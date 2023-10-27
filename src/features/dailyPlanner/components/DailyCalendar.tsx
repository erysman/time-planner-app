import { ScrollView, Separator, Stack, YStack } from "tamagui";
import { DailyCalendarTasks } from "./DailyCalendarTasks";
import { DailyCalendarSlots } from "./DailyCalendarSlots";
import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { DAY_FORMAT } from "../../../../config/constants";
import { mapTimeToCalendarPosition } from "../logic/utils";
import { ITaskWithTime } from "../model/model";
import Animated, { AnimatableValue, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { DailyPlannerViewMode, useHeightByViewMode } from "../logic/UseDailyPlannerViewMode";
import { DimensionValue } from "react-native";
import { DimensionInPercent } from "../../../core/model/types";

export interface DailyCalendarProps {
  day: string;
  tasks: ITaskWithTime[];
  viewMode: DailyPlannerViewMode;
}

/*
    TODO:
        * handle overlapping tasks (?)
        * when navigating, scroll down calendar to first task

*/
export const DailyCalendar = ({ tasks, day, viewMode }: DailyCalendarProps) => {
  const hourSlotHeight = 55;
  const minuteInPixels = hourSlotHeight / 60;
  const calendarHeight = 24 * hourSlotHeight;
  const isToday = dayjs().format(DAY_FORMAT) === day;
  const [editedTaskId, setEditedTaskId] = useState<string | null>(null);
  const style = useHeightByViewMode(viewMode, getCalendarHeight)
  return (
    <Animated.View style={[style]}>
      <ScrollView
        h={"100%"}
        alwaysBounceHorizontal={false}
        alwaysBounceVertical={false}
        bounces={false}
        overScrollMode="never"
      >
        <YStack backgroundColor="$backgroundFocus" paddingVertical={10}>
          <YStack height={calendarHeight}>
            <DailyCalendarSlots hourSlotHeight={hourSlotHeight} />
            <DailyCalendarTasks
              day={day}
              minuteInPixels={minuteInPixels}
              tasks={tasks}
              editedTaskId={editedTaskId}
              onTaskPress={(task) => {
                setEditedTaskId((prevTaskId) => {
                  if (prevTaskId === task.id) return null;
                  return task.id;
                });
              }}
            />
            {isToday ? <CurrentTime minuteInPixels={minuteInPixels} /> : null}
          </YStack>
        </YStack>
      </ScrollView>
    </Animated.View>
  );
};

export const CurrentTime = (props: { minuteInPixels: number }) => {
  const [time, setTime] = useState<Dayjs>(dayjs());
  useEffect(() => {
    const interval = setInterval(() => setTime(dayjs()), 5000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  const top = mapTimeToCalendarPosition(time, props.minuteInPixels);
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

function getCalendarHeight(viewMode: DailyPlannerViewMode): DimensionInPercent {
  switch (viewMode) {
    case "both":
      return "50%";
    case "calendar":
      return "100%";
    case "list":
      return "0%";
  }
}
