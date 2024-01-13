import { Spinner, H6 } from "tamagui";
import { useGetTask } from "../../../clients/time-planner-server/client";
import { ITask } from "../../../features/dailyPlanner/model/model";
import { EditTaskForm } from "./EditTaskForm";


interface TaskFormLoadProps {
  id: string;
  onClose: () => void;
}

export const TaskFormLoad = ({ id, onClose }: TaskFormLoadProps) => {
  const { data, isError, isLoading } = useGetTask(id);

  if (isLoading) {
    return <Spinner />;
  }
  if (isError) {
    return <H6>Error while loading task data</H6>;
  }
  const task = data as ITask;
  if(!task) return null;
  return (
    <EditTaskForm
      name={task.name}
      id={id}
      day={task.startDay}
      startTime={task.startTime}
      projectId={task.projectId}
      durationMin={task.durationMin}
      isImportant={task.isImportant}
      isUrgent={task.isUrgent}
      onClose={onClose}
    />
  );
};
