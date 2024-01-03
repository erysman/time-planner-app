import React from "react";
import { Checkbox, SizableText, StackProps, XStack } from "tamagui";
import { Priority } from "../../model/types";
import { ExpoIcon } from "../ExpoIcon";
import { PriorityIcons } from "../PriorityIcons";

export interface ListItemProps extends StackProps {
  name: string;
  priority: Priority;
  first?: boolean;
  isEdited: boolean;
  onPress?: () => void;
  projectColor? : string;
}

export default function ListItem({
  name,
  priority,
  first,
  isEdited,
  onPress,
  projectColor,
  ...props
}: ListItemProps) {
  return (
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
        borderColor={projectColor ?? "$background"}
        borderLeftWidth={8}
      >
        <Checkbox size="$2" circular marginLeft={8} marginRight={16}>
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
        <PriorityIcons priority={priority} />
      </XStack>
    </XStack>
  );
}
