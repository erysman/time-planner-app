import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { Spinner, YStack } from "tamagui";
import { useDraggableCalendarList } from "../../logic/UseDraggableCalendarList";
import { IProject, ITask } from "../../model/model";
import { DraggableCalendar } from "../calendar/DraggableCalendar";
import { DraggableList } from "./DraggableList";
import { MovingCalendarListItem } from "./MovingCalendarListItem";
import { useScreenDimensions } from "../../../../core/logic/dimensions/UseScreenDimensions";
import { deviceName } from "expo-device";
import {
  useGetDayTasks,
  useGetProjects,
  useGetTasksDayOrder,
} from "../../../../clients/time-planner-server/client";
import { getRefreshInterval } from "../../../../core/logic/config/utils";
import { useErrorBoundary } from "react-error-boundary";
import { useEffect, useMemo } from "react";

export interface DraggableCalendarListProps {
  day: string;
}

export const DraggableCalendarList = ({ day }: DraggableCalendarListProps) => {
  const {
    data: tasksData,
    isError,
    error,
    isLoading: isDayTasksLoading,
  } = useGetDayTasks(day, { query: { refetchInterval: getRefreshInterval() } });
  const {
    data: tasksOrderData,
    isError: isErrorOrder,
    error: errorOrder,
    isLoading: isLoadingOrder,
  } = useGetTasksDayOrder(day, {
    query: { refetchInterval: getRefreshInterval() },
  });

  const {
    data: projectsData,
    isError: isErrorProjects,
    error: errorProjects,
    isLoading: isLoadingProjects,
  } = useGetProjects({ query: { refetchInterval: getRefreshInterval() } });

  const { showBoundary } = useErrorBoundary();
  useEffect(() => {
    if (isError) {
      showBoundary(error);
    }
    if (isErrorOrder) {
      showBoundary(errorOrder);
    }
    if (isErrorProjects) {
      showBoundary(errorProjects);
    }
  }, [isError, isErrorOrder, isErrorProjects]);

  const isLoading = useMemo(
    () => isDayTasksLoading || isLoadingOrder || isLoadingProjects,
    [isDayTasksLoading, isLoadingOrder, isLoadingProjects]
  );

  const tasks = (tasksData ?? []) as ITask[];
  const tasksOrder = (tasksOrderData ?? []) as string[];
  const projects = (projectsData ?? []) as IProject[];

  // if (isLoading) {
  //   return <Spinner />; //TODO: print skeleton, not Spinner
  // }
  const {
    dragGesture,
    movingItem,
    scroll: {
      calendarScrollProps,
      calendarScrollRef,
      listScrollProps,
      listScrollRef,
    },
    styles: { calendarStyle, listStyle },
    movingTask,
  } = useDraggableCalendarList(day, tasksOrder, tasks);
  const { screenHeight } = useScreenDimensions();
  return (
    <YStack height={screenHeight} backgroundColor={"$background"}>
      <GestureDetector gesture={dragGesture}>
        <Animated.View
          collapsable={false}
          style={[{ flexDirection: "column" }]}
        >
          <DraggableList
            day={day}
            isLoading={isLoading}
            tasks={tasks}
            projects={projects}
            itemsOrder={movingItem.itemsOrder}
            listPointerIndex={movingItem.listPointerIndex}
            listStyle={listStyle}
            scrollRef={listScrollRef}
            scrollProps={listScrollProps}
            movingItemId={movingItem.id}
          />
          <DraggableCalendar
            day={day}
            isLoading={isLoading}
            projects={projects}
            tasks={tasks}
            movingItemId={movingItem.id}
            scrollRef={calendarScrollRef}
            scrollProps={calendarScrollProps}
            calendarStyle={calendarStyle}
            movingTimeAndDurationOfTasks={
              movingItem.movingTimeAndDurationOfTasks
            }
          />
        </Animated.View>
      </GestureDetector>
      <MovingCalendarListItem
        viewY={movingItem.viewY}
        movingItemType={movingItem.type}
        task={movingTask}
        project={projects.find((p) => p.id === movingTask?.projectId)}
        movingTimeAndDurationOfTasks={movingItem.movingTimeAndDurationOfTasks}
      />
    </YStack>
  );
};
