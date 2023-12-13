import { useState } from "react";
import Animated, { SharedValue } from "react-native-reanimated";
import { YStack } from "tamagui";
import { ITask, ITaskWithTime, TimeAndDuration, TimeAndDurationMap } from "../../model/model";
import { CalendarCurrentTime } from "./CalendarCurrentTime";
import { DailyCalendarSlots } from "./DailyCalendarSlots";
import { DailyCalendarTasks } from "./DailyCalendarTasks";
import { useDraggableCalendarListContext } from "../../logic/UseCalendarListContext";

interface DraggableCalendarProps {
  day: string;
  tasks: ITask[];
  calendarScrollRef: React.RefObject<Animated.ScrollView>;
  calendarStyle: { height: number };
  movingItemId: string | null;
  movingTimeAndDurationOfTasks: SharedValue<TimeAndDurationMap>
}

export const DraggableCalendar = ({
  day,
  tasks,
  movingItemId,
  calendarScrollRef,
  calendarStyle,
  movingTimeAndDurationOfTasks
}: DraggableCalendarProps) => {
  const { calendarHeight } = useDraggableCalendarListContext();
  const [editedTaskId, setEditedTaskId] = useState<string | null>(null);
  const onTaskPress = (taskId: string) => {
    setEditedTaskId((prevTaskId) => {
      if (prevTaskId === taskId) return null;
      return taskId;
    });
  };

  return (
    <Animated.View style={[calendarStyle]}>
      <Animated.ScrollView
        ref={calendarScrollRef}
        alwaysBounceHorizontal={false}
        alwaysBounceVertical={false}
        bounces={false}
        overScrollMode="never"
        scrollEventThrottle={16}
        contentContainerStyle={{
          height: calendarHeight,
        }}
      >
        <YStack backgroundColor="$backgroundFocus" height={calendarHeight}>
          <DailyCalendarSlots />
          <DailyCalendarTasks
            editedTaskId={editedTaskId}
            tasks={tasks}
            pressedTaskId={movingItemId}
            onTaskPress={onTaskPress}
            movingTimeAndDurationOfTasks={movingTimeAndDurationOfTasks}
          />
          <CalendarCurrentTime day={day} />
        </YStack>
      </Animated.ScrollView>
    </Animated.View>
  );
};
