import React from "react";
import { Checkbox, SizableText, StackProps, XStack } from "tamagui";
import { ITask } from "../../../features/dailyPlanner/model/model";
import { ExpoIcon } from "../ExpoIcon";
import { PriorityIcons } from "../PriorityIcons";
import { Priority } from "../../model/types";

export interface ListItemProps extends StackProps {
  name: string;
  priority: Priority
  first?: boolean;
  isEdited: boolean;
  onPress?: () => void;
}

export default function ListItem({
  name,
  priority,
  first,
  isEdited,
  onPress,
  ...props
}: ListItemProps) {

  return (

    <XStack
      h={"100%"}
      w={"100%"}
      alignItems="center"
      borderColor={isEdited ? "$blue8" : "$borderColor"}
      borderBottomWidth={isEdited ? 2 : 1}
      borderTopWidth={isEdited ? 2 : 1}
      onPress={onPress}
      {...props}
    >
      <Checkbox size="$2" circular marginHorizontal={16}>
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
      <PriorityIcons priority={priority}/>
    </XStack>
  );
}
