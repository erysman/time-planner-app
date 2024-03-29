import Animated, { SharedValue } from "react-native-reanimated";
import { ScrollView, Spinner, YStack, useTheme } from "tamagui";
import { IProject, ITask } from "../../model/model";
import { useDraggableCalendarListContext } from "../../logic/UseCalendarListContext";
import ListItem from "../../../../core/components/list/ListItem";
import { MovableItem } from "../../../../core/components/list/MovableItem";
import { MovingItemPointer } from "../../../../core/components/list/MovingItemPointer";
import { useCallback } from "react";
import { useDailyPlannerContext } from "../../logic/UseDailyPlannerContext";
import { AddTaskFab } from "../../../../core/components/list/AddTaskFab";

interface DraggableListProps {
  day: string;
  isLoading: boolean;
  tasks: ITask[];
  projects: IProject[];
  itemsOrder: SharedValue<string[]>;
  renderItem?: (id: string) => React.ReactNode;
  listPointerIndex: SharedValue<number | null>;
  movingItemId: string | null;
  scrollRef: React.RefObject<Animated.ScrollView>;
  scrollProps: Partial<{
    contentOffset: {
      x: number;
      y: number;
    };
  }>;
}

export const DraggableList = ({
  day,
  isLoading,
  projects,
  tasks,
  itemsOrder,
  listPointerIndex,
  movingItemId,
  scrollProps,
  scrollRef,
}: DraggableListProps) => {
  const { styles: {listStyle} } = useDailyPlannerContext();
  const { itemHeight } = useDraggableCalendarListContext();
  const theme = useTheme();
  const borderColor = theme.backgroundFocus.get();
  const renderItem = useCallback(
    (id: string): React.ReactNode => {
      const task = (tasks.find((task) => task.id === id) as ITask) ?? null;
      if (!task) return null;
      return (
        <ListItem
          id={task.id}
          name={task.name}
          isEdited={false}
          isImportant={task.isImportant}
          isUrgent={task.isUrgent}
          durationMin={task.durationMin}
          startDay={task.startDay}
          projectId={task.projectId}
          projectColor={projects.find((p) => p.id === task.projectId)?.color}
        />
      );
    },
    [tasks]
  );
  return (
    <Animated.View style={[{ overflow: "hidden" }, listStyle]}>
      <Animated.ScrollView
        ref={scrollRef}
        alwaysBounceHorizontal={false}
        alwaysBounceVertical={false}
        bounces={false}
        overScrollMode="never"
        scrollEventThrottle={16}
        contentContainerStyle={{
          height: (2 + itemsOrder.value.length) * itemHeight,
        }}
        borderBottomWidth={1}
        borderColor={borderColor}
        animatedProps={scrollProps}
      >
        <YStack w={"100%"} h={"100%"}>
          {isLoading ? (
            <Spinner />
          ) : (
            tasks.map((task) => {
              return (
                <MovableItem
                  key={task.id}
                  id={task.id}
                  itemHeight={itemHeight}
                  itemsOrder={itemsOrder}
                  renderItem={renderItem}
                />
              );
            })
          )}
          <MovingItemPointer
            itemHeight={itemHeight}
            visible={!!movingItemId}
            pointerIndex={listPointerIndex}
          />
        </YStack>
      </Animated.ScrollView>
      <AddTaskFab startDay={day} />
    </Animated.View>
  );
};
