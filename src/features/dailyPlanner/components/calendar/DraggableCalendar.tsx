import Animated, {
  SharedValue,
  useAnimatedProps,
  useScrollViewOffset,
  withTiming,
} from "react-native-reanimated";
import { Spinner, YStack } from "tamagui";
import { useDraggableCalendarListContext } from "../../logic/UseCalendarListContext";
import { IProject, ITask, TimeAndDurationMap } from "../../model/model";
import { CalendarCurrentTime } from "./CalendarCurrentTime";
import { CalendarSlots } from "./CalendarSlots";
import { CalendarTasks } from "./CalendarTasks";
import { useDailyPlannerContext } from "../../logic/UseDailyPlannerContext";

interface DraggableCalendarProps {
  day: string;
  isLoading: boolean;
  tasks: ITask[];
  projects: IProject[];
  scrollRef: React.RefObject<Animated.ScrollView>;
  scrollProps: Partial<{
    contentOffset: {
      x: number;
      y: number;
    };
  }>;
  movingItemId: string | null;
  movingTimeAndDurationOfTasks: SharedValue<TimeAndDurationMap>;
}

export const DraggableCalendar = ({
  day,
  isLoading,
  tasks,
  projects,
  movingItemId,
  scrollRef,
  movingTimeAndDurationOfTasks,
  scrollProps,
}: DraggableCalendarProps) => {
  const { calendarHeight } = useDraggableCalendarListContext();
  const { styles: {calendarStyle} } = useDailyPlannerContext();
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
          {isLoading ? (
            <Spinner />
          ) : (
            <CalendarTasks
              projects={projects}
              tasks={tasks}
              pressedTaskId={movingItemId}
              movingTimeAndDurationOfTasks={movingTimeAndDurationOfTasks}
            />
          )}
          <CalendarCurrentTime day={day} />
        </YStack>
      </Animated.ScrollView>
    </Animated.View>
  );
};
