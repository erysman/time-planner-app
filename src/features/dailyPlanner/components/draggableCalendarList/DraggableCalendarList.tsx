import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { YStack } from "tamagui";
import TasksListItem from "../../../../core/components/list/TasksListItem";
import { DailyPlannerViewMode } from "../../logic/UseDailyPlannerViewMode";
import { ITask } from "../../model/model";
import { DraggableCalendar } from "../calendar/DailyCalendar";
import { DraggableList } from "./DraggableList";
import { MovingCalendarListItem } from "./MovingCalendarListItem";
import { useDraggableCalendarList } from "../../logic/UseDraggableCalendarList";

export interface DraggableCalendarListProps {
  day: string;
  viewMode: DailyPlannerViewMode;
  tasks: ITask[];
  tasksOrder: string[];
}

export const DraggableCalendarList = ({
  day,
  viewMode,
  tasks,
  tasksOrder,
}: DraggableCalendarListProps) => {
  const {
    dragGesture,
    movingItem,
    calendarScrollRef,
    layout: { calendarStyle, listStyle, onChange },
    movingTask,
  } = useDraggableCalendarList(day, viewMode, tasksOrder, tasks);

  return (
    <YStack fullscreen backgroundColor={"$background"} onLayout={onChange}>
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
