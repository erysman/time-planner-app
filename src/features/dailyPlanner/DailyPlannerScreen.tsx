import { H6, Stack } from "tamagui";
import TasksList from "../../core/components/tasks/list/TasksList";
import { DEFAULT_TASKS } from "./defaultData";

export const DAY_FORMAT = "YYYY-MM-DD";

export interface DailyPlannerScreenProps {
  day: string;
}

export const DailyPlannerScreen = ({ day }: DailyPlannerScreenProps) => {
  //Tasks list
  //Calendar
  
    return (
    <Stack>
      <TasksList items={DEFAULT_TASKS}/>
    </Stack>
  );
};
