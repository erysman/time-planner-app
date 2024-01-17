import Animated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import ListItem from "../../../../core/components/list/ListItem";
import { useDraggableCalendarListContext } from "../../logic/UseCalendarListContext";
import { IProject, ITask, TimeAndDurationMap } from "../../model/model";
import { MovingCalendarTask } from "../calendar/MovingCalendarTask";

export const MovingCalendarListItem = (props: {
  viewY: SharedValue<number>;
  movingItemType: SharedValue<"calendar" | "list" | null>;
  task: ITask | null;
  project?: IProject;
  movingTimeAndDurationOfTasks: SharedValue<TimeAndDurationMap>;
}) => {
  const { viewY, movingItemType, task, project } = props;
  const { itemHeight, minuteInPixels } = useDraggableCalendarListContext();

  const listStyle = useAnimatedStyle(() => {
    if (movingItemType.value === "list") {
      return {
        display: "flex",
      };
    } else {
      return {
        display: "none",
      };
    }
  });

  const calendarStyle = useAnimatedStyle(() => {
    if (movingItemType.value === "calendar") {
      return {
        display: "flex",
      };
    } else {
      return {
        display: "none",
      };
    }
  });

  const outerStyle = useAnimatedStyle(() => {
    if (movingItemType.value === "list") {
      return {
        position: "absolute",
        width: "100%",
        marginLeft: 0,
        marginRight: 0,
        height: itemHeight,
        top: viewY.value,
        opacity: 0.7
      };
    } else {
      return {
        position: "absolute",
        width: "75%",
        marginLeft: 60,
        marginRight: 10,
        top: viewY.value,
        height: "auto",
        opacity: 0.7,
        zIndex: 1240
      };
    }
  });

  if (!task) {
    return null;
  }

  return (
    <Animated.View style={[outerStyle]}>
      <Animated.View style={[listStyle]}>
        <ListItem
          id={task.id}
          name={task.name}
          isEdited={false}
          isImportant={task.isImportant}
          isUrgent={task.isUrgent}
          durationMin={task.durationMin}
          projectColor={project?.color}
          projectId={task.projectId}
          startDay={task.startDay}
        />
      </Animated.View>
      <Animated.View style={[calendarStyle]}>
        <MovingCalendarTask
          minuteInPixels={minuteInPixels}
          task={task}
          projectColor={project?.color}
          movingTimeAndDurationOfTasks={props.movingTimeAndDurationOfTasks}
        />
      </Animated.View>
    </Animated.View>
  );
};
