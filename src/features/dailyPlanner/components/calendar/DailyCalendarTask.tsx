import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Checkbox, SizableText, Stack, XStack } from "tamagui";
import { DEFAULT_DURATION_MIN } from "../../../../../config/constants";
import { ExpoIcon } from "../../../../core/components/ExpoIcon";
import { useDraggableCalendarListContext } from "../../logic/UseCalendarListContext";
import { mapDurationToHeight, mapTimeToCalendarPosition, mapToDayjs } from "../../logic/utils";
import { ITask, ITaskWithTime, TimeAndDuration, TimeAndDurationMap } from "../../model/model";
import {
  DailyCalendarTaskHeightEditHandler,
  useAnimatedHeight,
} from "./CalendarTaskEditHandler";

export interface DailyCalendarTaskProps {
  task: ITask;
  isEdited: boolean;
  onPress: (taskId: string) => void;
  movingTimeAndDurationOfTasks: SharedValue<TimeAndDurationMap>;
}

export const DailyCalendarTask = ({
  task,
  isEdited,
  onPress,
  movingTimeAndDurationOfTasks,
}: DailyCalendarTaskProps) => {
  const { minuteInPixels, itemHeight } = useDraggableCalendarListContext();

  const topStyle = useAnimatedStyle(() => {
    const timeAndDuration = movingTimeAndDurationOfTasks.value[task.id];
    if(!timeAndDuration || timeAndDuration.startTimeMinutes === null) {
      return {
        display: 'none',
      }
    }
    return {
      display: 'flex',
      top: mapDurationToHeight(timeAndDuration.startTimeMinutes, minuteInPixels)
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          width: "100%",
          marginLeft: 60,
        },
        topStyle,
      ]}
    >
      <DailyCalendarTaskHeightEditHandler
        isEdited={isEdited}
        id={task.id}
        name={task.name}
        day={task.startDay}
        movingTimeAndDurationOfTasks={movingTimeAndDurationOfTasks}
      >
        <CalendarTaskView
          hourSlotHeight={itemHeight}
          id={task.id}
          name={task.name}
          isEdited={isEdited}
          onPress={onPress}
        />
      </DailyCalendarTaskHeightEditHandler>
    </Animated.View>
  );
};

export interface MovingCalendarTaskProps {
  minuteInPixels: number;
  task: ITask;
  isEdited: boolean;
  movingTimeAndDurationOfTasks: SharedValue<TimeAndDurationMap>;
}

export const MovingCalendarTask = ({
  minuteInPixels,
  task,
  movingTimeAndDurationOfTasks,
}: MovingCalendarTaskProps) => {
  // const durationMin = task.durationMin ?? DEFAULT_DURATION_MIN;
  // const height = mapDurationToHeight(durationMin, minuteInPixels)

  return (
    <DailyCalendarTaskHeightEditHandler
      isEdited={true}
      id={task.id}
      name={task.name}
      day={task.startDay}
      movingTimeAndDurationOfTasks={movingTimeAndDurationOfTasks}
    >
      <CalendarTaskView
        hourSlotHeight={minuteInPixels * 60}
        id={task.id}
        name={task.name}
        isEdited={true}
        // height={height}
      />
    </DailyCalendarTaskHeightEditHandler>
  );
};

interface CalendarTaskViewProps {
  id: string;
  name: string;
  isEdited: boolean;
  onPress?: (taskId: string) => void;
  hourSlotHeight: number;
  height?: number
}

const AnimatedXStack = Animated.createAnimatedComponent(XStack);
const AnimatedSizableText = Animated.createAnimatedComponent(SizableText);

const CalendarTaskView = ({
  hourSlotHeight,
  id,
  name,
  isEdited,
  onPress
}: CalendarTaskViewProps) => {
  const { height } = useAnimatedHeight();
  const nameProps = useAnimatedProps(() => {
    const numberOfLines = Math.max(Math.trunc((height?.value || 0) / 30), 1);
    return { numberOfLines };
  });
  const xstackProps = useAnimatedProps(() => {
    const paddingTop = interpolate(
      height?.value || 0,
      [hourSlotHeight / 2, hourSlotHeight],
      [0, 10],
      Extrapolation.CLAMP
    );
    return { paddingTop };
  });

  return (
    <AnimatedXStack
      zIndex={100}
      borderColor={isEdited ? "$blue8" : "$borderColor"}
      borderWidth={isEdited ? 2 : 0}
      backgroundColor={"$background"}
      borderRadius={"$4"}
      height={"100%"}
      onPress={() => onPress?.(id)}
      animatedProps={xstackProps}
    >
      <XStack width={60}>
        {isEdited ? null : (
          <Checkbox size="$1.5" circular marginHorizontal={16}>
            <Checkbox.Indicator>
              <ExpoIcon
                iconSet="MaterialIcons"
                name="check"
                size={24}
                color="color"
              />
            </Checkbox.Indicator>
          </Checkbox>
        )}
      </XStack>
      <AnimatedSizableText
        flexGrow={1}
        flexShrink={1}
        size={"$5"}
        ellipsizeMode="tail"
        onPress={() => onPress?.(id)}
        animatedProps={nameProps}
      >
        {name}
      </AnimatedSizableText>
      <SizableText size={"$3"} marginHorizontal={16}>
        Important
      </SizableText>
    </AnimatedXStack>
  );
};
