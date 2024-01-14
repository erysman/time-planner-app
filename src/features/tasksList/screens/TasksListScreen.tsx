import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { H6, Spinner } from "tamagui";
import { DAY_FORMAT } from "../../../../config/constants";
import {
  getGetTasksDayOrderQueryKey,
  useGetDayTasks,
  useGetProjects,
  useGetTasksDayOrder,
  useUpdateTasksDayOrder,
} from "../../../clients/time-planner-server/client";
import { DragAndDropList } from "../../../core/components/list/DragAndDropList";
import ListItem from "../../../core/components/list/ListItem";
import { IProject, ITask } from "../../dailyPlanner/model/model";
import { getRefreshInterval } from "../../../core/logic/config/utils";

export const TasksListScreen = () => {
  const day = dayjs().format(DAY_FORMAT);
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

  const {
    data: projects,
    isError: isErrorProjects,
    isLoading: isLoadingProjects,
  } = useGetProjects({ query: { refetchInterval: getRefreshInterval() } });

  if (isLoading || isLoadingOrder || isLoadingProjects) {
    return <Spinner />;
  }
  if (isError || isErrorOrder || isErrorProjects) {
    return <H6>{"Error during loading tasks, try again"}</H6>; //TODO: this should be toast!
  }

  const renderItem = (id: string) => {
    const task = (tasks.find((task) => task.id === id) as ITask) ?? null;
    if (!task) return null;
    return (
      <ListItem
        name={task.name}
        isEdited={false}
        priority={task.priority}
        durationMin={task.durationMin}
        projectColor={
          (projects as IProject[]).find((p) => p.id === task.projectId)?.color
        }
      />
    );
  };

  return (
    <DragAndDropList
      items={tasks as ITask[]}
      itemsOrder={tasksOrder}
      setItemsOrder={(itemsOrder) => {
        updateTasksDayOrder.mutateAsync({
          day,
          data: itemsOrder,
        });
      }}
      renderItem={renderItem}
    />
  );
};
