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
  useScrollViewOffset,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { DEFAULT_DURATION_MIN } from "../../../../../config/constants";
import { TaskUpdateDTO } from "../../../../clients/time-planner-server/model";
import {
  removeItemFromList,
  setItemOrder,
} from "../../../../core/components/list/DraggableList";
import { useScreenDimensions } from "../../../../core/dimensions/UseScreenDimensions";
import { useUpdateTaskWrapper } from "../../logic/UseUpdateTask";
import { useUpdateTasksDayOrderWrapper } from "../../logic/UseUpdateTasksDayOrder";
import {
  mapCalendarPositionToMinutes,
  minutesToTime,
  timeToMinutes,
} from "../../logic/utils";
import { ITask, ITaskWithTime } from "../../model/model";
import { useDraggableCalendarListContext } from "../../logic/UseCalendarListContext";

export const useDraggableCalendarListGesture = (
  day: string,
  itemsOrder: string[],
  calendarViewHeight: SharedValue<number>,
  listViewHeight: SharedValue<number>,
  tasks: ITask[]
) => {
  const {itemHeight, minuteInPixels} = useDraggableCalendarListContext();
  const { headerHeight } = useScreenDimensions();
  const listPointerIndex = useSharedValue<number | null>(null);
  const movingItemsOrder = useSharedValue<string[]>(itemsOrder);
  const movingItemId = useSharedValue<string | null>(null);
  const movingItemType = useSharedValue<"calendar" | "list" | null>(null);
  const [movingItemIdState, setMovingItemIdState] = useState<string | null>(
    null
  );
  const pressedTaskOffset = useSharedValue<number>(0);
  const movingItemViewY = useSharedValue(0);
  const calendarScrollRef = useAnimatedRef<Animated.ScrollView>();
  const calendarScrollHandler = useScrollViewOffset(calendarScrollRef);

  const { updateTasksOrder } = useUpdateTasksDayOrderWrapper(day);

  useEffect(() => {
    movingItemsOrder.value = itemsOrder;
  }, [JSON.stringify(itemsOrder)]);

  useAnimatedReaction(
    () => movingItemId.value,
    (current, prev) => {
      if (prev !== current) {
        runOnJS(setMovingItemIdState)(current);
      }
    }
  );

  const { updateTask } = useUpdateTaskWrapper(day);
  const setTaskTime = (
    itemId: string,
    time: string | null,
    durationMin: number | undefined
  ) => {
    console.log(`updating task with id: ${itemId}, new time: ${time}`);
    let data: TaskUpdateDTO = { startTime: time };
    if (!durationMin) {
      data.durationMin = DEFAULT_DURATION_MIN;
    }
    updateTask.mutate({ id: itemId, data });
  };

  function getPressedAreaType(
    pressedWindowY: number,
    listViewHeight: number,
    calendarViewHeight: number
  ) {
    "worklet";
    if (pressedWindowY < listViewHeight) {
      return "list";
    } else if (
      pressedWindowY > listViewHeight &&
      pressedWindowY < listViewHeight + calendarViewHeight
    ) {
      return "calendar";
    } else {
      console.log("cant say if calendar or list");
      return null;
    }
  }

  function onListItemPressed(pressedViewY: number) {
    "worklet";
    const pressedListIndex = Math.floor(pressedViewY / itemHeight);
    const pressedItemId = movingItemsOrder.value[pressedListIndex];
    if (!pressedItemId) {
      return;
    }
    listPointerIndex.value = pressedListIndex;
    movingItemId.value = pressedItemId;
    removeItemFromList(pressedListIndex, movingItemsOrder);
    pressedTaskOffset.value = pressedViewY - pressedListIndex * itemHeight;
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

  function onCalendarItemPressed(pressedWindowY: number) {
    "worklet";
    const pressedCalendarY =
      calendarScrollHandler.value + pressedWindowY - listViewHeight.value;
    const pressedMinutes = mapCalendarPositionToMinutes(
      pressedCalendarY,
      minuteInPixels
    );
    const pressedTask = findCalendarTaskByTime(pressedMinutes);
    if (!pressedTask) {
      return;
    }
    movingItemId.value = pressedTask.id;
    const pressedTaskStartTimeMinutes = timeToMinutes(pressedTask.startTime);
    pressedTaskOffset.value =
      (pressedMinutes - pressedTaskStartTimeMinutes) * minuteInPixels;
  }

  function onDragGestureStart(
    e: GestureStateChangeEvent<PanGestureHandlerEventPayload>
  ) {
    "worklet";
    const pressedViewY = e.absoluteY - headerHeight;
    const pressedAreaType = getPressedAreaType(
      pressedViewY,
      listViewHeight.value,
      calendarViewHeight.value
    );
    movingItemType.value = pressedAreaType;
    if (pressedAreaType === "list") {
      onListItemPressed(pressedViewY);
    }
    if (pressedAreaType === "calendar") {
      onCalendarItemPressed(pressedViewY);
    }
    movingItemViewY.value = pressedViewY - pressedTaskOffset.value;
  }

  function setNewListPointerIndex(pressedViewY: number) {
    "worklet";
    const newPointer = Math.min(
      movingItemsOrder.value.length,
      Math.max(0, Math.floor(pressedViewY / itemHeight))
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
    const pressedViewY = e.absoluteY - headerHeight;
    const pressedAreaType = getPressedAreaType(
      pressedViewY,
      listViewHeight.value,
      calendarViewHeight.value
    );
    movingItemType.value = pressedAreaType;
    if (pressedAreaType === "list") {
      setNewListPointerIndex(pressedViewY);
    }
    if (pressedAreaType === "calendar") {
      listPointerIndex.value = null;
    }
    movingItemViewY.value = pressedViewY - pressedTaskOffset.value;
  }

  function onListDragEnd() {
    "worklet";
    if (listPointerIndex.value === null || movingItemId.value === null) return;
    const task = tasks.find((task) => task.id === movingItemId.value);
    if (task?.startTime) {
      runOnJS(setTaskTime)(task.id, null, task.durationMin);
    }
    movingItemViewY.value = withTiming(listPointerIndex.value * itemHeight);
    setItemOrder(listPointerIndex.value, movingItemId.value, movingItemsOrder);
    movingItemId.value = null;
    listPointerIndex.value = null;
    runOnJS(updateTasksOrder)(movingItemsOrder.value);
    //TODO: should we clear pressedTaskOffset?
  }

  function onCalendarDragEnd() {
    "worklet";
    const movingItemCalendarY =
      calendarScrollHandler.value +
      movingItemViewY.value -
      listViewHeight.value;
    const minutes: number = mapCalendarPositionToMinutes(
      movingItemCalendarY,
      minuteInPixels
    );
    const time = minutesToTime(minutes);
    const task = tasks.find((task) => task.id === movingItemId.value);
    if (task && time !== task.startTime) {
      runOnJS(setTaskTime)(task.id, time, task.durationMin);
    }
    movingItemId.value = null;
    pressedTaskOffset.value = 0;
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
    .onStart(onDragGestureStart)
    .onChange(onDragChange)
    .onEnd(onDragEnd);

  return {
    dragGesture,
    movingItemsOrder,
    movingItemId: movingItemIdState,
    movingItemViewY,
    listPointerIndex,
    movingItemType,
    calendarScrollRef,
  };
};
