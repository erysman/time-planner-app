import Animated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useDraggableCalendarListContext } from "../../logic/UseCalendarListContext";
import { mapDurationToHeight, timeToMinutes } from "../../logic/utils";
import { ITask, TimeAndDurationMap } from "../../model/model";
import { CalendarTaskHeightEditHandler } from "./CalendarTaskHeightEditHandler";
import { CalendarTaskView } from "./CalendarTaskView";
import { useEditTaskModal } from "../../../../core/components/modal/UseEditTaskModal";
import { useQueryClient } from "@tanstack/react-query";
import {
  useDeleteTask,
  getGetDayTasksQueryKey,
  getGetTasksDayOrderQueryKey,
  getGetProjectTasksQueryKey,
  getGetTaskQueryKey,
} from "../../../../clients/time-planner-server/client";

export interface CalendarTaskProps {
  task: ITask;
  isEdited: boolean;
  onPress: (taskId: string) => void;
  movingTimeAndDurationOfTasks: SharedValue<TimeAndDurationMap>;
  projectColor?: string;
}

export const CalendarTask = ({
  task,
  isEdited,
  onPress,
  movingTimeAndDurationOfTasks,
  projectColor,
}: CalendarTaskProps) => {
  const { minuteInPixels, itemHeight } = useDraggableCalendarListContext();

  const topStyle = useAnimatedStyle(() => {
    const timeAndDuration = movingTimeAndDurationOfTasks.value[task.id];
    if (!timeAndDuration || timeAndDuration.startTimeMinutes === null) {
      return {
        display: "none",
      };
    }
    return {
      display: "flex",
      top: mapDurationToHeight(
        timeAndDuration.startTimeMinutes,
        minuteInPixels
      ),
    };
  });
  const { taskModal, openTaskModal } = useEditTaskModal();
  const zIndexAdd = timeToMinutes(task.startTime ?? "00:00") / 10;
  const zIndex = isEdited ? 200 + zIndexAdd : 100 + zIndexAdd;
  const queryClient = useQueryClient();
  const deleteTask = useDeleteTask({
    mutation: {
      onSettled: () => {
        if (task.startDay) {
          queryClient.invalidateQueries({
            queryKey: getGetDayTasksQueryKey(task.startDay),
          });
          queryClient.invalidateQueries({
            queryKey: getGetTasksDayOrderQueryKey(task.startDay),
          });
        }
        queryClient.invalidateQueries({
          queryKey: getGetProjectTasksQueryKey(task.projectId),
        });
        queryClient.invalidateQueries({
          queryKey: getGetTaskQueryKey(task.id),
        });
      },
    },
  });
  return (
    <>
      <Animated.View
        style={[
          {
            position: "absolute",
            width: "100%",
            marginLeft: 60,
            zIndex,
          },
          topStyle,
        ]}
      >
        <CalendarTaskHeightEditHandler
          isEdited={isEdited}
          id={task.id}
          name={task.name}
          day={task.startDay}
          movingTimeAndDurationOfTasks={movingTimeAndDurationOfTasks}
        >
          <CalendarTaskView
            hourSlotHeight={itemHeight}
            id={task.id}
            name={task.name}
            isImportant={task.isImportant}
            isUrgent={task.isUrgent}
            isEdited={isEdited}
            onPress={onPress}
            projectColor={projectColor}
            onEditPress={openTaskModal}
            onChecked={(checked) => {
              if (checked) {
                deleteTask.mutateAsync({ id: task.id });
              }
            }}
          />
        </CalendarTaskHeightEditHandler>
      </Animated.View>
      {taskModal}
    </>
  );
};
