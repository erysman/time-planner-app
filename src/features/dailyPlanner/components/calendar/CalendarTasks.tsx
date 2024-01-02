import { YStack } from "tamagui";
import { ITask, ITaskWithTime, TimeAndDuration, TimeAndDurationMap } from "../../model/model";
import { CalendarTask } from "./CalendarTask";
import { SharedValue } from "react-native-reanimated";

export interface CalendarItemsProps {
  tasks: ITask[];
  pressedTaskId: string | null;
  onTaskPress: (taskId: string) => void;
  editedTaskId: string|null;
  movingTimeAndDurationOfTasks: SharedValue<TimeAndDurationMap>
}

export const CalendarTasks = ({
  tasks,
  pressedTaskId,
  onTaskPress,
  editedTaskId,
  movingTimeAndDurationOfTasks,
}: CalendarItemsProps) => {
  return (
    <YStack fullscreen position="absolute" paddingLeft={60} paddingRight={15}>
      {tasks.map((task) => {
        if (pressedTaskId === task.id) {
          return null;
        }
        return (
          <CalendarTask
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
