import { YStack } from "tamagui";
import { ITaskWithTime } from "../model/model";
import { DailyCalendarTask } from "./DailyCalendarTask";

export interface DailyCalendarItemsProps {
  minuteInPixels: number;
  day: string;
  tasks: ITaskWithTime[];
  pressedTaskId: string | null;
  onTaskPress: (task: ITaskWithTime) => void;
  editedTaskId: string|null;
}

export const DailyCalendarTasks = ({
  minuteInPixels,
  tasks,
  pressedTaskId,
  onTaskPress,
  day,
  editedTaskId,
}: DailyCalendarItemsProps) => {
  return (
    <YStack fullscreen position="absolute" paddingLeft={60} paddingRight={15}>
      {tasks.map((task) => {
        if (pressedTaskId === task.id) {
          return null;
        }
        return (
          <DailyCalendarTask
            key={task.id}
            isEdited={editedTaskId === task.id}
            minuteInPixels={minuteInPixels}
            task={task}
            onPress={onTaskPress}
          />
        );
      })}
    </YStack>
  );
};
