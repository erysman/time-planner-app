import { ScrollView, Separator, Stack, YStack } from "tamagui";
import { ITaskWithTime } from "../defaultData";
import {
  DailyCalendarTasks,
  mapTimeToCalendarPosition,
} from "./DailyCalendarTasks";
import { DailyCalendarSlots } from "./DailyCalendarSlots";
import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { DAY_FORMAT } from "../../../../config/constants";

export interface DailyCalendarProps {
  day: string;
  tasks: ITaskWithTime[];
}

/*
    TODO:
        * handle overlapping tasks (?)
        * when navigating, scroll down calendar to first task

*/
export const DailyCalendar = ({ tasks, day }: DailyCalendarProps) => {
  const slotHeight = 55;
  const calendarHeight = 24 * slotHeight;
  const isToday = dayjs().format(DAY_FORMAT) === day;
  return (
    <ScrollView
      h="50%"
      alwaysBounceHorizontal={false}
      alwaysBounceVertical={false}
      bounces={false}
      overScrollMode="never"
    >
      <YStack backgroundColor="$backgroundFocus" paddingVertical={10}>
        <YStack height={calendarHeight}>
          <DailyCalendarSlots slotHeight={slotHeight} />
          <DailyCalendarTasks slotHeight={slotHeight} tasks={tasks} />
          {isToday ? <CurrentTime slotHeight={slotHeight} /> : null}
        </YStack>
      </YStack>
    </ScrollView>
  );
};

export const CurrentTime = (props: { slotHeight: number }) => {
  const [time, setTime] = useState<Dayjs>(dayjs());
  useEffect(() => {
    const interval = setInterval(() => setTime(dayjs()), 5000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  const top = mapTimeToCalendarPosition(time, props.slotHeight);
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
