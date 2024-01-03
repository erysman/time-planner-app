import { YStack } from "tamagui";
import { IProject, ITask, ITaskWithTime, TimeAndDuration, TimeAndDurationMap } from "../../model/model";
import { CalendarTask } from "./CalendarTask";
import { SharedValue } from "react-native-reanimated";
import { useDraggableCalendarListContext } from "../../logic/UseCalendarListContext";

export interface CalendarItemsProps {
  tasks: ITask[];
  pressedTaskId: string | null;
  movingTimeAndDurationOfTasks: SharedValue<TimeAndDurationMap>;
  projects: IProject[];
}

export const CalendarTasks = ({
  tasks,
  pressedTaskId,
  movingTimeAndDurationOfTasks,
  projects
}: CalendarItemsProps) => {
  const { editedTaskId, setEditedTaskId } = useDraggableCalendarListContext();
  const onTaskPress = (taskId: string) => {
    setEditedTaskId((prevTaskId) => {
      if (prevTaskId === taskId) return null;
      return taskId;
    });
  };
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
            projectColor={projects.find(p => p.id === task.projectId)?.color}
          />
        );
      })}
    </YStack>
  );
};
