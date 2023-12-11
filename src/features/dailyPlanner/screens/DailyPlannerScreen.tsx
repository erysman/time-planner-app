import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { produce } from "immer";
import { useEffect, useMemo, useState } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  SharedValue,
  runOnJS,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { H6, Spinner, YStack } from "tamagui";
import { DAY_FORMAT } from "../../../../config/constants";
import {
  getGetDayTasksQueryKey,
  getGetTasksDayOrderQueryKey,
  useGetDayTasks,
  useGetTasksDayOrder,
  useUpdateTask,
  useUpdateTasksDayOrder,
} from "../../../clients/time-planner-server/client";
import { TaskDTO, TaskUpdateDTO } from "../../../clients/time-planner-server/model";
import {
  MovableItem,
  MovingItemPointer,
  setItemOrderWorklet,
  unsetItemOrderWorklet,
} from "../../../core/components/list/DraggableList";
import TasksListItem from "../../../core/components/list/TasksListItem";
import { getRefreshInterval } from "../../../core/config/utils";
import { useScreenDimensions } from "../../../core/dimensions/UseScreenDimensions";
import { CurrentTime } from "../components/DailyCalendar";
import { DailyCalendarSlots } from "../components/DailyCalendarSlots";
import { MovingCalendarTask } from "../components/DailyCalendarTask";
import { DailyCalendarTasks } from "../components/DailyCalendarTasks";
import {
  DailyPlannerViewMode,
  useDimensionsByViewMode,
} from "../logic/UseDailyPlannerViewMode";
import {
  mapCalendarPositionToMinutes,
  minutesToTime,
  timeToMinutes,
} from "../logic/utils";
import { ITask, ITaskWithTime } from "../model/model";

export const DEFAULT_DURATION_MIN = 60;

export interface DailyPlannerScreenProps {
  day: string;
  viewMode: DailyPlannerViewMode;
}

export const DailyPlannerScreen = ({
  day,
  viewMode,
}: DailyPlannerScreenProps) => {
  const {
    data: tasks,
    isError,
    isLoading,
  } = useGetDayTasks(day, { query: { refetchInterval: getRefreshInterval() } });
  const {
    data: tasksOrder,
    isError: isErrorOrder,
    isLoading: isLoadingOrder,
  } = useGetTasksDayOrder(day, {
    query: { refetchInterval: getRefreshInterval() },
  });
  const queryClient = useQueryClient();
  const updateTasksDayOrder = useUpdateTasksDayOrder({
    mutation: {
      onMutate: async ({ data, day }) => {
        const queryKey = getGetTasksDayOrderQueryKey(day);
        console.log("optimistic cache update for key:", queryKey);
        await queryClient.cancelQueries({ queryKey });
        const previousData = queryClient.getQueryData<string[]>(queryKey);
        queryClient.setQueryData<string[]>(queryKey, () => data);
        return { previousData };
      },
      onError: (error, { day }, context) => {
        queryClient.setQueryData<string[]>(
          getGetTasksDayOrderQueryKey(day),
          context?.previousData
        );
      },
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: getGetTasksDayOrderQueryKey(day),
        });
      },
    },
  });

  // const listStyle = useHeightByViewMode(viewMode, getListHeight);
  const [layout, setLayout] = useState({ height: 0, width: 0 });
  const { calendarViewHeight, listViewHeight } = useDimensionsByViewMode(
    viewMode,
    layout
  );
  const calendarStyle = useAnimatedStyle(() => ({
    height: withTiming(calendarViewHeight.value),
  }));
  const listStyle = useAnimatedStyle(() => ({
    height: withTiming(listViewHeight.value),
  }));

  const itemHeight = 55;
  const hourSlotHeight = 55;
  const minuteInPixels = hourSlotHeight / 60;
  const stepHeight = minuteInPixels * 15;
  const calendarHeight = 24 * hourSlotHeight;
  const isToday = dayjs().format(DAY_FORMAT) === day;

  const {
    panGesture,
    movingItemsOrder,
    movingItemId,
    movingItemWindowTop,
    pointerIndex,
    movingItemTypeAnimated,
    calendarScrollRef,
  } = useDraggableListCalendar(
    day,
    itemHeight,
    tasksOrder ?? [],
    calendarViewHeight,
    listViewHeight,
    (itemsOrder) => {
      console.log(`updateTasksDayOrder: `, itemsOrder)
      updateTasksDayOrder.mutateAsync({
        day,
        data: itemsOrder,
      });
    },
    minuteInPixels,
    tasks as ITask[]
  );

  const tasksWithoutStartTime =
    (tasks?.filter((t) => !t.startTime || !t.durationMin) as ITask[]) ?? [];
  const tasksWithStartTime =
    (tasks?.filter(
      (t) => !!t.startTime && !!t.durationMin
    ) as ITaskWithTime[]) ?? [];

  const [editedTaskId, setEditedTaskId] = useState<string | null>(null);
  const onTaskPress = (taskId: string) => {
    setEditedTaskId((prevTaskId) => {
      if (prevTaskId === taskId) return null;
      return taskId;
    });
  };

  // const {
  //   scrollRef,
  //   editedTaskId,
  //   pressedTaskIdState,
  //   onTaskPress,
  //   movingCalendarItemTop,
  // } = useDailyCalendar(day, minuteInPixels, stepHeight, tasksWithStartTime);

  if (isLoading || isLoadingOrder) {
    return <Spinner />;
  }
  if (isError || isErrorOrder) {
    return <H6>{"Error during loading tasks, try again"}</H6>; //TODO: this should be toast!
  }

  const movingTask: ITask = useMemo(
    () => (tasks.find((task) => task.id === movingItemId) as ITask) ?? null,
    [movingItemId]
  );

  const renderItem = (id: string): React.ReactNode => {
    const task = (tasks.find((task) => task.id === id) as ITask) ?? null;
    if (!task) return null;
    return <TasksListItem name={task.name} isEdited={false} />;
  };

  return (
    <YStack
      fullscreen
      backgroundColor={"$background"}
      onLayout={(e) =>
        setLayout({
          height: e.nativeEvent.layout.height,
          width: e.nativeEvent.layout.width,
        })
      }
    >
      <GestureDetector gesture={panGesture}>
        <Animated.View
          collapsable={false}
          style={[
            {
              flexDirection: "column",
            },
          ]}
        >
          <Animated.View style={[listStyle]}>
            <YStack w={"100%"} h={"100%"}>
              {tasksWithoutStartTime.map((task) => {
                return (
                  <MovableItem
                    key={task.id}
                    id={task.id}
                    itemHeight={itemHeight}
                    itemsOrder={movingItemsOrder}
                    renderItem={renderItem}
                  />
                );
              })}
              <MovingItemPointer
                itemHeight={itemHeight}
                visible={!!movingItemId}
                pointerIndex={pointerIndex}
              />
            </YStack>
          </Animated.View>
          <Animated.View style={[calendarStyle]} collapsable={false}>
            <Animated.ScrollView
              ref={calendarScrollRef}
              alwaysBounceHorizontal={false}
              alwaysBounceVertical={false}
              bounces={false}
              overScrollMode="never"
              scrollEventThrottle={16}
              contentContainerStyle={{
                height: calendarHeight,
              }}
            >
              <YStack
                backgroundColor="$backgroundFocus"
                height={calendarHeight}
              >
                <DailyCalendarSlots hourSlotHeight={hourSlotHeight} />
                <DailyCalendarTasks
                  editedTaskId={editedTaskId}
                  day={day}
                  minuteInPixels={minuteInPixels}
                  tasks={tasksWithStartTime}
                  pressedTaskId={movingItemId}
                  onTaskPress={onTaskPress}
                />
                {isToday ? (
                  <CurrentTime minuteInPixels={minuteInPixels} />
                ) : null}
              </YStack>
            </Animated.ScrollView>
          </Animated.View>
        </Animated.View>
      </GestureDetector>
      <MovingCalendarListItem
        movingItemWindowTop={movingItemWindowTop}
        itemHeight={itemHeight}
        minuteInPixels={minuteInPixels}
        movingItemType={movingItemTypeAnimated}
        task={movingTask}
      />
    </YStack>
  );
};

export const useDraggableListCalendar = (
  day: string,
  itemHeight: number,
  itemsOrder: string[],
  calendarViewHeight: SharedValue<number>,
  listViewHeight: SharedValue<number>,
  setItemsOrder: (itemsOrder: string[]) => void,
  minuteInPixels: number,
  tasks: ITask[]
) => {
  //list stuff
  const { headerHeight } = useScreenDimensions();
  // const pressedWindowY = useSharedValue<number>(0);
  const pointerIndex = useSharedValue<number | null>(null);
  const movingItemsOrder = useSharedValue<string[]>(itemsOrder);
  const movingItemId = useSharedValue<string | null>(null);
  const movingItemType = useSharedValue<"calendar" | "list" | null>(null);

  const [movingItemIdState, setMovingItemIdState] = useState<string | null>(
    null
  );

  useEffect(() => {
    console.log("use effect, itemsOrder changed,", itemsOrder);
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
  // const [movingItemTypeState, setMovingItemTypeState] = useState<
  //   "calendar" | "list" | null
  // >(null);
  // useAnimatedReaction(
  //   () => movingItemType.value,
  //   (current, prev) => {
  //     if (prev !== current) {
  //       runOnJS(setMovingItemTypeState)(current);
  //     }
  //   }
  // );

  //calendar stuff
  // const pressed = useSharedValue(false);
  const pressedTaskOffset = useSharedValue<number>(0);
  // const pressedTaskId = useSharedValue<string | null>(null);
  // const [pressedTaskIdState, setPressedTaskIdState] = useState<string | null>(
  //   null
  // );
  const movingItemWindowTop = useSharedValue(0);
  const calendarScrollRef = useAnimatedRef<Animated.ScrollView>();
  const calendarScrollHandler = useScrollViewOffset(calendarScrollRef);
  const queryClient = useQueryClient();
  const updateTask = useUpdateTask({
    mutation: {
      onMutate: async ({ data, id }) => {
        const queryKey = getGetDayTasksQueryKey(day);
        console.log("optimistic cache update for key:", queryKey);
        await queryClient.cancelQueries({ queryKey });
        const previousData = queryClient.getQueryData<TaskDTO[]>(queryKey);
        console.log("optimistic cache update previous data:", previousData);
        queryClient.setQueryData<TaskDTO[]>(queryKey, (prev) => {
          if (!prev) {
            return prev;
          }
          return produce(prev, (draft) => {
            const taskToUpdateIndex = draft.findIndex((task) => task.id === id);
            if (taskToUpdateIndex !== -1) {
              draft[taskToUpdateIndex] = {
                ...draft[taskToUpdateIndex],
                ...data,
              };
            }
          });
        });
        return { previousData };
      },
      onError: (error, { id, data }, context) => {
        queryClient.setQueryData<TaskDTO[]>(
          getGetDayTasksQueryKey(day),
          context?.previousData
        );
      },
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: getGetDayTasksQueryKey(day),
        });
      },
    },
  });

  const setTaskTime = ( itemId: string, time: string | null, durationMin: number | undefined) => {
    console.log(`updating task with id: ${itemId}, new time: ${time}`);
    let data: TaskUpdateDTO = { startTime: time }
    if(!durationMin) {
      data.durationMin = DEFAULT_DURATION_MIN;
    }
    updateTask.mutate({ id: itemId, data });
  };

  const panGesture = Gesture.Pan()
    .activateAfterLongPress(250)
    .onStart((e) => {
      const pressedWindowY = e.absoluteY - headerHeight;
      const pressedAreaType = getPressedAreaType(
        pressedWindowY,
        listViewHeight.value,
        calendarViewHeight.value
      );
      movingItemType.value = pressedAreaType;
      console.log("gesture start, area: ", pressedAreaType);
      //list stuff
      if (pressedAreaType === "list") {
        const pressedItemIndex = Math.floor(pressedWindowY / itemHeight);
        const pressedItemId = movingItemsOrder.value[pressedItemIndex];
        if (!pressedItemId) {
          return;
        }
        console.log(`pressed item id: `, pressedItemId);
        pointerIndex.value = pressedItemIndex;
        movingItemId.value = pressedItemId;
        unsetItemOrderWorklet(pressedItemIndex, movingItemsOrder);
        pressedTaskOffset.value =
          pressedWindowY - pressedItemIndex * itemHeight;
        console.log(`pressedTaskOffset.value`, pressedTaskOffset.value);
      }

      //calendar stuff
      if (pressedAreaType === "calendar") {
        const movingItemCalendarPosition =
          calendarScrollHandler.value + pressedWindowY - listViewHeight.value;
        const itemCalendarPositionMin = mapCalendarPositionToMinutes(
          movingItemCalendarPosition,
          minuteInPixels
        );
        const pressedTask = tasks.find(
          (task) =>
            task.startTime &&
            task.durationMin &&
            itemCalendarPositionMin > timeToMinutes(task.startTime) &&
            itemCalendarPositionMin <
              timeToMinutes(task.startTime) + task.durationMin
        ) as ITaskWithTime;
        console.log(
          `movingItemCalendarPosition `,
          movingItemCalendarPosition,
          `itemCalendarPositionMin`,
          itemCalendarPositionMin
        );
        if (!pressedTask) {
          return;
        }
        console.log(
          `pressed calendar task id ${pressedTask.id}, name: ${pressedTask.name}`
        );
        movingItemId.value = pressedTask.id;
        const pressedTaskStartTimeMin = timeToMinutes(pressedTask.startTime);
        pressedTaskOffset.value =
          (itemCalendarPositionMin - pressedTaskStartTimeMin) * minuteInPixels;
      }
      movingItemWindowTop.value = pressedWindowY - pressedTaskOffset.value;
    })
    .onChange((e) => {
      if (!movingItemId.value) {
        return;
      }
      const pressedWindowY = e.absoluteY - headerHeight;
      const pressedAreaType = getPressedAreaType(
        pressedWindowY,
        listViewHeight.value,
        calendarViewHeight.value
      );
      movingItemType.value = pressedAreaType;
      console.log(`area:`, movingItemType.value, `movingItemWindowTop:`,  pressedWindowY )
      if (pressedAreaType === "list") {
        const newPointer = Math.min(
          movingItemsOrder.value.length,
          Math.max(0, Math.floor(pressedWindowY / itemHeight))
        );
        if (pointerIndex.value !== newPointer) {
          pointerIndex.value = newPointer;
        } 
      }
      if (pressedAreaType === "calendar") {
        //TODO
      }
      movingItemWindowTop.value = pressedWindowY - pressedTaskOffset.value;
      // console.log(`moveItemId:`, movingItemId.value, `movingItemWindowTop:`, movingItemWindowTop.value, `pressedWindowY:`, pressedWindowY, `pressedTaskOffset`, pressedTaskOffset.value )
    })
    .onEnd((e) => {
      if (!movingItemId.value) {
        return;
      }
      console.log(`press released`);
      if (movingItemType.value === "list") {
        if (pointerIndex.value === null) return;
        const task = tasks.find((task) => task.id === movingItemId.value);
        if(task?.startTime) {
          runOnJS(setTaskTime)(task.id, null, task.durationMin);
        }
        movingItemWindowTop.value = withTiming(pointerIndex.value * itemHeight);
        setItemOrderWorklet(
          pointerIndex.value,
          movingItemId.value,
          movingItemsOrder
        );
        movingItemId.value = null;
        pointerIndex.value = null;
        runOnJS(setItemsOrder)(movingItemsOrder.value);
      }

      if (movingItemType.value === "calendar") {
        const movingItemCalendarPosition =
          calendarScrollHandler.value +
          movingItemWindowTop.value -
          listViewHeight.value;
        const minutes: number = mapCalendarPositionToMinutes(
          movingItemCalendarPosition,
          minuteInPixels
        );
        const time = minutesToTime(minutes);
        const task = tasks.find((task) => task.id === movingItemId.value);
        console.log(
          `verticalCalendarMovementPan: end: task id: ${movingItemId.value}, new time: ${time}`
        );
        if (task && time !== task.startTime) {
          runOnJS(setTaskTime)(task.id, time, task.durationMin);
        }
        movingItemId.value = null;
        pressedTaskOffset.value = 0;
      }
    });
  return {
    panGesture,
    movingItemsOrder,
    movingItemId: movingItemIdState,
    movingItemWindowTop,
    pointerIndex,
    // movingItemTypeState,
    movingItemTypeAnimated: movingItemType,
    calendarScrollRef,
  };
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

export const MovingCalendarListItem = (props: {
  itemHeight: number;
  movingItemWindowTop: SharedValue<number>;
  movingItemType: SharedValue<"calendar" | "list" | null>;
  minuteInPixels: number;
  task: ITask | null;
}) => {
  const {
    movingItemWindowTop,
    itemHeight,
    movingItemType,
    minuteInPixels,
    task,
  } = props;

  const style = useAnimatedStyle(() => {
    if (movingItemType.value === "calendar") {
      return {
        position: "absolute",
        width: "75%",
        marginLeft: 60,
        marginRight: 10,
        top: movingItemWindowTop.value,
      };
    } else {
      return {
        position: "absolute",
        width: "100%",
        marginLeft: 0,
        marginRight: 0,
        height: itemHeight,
        top: movingItemWindowTop.value,
      };
    }
  });

  const [movingItemTypeState, setMovingItemTypeState] = useState<
    "calendar" | "list" | null
  >(null);
  useAnimatedReaction(
    () => movingItemType.value,
    (current, prev) => {
      if (prev !== current) {
        runOnJS(setMovingItemTypeState)(current);
      }
    }
  );

  const item = useMemo(() => {
    if (movingItemTypeState === null || !task) return null;
    if (movingItemTypeState === "calendar") {
      return (
        <MovingCalendarTask
          isEdited={true}
          minuteInPixels={minuteInPixels}
          task={task}
        />
      );
    }
    if (movingItemTypeState === "list") {
      return <TasksListItem name={task.name} isEdited={false} />;
    }
  }, [movingItemTypeState, task]);

  if (!task) {
    return null;
  }

  return <Animated.View style={[style]}>{item}</Animated.View>;
};
