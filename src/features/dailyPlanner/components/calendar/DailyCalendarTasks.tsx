import { YStack } from "tamagui";
import { ITaskWithTime } from "../../model/model";
import { DailyCalendarTask } from "./DailyCalendarTask";

export interface DailyCalendarItemsProps {
  tasks: ITaskWithTime[];
  pressedTaskId: string | null;
  onTaskPress: (taskId: string) => void;
  editedTaskId: string|null;
}

export const DailyCalendarTasks = ({
  tasks,
  pressedTaskId,
  onTaskPress,
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
            task={task}
            onPress={onTaskPress}
          />
        );
      })}
    </YStack>
  );
};
