import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { H6, Spinner } from "tamagui";
import { DAY_FORMAT } from "../../../../config/constants";
import {
  getGetTasksDayOrderQueryKey,
  useGetDayTasks,
  useGetTasksDayOrder,
  useUpdateTasksDayOrder,
} from "../../../clients/time-planner-server/client";
import { DraggableList } from "../../../core/components/list/DraggableList";
import TasksListItem from "../../../core/components/list/TasksListItem";
import { ITask } from "../../dailyPlanner/model/model";

export const TasksListScreen = () => {
  const day = dayjs().format(DAY_FORMAT);
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

  if (isLoading || isLoadingOrder) {
    return <Spinner />;
  }
  if (isError || isErrorOrder) {
    return <H6>{"Error during loading tasks, try again"}</H6>; //TODO: this should be toast!
  }
  return (
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
  );
};
