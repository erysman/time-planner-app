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
  getGetTasksQueryKey,
  useGetTasks,
  useUpdateTask,
} from "../../../clients/time-planner-server/client";
import TasksListItem from "../../../core/components/tasks/list/TasksListItem";
import { useScreenDimensions } from "../../../core/dimensions/UseScreenDimensions";
import { ITaskWithPosition } from "../../dailyPlanner/model/model";
import { useQueryClient } from "@tanstack/react-query";
import { TaskDTO } from "../../../clients/time-planner-server/model";

const AnimatedSeparator = Animated.createAnimatedComponent(Separator);

/*
    TODO:
        * design better endpoint for updating tasks positions (all tasks positions at once)
        * refresh data on swipe up, auto refresh every minute
        * do not remove moving task from the list, just mark it as visible=false
*/

export const TasksListScreen = () => {
  const day = dayjs().format(DAY_FORMAT);
  const {
    data: tasks,
    isError,
    isLoading,
  } = useGetTasks({ day }, { query: { refetchInterval: 5000 } });

  const queryClient = useQueryClient();
  const updateTask = useUpdateTask(
//     {
//     mutation: {
//       onSuccess: (newTask) => {
//         queryClient.setQueryData<TaskDTO[]>(
//           getGetTasksQueryKey({ day }),
//           (prev) =>
//             prev?.map((task) => (task.id === newTask.id ? newTask : task))
//         );
//       },
//     },
//   }
);

  useEffect(() => {
    const tasksWithPosition =
      (tasks?.filter(
        (t) => !t.startTime || !t.durationMin
      ) as ITaskWithPosition[]) ?? [];
      console.log(`fetched tasks changed, updating tasks: `, tasksWithPosition)
    setTasksList(tasksWithPosition);
  }, [JSON.stringify(tasks)]);

  const [tasksList, setTasksList] = useState<ITaskWithPosition[]>([]);
  if (isLoading) {
    return <Spinner />;
  }
  if (isError) {
    return <H6>{"Error during loading tasks, try again"}</H6>; //TODO: this should be toast!
  }
  return (
    <DraggableList
      items={tasksList}
      setItems={(items) => {
        console.log(`setItems: `, items);
        setTasksList(items);
        items.forEach((item) =>
          updateTask.mutateAsync({
            id: item.id,
            data: { listPosition: item.listPosition },
          })
        );
        console.log(`setItems: updated positions async`);
      }}
    />
  );
};

type DraggableListProps = {
  items: ITaskWithPosition[];
  setItems: (items: ITaskWithPosition[]) => void;
};

export const DraggableList = ({ items, setItems }: DraggableListProps) => {
  const itemHeight = 55;
  const { panGesture, sortedItems, movingItem, dragY, pointerIndex } =
    useDraggableList(itemHeight, items, setItems);
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
          {sortedItems.map((task) => {
            return (
              <MovableItem key={task.id} task={task} itemHeight={itemHeight} />
            );
          })}
        </Animated.View>
      </GestureDetector>
      <MovingItem dragY={dragY} task={movingItem} itemHeight={itemHeight} />
      <MovingItemPointer
        itemHeight={itemHeight}
        movingItemState={movingItem}
        pointerIndex={pointerIndex}
      />
    </YStack>
  );
};

function removeItemWorklet(
  item: ITaskWithPosition,
  movingTasksList: SharedValue<ITaskWithPosition[]>
) {
  "worklet";
  const prev = movingTasksList.value;
  const newList = [...prev];
  const indexToRemove = prev.findIndex((item1) => item1.id === item.id);
  if (indexToRemove !== -1) {
    newList.splice(indexToRemove, 1);
  }
  newList.forEach((item1, i) => {
    if (item1.listPosition !== i) {
      item1.listPosition = i;
    }
  });
  movingTasksList.value = newList;
}

function addItemWorklet(
  newItem: ITaskWithPosition,
  index: number,
  movingTasksList: SharedValue<ITaskWithPosition[]>
) {
  "worklet";
  const prev = movingTasksList.value;
  const newList = [...prev];
  newList.splice(index, 0, newItem);
  newList.forEach((item, i) => {
    if (item.listPosition !== i) {
      item.listPosition = i;
    }
  });
  movingTasksList.value = newList;
}

const useDraggableList = (
  itemHeight: number,
  items: ITaskWithPosition[],
  setItems: (items: ITaskWithPosition[]) => void
) => {
  //   const [itemsList, setItemsList] = useState<ITaskWithPosition[]>([]);
  const [movingItemState, setMovingItemState] =
    useState<ITaskWithPosition | null>(null);
  const { headerHeight } = useScreenDimensions();

  //   useEffect(() => {
  //     setItemsList(items);
  //   }, [items]);

  const sortedItems = useMemo(() => {
    const sortedItems = items.sort((a, b) => a.listPosition - b.listPosition);
    console.log(`items changes, sorted: `, sortedItems);
    return sortedItems;
  }, [JSON.stringify(items)]);

  const dragY = useSharedValue<number>(0);
  const pointerIndex = useSharedValue<number | null>(null);
  const movingItemsList = useSharedValue<ITaskWithPosition[]>([]);
  const movingItem = useSharedValue<ITaskWithPosition | null>(null);

  useAnimatedReaction(
    () => movingItem.value,
    (current, prev) => {
      if (prev !== current) {
        runOnJS(setMovingItemState)(current);
      }
    }
  );

  const panGesture = Gesture.Pan()
    .onStart((e) => {
      movingItemsList.value = items;
      dragY.value = e.absoluteY - headerHeight;
      const pressedItemIndex = Math.floor(e.y / itemHeight);
      const pressedItem = movingItemsList.value[pressedItemIndex];
      if (!pressedItem) {
        return;
      }
      console.log(`pressed item: `, pressedItem)
      pointerIndex.value = pressedItemIndex;
      movingItem.value = pressedItem;
      removeItemWorklet(pressedItem, movingItemsList);
      runOnJS(setItems)(movingItemsList.value);
    })
    .onChange((e) => {
      if (!movingItem.value) {
        return;
      }
      dragY.value = e.absoluteY - headerHeight;
      const newPointer = Math.min(
        movingItemsList.value.length,
        Math.max(0, Math.floor(dragY.value / itemHeight))
      );
      if (pointerIndex.value === newPointer) {
        return;
      }
      pointerIndex.value = newPointer;
    })
    .onEnd(() => {
      if (!movingItem.value || pointerIndex.value === null) {
        return;
      }
      console.log(`press released`)
      addItemWorklet(movingItem.value, pointerIndex.value, movingItemsList);
      movingItem.value = null;
      pointerIndex.value = null;
      runOnJS(setItems)(movingItemsList.value);
    });
  return {
    panGesture,
    sortedItems,
    movingItem: movingItemState,
    dragY,
    pointerIndex,
  };
};

const MovableItem = (props: {
  task: ITaskWithPosition;
  itemHeight: number;
}) => {
  const { task, itemHeight } = props;

  return (
    <Animated.View>
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
  movingItemState: ITaskWithPosition | null;
  pointerIndex: SharedValue<number | null>;
  itemHeight: number;
};

const MovingItemPointer = ({
  movingItemState,
  pointerIndex,
  itemHeight,
}: MovingItemPointerProps) => {
  const separatorStyle = useAnimatedStyle(() => ({
    top: withTiming((pointerIndex.value || 0) * itemHeight, { duration: 50 }),
    display: pointerIndex.value === null ? "none" : "flex",
  }));
  if (!movingItemState) {
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
