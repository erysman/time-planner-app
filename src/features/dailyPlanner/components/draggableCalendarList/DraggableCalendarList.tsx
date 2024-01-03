import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { YStack } from "tamagui";
import { useDraggableCalendarList } from "../../logic/UseDraggableCalendarList";
import { ITask } from "../../model/model";
import { DraggableCalendar } from "../calendar/DraggableCalendar";
import { DraggableList } from "./DraggableList";
import { MovingCalendarListItem } from "./MovingCalendarListItem";

export interface DraggableCalendarListProps {
  day: string;
  tasks: ITask[];
  tasksOrder: string[];
}

export const DraggableCalendarList = ({
  day,
  tasks,
  tasksOrder,
}: DraggableCalendarListProps) => {
  const {
    dragGesture,
    movingItem,
    calendarScrollRef,
    calendarScrollDuration,
    calendarScrollTargetY,
    styles: { calendarStyle, listStyle },
    movingTask,
  } = useDraggableCalendarList(day, tasksOrder, tasks);

  return (
    <YStack fullscreen backgroundColor={"$background"}>
      <GestureDetector gesture={dragGesture}>
        <Animated.View
          collapsable={false}
          style={[{ flexDirection: "column" }]}
        >
          <DraggableList
            tasks={tasks}
            itemsOrder={movingItem.itemsOrder}
            listPointerIndex={movingItem.listPointerIndex}
            listStyle={listStyle}
            movingItemId={movingItem.id}
          />
          <DraggableCalendar
            day={day}
            tasks={tasks}
            movingItemId={movingItem.id}
            calendarScrollRef={calendarScrollRef}
            scrollDuration={calendarScrollDuration}
            scrollTargetY={calendarScrollTargetY}
            calendarStyle={calendarStyle}
            movingTimeAndDurationOfTasks={movingItem.movingTimeAndDurationOfTasks}
          />
        </Animated.View>
      </GestureDetector>
      <MovingCalendarListItem
        viewY={movingItem.viewY}
        movingItemType={movingItem.type}
        task={movingTask}
        movingTimeAndDurationOfTasks={movingItem.movingTimeAndDurationOfTasks}
      />
    </YStack>
  );
};
