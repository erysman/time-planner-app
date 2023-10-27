import {
  YStack
} from "tamagui";
import { ITaskWithTime } from "../model/model";
import { DailyCalendarTask } from "./DailyCalendarTask";

export interface DailyCalendarItemsProps {
  minuteInPixels: number;
  day: string,
  tasks: ITaskWithTime[];
  editedTaskId: string | null;
  onTaskPress: (task: ITaskWithTime) => void;
}

export const DailyCalendarTasks = ({
  minuteInPixels,
  tasks,
  editedTaskId,
  onTaskPress,
  day
}: DailyCalendarItemsProps) => {
  return (
    <YStack fullscreen position="absolute" paddingLeft={60} paddingRight={15}>
      {tasks.map((task) => (
        <DailyCalendarTask
          key={task.id}
          isEdited={editedTaskId === task.id}
          minuteInPixels={minuteInPixels}
          task={task}
          onPress={onTaskPress}
        />
      ))}
    </YStack>
  );
};
