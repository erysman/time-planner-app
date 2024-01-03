import { useState } from "react";
import Animated, {
  SharedValue,
  useAnimatedProps,
  useScrollViewOffset,
  withTiming,
} from "react-native-reanimated";
import { YStack } from "tamagui";
import {
  ITask,
  ITaskWithTime,
  TimeAndDuration,
  TimeAndDurationMap,
} from "../../model/model";
import { CalendarCurrentTime } from "./CalendarCurrentTime";
import { CalendarSlots } from "./CalendarSlots";
import { CalendarTasks } from "./CalendarTasks";
import { useDraggableCalendarListContext } from "../../logic/UseCalendarListContext";
import { range } from "lodash";

interface DraggableCalendarProps {
  day: string;
  tasks: ITask[];
  calendarScrollRef: React.RefObject<Animated.ScrollView>;
  scrollTargetY: SharedValue<number | null>;
  scrollDuration: SharedValue<number>;
  calendarStyle: { height: number };
  movingItemId: string | null;
  movingTimeAndDurationOfTasks: SharedValue<TimeAndDurationMap>;
}

export const DraggableCalendar = ({
  day,
  tasks,
  movingItemId,
  calendarScrollRef,
  calendarStyle,
  movingTimeAndDurationOfTasks,
  scrollTargetY,
  scrollDuration,
}: DraggableCalendarProps) => {
  const { calendarHeight } = useDraggableCalendarListContext();
  const [editedTaskId, setEditedTaskId] = useState<string | null>(null);
  const onTaskPress = (taskId: string) => {
    setEditedTaskId((prevTaskId) => {
      if (prevTaskId === taskId) return null;
      return taskId;
    });
  };

  const scrollOffset = useScrollViewOffset(calendarScrollRef);

  const animatedScrollProps = useAnimatedProps(() => {
    if (scrollTargetY.value === null) {
      return { contentOffset: { x: 0, y: scrollOffset.value } };
    }
    return {
      contentOffset: {
        x: 0,
        y: withTiming(scrollTargetY.value, { duration: scrollDuration.value }),
      },
    };
  });

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
        animatedProps={animatedScrollProps}
      >
        <YStack backgroundColor="$backgroundFocus" height={calendarHeight}>
          <CalendarSlots />
          <CalendarTasks
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
