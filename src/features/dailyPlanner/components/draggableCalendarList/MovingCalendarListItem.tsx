import Animated, {
  SharedValue,
  useAnimatedStyle
} from "react-native-reanimated";
import ListItem from "../../../../core/components/list/ListItem";
import { useDraggableCalendarListContext } from "../../logic/UseCalendarListContext";
import { ITask, TimeAndDurationMap } from "../../model/model";
import { MovingCalendarTask } from "../calendar/MovingCalendarTask";


export const MovingCalendarListItem = (props: {
  viewY: SharedValue<number>;
  movingItemType: SharedValue<"calendar" | "list" | null>;
  task: ITask | null;
  movingTimeAndDurationOfTasks: SharedValue<TimeAndDurationMap>;
}) => {
  const { viewY, movingItemType, task } = props;
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
      };
    } else {
      return {
        position: "absolute",
        width: "75%",
        marginLeft: 60,
        marginRight: 10,
        top: viewY.value,
        height: 'auto'
      };
    }
  });

  if (!task) {
    return null;
  }

  return (
    <Animated.View style={[outerStyle]}>
      <Animated.View style={[listStyle]}>
        <ListItem name={task.name} isEdited={false} priority={task.priority}/>
      </Animated.View>
      <Animated.View style={[calendarStyle]}>
        <MovingCalendarTask
          minuteInPixels={minuteInPixels}
          task={task}
          movingTimeAndDurationOfTasks={props.movingTimeAndDurationOfTasks}
        />
      </Animated.View>
    </Animated.View>
  );
};
