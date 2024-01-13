import React, { useCallback, useState } from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import {
  ScrollView,
  Separator,
  YStack
} from "tamagui";
import { SelectDay } from "./SelectDay";
import { SelectDurationMin } from "./SelectDuration";
import { SelectProject } from "./SelectProject";
import { SelectStartTime } from "./SelectStartTime";
import { TaskFormHeader } from "./TaskFormHeader";
import { useUpdateTaskDetails } from "./UseUpdateTaskDetails";
import { DeleteButton } from "./DeleteButton";
import { SelectPriority } from "./SelectPriority";

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

export const EditTaskForm = ({
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
  
  const {updateTask} = useUpdateTaskDetails(id, projectId, day);

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
  const updateDay = useCallback(
    (day: string) => updateTask.mutate({ id, data: { startDay: day } }),
    [updateTask, id]
  );

  const updateStartTime = useCallback(
    (startTime: string) => updateTask.mutate({ id, data: { startTime } }),
    [updateTask, id]
  );

  const updateDuration = useCallback(
    (durationMin: number) => updateTask.mutate({ id, data: { durationMin } }),
    [updateTask, id]
  );

  const updateProject = useCallback(
    (projectId: string) => {
      updateTask.mutate({ id, data: { projectId } });
    },
    [id, projectId, updateTask]
  );
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
              isImportant={isImportant}
              isUrgent={isUrgent}
              updateImportant={updateImportant}
              updateUrgent={updateUrgent}
            />
            <Separator
              borderBottomWidth={1}
              width={"100%"}
              alignSelf="center"
            />
            <YStack space={8}>
              <SelectDay day={day} updateDay={updateDay} />
              <SelectStartTime
                updateStartTime={updateStartTime}
                startTime={startTime}
              />
              <SelectDurationMin
                updateDuration={updateDuration}
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
                updateProject={updateProject}
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


