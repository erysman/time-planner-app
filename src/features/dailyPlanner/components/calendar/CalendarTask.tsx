import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Checkbox, SizableText, Stack, XStack } from "tamagui";
import { DEFAULT_DURATION_MIN } from "../../../../../config/constants";
import {
  ExpoIcon,
  HourglassIcon,
  StartIcon,
} from "../../../../core/components/ExpoIcon";
import { useDraggableCalendarListContext } from "../../logic/UseCalendarListContext";
import {
  mapDurationToHeight,
  mapTimeToCalendarPosition,
  mapToDayjs,
} from "../../logic/utils";
import {
  ITask,
  ITaskWithTime,
  TimeAndDuration,
  TimeAndDurationMap,
} from "../../model/model";
import {
  CalendarTaskHeightEditHandler,
  useAnimatedHeight,
} from "./CalendarTaskHeightEditHandler";
import { PriorityIcons } from "../../../../core/components/PriorityIcons";
import { Priority } from "../../../../core/model/types";
import { CalendarTaskView } from "./CalendarTaskView";

export interface CalendarTaskProps {
  task: ITask;
  isEdited: boolean;
  onPress: (taskId: string) => void;
  movingTimeAndDurationOfTasks: SharedValue<TimeAndDurationMap>;
}

export const CalendarTask = ({
  task,
  isEdited,
  onPress,
  movingTimeAndDurationOfTasks,
}: CalendarTaskProps) => {
  const { minuteInPixels, itemHeight } = useDraggableCalendarListContext();

  const topStyle = useAnimatedStyle(() => {
    const timeAndDuration = movingTimeAndDurationOfTasks.value[task.id];
    if (!timeAndDuration || timeAndDuration.startTimeMinutes === null) {
      return {
        display: "none",
      };
    }
    return {
      display: "flex",
      top: mapDurationToHeight(
        timeAndDuration.startTimeMinutes,
        minuteInPixels
      ),
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
      <CalendarTaskHeightEditHandler
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
          priority={task.priority}
          isEdited={isEdited}
          onPress={onPress}
        />
      </CalendarTaskHeightEditHandler>
    </Animated.View>
  );
};
