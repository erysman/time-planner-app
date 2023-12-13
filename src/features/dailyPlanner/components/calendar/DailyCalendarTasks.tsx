import { YStack } from "tamagui";
import { ITask, ITaskWithTime, TimeAndDuration, TimeAndDurationMap } from "../../model/model";
import { DailyCalendarTask } from "./DailyCalendarTask";
import { SharedValue } from "react-native-reanimated";

export interface DailyCalendarItemsProps {
  tasks: ITask[];
  pressedTaskId: string | null;
  onTaskPress: (taskId: string) => void;
  editedTaskId: string|null;
  movingTimeAndDurationOfTasks: SharedValue<TimeAndDurationMap>
}

export const DailyCalendarTasks = ({
  tasks,
  pressedTaskId,
  onTaskPress,
  editedTaskId,
  movingTimeAndDurationOfTasks,
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
            movingTimeAndDurationOfTasks={movingTimeAndDurationOfTasks}
          />
        );
      })}
    </YStack>
  );
};
