import Animated, {
  SharedValue,
  useAnimatedStyle
} from "react-native-reanimated";
import { useDraggableCalendarListContext } from "../../logic/UseCalendarListContext";
import {
  mapDurationToHeight
} from "../../logic/utils";
import {
  ITask,
  TimeAndDurationMap
} from "../../model/model";
import {
  CalendarTaskHeightEditHandler
} from "./CalendarTaskHeightEditHandler";
import { CalendarTaskView } from "./CalendarTaskView";

export interface CalendarTaskProps {
  task: ITask;
  isEdited: boolean;
  onPress: (taskId: string) => void;
  movingTimeAndDurationOfTasks: SharedValue<TimeAndDurationMap>;
  projectColor?: string;
}

export const CalendarTask = ({
  task,
  isEdited,
  onPress,
  movingTimeAndDurationOfTasks,
  projectColor
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
          projectColor={projectColor}
        />
      </CalendarTaskHeightEditHandler>
    </Animated.View>
  );
};
