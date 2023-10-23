import { H6, Stack, YStack } from "tamagui";
import TasksList from "../../core/components/tasks/list/TasksList";
import { DEFAULT_TASKS } from "./defaultData";
import { DailyCalendar } from "./components/DailyCalendar";



export interface DailyPlannerScreenProps {
  day: string;
}

export const DailyPlannerScreen = ({ day }: DailyPlannerScreenProps) => {
  //TODO: get list of tasks
  const tasksWithSameDay = DEFAULT_TASKS.filter(task => task.startDate?.date === day);
  const tasksWithoutStartTime = tasksWithSameDay.filter(t => !t.startDate?.time || !t.durationMin);
  const tasksWithStartTime = tasksWithSameDay.filter(t => !!t.startDate?.time && !!t.durationMin)
  
    return (
    <YStack fullscreen backgroundColor={"$background"}>
      <TasksList items={tasksWithoutStartTime}/>
      <DailyCalendar tasks={tasksWithStartTime} day={day}/>
    </YStack>
  );
};
