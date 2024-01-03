import React, { useContext, useMemo } from "react";
import { useScreenDimensions } from "../../../core/dimensions/UseScreenDimensions";

interface ICalendarListContext {
  itemHeight: number;
  minuteInPixels: number;
  calendarHeight: number;
  calendarStepHeight: number;
}

const CalendarListContext = React.createContext<ICalendarListContext>({
  itemHeight: 0,
  calendarHeight: 0,
  calendarStepHeight: 1,
  minuteInPixels: 0,
});

export const CalendarListDataProvider = (props: any) => {
  const { screenHeight } = useScreenDimensions();
  const value = useMemo(() => {
    const itemHeight = 0.082 * screenHeight;
    const minuteInPixels = itemHeight / 60;
    const calendarStepHeight = minuteInPixels * 15;
    const calendarHeight = 24 * itemHeight;
    return {
      itemHeight,
      minuteInPixels,
      calendarStepHeight,
      calendarHeight,
    };
  }, [screenHeight]);

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
