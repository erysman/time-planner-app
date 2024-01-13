import { useQueryClient } from "@tanstack/react-query";
import { produce } from "immer";
import {
    getGetDayTasksQueryKey,
    getGetProjectTasksQueryKey,
    getGetTaskQueryKey,
    getGetTasksDayOrderQueryKey,
    useUpdateTask
} from "../../../clients/time-planner-server/client";
import { TaskDTO } from "../../../clients/time-planner-server/model";


export type UseUpdateTaskReturnType = ReturnType<typeof useUpdateTask>;

export const useUpdateTaskDetails = (id:string, projectId: string, day?: string, ) => {
    const queryClient = useQueryClient();
    const updateTask: UseUpdateTaskReturnType = useUpdateTask({
      mutation: {
        onMutate: async ({ data, id }) => {
          const queryKey = getGetTaskQueryKey(id);
          console.log("optimistic cache update for key:", queryKey);
          await queryClient.cancelQueries({ queryKey });
          const previousData = queryClient.getQueryData<TaskDTO>(queryKey);
          queryClient.setQueryData<TaskDTO>(queryKey, (prev) => {
            if (!prev) {
              return prev;
            }
            return produce(prev, (draft) => {
              Object.keys(data).forEach((key) => {
                draft[key] = data[key];
              });
            });
          });
          return { previousData };
        },
        onError: (error, { id }, context) => {
          queryClient.setQueryData<TaskDTO>(
            getGetTaskQueryKey(id),
            context?.previousData
          );
        },
        onSettled: (data, e, v, context) => {
          const prevData = context?.previousData;
          queryClient.invalidateQueries({
            queryKey: getGetTaskQueryKey(id),
          });
          if (day) {
            queryClient.invalidateQueries({
              queryKey: getGetDayTasksQueryKey(day),
            });
            queryClient.invalidateQueries({
              queryKey: getGetTasksDayOrderQueryKey(day),
            });
          }
          if (prevData?.startDay) {
            queryClient.invalidateQueries({
              queryKey: getGetDayTasksQueryKey(prevData?.startDay),
            });
            queryClient.invalidateQueries({
              queryKey: getGetTasksDayOrderQueryKey(prevData?.startDay),
            });
          }
          if (prevData?.projectId) {
            queryClient.invalidateQueries({
              queryKey: getGetProjectTasksQueryKey(prevData?.projectId),
            });
          }
          queryClient.invalidateQueries({
            queryKey: getGetProjectTasksQueryKey(projectId),
          });
        },
      },
    });
    return {updateTask}
  } 