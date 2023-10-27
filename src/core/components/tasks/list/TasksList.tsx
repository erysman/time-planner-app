import React, { useEffect } from "react";
import TasksListItem, { TasksListItemProps } from "./TasksListItem";
import { ScrollView, YStack } from "tamagui";
import { ITask } from "../../../../features/dailyPlanner/model/model";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { DailyPlannerViewMode, useHeightByViewMode } from "../../../../features/dailyPlanner/logic/UseDailyPlannerViewMode";
import { DimensionInPercent } from "../../../model/types";

export type TasksListProps = {
  tasks: ITask[];
  height: any;
  viewMode: DailyPlannerViewMode;
};

export default function TasksList({ tasks, viewMode }: TasksListProps) {
  const style = useHeightByViewMode(viewMode, getListHeight);
  return (
    <Animated.View style={[style]}>
      <ScrollView
        h={"100%"}
        alwaysBounceHorizontal={false}
        alwaysBounceVertical={false}
        bounces={false}
        overScrollMode="never"
      >
        {tasks.map((task, i) => (
          <TasksListItem key={task.id} task={task} first={i === 0} />
        ))}
      </ScrollView>
    </Animated.View>
  );
}

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
