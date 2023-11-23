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
import { useGetTasks } from "../../../clients/time-planner-server/client";
import TasksListItem from "../../../core/components/tasks/list/TasksListItem";
import { useScreenDimensions } from "../../../core/dimensions/UseScreenDimensions";
import { ITaskWithPosition } from "../../dailyPlanner/model/model";

const AnimatedSeparator = Animated.createAnimatedComponent(Separator);



export const TasksListScreen = () => {
  const {
    data: tasks,
    isError,
    isLoading,
  } = useGetTasks({ day: dayjs().format(DAY_FORMAT) });
  const [tasksList, setTasksList] = useState<ITaskWithPosition[]>([]);
  const [movingItemState, setMovingItemState] =
    useState<ITaskWithPosition | null>(null);
  const { headerHeight } = useScreenDimensions();

  useEffect(() => {
    const tasksWithPosition =
      (tasks?.filter(
        (t) => !t.startTime || !t.durationMin
      ) as ITaskWithPosition[]) ?? [];
    setTasksList(tasksWithPosition);
  }, [tasks]);

  const sortedTasks = useMemo(
    () => tasksList.sort((a, b) => a.listPosition - b.listPosition),
    [tasksList]
  );

  const itemHeight = 55;
  const dragY = useSharedValue<number>(0);
  const pointerIndex = useSharedValue<number | null>(null);
  const movingTasksList = useSharedValue<ITaskWithPosition[]>([]);
  const movingItem = useSharedValue<ITaskWithPosition | null>(null);

  useAnimatedReaction(
    () => movingItem.value,
    (current, prev) => {
      if (prev !== current) {
        runOnJS(setMovingItemState)(current);
      }
    }
  );

  const separatorStyle = useAnimatedStyle(() => ({
    top: withTiming((pointerIndex.value || 0) * itemHeight, { duration: 50 }),
    display: pointerIndex.value === null ? "none" : "flex",
  }));

  if (isLoading) {
    return <Spinner />;
  }
  if (isError) {
    return <H6>{"Error during loading tasks, try again"}</H6>; //TODO: this should be toast!
  }

  const panGesture = Gesture.Pan()
    .onStart((e) => {
      movingTasksList.value = tasksList;
      dragY.value = e.absoluteY - headerHeight;
      const pressedItemIndex = Math.floor(e.y / itemHeight);
      const pressedItem = movingTasksList.value[pressedItemIndex];
      if (!pressedItem) {
        return;
      }
      pointerIndex.value = pressedItemIndex;
      movingItem.value = pressedItem;
      removeItemWorklet(pressedItem, movingTasksList);
      runOnJS(setTasksList)(movingTasksList.value);
    })
    .onChange((e) => {
      if (!movingItem.value) {
        return;
      }
      dragY.value = e.absoluteY - headerHeight;
      const newPointer = Math.min(
        tasksList.length,
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
      addItemWorklet(movingItem.value, pointerIndex.value, movingTasksList);
      movingItem.value = null;
      pointerIndex.value = null;
      runOnJS(setTasksList)(movingTasksList.value);
    });
  return (
    <YStack>
      {/* <Link href={{
                pathname: "/(tabs)/(tasks)/tasks/[taskId]",
                params: {
                    taskId: "1"
                }
            }} asChild>
                <Button>
                    {"Task 1"}
                </Button>
            </Link> */}

      <GestureDetector gesture={panGesture}>
        <Animated.View
          collapsable={false}
          style={[
            {
              flexDirection: "column",
            },
          ]}
        >
          {sortedTasks.map((task) => {
            return (
              <MovableItem key={task.id} task={task} itemHeight={itemHeight} />
            );
          })}
        </Animated.View>
      </GestureDetector>
      {movingItemState ? (
        <MovingItem
          dragY={dragY}
          task={movingItemState}
          itemHeight={itemHeight}
        />
      ) : null}
      {movingItemState ? (
        <AnimatedSeparator
          position={"absolute"}
          borderBottomWidth={2}
          width={"100%"}
          borderColor={"red"}
          style={[separatorStyle]}
        />
      ) : null}
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

const useTaskList = () => {
    
}

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
  task: ITaskWithPosition;
  itemHeight: number;
  dragY: SharedValue<number>;
}) => {
  const { dragY, task, itemHeight } = props;

  const style = useAnimatedStyle(() => {
    return {
      top: dragY.value - itemHeight / 2,
    };
  });

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
