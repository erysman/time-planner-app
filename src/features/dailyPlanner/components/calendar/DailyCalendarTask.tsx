import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedProps
} from "react-native-reanimated";
import { Checkbox, SizableText, Stack, XStack } from "tamagui";
import { DEFAULT_DURATION_MIN } from "../../../../../config/constants";
import { ExpoIcon } from "../../../../core/components/ExpoIcon";
import { useDraggableCalendarListContext } from "../../logic/UseCalendarListContext";
import {
  mapTimeToCalendarPosition,
  mapToDayjs
} from "../../logic/utils";
import { ITask, ITaskWithTime } from "../../model/model";
import {
  CalendarTaskEditHandler,
  useAnimatedHeight,
} from "./CalendarTaskEditHandler";

export interface DailyCalendarTaskProps {
  task: ITaskWithTime | null;
  isEdited: boolean;
  onPress: (taskId: string) => void;
}

export const DailyCalendarTask = ({
  task,
  isEdited,
  onPress,
}: DailyCalendarTaskProps) => {
  const {minuteInPixels, itemHeight} = useDraggableCalendarListContext();
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
        id={task.id}
        name={task.name}
        durationMin={task.durationMin}
        day={task.startDay}
      >
        <CalendarTaskView
          hourSlotHeight={itemHeight}
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
}

export const MovingCalendarTask = ({
  minuteInPixels,
  task,
}: MovingCalendarTaskProps) => {

  const durationMin = task.durationMin ?? DEFAULT_DURATION_MIN;

  return (
      <CalendarTaskEditHandler
        isEdited={true}
        id={task.id}
        name={task.name}
        durationMin={durationMin}
        day={task.startDay}
      >
        <CalendarTaskView
          hourSlotHeight={minuteInPixels * 60}
          id={task.id}
          name={task.name}
          isEdited={true}
        />
      </CalendarTaskEditHandler>
  );
};

interface CalendarTaskViewProps {
  id: string;
  name: string;
  isEdited: boolean;
  onPress?: (taskId: string) => void;
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
