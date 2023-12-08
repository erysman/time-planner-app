import { ScrollView, Separator, Stack, YStack } from "tamagui";
import { DailyCalendarTasks } from "./DailyCalendarTasks";
import { DailyCalendarSlots } from "./DailyCalendarSlots";
import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { DAY_FORMAT } from "../../../../config/constants";
import {
  mapCalendarPositionToMinutes,
  mapCalendarPositionToTime,
  mapTimeToCalendarPosition,
  minutesToTime,
  timeToMinutes,
} from "../logic/utils";
import { ITask, ITaskWithTime } from "../model/model";
import Animated, {
  AnimatableValue,
  SharedValue,
  runOnJS,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useScrollViewOffset,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  DailyPlannerViewMode,
  useHeightByViewMode,
} from "../logic/UseDailyPlannerViewMode";
import { DimensionValue } from "react-native";
import { DimensionInPercent } from "../../../core/model/types";
import { DailyCalendarTask, MovingCalendarTask } from "./DailyCalendarTask";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useQueryClient } from "@tanstack/react-query";
import {
  getGetDayTasksQueryKey,
  useUpdateTask,
} from "../../../clients/time-planner-server/client";
import { TaskDTO } from "../../../clients/time-planner-server/model";
import { produce } from "immer";

export interface DailyCalendarProps {
  day: string;
  tasks: ITaskWithTime[];
}

/*
  TODO:
    * create list of tasks (with calculated top positions from startTime) as shared value, update it when task is moving. then override it whenever cache changes
    * handle overlapping tasks (?)
    * when navigating, scroll down calendar to first task
*/
export const DailyCalendar = ({ tasks, day }: DailyCalendarProps) => {
  const hourSlotHeight = 55;
  const minuteInPixels = hourSlotHeight / 60;
  const stepHeight = minuteInPixels * 15;
  const calendarHeight = 24 * hourSlotHeight;
  const isToday = dayjs().format(DAY_FORMAT) === day;

  // const style = useHeightByViewMode(viewMode, getCalendarHeight);

  const {
    scrollRef,
    editedTaskId,
    pressedTaskIdState,
    onTaskPress,
    movingCalendarItemTop,
  } = useDailyCalendar(day, minuteInPixels, stepHeight, tasks);

  const movingTask =
    tasks.find((task) => task.id === pressedTaskIdState) ?? null;
  return (
    // <GestureDetector gesture={verticalMovementPan}>
    <Animated.View collapsable={false}>
      <Animated.ScrollView
        ref={scrollRef}
        alwaysBounceHorizontal={false}
        alwaysBounceVertical={false}
        bounces={false}
        overScrollMode="never"
        scrollEventThrottle={16}
        contentContainerStyle={{
          height: 24 * hourSlotHeight,
        }}
      >
        <YStack backgroundColor="$backgroundFocus" height={calendarHeight}>
          <DailyCalendarSlots hourSlotHeight={hourSlotHeight} />
          <DailyCalendarTasks
            editedTaskId={editedTaskId}
            day={day}
            minuteInPixels={minuteInPixels}
            tasks={tasks}
            pressedTaskId={pressedTaskIdState}
            onTaskPress={onTaskPress}
          />
          {isToday ? <CurrentTime minuteInPixels={minuteInPixels} /> : null}
        </YStack>
        {!movingTask ? null : (
          <MovingCalendarTask
            movingTop={movingCalendarItemTop}
            isEdited={true}
            minuteInPixels={minuteInPixels}
            task={movingTask}
            onPress={onTaskPress}
          />
        )}
      </Animated.ScrollView>
    </Animated.View>
    // </GestureDetector>
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

export const useDailyCalendar = (
  day: string,
  minuteInPixels: number,
  stepHeight: number,
  tasks: ITaskWithTime[]
) => {
  const [editedTaskId, setEditedTaskId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const updateTask = useUpdateTask({
    mutation: {
      onMutate: async ({ data, id }) => {
        const queryKey = getGetDayTasksQueryKey(day);
        console.log("optimistic cache update for key:", queryKey);
        await queryClient.cancelQueries({ queryKey });
        const previousData = queryClient.getQueryData<TaskDTO[]>(queryKey);
        console.log("optimistic cache update previous data:", previousData);
        queryClient.setQueryData<TaskDTO[]>(queryKey, (prev) => {
          if (!prev) {
            return prev;
          }
          return produce(prev, (draft) => {
            const taskToUpdateIndex = draft.findIndex((task) => task.id === id);
            if (taskToUpdateIndex !== -1) {
              draft[taskToUpdateIndex] = {
                ...draft[taskToUpdateIndex],
                ...data,
              };
            }
          });
        });
        return { previousData };
      },
      onError: (error, { id, data }, context) => {
        queryClient.setQueryData<TaskDTO[]>(
          getGetDayTasksQueryKey(day),
          context?.previousData
        );
      },
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: getGetDayTasksQueryKey(day),
        });
      },
    },
  });

  const onTaskPress = (taskId: string) => {
    setEditedTaskId((prevTaskId) => {
      if (prevTaskId === taskId) return null;
      return taskId;
    });
  };

  const pressed = useSharedValue(false);
  const offsetFromPressedToTaskStart = useSharedValue<number>(0);
  const pressedTaskId = useSharedValue<string | null>(null);
  const [pressedTaskIdState, setPressedTaskIdState] = useState<string | null>(
    null
  );
  const movedItemOffset = useSharedValue(0);
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollHandler = useScrollViewOffset(scrollRef);

  useAnimatedReaction(
    () => pressedTaskId.value,
    () => {
      runOnJS(setPressedTaskIdState)(pressedTaskId.value);
    }
  );

  const movingCalendarItemTop = useDerivedValue(() => {
    const numberOfSteps = Math.trunc(movedItemOffset.value / stepHeight);
    const newTop = numberOfSteps * stepHeight;
    //TODO: task shouldn't exceed calendar end
    //TODO: drag with negative "newTop" should move task to tasks list (remove startTime)
    return Math.max(newTop, 0);
  });

  const updateTaskTimeFn = (time: string, itemId: string) => {
    console.log(`updating task with id: ${itemId}, new time: ${time}`);
    updateTask.mutate({ id: itemId, data: { startTime: time } });
  };

  const verticalMovementPan = Gesture.Pan()
    .activateAfterLongPress(250)
    .onStart((event) => {
      pressed.value = true;
      const pressedY = scrollHandler.value + event.y;
      const pressedTimeInMinutes = mapCalendarPositionToMinutes(
        pressedY,
        minuteInPixels
      );
      console.log(
        `verticalCalendarMovementPan: on start pressed y: ${pressedY}, time: ${pressedTimeInMinutes}`
      );
      const pressedTask = tasks.find(
        (task) =>
          pressedTimeInMinutes > timeToMinutes(task.startTime) &&
          pressedTimeInMinutes <
            timeToMinutes(task.startTime) + task.durationMin
      );
      if (!pressedTask) {
        return;
      }
      console.log(
        `pressed task id ${pressedTask.id}, name: ${pressedTask.name}`
      );
      pressedTaskId.value = pressedTask.id;
      const pressedTaskStartTimeInMinutes = timeToMinutes(
        pressedTask.startTime
      );
      offsetFromPressedToTaskStart.value =
        (pressedTimeInMinutes - pressedTaskStartTimeInMinutes) * minuteInPixels;
      movedItemOffset.value = pressedY - offsetFromPressedToTaskStart.value;
    })
    .onChange((event) => {
      movedItemOffset.value =
        scrollHandler.value + event.y - offsetFromPressedToTaskStart.value;
    })
    .onEnd(() => {
      pressed.value = false;
      if (pressedTaskId.value === null) {
        return;
      }
      const minutes: number = mapCalendarPositionToMinutes(
        movingCalendarItemTop.value,
        minuteInPixels
      );
      const time = minutesToTime(minutes);
      const task = tasks.find((task) => task.id === pressedTaskId.value);
      console.log(
        `verticalCalendarMovementPan: end: task id: ${pressedTaskId.value}, new time: ${time}`
      );
      if (task && time !== task.startTime) {
        runOnJS(updateTaskTimeFn)(time, pressedTaskId.value);
      }
      pressedTaskId.value = null;
      offsetFromPressedToTaskStart.value = 0;
    });

  return {
    verticalMovementPan,
    scrollRef,
    editedTaskId,
    pressedTaskIdState,
    onTaskPress,
    movingCalendarItemTop,
  };
};
