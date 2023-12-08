import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  SharedValue,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { H6, Spinner, YStack } from "tamagui";
import {
  getGetTasksDayOrderQueryKey,
  useGetDayTasks,
  useGetTasksDayOrder,
  useUpdateTasksDayOrder,
} from "../../../clients/time-planner-server/client";
import {
  MovableItem,
  MovingItem,
  MovingItemPointer,
  setItemOrderWorklet,
  unsetItemOrderWorklet,
} from "../../../core/components/list/DraggableList";
import TasksListItem from "../../../core/components/list/TasksListItem";
import { getRefreshInterval } from "../../../core/config/utils";
import { useScreenDimensions } from "../../../core/dimensions/UseScreenDimensions";
import { DailyCalendar, useDailyCalendar } from "../components/DailyCalendar";
import { MovingCalendarTask } from "../components/DailyCalendarTask";
import {
  DailyPlannerViewMode,
  useDimensionsByViewMode,
} from "../logic/UseDailyPlannerViewMode";
import { ITask, ITaskWithTime } from "../model/model";

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
  const {
    panGesture,
    movingItemsOrder,
    movingItemId,
    dragY,
    pointerIndex,
    movingItemType,
  } = useDraggableListCalendar(
    itemHeight,
    tasksOrder ?? [],
    calendarViewHeight,
    listViewHeight,
    (itemsOrder) => {
      updateTasksDayOrder.mutateAsync({
        day,
        data: itemsOrder,
      });
    }
  );

  const hourSlotHeight = 55;
  const minuteInPixels = hourSlotHeight / 60;
  const stepHeight = minuteInPixels * 15;

  const tasksWithoutStartTime =
    (tasks?.filter((t) => !t.startTime || !t.durationMin) as ITask[]) ?? [];
  const tasksWithStartTime =
    (tasks?.filter(
      (t) => !!t.startTime && !!t.durationMin
    ) as ITaskWithTime[]) ?? [];

  const {
    scrollRef,
    editedTaskId,
    pressedTaskIdState,
    onTaskPress,
    movingCalendarItemTop,
  } = useDailyCalendar(day, minuteInPixels, stepHeight, tasksWithStartTime);

  if (isLoading || isLoadingOrder) {
    return <Spinner />;
  }
  if (isError || isErrorOrder) {
    return <H6>{"Error during loading tasks, try again"}</H6>; //TODO: this should be toast!
  }

  const renderItem = (id: string): React.ReactNode => {
    const task = (tasks.find((task) => task.id === id) as ITask) ?? null;
    if (!task) return null;
    return <TasksListItem name={task.name} isEdited={false} />;
  };

  const renderMovingItem = (id: string) => {
    const task = (tasks.find((task) => task.id === id) as ITask) ?? null;
    if (!task) return null;
    switch (movingItemType) {
      case null:
        return null;
      case "calendar":
        return (
          <MovingCalendarTask
            movingTop={movingCalendarItemTop}
            isEdited={true}
            minuteInPixels={minuteInPixels}
            task={task}
            onPress={onTaskPress}
          />
        );
      case "list":
        return <TasksListItem name={task.name} isEdited={false} />;
    }
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
          <Animated.View style={[calendarStyle]}>
            <DailyCalendar tasks={tasksWithStartTime} day={day} />
          </Animated.View>
        </Animated.View>
      </GestureDetector>
      <MovingItem
        dragY={dragY}
        id={movingItemId}
        renderItem={renderMovingItem}
        itemHeight={itemHeight}
      />
    </YStack>
  );
};

export const useDraggableListCalendar = (
  itemHeight: number,
  itemsOrder: string[],
  calendarViewHeight: SharedValue<number>,
  listViewHeight: SharedValue<number>,
  setItemsOrder: (itemsOrder: string[]) => void
) => {
  const { headerHeight } = useScreenDimensions();
  const dragY = useSharedValue<number>(0);
  const pointerIndex = useSharedValue<number | null>(null);
  const movingItemsOrder = useSharedValue<string[]>(itemsOrder);
  const movingItemId = useSharedValue<string | null>(null);
  const [movingItemType, setMovingItemType] = useState<
    "calendar" | "list" | null
  >(null);
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

  const panGesture = Gesture.Pan()
    .activateAfterLongPress(250)
    .onStart((e) => {
      console.log("useDraggableListCalendar gesture handler start");
      //TODO: we need dimensions of list view and calendar view.
      //  if absoluteY is in list area, then
      //    set movingItemType as list
      //    do everything that now is done with list item (identifying id, pointerIndex, etc.)
      //  if absoluteY is in calendar area, then:
      //    set movingItemType as calendar
      const pressedY = e.absoluteY - headerHeight;
      if (pressedY < listViewHeight.value) {
        runOnJS(setMovingItemType)("list");
      } else if (
        pressedY > listViewHeight.value &&
        pressedY < listViewHeight.value + calendarViewHeight.value
      ) {
        runOnJS(setMovingItemType)("calendar");
      } else {
        console.log("cant say if calendar or list");
        return;
      }
      dragY.value = pressedY;
      const pressedItemIndex = Math.floor(e.y / itemHeight);
      const pressedItemId = movingItemsOrder.value[pressedItemIndex];
      if (!pressedItemId) {
        return;
      }
      console.log(`pressed item id: `, pressedItemId);
      pointerIndex.value = pressedItemIndex;
      movingItemId.value = pressedItemId;
      unsetItemOrderWorklet(pressedItemIndex, movingItemsOrder);
    })
    .onChange((e) => {
      if (!movingItemId.value) {
        return;
      }
      const pressedY = e.absoluteY - headerHeight;
      if (pressedY < listViewHeight.value) {
        runOnJS(setMovingItemType)("list");
      } else if (
        pressedY > listViewHeight.value &&
        pressedY < listViewHeight.value + calendarViewHeight.value
      ) {
        runOnJS(setMovingItemType)("calendar");
      } else {
        console.log("cant say if calendar or list");
        return;
      }
      dragY.value = pressedY;
      const newPointer = Math.min(
        movingItemsOrder.value.length,
        Math.max(0, Math.floor(dragY.value / itemHeight))
      );
      if (pointerIndex.value === newPointer) {
        return;
      }
      pointerIndex.value = newPointer;
    })
    .onEnd(() => {
      if (!movingItemId.value || pointerIndex.value === null) {
        return;
      }
      console.log(`press released`);
      dragY.value = withTiming(pointerIndex.value * itemHeight);
      setItemOrderWorklet(
        pointerIndex.value,
        movingItemId.value,
        movingItemsOrder
      );
      movingItemId.value = null;
      pointerIndex.value = null;
      runOnJS(setItemsOrder)(movingItemsOrder.value);
    });
  return {
    panGesture,
    movingItemsOrder,
    movingItemId: movingItemIdState,
    dragY,
    pointerIndex,
    movingItemType,
  };
};
