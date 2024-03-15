import { useMemo } from "react";
import { Button, Spinner, Stack, XStack } from "tamagui";
import { ExpoIcon } from "../../../core/components/ExpoIcon";
import {
  getAutoScheduleInfo,
  getGetAutoScheduleInfoQueryKey,
  getGetDayTasksQueryKey,
  getGetTasksDayOrderQueryKey,
  useGetAutoScheduleInfo,
  useRevokeSchedule,
  useSchedule,
} from "../../../clients/time-planner-server/client";
import { useQueryClient } from "@tanstack/react-query";

export const useScheduleDayTasks = (day: string) => {
  const queryClient = useQueryClient();
  const {
    data: scheduleInfo,
    isError: isErrorLoading,
    isLoading: isInfoLoading,
  } = useGetAutoScheduleInfo(day);
  const schedule = useSchedule({
    mutation: {
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: getGetDayTasksQueryKey(day),
        });
        queryClient.invalidateQueries({
          queryKey: getGetTasksDayOrderQueryKey(day),
        });
        queryClient.invalidateQueries({
          queryKey: getGetAutoScheduleInfoQueryKey(day),
        });
      },
    },
  });
  const unschedule = useRevokeSchedule({
    mutation: {
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: getGetDayTasksQueryKey(day),
        });
        queryClient.invalidateQueries({
          queryKey: getGetTasksDayOrderQueryKey(day),
        });
        queryClient.invalidateQueries({
          queryKey: getGetAutoScheduleInfoQueryKey(day),
        });
      },
    },
  });

  const scheduleButton = useMemo(
    () => (
      <Button
        paddingHorizontal={12}
        onPress={() => {
          schedule.mutate({ day });
          schedule.isLoading;
          //lock edit, while isLoading, render spinner instead of unscheduleButton
        }}
        variant="outlined"
      >
        {/* <MaterialCommunityIcons name="timetable" size={24} color="black" /> */}
        <ExpoIcon
          iconSet="MaterialCommunityIcons"
          name="clock-fast"
          size={24}
          color="color"
        />
      </Button>
    ),
    [schedule, day]
  );

  const unscheduleButton = useMemo(
    () => (
      <Button
        paddingHorizontal={12}
        onPress={() => {
          unschedule.mutate({ day });
        }}
        variant="outlined"
      >
        <ExpoIcon
          iconSet="MaterialCommunityIcons"
          name="delete-clock-outline"
          size={24}
          color="color"
        />
      </Button>
    ),
    [unschedule, day]
  );

  const spinner = useMemo(() => (<Spinner margin={16} />), [])

  const stack = useMemo(
    () => (
      <XStack width={106} height={46} justifyContent="flex-end">
        {schedule.isLoading || unschedule.isLoading ? (
          spinner
        ) : scheduleInfo?.isScheduled ? (
          unscheduleButton
        ) : null}
        {scheduleButton}
      </XStack>
    ),
    [schedule.isLoading, unschedule.isLoading, unscheduleButton, scheduleButton]
  );

  return {
    stack,
  };
};
