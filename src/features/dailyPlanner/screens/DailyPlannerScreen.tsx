import { useQueryClient } from "@tanstack/react-query";
import { H6, Spinner, YStack } from "tamagui";
import {
  getGetTasksDayOrderQueryKey,
  useGetDayTasks,
  useGetTasksDayOrder,
  useUpdateTasksDayOrder,
} from "../../../clients/time-planner-server/client";
import { DraggableList } from "../../../core/components/list/DraggableList";
import TasksListItem from "../../../core/components/list/TasksListItem";
import { DailyCalendar } from "../components/DailyCalendar";
import {
  DailyPlannerViewMode,
  useHeightByViewMode,
} from "../logic/UseDailyPlannerViewMode";
import { ITask, ITaskWithTime } from "../model/model";
import Animated from "react-native-reanimated";
import { DimensionInPercent } from "../../../core/model/types";

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
  } = useGetDayTasks(day, { query: { refetchInterval: 5000 } });
  const {
    data: tasksOrder,
    isError: isErrorOrder,
    isLoading: isLoadingOrder,
  } = useGetTasksDayOrder(day, { query: { refetchInterval: 5000 } });
  const queryClient = useQueryClient();
  const updateTasksDayOrder = useUpdateTasksDayOrder({
    mutation: {
      onMutate: async ({ data, day }) => {
        const queryKey = getGetTasksDayOrderQueryKey(day);
        console.log("optimistic cache update for key:", queryKey);
        await queryClient.cancelQueries({ queryKey });
        const previousData = queryClient.getQueryData<string[]>(queryKey);
        queryClient.setQueryData<string[]>(queryKey, () => data);
        return { previousData };
      },
      onError: (error, { day }, context) => {
        queryClient.setQueryData<string[]>(
          getGetTasksDayOrderQueryKey(day),
          context?.previousData
        );
      },
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: getGetTasksDayOrderQueryKey(day),
        });
      },
    },
  });

  const listStyle = useHeightByViewMode(viewMode, getListHeight);

  if (isLoading || isLoadingOrder) {
    return <Spinner />;
  }
  if (isError || isErrorOrder) {
    return <H6>{"Error during loading tasks, try again"}</H6>; //TODO: this should be toast!
  }

  const tasksWithSameDay = tasks.filter((task) => task.startDay === day);
  const tasksWithoutStartTime = tasksWithSameDay.filter(
    (t) => !t.startTime || !t.durationMin
  );
  const tasksWithStartTime = tasksWithSameDay.filter(
    (t) => !!t.startTime && !!t.durationMin
  ) as ITaskWithTime[];
  return (
    <YStack fullscreen backgroundColor={"$background"}>
      <Animated.View style={[listStyle]}>
        <DraggableList
          items={tasks as ITask[]}
          itemsOrder={tasksOrder}
          setItemsOrder={(itemsOrder) => {
            updateTasksDayOrder.mutateAsync({
              day,
              data: itemsOrder,
            });
          }}
          renderItem={(id) => (
            <TasksListItem
              task={(tasks.find((task) => task.id === id) as ITask) ?? null}
              isEdited={false}
            />
          )}
        />
      </Animated.View>
      <DailyCalendar tasks={tasksWithStartTime} day={day} viewMode={viewMode} />
    </YStack>
  );
};

function getListHeight(viewMode: DailyPlannerViewMode): DimensionInPercent {
  switch (viewMode) {
    case "both":
      return "50%";
    case "calendar":
      return "0%";
    case "list":
      return "100%";
  }
}
