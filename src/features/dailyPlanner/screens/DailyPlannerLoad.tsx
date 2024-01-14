import { H6, Spinner, YStack } from "tamagui";
import {
  useGetDayTasks,
  useGetProjects,
  useGetTasksDayOrder,
} from "../../../clients/time-planner-server/client";
import { getRefreshInterval } from "../../../core/logic/config/utils";
import { useScreenDimensions } from "../../../core/logic/dimensions/UseScreenDimensions";
import { DraggableCalendarList } from "../components/draggableCalendarList/DraggableCalendarList";
import { CalendarListDataProvider } from "../logic/UseCalendarListContext";
import { IProject, ITask } from "../model/model";

export interface DailyPlannerLoadProps {
  day: string;
}

export const DailyPlannerLoad = ({ day }: DailyPlannerLoadProps) => {
  const {
    data: tasks,
    isError,
    isLoading,
  } = useGetDayTasks(day, { query: { refetchInterval: getRefreshInterval(),useErrorBoundary: true } });
  const {
    data: tasksOrder,
    isError: isErrorOrder,
    isLoading: isLoadingOrder,
  } = useGetTasksDayOrder(day, {
    query: { refetchInterval: getRefreshInterval(), useErrorBoundary: true },
  });

  const {
    data: projects,
    isError: isErrorProjects,
    isLoading: isLoadingProjects,
  } = useGetProjects({ query: { refetchInterval: getRefreshInterval(),useErrorBoundary: true } });

  if (isLoading || isLoadingOrder || isLoadingProjects) {
    return <Spinner />; //TODO: print skeleton, not Spinner
  }
  
  return (
    <CalendarListDataProvider>
      <DraggableCalendarList
        day={day}
        tasks={tasks as ITask[]}
        projects={projects as IProject[]}
        tasksOrder={tasksOrder as string[]}
      />
    </CalendarListDataProvider>
  );
};
