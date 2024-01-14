import React, { useContext, useMemo, useState } from "react";
import { useScreenDimensions } from "../../../core/logic/dimensions/UseScreenDimensions";
import { DEFAULT_CALENDAR_STEP_MINUTES } from "../../../../config/constants";

interface ICalendarListContext {
  itemHeight: number;
  minuteInPixels: number;
  calendarHeight: number;
  calendarStepHeight: number;
  editedTaskId: string | null;
  setEditedTaskId : React.Dispatch<React.SetStateAction<string | null>>
}

const CalendarListContext = React.createContext<ICalendarListContext>({
  itemHeight: 0,
  calendarHeight: 0,
  calendarStepHeight: 1,
  minuteInPixels: 0,
  editedTaskId: null,
  setEditedTaskId: () => {}
});

export const CalendarListDataProvider = (props: any) => {
  const [editedTaskId, setEditedTaskId] = useState<string | null>(null);
  const { screenHeight } = useScreenDimensions();
  const value = useMemo(() => {
    const itemHeight = 0.09 * screenHeight;
    const minuteInPixels = itemHeight / 60;
    const calendarStepHeight = minuteInPixels * DEFAULT_CALENDAR_STEP_MINUTES;
    const calendarHeight = 24 * itemHeight;
    return {
      itemHeight,
      minuteInPixels,
      calendarStepHeight,
      calendarHeight,
      editedTaskId, 
      setEditedTaskId
    };
  }, [screenHeight, setEditedTaskId, editedTaskId]);

  return (
    <CalendarListContext.Provider value={value}>
      {props.children}
    </CalendarListContext.Provider>
  );
};

export function useDraggableCalendarListContext(): ICalendarListContext {
  const context = useContext(CalendarListContext);
  if (!context) {
    throw new Error("User's CalendarListContext doesn't exist!");
  }
  return context;
}
