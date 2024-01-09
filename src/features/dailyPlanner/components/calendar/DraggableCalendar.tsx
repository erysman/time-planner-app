import Animated, {
  SharedValue,
  useAnimatedProps,
  useScrollViewOffset,
  withTiming,
} from "react-native-reanimated";
import { YStack } from "tamagui";
import { useDraggableCalendarListContext } from "../../logic/UseCalendarListContext";
import { IProject, ITask, TimeAndDurationMap } from "../../model/model";
import { CalendarCurrentTime } from "./CalendarCurrentTime";
import { CalendarSlots } from "./CalendarSlots";
import { CalendarTasks } from "./CalendarTasks";

interface DraggableCalendarProps {
  day: string;
  tasks: ITask[];
  projects: IProject[];
  scrollRef: React.RefObject<Animated.ScrollView>;
  scrollProps: Partial<{
    contentOffset: {
      x: number;
      y: number;
    };
  }>;
  calendarStyle: { height: number };
  movingItemId: string | null;
  movingTimeAndDurationOfTasks: SharedValue<TimeAndDurationMap>;
}

export const DraggableCalendar = ({
  day,
  tasks,
  projects,
  movingItemId,
  scrollRef,
  calendarStyle,
  movingTimeAndDurationOfTasks,
  scrollProps
}: DraggableCalendarProps) => {
  const { calendarHeight } = useDraggableCalendarListContext();
  return (
    <Animated.View style={[calendarStyle]}>
      <Animated.ScrollView
        ref={scrollRef}
        alwaysBounceHorizontal={false}
        alwaysBounceVertical={false}
        bounces={false}
        overScrollMode="never"
        scrollEventThrottle={16}
        contentContainerStyle={{
          height: calendarHeight,
        }}
        animatedProps={scrollProps}
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
