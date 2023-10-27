import React from "react";
import { Checkbox, H5, H6, SizableText, StackProps, XStack } from "tamagui";
import { ExpoIcon } from "../../ExpoIcon";
import { ITask } from "../../../../features/dailyPlanner/model/model";

export interface TasksListItemProps extends StackProps {
  task: ITask,
  first?: boolean
};

export default function TasksListItem({ task, first, ...props }: TasksListItemProps) {
  return (
    <XStack
      h={55}
      w={"100%"}
      alignItems="center"
      borderColor="$borderColor"
      borderBottomWidth={1}
      borderTopWidth={1}
      marginTop={first ? 0 : -1}
      {...props}
    >
      <Checkbox size="$2" circular marginHorizontal={16}>
        <Checkbox.Indicator>
          <ExpoIcon iconSet="MaterialIcons" name='check' size={24} color='color' />
        </Checkbox.Indicator>
      </Checkbox>
      <SizableText flexGrow={1} flexShrink={1} size={"$5"} numberOfLines={1} ellipsizeMode="tail">{task.name}</SizableText>
      <SizableText  size={"$3"} marginHorizontal={16}>Important</SizableText>
    </XStack>
  );
}
