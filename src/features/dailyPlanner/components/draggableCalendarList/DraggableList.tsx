import Animated, { SharedValue } from "react-native-reanimated";
import { YStack } from "tamagui";
import { MovableItem, MovingItemPointer } from "../../../../core/components/list/DraggableList";
import { ITask } from "../../model/model";
import { useDraggableCalendarListContext } from "../../logic/UseCalendarListContext";
import TasksListItem from "../../../../core/components/list/TasksListItem";

interface DraggableListProps {
    listStyle: { height: number };
    tasks: ITask[];
    listOrder: SharedValue<string[]>;
    renderItem?: (id: string) => React.ReactNode;
    listPointerIndex: SharedValue<number | null>;
    movingItemId: string | null;
  }
  
  export const DraggableList = ({
    listStyle,
    tasks,
    // renderItem,
    listOrder,
    listPointerIndex,
    movingItemId,
  }: DraggableListProps) => {
    const {itemHeight} = useDraggableCalendarListContext();
    const renderItem = (id: string): React.ReactNode => {
      const task = (tasks.find((task) => task.id === id) as ITask) ?? null;
      if (!task) return null;
      return <TasksListItem name={task.name} isEdited={false} />;
    };
    return (
      <Animated.View style={[listStyle]}>
        <YStack w={"100%"} h={"100%"}>
          {tasks.map((task) => {
            return (
              <MovableItem
                key={task.id}
                id={task.id}
                itemHeight={itemHeight}
                listOrder={listOrder}
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
  