import React from "react";
import { Checkbox, H5, H6, SizableText, XStack } from "tamagui";
import { ExpoIcon } from "../../ExpoIcon";

export type TasksListItemProps = {
  name: string;
};

export default function TasksListItem({ name }: TasksListItemProps) {
  return (
    <XStack
      h={55}
      w={"100%"}
      alignItems="center"
      borderBottomWidth={1}
      borderTopWidth={1}
    >
      <Checkbox size="$2" circular marginHorizontal={16}>
        <Checkbox.Indicator>
          <ExpoIcon iconSet="MaterialIcons" name='check' size={24} color='color' />
        </Checkbox.Indicator>
      </Checkbox>
      <SizableText flexGrow={1} flexShrink={1} size={"$5"} numberOfLines={1} ellipsizeMode="tail">{name}</SizableText>
      <SizableText  size={"$3"} marginHorizontal={16}>Important</SizableText>
    </XStack>
  );
}
