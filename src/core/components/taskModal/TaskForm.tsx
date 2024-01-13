import { useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useEffect, useState } from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import {
  Button,
  ScrollView,
  Separator,
  SizableText,
  TextArea,
  YStack,
} from "tamagui";
import {
  getGetDayTasksQueryKey,
  getGetProjectTasksQueryKey,
  getGetTaskQueryKey,
  getGetTasksDayOrderQueryKey,
  useDeleteTask,
  useUpdateTask,
} from "../../../clients/time-planner-server/client";
import { ExpoIcon, HourglassIcon, StartIcon } from "../ExpoIcon";
import { SelectDay } from "./SelectDay";
import { SelectDurationMin } from "./SelectDuration";
import { SelectProject } from "./SelectProject";
import { SelectStartTime } from "./SelectStartTime";
import { SwitchWithLabel } from "./SwitchWithLabel";
import { TaskFormHeader } from "./TaskFormHeader";
import { TaskDTO } from "../../../clients/time-planner-server/model";
import { produce } from "immer";

export type UseUpdateTaskReturnType = ReturnType<typeof useUpdateTask>;

interface TaskFormProps {
  id: string;
  name: string;
  day?: string;
  startTime?: string;
  durationMin?: number;
  projectId: string;
  isUrgent: boolean;
  isImportant: boolean;
  onClose: () => void;
}

export const TaskForm = ({
  name,
  id,
  day,
  startTime,
  durationMin,
  projectId,
  isUrgent,
  isImportant,
  onClose,
}: TaskFormProps) => {
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
  const [namePressed, setNamePressed] = useState(false);

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
          <TaskFormHeader
            name={name}
            taskId={id}
            updateTask={updateTask}
            onClose={onClose}
            namePressed={namePressed}
            setNamePressed={setNamePressed}
          />
          <Separator borderBottomWidth={1} width={"100%"} />
          <YStack marginHorizontal={12} space={12}>
            <SelectPriority
              id={id}
              isImportant={isImportant}
              isUrgent={isUrgent}
              updateTask={updateTask}
            />
            <Separator
              borderBottomWidth={1}
              width={"100%"}
              alignSelf="center"
            />
            <YStack space={8}>
              <SelectDay day={day} updateTask={updateTask} taskId={id} />
              <SelectStartTime
                updateTask={updateTask}
                taskId={id}
                startTime={startTime}
              />
              <SelectDurationMin
                updateTask={updateTask}
                taskId={id}
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
                projectId={projectId}
                taskId={id}
                updateTask={updateTask}
              />
              {/* <TextArea placeholder="Description..." /> */}
            </YStack>
          </YStack>
          <YStack marginHorizontal={12} marginTop={36}>
            <DeleteButton
              day={day}
              id={id}
              projectId={projectId}
              onPress={onClose}
            />
          </YStack>
        </YStack>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

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

interface SelectPriorityProps {
  updateTask: UseUpdateTaskReturnType;
  id: string;
  isImportant: boolean;
  isUrgent: boolean;
}

export const SelectPriority = ({
  id,
  isImportant,
  isUrgent,
  updateTask,
}: SelectPriorityProps) => {
  const updateUrgent = useCallback(
    (isUrgent: boolean) => {
      updateTask.mutate({
        id,
        data: { isUrgent },
      });
    },
    [id, updateTask]
  );

  const updateImportant = useCallback(
    (isImportant: boolean) => {
      updateTask.mutate({
        id,
        data: { isImportant },
      });
    },
    [id, updateTask]
  );
  return (
    <YStack>
      <SwitchWithLabel
        size={"$4"}
        name={"Important"}
        icon={<StartIcon size={16} color={"color"} />}
        value={isImportant}
        setValue={(v) => updateImportant(v)}
      />
      <SwitchWithLabel
        size={"$4"}
        name={"Urgent"}
        icon={<HourglassIcon size={16} color={"color"} />}
        value={isUrgent}
        setValue={(v) => updateUrgent(v)}
      />
    </YStack>
  );
};
