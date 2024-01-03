import Animated, { SharedValue } from "react-native-reanimated";
import { YStack } from "tamagui";
import { IProject, ITask } from "../../model/model";
import { useDraggableCalendarListContext } from "../../logic/UseCalendarListContext";
import ListItem from "../../../../core/components/list/ListItem";
import { MovableItem } from "../../../../core/components/list/MovableItem";
import { MovingItemPointer } from "../../../../core/components/list/MovingItemPointer";
import { useCallback } from "react";

interface DraggableListProps {
  listStyle: { height: number };
  tasks: ITask[];
  projects: IProject[];
  itemsOrder: SharedValue<string[]>;
  renderItem?: (id: string) => React.ReactNode;
  listPointerIndex: SharedValue<number | null>;
  movingItemId: string | null;
}

export const DraggableList = ({
  listStyle,
  projects,
  tasks,
  itemsOrder,
  listPointerIndex,
  movingItemId,
}: DraggableListProps) => {
  const { itemHeight } = useDraggableCalendarListContext();
  const renderItem = useCallback((id: string): React.ReactNode => {
    const task = (tasks.find((task) => task.id === id) as ITask) ?? null;
    if (!task) return null;
    return (
      <ListItem name={task.name} isEdited={false} priority={task.priority} projectColor={projects.find(p => p.id === task.projectId)?.color} />
    );
  }, [tasks]);
  return (
    <Animated.View style={[listStyle]}>
      <YStack w={"100%"} h={"100%"} borderBottomWidth={1} borderColor={"$backgroundFocus"}>
        {tasks.map((task) => {
          return (
            <MovableItem
              key={task.id}
              id={task.id}
              itemHeight={itemHeight}
              itemsOrder={itemsOrder}
              renderItem={renderItem}
            />
          );
        })}
        <MovingItemPointer
          itemHeight={itemHeight}
          visible={!!movingItemId}
          pointerIndex={listPointerIndex}
        />
      </YStack>
    </Animated.View>
  );
};
