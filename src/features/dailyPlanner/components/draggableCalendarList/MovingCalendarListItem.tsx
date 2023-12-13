import { useState, useMemo } from "react";
import Animated, { SharedValue, useAnimatedStyle, useAnimatedReaction, runOnJS } from "react-native-reanimated";
import TasksListItem from "../../../../core/components/list/TasksListItem";
import { ITask, TimeAndDurationMap } from "../../model/model";
import { MovingCalendarTask } from "../calendar/DailyCalendarTask";
import { useDraggableCalendarListContext } from "../../logic/UseCalendarListContext";

export const MovingCalendarListItem = (props: {
    viewY: SharedValue<number>;
    movingItemType: SharedValue<"calendar" | "list" | null>;
    task: ITask | null;
    movingTimeAndDurationOfTasks: SharedValue<TimeAndDurationMap>;
  }) => {
    const {
      viewY,
      movingItemType,
      task,
    } = props;
    const {itemHeight, minuteInPixels} = useDraggableCalendarListContext();
  
    const style = useAnimatedStyle(() => {
      if (movingItemType.value === "calendar") {
        return {
          position: "absolute",
          width: "75%",
          marginLeft: 60,
          marginRight: 10,
          top: viewY.value,
        };
      } else {
        return {
          position: "absolute",
          width: "100%",
          marginLeft: 0,
          marginRight: 0,
          height: itemHeight,
          top: viewY.value,
        };
      }
    });
  
    const [movingItemTypeState, setMovingItemTypeState] = useState<
      "calendar" | "list" | null
    >(null);
    useAnimatedReaction(
      () => movingItemType.value,
      (current, prev) => {
        if (prev !== current) {
          runOnJS(setMovingItemTypeState)(current);
        }
      }
    );
  
    const item = useMemo(() => {
      if (movingItemTypeState === null || !task) return null;
      if (movingItemTypeState === "calendar") {
        return (
          <MovingCalendarTask
            isEdited={true}
            minuteInPixels={minuteInPixels}
            task={task}
            movingTimeAndDurationOfTasks={props.movingTimeAndDurationOfTasks}
          />
        );
      }
      if (movingItemTypeState === "list") {
        return <TasksListItem name={task.name} isEdited={false} />;
      }
    }, [movingItemTypeState, task]);
  
    if (!task) {
      return null;
    }
  
    return <Animated.View style={[style]}>{item}</Animated.View>;
  };
  