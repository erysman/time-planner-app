import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Gesture } from "react-native-gesture-handler";
import {
  SharedValue,
  runOnJS,
  useDerivedValue,
  useSharedValue
} from "react-native-reanimated";
import {
  getGetDayTasksQueryKey,
  getGetTasksQueryKey,
  useUpdateTask,
} from "../../../clients/time-planner-server/client";
import { TaskDTO } from "../../../clients/time-planner-server/model";
import { ITaskWithTime } from "../model/model";
import { mapCalendarPositionToTime } from "./utils";


export const useTaskVerticalCalendarMovement = (
  isEnabled: boolean,
  top: number,
  minuteInPixels: number,
  { id, name, startDay: day, startTime }: ITaskWithTime
) => {
  const stepHeight = minuteInPixels * 15;
  const queryClient = useQueryClient();

  const updateTask = useUpdateTask({
    mutation: {
      onSuccess: (newTask) => {
        queryClient.setQueryData<TaskDTO[]>(
          getGetDayTasksQueryKey(day),
          (prev) =>
            prev?.map((task) => (task.id === newTask.id ? newTask : task))
        );
      },
    },
  });
  const pressed = useSharedValue(false);
  const startTimeOffset = useSharedValue(0);

  useEffect(() => {
    startTimeOffset.value = 0;
  }, [startTime]);

  const newTop = useDerivedValue(() => {
    const numberOfSteps = Math.trunc(startTimeOffset.value / stepHeight);
    const newTop = top + numberOfSteps * stepHeight;
    //TODO: task shouldn't exceed calendar end
    //TODO: drag with negative "newTop" should move task to tasks list (remove startTime)
    return Math.max(newTop, 0);
  });

  const updateTaskTimeFn = (newTop: SharedValue<number>) => {
    const time = mapCalendarPositionToTime(newTop.value, minuteInPixels);
    console.log(`updating task ${name}, id: ${id}, new time: ${time}`);
    updateTask.mutate({ id, data: { startTime: time } });
  };

  const verticalMovementPan = Gesture.Pan()
    .enabled(isEnabled)
    .onBegin(() => {
      pressed.value = true;
    })
    .onChange((event) => {
      startTimeOffset.value = event.translationY;
    })
    .onFinalize(() => {
      pressed.value = false;
      if(top !== newTop.value) {
        runOnJS(updateTaskTimeFn)(newTop);
      }
    });

  return { verticalMovementPan, newTop };
};
