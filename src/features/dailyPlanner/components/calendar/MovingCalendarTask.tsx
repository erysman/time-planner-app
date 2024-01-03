import React, { useMemo } from "react";
import { SharedValue } from "react-native-reanimated";
import { ITask, TimeAndDurationMap } from "../../model/model";
import { CalendarTaskHeightEditHandler } from "./CalendarTaskHeightEditHandler";
import { CalendarTaskView } from "./CalendarTaskView";
import { useDraggableCalendarListContext } from "../../logic/UseCalendarListContext";

export interface MovingCalendarTaskProps {
    minuteInPixels: number;
    task: ITask;
    movingTimeAndDurationOfTasks: SharedValue<TimeAndDurationMap>;
  }
  
  export const MovingCalendarTask = ({
    minuteInPixels,
    task,
    movingTimeAndDurationOfTasks,
  }: MovingCalendarTaskProps) => {
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
        />
      </CalendarTaskHeightEditHandler>
    );
  };