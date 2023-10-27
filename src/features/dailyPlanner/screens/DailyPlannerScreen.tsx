import { H6, Spinner, YStack } from "tamagui";
import { useGetTasks } from "../../../clients/time-planner-server/client";
import TasksList from "../../../core/components/tasks/list/TasksList";
import { DailyCalendar } from "../components/DailyCalendar";
import { DailyPlannerViewMode } from "../logic/UseDailyPlannerViewMode";
import { useSharedValue, withTiming } from "react-native-reanimated";
import { useEffect } from "react";

export interface DailyPlannerScreenProps {
  day: string;
  viewMode: DailyPlannerViewMode
}

export const DailyPlannerScreen = ({ day, viewMode }: DailyPlannerScreenProps) => {
  
  const {data: tasks, isError, isLoading} = useGetTasks({day});

  if(isLoading) {
    return (<Spinner />)
  }
  if(isError) {
    return (<H6>{"Error during loading tasks, try again"}</H6>) //TODO: this should be toast!
  }

  const tasksWithSameDay = tasks.filter(task => task.startDate === day);
  const tasksWithoutStartTime = tasksWithSameDay.filter(t => !t.startTime || !t.durationMin);
  const tasksWithStartTime = tasksWithSameDay.filter(t => !!t.startTime && !!t.durationMin)
    return (
    <YStack fullscreen backgroundColor={"$background"}>
      <TasksList tasks={tasksWithoutStartTime} viewMode={viewMode}/>
      <DailyCalendar tasks={tasksWithStartTime} day={day} viewMode={viewMode}/>
    </YStack>
  );
};


