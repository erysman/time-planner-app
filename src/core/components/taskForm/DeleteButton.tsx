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
import { useConfirmDeleteModal } from "../modal/UseConfirmActionModal";

export const DeleteButton = (props: {
  name: string;
  id: string;
  day?: string;
  projectId: string;
  onPress: () => void;
}) => {
  const { id, day, projectId, onPress, name } = props;
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
  const onDelete = () => {
    deleteTask.mutate({ id });
    onPress();
  };
  const { confirmDeleteModal, openConfirmDeleteModal } = useConfirmDeleteModal(
    onDelete,
    `Do you want to delete task ${name}?`
  );
  return (
    <>
      <Button
        justifyContent="flex-start"
        theme="red"
        onPress={openConfirmDeleteModal}
      >
        <ExpoIcon
          iconSet="MaterialCommunityIcons"
          name="delete-outline"
          size={24}
        />
        <SizableText>{"Delete"}</SizableText>
      </Button>
      {confirmDeleteModal}
    </>
  );
};
