import { H6, Spinner, YStack } from "tamagui";
import {
  useGetDayTasks,
  useGetProjects,
  useGetTasksDayOrder,
} from "../../../clients/time-planner-server/client";
import { getRefreshInterval } from "../../../core/config/utils";
import { useScreenDimensions } from "../../../core/dimensions/UseScreenDimensions";
import { DraggableCalendarList } from "../components/draggableCalendarList/DraggableCalendarList";
import { CalendarListDataProvider } from "../logic/UseCalendarListContext";
import { IProject, ITask } from "../model/model";

export interface DailyPlannerScreenProps {
  day: string;
}

export const DailyPlannerScreen = ({ day }: DailyPlannerScreenProps) => {
  const {
    data: tasks,
    isError,
    isLoading,
  } = useGetDayTasks(day, { query: { refetchInterval: getRefreshInterval() } });
  const {
    data: tasksOrder,
    isError: isErrorOrder,
    isLoading: isLoadingOrder,
  } = useGetTasksDayOrder(day, {
    query: { refetchInterval: getRefreshInterval() },
  });

  const {
    data: projects,
    isError: isErrorProjects,
    isLoading: isLoadingProjects,
  } = useGetProjects({ query: { refetchInterval: getRefreshInterval() } });

  if (isLoading || isLoadingOrder || isLoadingProjects) {
    return <Spinner />; //TODO: print skeleton, not Spinner
  }
  if (isError || isErrorOrder || isErrorProjects) {
    return <H6>{"Error during loading tasks or projects, try again"}</H6>; //TODO: this should be toast!
  }

  return (
    <CalendarListDataProvider>
      <DraggableCalendarList
        day={day}
        tasks={tasks as ITask[]}
        projects={projects as IProject[]}
        tasksOrder={tasksOrder}
      />
    </CalendarListDataProvider>
  );
};
