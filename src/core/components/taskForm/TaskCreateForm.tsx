import React, { useCallback, useEffect, useState } from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { ScrollView, Separator, YStack } from "tamagui";
import { SelectDay } from "./SelectDay";
import { SelectDurationMin } from "./SelectDuration";
import { SelectProject } from "./SelectProject";
import { SelectStartTime } from "./SelectStartTime";
import { TaskFormHeader } from "./TaskFormHeader";
import { useUpdateTaskDetails } from "./UseUpdateTaskDetails";
import { DeleteButton } from "./DeleteButton";
import { SelectPriority } from "./SelectPriority";
import {
  getGetDayTasksQueryKey,
  getGetProjectTasksQueryKey,
  getGetTaskQueryKey,
  getGetTasksDayOrderQueryKey,
  useCreateTask,
} from "../../../clients/time-planner-server/client";
import { useQueryClient } from "@tanstack/react-query";

interface TaskCreateFormProps {
  projectId: string;
  onClose: () => void;
  isOpen: boolean;
}

export const TaskCreateForm = ({
  projectId,
  onClose,
  isOpen,
}: TaskCreateFormProps) => {
  const queryClient = useQueryClient();
  const createTask = useCreateTask({
    mutation: {
      onSettled: (data) => {
        if (data?.startDay) {
          queryClient.invalidateQueries({
            queryKey: getGetDayTasksQueryKey(data?.startDay),
          });
          queryClient.invalidateQueries({
            queryKey: getGetTasksDayOrderQueryKey(data?.startDay),
          });
        }
        if (data?.projectId) {
          queryClient.invalidateQueries({
            queryKey: getGetProjectTasksQueryKey(data?.projectId),
          });
        }
      },
    },
  });

  const [namePressed, setNamePressed] = useState(false);
  const [name, setName] = useState<string>("");
  const [isImportant, setIsImportant] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);
  const [startDay, setStartDay] = useState<string>();
  const [startTime, setStartTime] = useState<string>();
  const [durationMin, setDurationMin] = useState<number>();
  const [editedProjectId, setEditedProjectId] = useState<string>(projectId);

  useEffect(() => setEditedProjectId(projectId), [projectId]);

  const onSave = useCallback(() => {
    createTask.mutate({
      data: {
        name,
        isImportant,
        isUrgent,
        durationMin,
        startDay,
        startTime,
        projectId: editedProjectId,
      },
    });
    onClose();
  }, [
    onClose,
    createTask,
    name,
    isImportant,
    isUrgent,
    durationMin,
    startDay,
    startTime,
    editedProjectId,
  ]);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        setNamePressed(false);
      }}
      accessible={false}
    >
      <ScrollView flex={1} h="100%" w="100%">
        <YStack h={"100%"} w={"100%"} space={8} paddingVertical={12}>
          {isOpen ? (
            <TaskFormHeader
              onSave={onSave}
              name={name}
              updateName={setName}
              onClose={onClose}
              namePressed={namePressed}
              setNamePressed={setNamePressed}
              autofocus
            />
          ) : null}

          <Separator borderBottomWidth={1} width={"100%"} />
          <YStack marginHorizontal={12} space={12}>
            <SelectPriority
              id={"createForm"}
              isImportant={isImportant}
              isUrgent={isUrgent}
              updateImportant={setIsImportant}
              updateUrgent={setIsUrgent}
            />
            <Separator
              borderBottomWidth={1}
              width={"100%"}
              alignSelf="center"
            />
            <YStack space={8}>
              <SelectDay day={startDay} updateDay={setStartDay} />
              <SelectStartTime
                updateStartTime={setStartTime}
                startTime={startTime}
              />
              <SelectDurationMin
                updateDuration={setDurationMin}
                durationMin={durationMin}
              />
            </YStack>
            <Separator
              borderBottomWidth={1}
              width={"100%"}
              alignSelf="center"
            />
            <YStack space={8}>
              <SelectProject
                id={"create-task"}
                projectId={editedProjectId}
                updateProject={setEditedProjectId}
              />
              {/* <TextArea placeholder="Description..." /> */}
            </YStack>
          </YStack>
        </YStack>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};
