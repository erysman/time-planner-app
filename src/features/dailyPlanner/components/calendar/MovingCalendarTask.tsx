import React from "react";
import { SharedValue } from "react-native-reanimated";
import { ITask, TimeAndDurationMap } from "../../model/model";
import { CalendarTaskHeightEditHandler } from "./CalendarTaskHeightEditHandler";
import { CalendarTaskView } from "./CalendarTaskView";

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
      <CalendarTaskHeightEditHandler
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
          priority={task.priority}
          // height={height}
        />
      </CalendarTaskHeightEditHandler>
    );
  };