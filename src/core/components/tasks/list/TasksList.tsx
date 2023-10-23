import React from "react";
import TasksListItem, { TasksListItemProps } from "./TasksListItem";
import { ScrollView, YStack } from "tamagui";
import { ITask } from "../../../../features/dailyPlanner/defaultData";

export type TasksListProps = {
  items: ITask[];
};

export default function TasksList({ items }: TasksListProps) {
  return (
    <YStack>
      <ScrollView
        h={"50%"}
        alwaysBounceHorizontal={false}
        alwaysBounceVertical={false}
        bounces={false}
        overScrollMode="never"
      >
        {items.map((item, i) => (
          <TasksListItem
            key={item.id}
            {...item}
            first={i === 0}
            last={i === items.length - 1}
          />
        ))}
      </ScrollView>
    </YStack>
  );
}
