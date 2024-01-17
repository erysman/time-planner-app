import React from "react";
import { Checkbox, SizableText, StackProps, XStack } from "tamagui";
import { minutesToShortTime } from "../../utils";
import { ExpoIcon } from "../ExpoIcon";
import { PriorityIcons } from "../PriorityIcons";
import { useEditTaskModal } from "../modal/UseEditTaskModal";
import {
  getGetDayTasksQueryKey,
  getGetProjectTasksQueryKey,
  getGetTaskQueryKey,
  getGetTasksDayOrderQueryKey,
  useDeleteTask,
} from "../../../clients/time-planner-server/client";
import { useQueryClient } from "@tanstack/react-query";

export interface ListItemProps extends StackProps {
  id: string;
  name: string;
  first?: boolean;
  isEdited: boolean;
  onPress?: () => void;
  projectColor?: string;
  durationMin?: number;
  isUrgent: boolean;
  isImportant: boolean;
  projectId: string;
  startDay?: string;
}

export default function ListItem({
  id,
  name,
  durationMin,
  isUrgent,
  isImportant,
  first,
  isEdited,
  onPress,
  projectColor,
  startDay,
  projectId,
  ...props
}: ListItemProps) {
  const { taskModal, openTaskModal } = useEditTaskModal();
  const queryClient = useQueryClient();
  const deleteTask = useDeleteTask({
    mutation: {
      onSettled: () => {
        if (startDay) {
          queryClient.invalidateQueries({
            queryKey: getGetDayTasksQueryKey(startDay),
          });
          queryClient.invalidateQueries({
            queryKey: getGetTasksDayOrderQueryKey(startDay),
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
    <>
      <XStack
        h={"100%"}
        w={"100%"}
        borderColor={isEdited ? "$blue8" : "$borderColor"}
        borderBottomWidth={isEdited ? 2 : 1}
        borderTopWidth={isEdited ? 2 : 1}
        onPress={onPress}
        {...props}
      >
        <XStack
          h={"100%"}
          w={"100%"}
          alignItems="center"
          backgroundColor={"$background"}
          borderColor={projectColor ?? "$background"}
          borderLeftWidth={8}
          onPress={() => {
            openTaskModal(id);
            onPress?.();
          }}
          pressStyle={{
            backgroundColor: "$backgroundHover",
          }}
        >
          <Checkbox size="$2" circular marginLeft={8} marginRight={16} onCheckedChange={(checked) => {
            if(checked) {
              deleteTask.mutateAsync({id});
            }
          }}>
            <Checkbox.Indicator>
              <ExpoIcon
                iconSet="MaterialIcons"
                name="check"
                size={24}
                color="color"
              />
            </Checkbox.Indicator>
          </Checkbox>
          <SizableText
            flexGrow={1}
            flexShrink={1}
            size={"$5"}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {name}
          </SizableText>
          <PriorityIcons isImportant={isImportant} isUrgent={isUrgent} />
          {durationMin ? (
            <SizableText size={"$3"} marginLeft={8} marginRight={16}>
              {minutesToShortTime(durationMin)}
            </SizableText>
          ) : null}
        </XStack>
      </XStack>
      {taskModal}
    </>
  );
}
