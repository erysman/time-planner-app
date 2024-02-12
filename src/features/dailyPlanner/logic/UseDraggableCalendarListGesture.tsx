import { useEffect, useState } from "react";
import {
  Gesture,
  GestureStateChangeEvent,
  GestureUpdateEvent,
  PanGestureChangeEventPayload,
  PanGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import Animated, {
  SharedValue,
  runOnJS,
  useAnimatedReaction,
  useAnimatedRef,
  useDerivedValue,
  useScrollViewOffset,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { DEFAULT_DURATION_MIN } from "../../../../config/constants";
import { TaskUpdateDTO } from "../../../clients/time-planner-server/model";
import {
  removeItemFromList,
  setItemOrder,
} from "../../../core/components/list/DragAndDropList";
import { useScreenDimensions } from "../../../core/logic/dimensions/UseScreenDimensions";
import { ITask, ITaskWithTime, TimeAndDurationMap } from "../model/model";
import { useDraggableCalendarListContext } from "./UseCalendarListContext";
import { useUpdateTaskDayWrapper } from "./UseUpdateTask";
import { useUpdateTasksDayOrderWrapper } from "./UseUpdateTasksDayOrder";
import {
  mapCalendarPositionToMinutes,
  mapDurationToHeight,
  minutesToTime,
  timeToMinutes,
} from "./utils";
import { useDragScrollArea } from "./UseScrollArea";

function buildTasksTimeAndDurationMap(tasks: ITask[]): TimeAndDurationMap {
  const map = Object.fromEntries(
    tasks.map((task) => [
      task.id,
      {
        startTimeMinutes:
          task.startTime !== undefined && task.startTime !== null
            ? timeToMinutes(task.startTime)
            : null,
        durationMinutes:
          task.durationMin !== undefined ? task.durationMin : null,
      },
    ])
  );
  // console.log(`build new object:`, map);
  return map;
}

export const useDraggableCalendarListGesture = (
  day: string,
  itemsOrder: string[],
  calendarViewHeight: SharedValue<number>,
  listViewHeight: SharedValue<number>,
  tasks: ITask[]
) => {
  const {
    itemHeight,
    minuteInPixels,
    calendarHeight,
    setEditedTaskId,
    calendarStepHeight,
  } = useDraggableCalendarListContext();
  const { headerHeight } = useScreenDimensions();
  const movingItemId = useSharedValue<string | null>(null);
  const [movingItemIdState, setMovingItemIdState] = useState<string | null>(
    null
  );
  const movingItemType = useSharedValue<"calendar" | "list" | null>(null);
  const movingItemViewTopY = useSharedValue(0);
  const pressedTaskOffsetToTop = useSharedValue<number>(0);
  const listPointerIndex = useSharedValue<number | null>(null);
  const movingItemsOrder = useSharedValue<string[]>(itemsOrder);
  const movingTimeAndDurationOfTasks = useSharedValue<TimeAndDurationMap>(
    buildTasksTimeAndDurationMap(tasks)
  );

  useEffect(() => {
    movingTimeAndDurationOfTasks.value = buildTasksTimeAndDurationMap(tasks);
  }, [JSON.stringify(tasks)]);

  const calendarScrollRef = useAnimatedRef<Animated.ScrollView>();
  const calendarScrollOffset = useScrollViewOffset(calendarScrollRef);

  const calendarScrollArea = useDragScrollArea(
    listViewHeight,
    calendarViewHeight,
    calendarHeight,
    calendarScrollOffset
  );
  const listScrollRef = useAnimatedRef<Animated.ScrollView>();
  const listScrollOffset = useScrollViewOffset(listScrollRef);

  const listHeight = useDerivedValue(() => {
    return (
      itemHeight * movingItemsOrder.value.length +
      (movingItemId.value ? itemHeight : 0)
    );
  });
  const listScrollArea = useDragScrollArea(
    null,
    listViewHeight,
    listHeight.value,
    listScrollOffset
  );

  const { updateTasksOrder } = useUpdateTasksDayOrderWrapper(day);

  useEffect(() => {
    movingItemsOrder.value = itemsOrder;
  }, [JSON.stringify(itemsOrder)]);

  useAnimatedReaction(
    () => movingItemId.value,
    (current, prev) => {
      if (prev !== current) {
        runOnJS(setMovingItemIdState)(current);
        if (current !== null) runOnJS(setEditedTaskId)(current);
      }
    }
  );

  const { updateTask } = useUpdateTaskDayWrapper(day);
  const setTaskTime = (
    itemId: string,
    time: string | null,
    durationMin: number | undefined
  ) => {
    console.log(
      `updating task with id: ${itemId}, new time: ${time}, duration: ${durationMin}`
    );
    let data: TaskUpdateDTO = { startTime: time };
    if (!durationMin) {
      data.durationMin = DEFAULT_DURATION_MIN;
    }
    updateTask.mutate({ id: itemId, data });
  };

  function getPressedAreaType(pressedWindowY: number, listViewHeight: number) {
    "worklet";
    if (pressedWindowY < listViewHeight) {
      return "list";
    } else if (
      pressedWindowY >= listViewHeight
      //&& pressedWindowY < listViewHeight + calendarViewHeight
    ) {
      return "calendar";
    } else {
      console.log("cant say if calendar or list");
      return null;
    }
  }

  function onListItemPressed(pressedViewY: number) {
    "worklet";
    const pressedListIndex = Math.floor(
      (pressedViewY + listScrollOffset.value) / itemHeight
    );
    const pressedItemId = movingItemsOrder.value[pressedListIndex];
    if (!pressedItemId) {
      return;
    }
    listPointerIndex.value = pressedListIndex;
    movingItemId.value = pressedItemId;
    removeItemFromList(pressedListIndex, movingItemsOrder);
    pressedTaskOffsetToTop.value =
      pressedViewY + listScrollOffset.value - pressedListIndex * itemHeight;
  }

  function findCalendarTaskByTime(
    itemCalendarPositionMin: number
  ): ITaskWithTime | undefined {
    "worklet";
    return tasks.find(
      (task) =>
        task.startTime &&
        task.durationMin &&
        itemCalendarPositionMin > timeToMinutes(task.startTime) &&
        itemCalendarPositionMin <
          timeToMinutes(task.startTime) + task.durationMin
    ) as ITaskWithTime;
  }

  /**
   * Finds pressed item, sets it as moving item, calculates top and bottom boundry of moved item for scroll area
   * @param pressedWindowY
   * @returns
   */
  function onCalendarItemPressed(pressedWindowY: number) {
    "worklet";
    const pressedCalendarY =
      calendarScrollOffset.value + pressedWindowY - listViewHeight.value;
    const pressedMinutes = mapCalendarPositionToMinutes(
      pressedCalendarY,
      minuteInPixels
    );
    const pressedTask = findCalendarTaskByTime(pressedMinutes);
    if (!pressedTask) {
      return null;
    }
    movingItemId.value = pressedTask.id;
    const pressedTaskStartTimeMinutes = timeToMinutes(pressedTask.startTime);
    const minutesDiffFromStart = pressedMinutes - pressedTaskStartTimeMinutes;
    pressedTaskOffsetToTop.value = minutesDiffFromStart * minuteInPixels;
    const taskTop = pressedTaskStartTimeMinutes * minuteInPixels;
    const taskHeight = pressedTask.durationMin * minuteInPixels;
    return { top: taskTop, bottom: taskTop + taskHeight };
  }

  function onDragStartGesture(
    e: GestureStateChangeEvent<PanGestureHandlerEventPayload>
  ) {
    "worklet";
    const pressedViewY = e.absoluteY - headerHeight;
    const pressedAreaType = getPressedAreaType(
      pressedViewY,
      listViewHeight.value
    );
    movingItemType.value = pressedAreaType;
    if (pressedAreaType === "list") {
      onListItemPressed(pressedViewY);
    }
    if (pressedAreaType === "calendar") {
      const itemBoundries = onCalendarItemPressed(pressedViewY);
      if (itemBoundries) {
        calendarScrollArea.activateScroll(itemBoundries);
      }
    }
    movingItemViewTopY.value = pressedViewY - pressedTaskOffsetToTop.value;
  }

  function setNewListPointerIndex(pressedViewY: number) {
    "worklet";
    const newPointer = Math.min(
      movingItemsOrder.value.length,
      Math.max(
        0,
        Math.floor((pressedViewY + listScrollOffset.value) / itemHeight)
      )
    );
    if (listPointerIndex.value !== newPointer) {
      listPointerIndex.value = newPointer;
    }
  }

  function onDragChange(
    e: GestureUpdateEvent<
      PanGestureHandlerEventPayload & PanGestureChangeEventPayload
    >
  ) {
    "worklet";
    if (!movingItemId.value) {
      return;
    }
    const maxViewY = listViewHeight.value + calendarViewHeight.value;
    const pressedViewY = e.absoluteY - headerHeight;
    movingItemViewTopY.value = Math.max(
      pressedViewY - pressedTaskOffsetToTop.value,
      0
    );
    const pressedAreaType = getPressedAreaType(
      Math.min(movingItemViewTopY.value, maxViewY-itemHeight),
      listViewHeight.value
    );
    movingItemType.value = pressedAreaType;
    if (pressedAreaType === "list") {
      calendarScrollArea.cancelScroll();
      setNewListPointerIndex(pressedViewY);
      let bottom = movingItemViewTopY.value + itemHeight;
      if (bottom > maxViewY) {
        movingItemViewTopY.value = maxViewY - itemHeight;
        bottom = maxViewY;
      }
      listScrollArea.activateScroll({
        top: movingItemViewTopY.value,
        bottom,
      });
    }
    if (pressedAreaType === "calendar") {
      listScrollArea.cancelScroll();
      listPointerIndex.value = null;
      const task = tasks.find((t) => t.id === movingItemId.value);
      if (task && task.durationMin) {
        const height = mapDurationToHeight(task.durationMin, minuteInPixels);
        let bottom = pressedViewY + height - pressedTaskOffsetToTop.value;
        if (bottom > maxViewY) {
          movingItemViewTopY.value = maxViewY - height;
          bottom = maxViewY
        }
        // const top = pressedViewY - pressedTaskOffsetToTop.value;
        calendarScrollArea.activateScroll({
          top: movingItemViewTopY.value,
          bottom,
        });
      }
      //if scroll is not active, pin movingItemViewY.value to 15 minutes multiple
      if (!calendarScrollArea.isScrollActive.value) {
        const movingItemCalendarY =
          calendarScrollOffset.value +
          movingItemViewTopY.value -
          listViewHeight.value;
        const snappedMovingItemCalendarY =
          Math.round(movingItemCalendarY / calendarStepHeight) *
          calendarStepHeight;
        movingItemViewTopY.value =
          snappedMovingItemCalendarY +
          listViewHeight.value -
          calendarScrollOffset.value;
      }
    }
  }

  function updateTasksMap(
    itemId: string,
    minutes: number | null,
    durationMin: number | undefined
  ) {
    "worklet";
    let newMap = { ...movingTimeAndDurationOfTasks.value };
    newMap[itemId] = {
      startTimeMinutes: minutes,
      durationMinutes: durationMin ?? DEFAULT_DURATION_MIN,
    };
    movingTimeAndDurationOfTasks.value = newMap;
  }

  function onListDragEnd() {
    "worklet";
    listScrollArea.cancelScroll();
    if (listPointerIndex.value === null || movingItemId.value === null) return;
    const task = tasks.find((task) => task.id === movingItemId.value);
    if (task?.startTime) {
      updateTasksMap(task.id, null, task.durationMin);
      runOnJS(setTaskTime)(task.id, null, task.durationMin);
    }
    movingItemViewTopY.value = withTiming(
      listPointerIndex.value * itemHeight - listScrollOffset.value
    );
    setItemOrder(listPointerIndex.value, movingItemId.value, movingItemsOrder);
    movingItemId.value = null;
    listPointerIndex.value = null;
    runOnJS(updateTasksOrder)(movingItemsOrder.value);
    //todo we should clear all gesture related data
  }

  function onCalendarDragEnd() {
    "worklet";
    calendarScrollArea.cancelScroll();
    //if scroll is not active, pin movingItemViewY.value to 15 minutes multiple
    const movingItemCalendarY =
      calendarScrollOffset.value +
      movingItemViewTopY.value -
      listViewHeight.value;
    const snappedMovingItemCalendarY =
      Math.round(movingItemCalendarY / calendarStepHeight) * calendarStepHeight;

    const minutes: number = mapCalendarPositionToMinutes(
      snappedMovingItemCalendarY,
      minuteInPixels
    );
    const time = minutesToTime(minutes);
    const task = tasks.find((task) => task.id === movingItemId.value);
    if (task && time !== task.startTime) {
      updateTasksMap(task.id, minutes, task.durationMin);
      runOnJS(setTaskTime)(task.id, time, task.durationMin);
    }
    movingItemId.value = null;
    pressedTaskOffsetToTop.value = 0;
  }

  function onDragEnd() {
    "worklet";
    if (!movingItemId.value) {
      return;
    }
    if (movingItemType.value === "list") {
      onListDragEnd();
    }
    if (movingItemType.value === "calendar") {
      onCalendarDragEnd();
    }
  }

  const dragGesture = Gesture.Pan()
    .activateAfterLongPress(250)
    .onStart(onDragStartGesture)
    .onChange(onDragChange)
    .onEnd(onDragEnd);

  return {
    dragGesture,
    movingItemsOrder,
    movingItemId: movingItemIdState,
    movingItemViewY: movingItemViewTopY,
    listPointerIndex,
    movingItemType,
    scroll: {
      calendarScrollRef,
      calendarScrollProps: calendarScrollArea.scrollProps,
      listScrollRef,
      listScrollProps: listScrollArea.scrollProps,
    },
    movingTimeAndDurationOfTasks,
  };
};
