import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { YStack } from "tamagui";
import TasksListItem from "../../../../core/components/list/TasksListItem";
import { DailyPlannerViewMode } from "../../logic/UseDailyPlannerViewMode";
import { ITask } from "../../model/model";
import { DraggableCalendar } from "../calendar/DailyCalendar";
import { DraggableList } from "./DraggableList";
import { MovingCalendarListItem } from "./MovingCalendarListItem";
import { useDraggableCalendarList } from "./UseDraggableCalendarList";

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
    layout: {
      calendarStyle,
      listStyle,
      onChange,
    },
    tasksWithoutStartTime,
    tasksWithStartTime,
    movingTask,
  } = useDraggableCalendarList(day, viewMode, tasksOrder, tasks);

  // const renderItem = (id: string): React.ReactNode => {
  //   const task = (tasks.find((task) => task.id === id) as ITask) ?? null;
  //   if (!task) return null;
  //   return <TasksListItem name={task.name} isEdited={false} />;
  // };

  return (
    <YStack fullscreen backgroundColor={"$background"} onLayout={onChange}>
      <GestureDetector gesture={dragGesture}>
        <Animated.View
          collapsable={false}
          style={[
            {
              flexDirection: "column",
            },
          ]}
        >
          <DraggableList
            tasks={tasksWithoutStartTime}
            listOrder={movingItem.listOrder}
            listPointerIndex={movingItem.listPointerIndex}
            listStyle={listStyle}
            movingItemId={movingItem.id}
            // renderItem={renderItem}
          />
          <DraggableCalendar
            day={day}
            tasksWithStartTime={tasksWithStartTime}
            movingItemId={movingItem.id}
            calendarScrollRef={calendarScrollRef}
            calendarStyle={calendarStyle}
          />
        </Animated.View>
      </GestureDetector>
      <MovingCalendarListItem
        viewY={movingItem.viewY}
        movingItemType={movingItem.type}
        task={movingTask}
      />
    </YStack>
  );
};
