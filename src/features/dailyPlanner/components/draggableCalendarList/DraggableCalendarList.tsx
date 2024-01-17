import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { YStack } from "tamagui";
import { useDraggableCalendarList } from "../../logic/UseDraggableCalendarList";
import { IProject, ITask } from "../../model/model";
import { DraggableCalendar } from "../calendar/DraggableCalendar";
import { DraggableList } from "./DraggableList";
import { MovingCalendarListItem } from "./MovingCalendarListItem";
import { useScreenDimensions } from "../../../../core/logic/dimensions/UseScreenDimensions";
import { deviceName } from "expo-device";

export interface DraggableCalendarListProps {
  day: string;
  tasks: ITask[];
  projects: IProject[];
  tasksOrder: string[];
}

export const DraggableCalendarList = ({
  day,
  tasks,
  projects,
  tasksOrder,
}: DraggableCalendarListProps) => {
  const {
    dragGesture,
    movingItem,
    scroll: {
      calendarScrollProps,
      calendarScrollRef,
      listScrollProps,
      listScrollRef,
    },
    styles: { calendarStyle, listStyle },
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
            tasks={tasks}
            projects={projects}
            itemsOrder={movingItem.itemsOrder}
            listPointerIndex={movingItem.listPointerIndex}
            listStyle={listStyle}
            scrollRef={listScrollRef}
            scrollProps={listScrollProps}
            movingItemId={movingItem.id}
          />
          <DraggableCalendar
            day={day}
            projects={projects}
            tasks={tasks}
            movingItemId={movingItem.id}
            scrollRef={calendarScrollRef}
            scrollProps={calendarScrollProps}
            calendarStyle={calendarStyle}
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
