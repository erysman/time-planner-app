import { useMemo } from "react";
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedProps,
} from "react-native-reanimated";
import { Checkbox, SizableText, Stack, XStack } from "tamagui";
import { ExpoIcon } from "../../../core/components/ExpoIcon";
import {
  mapDurationToHeight,
  mapTimeToCalendarPosition,
  mapToDayjs,
} from "../logic/utils";
import { ITask, ITaskWithTime } from "../model/model";
import {
  CalendarTaskEditHandler,
  useAnimatedHeight,
} from "./CalendarTaskEditHandler";

export interface DailyCalendarTaskProps {
  minuteInPixels: number;
  task: ITaskWithTime | null;
  isEdited: boolean;
  onPress: (taskId: string) => void;
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
  if (!task) {
    return null;
  }
  const top = mapTimeToCalendarPosition(
    mapToDayjs(task.startDay, task.startTime),
    minuteInPixels
  );
  return (
    <Stack position="absolute" top={top} width="100%" marginLeft={60}>
      <CalendarTaskEditHandler
        isEdited={isEdited}
        minuteInPixels={minuteInPixels}
        id={task.id}
        name={task.name}
        durationMin={task.durationMin}
        day={task.startDay}
      >
        <CalendarTaskView
          hourSlotHeight={minuteInPixels * 60}
          id={task.id}
          name={task.name}
          isEdited={isEdited}
          onPress={onPress}
        />
      </CalendarTaskEditHandler>
    </Stack>
  );
};

export interface MovingCalendarTaskProps {
  minuteInPixels: number;
  task: ITask;
  isEdited: boolean;
  onPress: (taskId: string) => void;
  movingTop: SharedValue<number>;
}

export const MovingCalendarTask = ({
  minuteInPixels,
  task,
  isEdited,
  onPress,
  movingTop
}: MovingCalendarTaskProps) => {

  const durationMin = task.durationMin ?? 60;

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          width: "75%",
          marginLeft: 60,
          marginRight: 10,
          top: movingTop,
        },
      ]}
    >
      <CalendarTaskEditHandler
        isEdited={isEdited}
        minuteInPixels={minuteInPixels}
        id={task.id}
        name={task.name}
        durationMin={durationMin}
        day={task.startDay}
      >
        <CalendarTaskView
          hourSlotHeight={minuteInPixels * 60}
          id={task.id}
          name={task.name}
          isEdited={isEdited}
          onPress={onPress}
        />
      </CalendarTaskEditHandler>
    </Animated.View>
  );
};

interface CalendarTaskViewProps {
  id: string;
  name: string;
  isEdited: boolean;
  onPress: (taskId: string) => void;
  hourSlotHeight: number;
}

const AnimatedXStack = Animated.createAnimatedComponent(XStack);
const AnimatedSizableText = Animated.createAnimatedComponent(SizableText);

const CalendarTaskView = ({
  hourSlotHeight,
  id,
  name,
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
      onPress={() => onPress(id)}
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
        onPress={() => onPress(id)}
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
