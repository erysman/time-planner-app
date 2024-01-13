import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Button, SizableText } from "tamagui";
import {
  getGetDayTasksQueryKey,
  getGetProjectTasksQueryKey,
  getGetTaskQueryKey,
  getGetTasksDayOrderQueryKey,
  useDeleteTask,
} from "../../../clients/time-planner-server/client";
import { ExpoIcon } from "../ExpoIcon";

export const DeleteButton = (props: {
  id: string;
  day?: string;
  projectId: string;
  onPress: () => void;
}) => {
  const { id, day, projectId, onPress } = props;
  const queryClient = useQueryClient();
  const deleteTask = useDeleteTask({
    mutation: {
      onSettled: () => {
        if (day) {
          queryClient.invalidateQueries({
            queryKey: getGetDayTasksQueryKey(day),
          });
          queryClient.invalidateQueries({
            queryKey: getGetTasksDayOrderQueryKey(day),
          });
        }
        queryClient.invalidateQueries({
          queryKey: getGetProjectTasksQueryKey(projectId),
        });
        queryClient.invalidateQueries({
          queryKey: getGetTaskQueryKey(id),
        });
      },
    },
  });
  return (
    <Button
      justifyContent="flex-start"
      theme="red"
      onPress={() => {
        deleteTask.mutate({ id });
        onPress();
      }}
    >
      <ExpoIcon
        iconSet="MaterialCommunityIcons"
        name="delete-outline"
        size={24}
      />
      <SizableText>{"Delete"}</SizableText>
    </Button>
  );
};
