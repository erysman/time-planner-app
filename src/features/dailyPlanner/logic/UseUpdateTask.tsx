import { useQueryClient } from "@tanstack/react-query";
import { produce } from "immer";
import { useUpdateTask, getGetDayTasksQueryKey } from "../../../clients/time-planner-server/client";
import { TaskDTO } from "../../../clients/time-planner-server/model";

export const useUpdateTaskWrapper = (day: string) => {
    const queryClient = useQueryClient();

  const updateTask = useUpdateTask({
    mutation: {
      onMutate: async ({ data, id }) => {
        const queryKey = getGetDayTasksQueryKey(day);
        console.log("optimistic cache update for key:", queryKey);
        await queryClient.cancelQueries({ queryKey });
        const previousData = queryClient.getQueryData<TaskDTO[]>(queryKey);
        console.log("optimistic cache update previous data:", previousData);
        queryClient.setQueryData<TaskDTO[]>(queryKey, (prev) => {
          if (!prev) {
            return prev;
          }
          return produce(prev, (draft) => {
            const taskToUpdateIndex = draft.findIndex((task) => task.id === id);
            if (taskToUpdateIndex !== -1) {
              draft[taskToUpdateIndex] = {
                ...draft[taskToUpdateIndex],
                ...data,
              };
            }
          });
        });
        return { previousData };
      },
      onError: (error, { id, data }, context) => {
        queryClient.setQueryData<TaskDTO[]>(
          getGetDayTasksQueryKey(day),
          context?.previousData
        );
      },
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: getGetDayTasksQueryKey(day),
        });
      },
    },
  });
  return {updateTask}
}