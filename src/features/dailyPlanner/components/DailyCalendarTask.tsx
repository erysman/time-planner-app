import { useMemo } from "react";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedProps
} from "react-native-reanimated";
import { Checkbox, SizableText, XStack } from "tamagui";
import { ExpoIcon } from "../../../core/components/ExpoIcon";
import {
  mapDurationToHeight,
  mapTimeToCalendarPosition,
  mapToDayjs,
} from "../logic/utils";
import { ITaskWithTime } from "../model/model";
import {
  CalendarTaskEditHandler,
  useAnimatedHeight,
} from "./CalendarTaskEditHandler";

export interface DailyCalendarTaskProps {
  minuteInPixels: number;
  task: ITaskWithTime;
  isEdited: boolean;
  onPress: (task: ITaskWithTime) => void;
}

/*
  
    TODO:
    * move scrollview, when pan gesture is moving towards calendar top or bottom
    * add another gesture handler for bottom border, that will affect height
    * update task.durationMin based on newHeight 
  */

export const DailyCalendarTask = ({
  minuteInPixels,
  task,
  isEdited,
  onPress,
}: DailyCalendarTaskProps) => {
  const { name, durationMin, startDate, startTime } = task;
  const top = mapTimeToCalendarPosition(
    mapToDayjs(startDate, startTime),
    minuteInPixels
  );
  const height = useMemo(
    () => mapDurationToHeight(durationMin, minuteInPixels), //TODO: small margin to see boundry between tasks
    [durationMin]
  );

  return (
    <CalendarTaskEditHandler
      isEdited={isEdited}
      top={top}
      height={height}
      minuteInPixels={minuteInPixels}
      task={task}
    >
      <CalendarTaskView
        hourSlotHeight={minuteInPixels * 60}
        task={task}
        isEdited={isEdited}
        onPress={onPress}
      />
    </CalendarTaskEditHandler>
  );
};

interface CalendarTaskViewProps {
  task: ITaskWithTime;
  isEdited: boolean;
  onPress: (task: ITaskWithTime) => void;
  hourSlotHeight: number;
}

const AnimatedXStack = Animated.createAnimatedComponent(XStack);
const AnimatedSizableText = Animated.createAnimatedComponent(SizableText);

const CalendarTaskView = ({
  hourSlotHeight,
  task,
  isEdited,
  onPress,
}: CalendarTaskViewProps) => {
  const { newHeight } = useAnimatedHeight();
  const nameProps = useAnimatedProps(() => {
    const numberOfLines = Math.max(Math.trunc((newHeight?.value || 0) / 30), 1);
    return { numberOfLines };
  });
  const xstackProps = useAnimatedProps(() => {
    const paddingTop = interpolate(
      newHeight?.value || 0,
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
      onPress={() => onPress(task)}
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
        // numberOfLines={Math.max(Math.trunc(height / 30), 1)}
        ellipsizeMode="tail"
        onPress={() => onPress(task)}
        animatedProps={nameProps}
      >
        {task.name}
      </AnimatedSizableText>
      <SizableText size={"$3"} marginHorizontal={16}>
        Important
      </SizableText>
    </AnimatedXStack>
  );
};
