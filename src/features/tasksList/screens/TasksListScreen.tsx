import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  SharedValue,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { H6, Separator, Spinner, YStack } from "tamagui";
import { DAY_FORMAT } from "../../../../config/constants";
import {
  getDayTasks,
  getGetTasksDayOrderQueryKey,
  getGetTasksQueryKey,
  useGetDayTasks,
  useGetTasks,
  useGetTasksDayOrder,
  useUpdateTask,
  useUpdateTasksDayOrder,
} from "../../../clients/time-planner-server/client";
import TasksListItem from "../../../core/components/tasks/list/TasksListItem";
import { useScreenDimensions } from "../../../core/dimensions/UseScreenDimensions";
import { ITaskWithPosition } from "../../dailyPlanner/model/model";
import { useQueryClient } from "@tanstack/react-query";
import { TaskDTO } from "../../../clients/time-planner-server/model";

const AnimatedSeparator = Animated.createAnimatedComponent(Separator);

export const TasksListScreen = () => {
  const day = dayjs().format(DAY_FORMAT);
  const { data: tasks, isError, isLoading } = useGetDayTasks(day, {query: {refetchInterval: 1000}});
  const {
    data: tasksOrder,
    isError: isErrorOrder,
    isLoading: isLoadingOrder,
  } = useGetTasksDayOrder(day,  {query: {refetchInterval: 1000}});
  const queryClient = useQueryClient();
  const updateTasksDayOrder = useUpdateTasksDayOrder({
    mutation: {
      onMutate: async ({data, day}) => {
        const queryKey = getGetTasksDayOrderQueryKey(day);
        console.log("optimistic cache update for key:", queryKey);
        await queryClient.cancelQueries({queryKey});
        const previousData = queryClient.getQueryData<string[]>(queryKey);
        queryClient.setQueryData<string[]>(queryKey, () => data)
        return {previousData};
      },
      onError: (error, {day}, context) => {
        queryClient.setQueryData<string[]>(getGetTasksDayOrderQueryKey(day), context?.previousData)
      },
      onSettled: () => {
        queryClient.invalidateQueries({queryKey: getGetTasksDayOrderQueryKey(day)})
      }
    },
  });

  if (isLoading || isLoadingOrder) {
    return <Spinner />;
  }
  if (isError || isErrorOrder) {
    return <H6>{"Error during loading tasks, try again"}</H6>; //TODO: this should be toast!
  }
  return (
    <DraggableList
      items={tasks as ITaskWithPosition[]}
      itemsOrder={tasksOrder}
      setItemsOrder={(itemsOrder) => {
        updateTasksDayOrder.mutateAsync({
          day,
          data: itemsOrder,
        });
        console.log(`setItemsOrder: updated order async`);
      }}
    />
  );
};

type DraggableListProps = {
  items: ITaskWithPosition[];
  itemsOrder: string[];
  setItemsOrder: (itemsOrder: string[]) => void;
};

export const DraggableList = ({
  items,
  itemsOrder,
  setItemsOrder,
}: DraggableListProps) => {
  const itemHeight = 55;
  const { panGesture, movingItemsOrder, movingItemId, dragY, pointerIndex } =
    useDraggableList(itemHeight, itemsOrder, setItemsOrder);
  console.log(movingItemsOrder.value);
  return (
    <YStack>
      <GestureDetector gesture={panGesture}>
        <Animated.View
          collapsable={false}
          style={[
            {
              flexDirection: "column",
            },
          ]}
        >
          {items.map((task) => {
            return (
              <MovableItem
                key={task.id}
                task={task}
                itemHeight={itemHeight}
                itemsOrder={movingItemsOrder}
              />
            );
          })}
        </Animated.View>
      </GestureDetector>
      <MovingItem
        dragY={dragY}
        task={items.find((task) => task.id === movingItemId) ?? null}
        itemHeight={itemHeight}
      />
      <MovingItemPointer
        itemHeight={itemHeight}
        visible={!!movingItemId}
        pointerIndex={pointerIndex}
      />
    </YStack>
  );
};

function unsetItemOrderWorklet(
  indexToRemove: number,
  movingTasksOrder: SharedValue<string[]>
) {
  "worklet";
  const prev = movingTasksOrder.value;
  const newList = [...prev];
  newList.splice(indexToRemove, 1);
  console.log("unsetItemOrderWorklet: prev: ", prev, "newList: ", newList);
  movingTasksOrder.value = newList;
}

function setItemOrderWorklet(
  indexToAdd: number,
  itemId: string,
  movingTasksOrder: SharedValue<string[]>
) {
  "worklet";
  const prev = movingTasksOrder.value;
  const newList = [...prev];
  newList.splice(indexToAdd, 0, itemId);
  console.log("setItemOrderWorklet: prev: ", prev, "newList: ", newList);
  movingTasksOrder.value = newList;
}

const useDraggableList = (
  itemHeight: number,
  itemsOrder: string[],
  setItemsOrder: (itemsOrder: string[]) => void
) => {
  const { headerHeight } = useScreenDimensions();
  const dragY = useSharedValue<number>(0);
  const pointerIndex = useSharedValue<number | null>(null);
  const movingItemsOrder = useSharedValue<string[]>(itemsOrder);
  const movingItemId = useSharedValue<string | null>(null);
  const [movingItemIdState, setMovingItemIdState] = useState<string | null>(null);

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
    .onStart((e) => {
      dragY.value = e.absoluteY - headerHeight;
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
      dragY.value = e.absoluteY - headerHeight;
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
      dragY.value=withTiming(pointerIndex.value*itemHeight)
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
  };
};

const MovableItem = (props: {
  task: ITaskWithPosition;
  itemHeight: number;
  itemsOrder: SharedValue<string[]>;
}) => {
  const { task, itemHeight, itemsOrder } = props;
  const style = useAnimatedStyle(() => {
    const index = itemsOrder.value.findIndex((id) => id === task.id);
    if (index === -1) {
      return {
        display: "none",
      };
    }
    return {
      display: "flex",
      top: withTiming(index * itemHeight, { duration: 100 }),
    };
  });

  return (
    <Animated.View
      style={[
        { position: "absolute", width: "100%", height: itemHeight },
        style,
      ]}
    >
      <TasksListItem
        task={task}
        isEdited={false}
        height={itemHeight}
        onPress={() => {}}
      />
    </Animated.View>
  );
};

const MovingItem = (props: {
  task: ITaskWithPosition | null;
  itemHeight: number;
  dragY: SharedValue<number>;
}) => {
  const { dragY, task, itemHeight } = props;

  const style = useAnimatedStyle(() => {
    return {
      top: dragY.value - itemHeight / 2,
    };
  });

  if (!task) {
    return null;
  }

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
        },
        style,
      ]}
    >
      <TasksListItem
        task={task}
        isEdited={false}
        height={itemHeight}
        onPress={() => {}}
      />
    </Animated.View>
  );
};

type MovingItemPointerProps = {
  visible: boolean;
  pointerIndex: SharedValue<number | null>;
  itemHeight: number;
};

const MovingItemPointer = ({
  visible,
  pointerIndex,
  itemHeight,
}: MovingItemPointerProps) => {
  const separatorStyle = useAnimatedStyle(() => ({
    top: withTiming((pointerIndex.value || 0) * itemHeight, { duration: 50 }),
    display: pointerIndex.value === null ? "none" : "flex",
  }));
  if (!visible) {
    return null;
  }
  return (
    <AnimatedSeparator
      position={"absolute"}
      borderBottomWidth={2}
      width={"100%"}
      borderColor={"red"}
      style={[separatorStyle]}
    />
  );
};
