import { useQueryClient } from "@tanstack/react-query";
import { H6, Spinner, YStack } from "tamagui";
import {
  getGetTasksDayOrderQueryKey,
  useGetDayTasks,
  useGetTasksDayOrder,
  useUpdateTasksDayOrder,
} from "../../../clients/time-planner-server/client";
import {
  DraggableList,
  MovableItem,
  MovingItem,
  MovingItemPointer,
  useDraggableList,
} from "../../../core/components/list/DraggableList";
import TasksListItem from "../../../core/components/list/TasksListItem";
import { DailyCalendar } from "../components/DailyCalendar";
import {
  DailyPlannerViewMode,
  useHeightByViewMode,
} from "../logic/UseDailyPlannerViewMode";
import { ITask, ITaskWithTime } from "../model/model";
import Animated from "react-native-reanimated";
import { DimensionInPercent } from "../../../core/model/types";
import { GestureDetector } from "react-native-gesture-handler";
import { getRefreshInterval } from "../../../core/config/utils";

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

  const itemHeight = 55;
  const { panGesture, movingItemsOrder, movingItemId, dragY, pointerIndex } =
    useDraggableList(itemHeight, tasksOrder ?? [], (itemsOrder) => {
      updateTasksDayOrder.mutateAsync({
        day,
        data: itemsOrder,
      });
    });

  if (isLoading || isLoadingOrder) {
    return <Spinner />;
  }
  if (isError || isErrorOrder) {
    return <H6>{"Error during loading tasks, try again"}</H6>; //TODO: this should be toast!
  }

  const tasksWithoutStartTime = tasks.filter(
    (t) => !t.startTime || !t.durationMin
  ) as ITask[];
  const tasksWithStartTime = tasks.filter(
    (t) => !!t.startTime && !!t.durationMin
  ) as ITaskWithTime[];

  const renderItem = (id: string) => (
    <TasksListItem
      task={(tasks.find((task) => task.id === id) as ITask) ?? null}
      isEdited={false}
    />
  );

  return (
    <YStack fullscreen backgroundColor={"$background"}>
      <GestureDetector gesture={panGesture}>
        <Animated.View
          collapsable={false}
          style={[
            {
              flexDirection: "column",
            },
          ]}
        >
          <Animated.View style={[listStyle]}>
            <YStack>
              {tasksWithoutStartTime.map((task) => {
                return (
                  <MovableItem
                    key={task.id}
                    id={task.id}
                    itemHeight={itemHeight}
                    itemsOrder={movingItemsOrder}
                    renderItem={renderItem}
                  />
                );
              })}
              <MovingItemPointer
                itemHeight={itemHeight}
                visible={!!movingItemId}
                pointerIndex={pointerIndex}
              />
            </YStack>
          </Animated.View>
          <DailyCalendar
            tasks={tasksWithStartTime}
            day={day}
            viewMode={viewMode}
          />
        </Animated.View>
      </GestureDetector>
      <MovingItem
        dragY={dragY}
        id={movingItemId}
        renderItem={renderItem}
        itemHeight={itemHeight}
      />
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
