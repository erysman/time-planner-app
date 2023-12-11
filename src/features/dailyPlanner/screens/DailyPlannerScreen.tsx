import { H6, Spinner } from "tamagui";
import {
  useGetDayTasks,
  useGetTasksDayOrder,
} from "../../../clients/time-planner-server/client";
import { getRefreshInterval } from "../../../core/config/utils";
import { DraggableCalendarList } from "../components/draggableCalendarList/DraggableCalendarList";
import { DailyPlannerViewMode } from "../logic/UseDailyPlannerViewMode";
import { ITask } from "../model/model";
import { CalendarListDataProvider } from "../logic/UseCalendarListContext";

export interface DailyPlannerScreenProps {
  day: string;
  viewMode: DailyPlannerViewMode;
}

export const DailyPlannerScreen = ({
  day,
  viewMode,
}: DailyPlannerScreenProps) => {
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

  if (isLoading || isLoadingOrder) {
    return <Spinner />; //TODO: print skeleton, not Spinner
  }
  if (isError || isErrorOrder) {
    return <H6>{"Error during loading tasks, try again"}</H6>; //TODO: this should be toast!
  }

  return (
    <CalendarListDataProvider>
      <DraggableCalendarList
        viewMode={viewMode}
        day={day}
        tasks={tasks as ITask[]}
        tasksOrder={tasksOrder}
      />
    </CalendarListDataProvider>
  );
};
