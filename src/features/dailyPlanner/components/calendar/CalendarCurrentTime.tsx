import dayjs, { Dayjs } from "dayjs";
import { useState, useEffect } from "react";
import { Separator } from "tamagui";
import { mapTimeToCalendarPosition } from "../../logic/utils";
import { DAY_FORMAT } from "../../../../../config/constants";
import { useDraggableCalendarListContext } from "../../logic/UseCalendarListContext";

export const CalendarCurrentTime = (props: { day: string }) => {
  const {minuteInPixels} = useDraggableCalendarListContext();
    const [time, setTime] = useState<Dayjs>(dayjs());
    useEffect(() => {
      const interval = setInterval(() => setTime(dayjs()), 5000);
      return () => {
        clearInterval(interval);
      };
    }, []);
    const top = mapTimeToCalendarPosition(time, minuteInPixels);
    const isToday = dayjs().format(DAY_FORMAT) === props.day;
    if(!isToday) return null;
    return (
      <Separator
        marginLeft={60}
        position="absolute"
        top={top}
        width="100%"
        borderColor={"red"}
        borderBottomWidth={2}
      />
    );
  };