import Animated, {
  SharedValue,
  useAnimatedProps,
  useScrollViewOffset,
  withTiming,
} from "react-native-reanimated";
import { YStack } from "tamagui";
import { useDraggableCalendarListContext } from "../../logic/UseCalendarListContext";
import {
  IProject,
  ITask,
  TimeAndDurationMap
} from "../../model/model";
import { CalendarCurrentTime } from "./CalendarCurrentTime";
import { CalendarSlots } from "./CalendarSlots";
import { CalendarTasks } from "./CalendarTasks";

interface DraggableCalendarProps {
  day: string;
  tasks: ITask[];
  projects: IProject[];
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
  projects,
  movingItemId,
  calendarScrollRef,
  calendarStyle,
  movingTimeAndDurationOfTasks,
  scrollTargetY,
  scrollDuration,
}: DraggableCalendarProps) => {
  const { calendarHeight} = useDraggableCalendarListContext();
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
            projects={projects}
            tasks={tasks}
            pressedTaskId={movingItemId}
            movingTimeAndDurationOfTasks={movingTimeAndDurationOfTasks}
          />
          <CalendarCurrentTime day={day} />
        </YStack>
      </Animated.ScrollView>
    </Animated.View>
  );
};
