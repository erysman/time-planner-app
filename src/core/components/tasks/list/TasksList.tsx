import React from "react";
import TasksListItem, { TasksListItemProps } from "./TasksListItem";
import { YStack } from "tamagui";

export type TasksListProps = {
  items: TasksListItemProps[];
};

export default function TasksList({ items }: TasksListProps) {
  return (
    <YStack>
      {items.map((item) => (
        <TasksListItem {...item}/>
      ))}
    </YStack>
  );
}
