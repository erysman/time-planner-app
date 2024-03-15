import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { YStack } from "tamagui";
import { useScreenDimensions } from "../../../../core/logic/dimensions/UseScreenDimensions";
import { useDraggableCalendarList } from "../../logic/UseDraggableCalendarList";
import { useGetDraggableCalendarListData } from "../../logic/UseGetDraggableCalendarListData";
import { DraggableCalendar } from "../calendar/DraggableCalendar";
import { DraggableList } from "./DraggableList";
import { MovingCalendarListItem } from "./MovingCalendarListItem";

export interface DraggableCalendarListProps {
  day: string;
}

export const DraggableCalendarList = ({ day }: DraggableCalendarListProps) => {
  const {isLoading, projects, tasks, tasksOrder} = useGetDraggableCalendarListData(day);
  const {
    dragGesture,
    movingItem,
    scroll: {
      calendarScrollProps,
      calendarScrollRef,
      listScrollProps,
      listScrollRef,
    },
    movingTask,
  } = useDraggableCalendarList(day, tasksOrder, tasks);
  const { screenHeight } = useScreenDimensions();
  return (
    <YStack height={screenHeight} backgroundColor={"$background"}>
      <GestureDetector gesture={dragGesture}>
        <Animated.View
          collapsable={false}
          style={[{ flexDirection: "column" }]}
        >
          <DraggableList
            day={day}
            isLoading={isLoading}
            tasks={tasks}
            projects={projects}
            itemsOrder={movingItem.itemsOrder}
            listPointerIndex={movingItem.listPointerIndex}
            scrollRef={listScrollRef}
            scrollProps={listScrollProps}
            movingItemId={movingItem.id}
          />
          <DraggableCalendar
            day={day}
            isLoading={isLoading}
            projects={projects}
            tasks={tasks}
            movingItemId={movingItem.id}
            scrollRef={calendarScrollRef}
            scrollProps={calendarScrollProps}
            movingTimeAndDurationOfTasks={
              movingItem.movingTimeAndDurationOfTasks
            }
          />
        </Animated.View>
      </GestureDetector>
      <MovingCalendarListItem
        viewY={movingItem.viewY}
        movingItemType={movingItem.type}
        task={movingTask}
        project={projects.find((p) => p.id === movingTask?.projectId)}
        movingTimeAndDurationOfTasks={movingItem.movingTimeAndDurationOfTasks}
      />
    </YStack>
  );
};
