import React, { useState } from "react";
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { ScrollView, Separator, Stack } from "tamagui";
import {
  DailyPlannerViewMode,
  useHeightByViewMode,
} from "../../../../features/dailyPlanner/logic/UseDailyPlannerViewMode";
import { ITaskWithPosition } from "../../../../features/dailyPlanner/model/model";
import { DimensionInPercent } from "../../../model/types";
import TasksListItem from "./TasksListItem";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

export type TasksListProps = {
  tasks: ITaskWithPosition[];
  height: any;
  viewMode: DailyPlannerViewMode;
};

export default function TasksList({ tasks, viewMode }: TasksListProps) {
  const style = useHeightByViewMode(viewMode, getListHeight);

  const positions = useSharedValue(
    Object.fromEntries(tasks.map((task) => [task.id, task.dayOrder]))
  );

  const taskHeight = 55;

  const [editedTaskId, setEditedTaskId] = useState<string | null>(null);

  const top = useSharedValue(0);
  const pressed = useSharedValue(false);

  function swapPositions(object: any, from: number, to: number): any {
    "worklet";
    const newObject = { ...object };
    for (const id in object) {
      if (object[id] === from) {
        newObject[id] = to;
      }
      if (object[id] === to) {
        newObject[id] = from;
      }
    }
    return newObject;
  }

  const pan = Gesture.Pan()
    .enabled(!!editedTaskId)
    .onStart(() => {
      pressed.value = true;
    })
    .onChange((e) => {
      if (!editedTaskId) return;

      const positionY =Math.max( e.y, 0);
      top.value = positionY;
      const newPosition = Math.min(
        Math.max(Math.floor(positionY / taskHeight), 0),
        tasks.length - 1
      );

      if (newPosition !== positions.value[editedTaskId]) {
        console.log(`swapPositions: from ${positions.value[editedTaskId]} to ${newPosition}`)
        positions.value = swapPositions(
          positions.value,
          positions.value[editedTaskId],
          newPosition
        );
      }
    })
    .onEnd(() => {
      pressed.value = false;

      //TODO: update positions of the tasks
    });

  return (
    <Animated.View style={[style]}>
      <GestureDetector gesture={pan}>
        <ScrollView
          h={"100%"}
          alwaysBounceHorizontal={false}
          alwaysBounceVertical={false}
          bounces={false}
          overScrollMode="never"
          contentContainerStyle={{ height: "100%" }}
        >
          {tasks.map((task) => {
            const isEdited = editedTaskId === task.id;

            return (
              <MovableTask
                positions={positions}
                key={task.id}
                top={isEdited ? top : null}
                pressed={pressed}
                task={task}
                taskHeight={taskHeight}
                isEdited={isEdited}
                onPress={() => setEditedTaskId(prev => {
                  if(prev === task.id) {
                    return null;
                  }
                  return task.id
                })}
              />
            );
          })}
        </ScrollView>
      </GestureDetector>
    </Animated.View>
  );
}

interface MovableTaskProps {
  task: ITaskWithPosition;
  isEdited: boolean;
  taskHeight: number;
  onPress: () => void;
  top: any;
  positions: any;
  pressed: any,
}

export const MovableTask = ({
  task,
  isEdited,
  taskHeight,
  onPress,
  top,
  pressed,
  positions,
}: MovableTaskProps) => {
  const moveStyle = useAnimatedStyle(() => ({
    top: (isEdited && pressed.value ? top.value : withTiming((positions.value[task.id] ?? 0) * (taskHeight - 1), {duration: 100})),
    overflow: "hidden" 
  }));

  // useAnimatedReaction(
  //   () => (editedTaskId ? positions.value[editedTaskId] : null),
  //   (currentPosition, prevPosition) => {
  //     if (currentPosition && currentPosition !== prevPosition) {
  //       top.value = withTiming(currentPosition * taskHeight);
  //     }
  //   }
  // );

  return (
    <Animated.View
      style={[
        {
          zIndex: isEdited ? 200 : 100,
          position: "absolute",
          height: taskHeight,
          width: "100%",
        },
        moveStyle,
      ]}
    >
      <TasksListItem
        height={taskHeight}
        task={task}
        onPress={onPress}
        isEdited={isEdited}
      />
    </Animated.View>
  );
};

function getListHeight(viewMode: DailyPlannerViewMode): DimensionInPercent {
  switch (viewMode) {
    case "both":
      return "50%";
    case "calendar":
      return "0%";
    case "list":
      return "100%";
  }
}
