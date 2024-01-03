import { H6, Spinner, YStack } from "tamagui";
import {
  useGetDayTasks,
  useGetTasksDayOrder,
} from "../../../clients/time-planner-server/client";
import { getRefreshInterval } from "../../../core/config/utils";
import { useScreenDimensions } from "../../../core/dimensions/UseScreenDimensions";
import { DraggableCalendarList } from "../components/draggableCalendarList/DraggableCalendarList";
import { CalendarListDataProvider } from "../logic/UseCalendarListContext";
import { ITask } from "../model/model";

export interface DailyPlannerScreenProps {
  day: string;
}

export const DailyPlannerScreen = ({
  day,
}:
DailyPlannerScreenProps) => {
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
  const { screenHeight } = useScreenDimensions();

  if (isLoading || isLoadingOrder) {
    return <Spinner />; //TODO: print skeleton, not Spinner
  }
  if (isError || isErrorOrder) {
    return <H6>{"Error during loading tasks, try again"}</H6>; //TODO: this should be toast!
  }

  return (
    <YStack h={screenHeight} w={"100%"}>
      <CalendarListDataProvider>
        <DraggableCalendarList
          day={day}
          tasks={tasks as ITask[]}
          tasksOrder={tasksOrder}
        />
      </CalendarListDataProvider>
    </YStack>
  );
};
