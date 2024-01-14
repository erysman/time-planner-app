import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import React, { useCallback, useEffect, useState } from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import {
  ScrollView,
  Separator,
  SizableText,
  YStack
} from "tamagui";
import { z } from "zod";
import {
  DEFAULT_CALENDAR_STEP_MINUTES,
  MIN_TASK_DURATION_MINUTES,
} from "../../../../config/constants";
import {
  getGetDayTasksQueryKey,
  getGetProjectTasksQueryKey,
  getGetTasksDayOrderQueryKey,
  useCreateTask,
} from "../../../clients/time-planner-server/client";
import { NoRetryFallback } from "../fallbacks/GenericFallback";
import { SelectDay } from "./SelectDay";
import { SelectDurationMin } from "./SelectDuration";
import { SelectPriority } from "./SelectPriority";
import { SelectProject } from "./SelectProject";
import { SelectStartTime } from "./SelectStartTime";
import { TaskFormHeader } from "./TaskFormHeader";
import { useValidateName, useValidateStartDay, useValidateStartTime, useValidateDuration } from "./UseValidateTask";

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

  const resetState = () => {
    setNamePressed(false);
    setName("");
    setIsImportant(false);
    setIsUrgent(false);
    setStartDay(undefined);
    setStartTime(undefined);
    setDurationMin(undefined);
    setEditedProjectId(projectId);
  };

  const { isNameValid, nameMessage, validateName } = useValidateName();
  const { isStartDayValid, startDayMessage, validateStartDay } =
    useValidateStartDay();
  const { isStartTimeValid, startTimeMessage, validateStartTime } =
    useValidateStartTime();
  const { durationMessage, isDurationValid, validateDuration } =
    useValidateDuration();

  useEffect(() => setEditedProjectId(projectId), [projectId]);

  const onSave = useCallback(() => {
    const isNameValid = validateName(name);
    if (!isNameValid) return;
    if (durationMin) {
      const isDurationValid = validateDuration(durationMin);
      if (!isDurationValid) return;
    }
    if (startDay) {
      const isStartDayValid = validateStartDay(startDay);
      if (!isStartDayValid) return;
    }
    if (startTime) {
      const isStartTimeValid = validateStartTime(startTime);
      if (!isStartTimeValid) return;
    }
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
    if (!createTask.isError) {
      resetState();
    }
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
    resetState,
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
              isNameValid={isNameValid}
              validateName={validateName}
            />
          ) : null}

          <Separator borderBottomWidth={1} width={"100%"} />
          <YStack marginHorizontal={12} space={12}>
            {nameMessage ? (
              <SizableText color={"$red9"}>{nameMessage}</SizableText>
            ) : null}
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
              <SelectDay
                day={startDay}
                updateDay={setStartDay}
                isStartDayValid={isStartDayValid}
                validateStartDay={validateStartDay}
                errorMessage={startDayMessage}
              />
              <SelectStartTime
                updateStartTime={setStartTime}
                startTime={startTime}
                isStartTimeValid={isStartTimeValid}
                validateStartTime={validateStartTime}
                errorMessage={startTimeMessage}
              />
              <SelectDurationMin
                durationMin={durationMin}
                updateDuration={setDurationMin}
                isDurationValid={isDurationValid}
                validateDuration={validateDuration}
                errorMessage={durationMessage}
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
          {createTask.isError ? (
            <NoRetryFallback error={createTask.error} />
          ) : null}
        </YStack>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};
