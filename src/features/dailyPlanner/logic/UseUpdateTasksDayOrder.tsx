import { useQueryClient } from "@tanstack/react-query";
import { useUpdateTasksDayOrder, getGetTasksDayOrderQueryKey } from "../../../clients/time-planner-server/client";

export const useUpdateTasksDayOrderWrapper = (day: string) => {
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
  
    const updateTasksOrder = (itemsOrder: string[]) => {
      console.log(`updateTasksDayOrder: `, itemsOrder);
      updateTasksDayOrder.mutateAsync({
        day,
        data: itemsOrder,
      });
    }
    return {updateTasksOrder}
  }