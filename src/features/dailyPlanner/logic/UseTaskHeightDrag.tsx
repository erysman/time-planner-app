import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Gesture } from "react-native-gesture-handler";
import {
  SharedValue,
  runOnJS,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import {
  getGetDayTasksQueryKey,
  useUpdateTask,
} from "../../../clients/time-planner-server/client";
import { TaskDTO } from "../../../clients/time-planner-server/model";
import { mapDurationToHeight, mapHeightToDurationMin } from "../logic/utils";
import { TimeAndDurationMap } from "../model/model";
import { useDraggableCalendarListContext } from "./UseCalendarListContext";
import { DEFAULT_CALENDAR_STEP_MINUTES, DEFAULT_DURATION_MIN, MIN_TASK_DURATION_MINUTES } from "../../../../config/constants";

export const useTaskHeightDrag = (
  isEdited: boolean,
  id: string,
  name: string,
  day: string,
  movingTimeAndDurationOfTasks: SharedValue<TimeAndDurationMap>
) => {
  const { minuteInPixels, calendarStepHeight } =
    useDraggableCalendarListContext();

  function getDuration() {
    "worklet";
    const timeAndDuration = movingTimeAndDurationOfTasks.value[id];
    if (!timeAndDuration) return 0;
    if (!timeAndDuration.durationMinutes) return DEFAULT_DURATION_MIN;
    return timeAndDuration.durationMinutes;
  }

  function calculateHeight() {
    "worklet";
    const duration = getDuration();
    const height = mapDurationToHeight(duration, minuteInPixels)+1;
    return height;
  }

  function updateDurationOnTasksMap(itemId: string, durationMinutes: number) {
    "worklet";
    let newMap = { ...movingTimeAndDurationOfTasks.value };
    if (!newMap[itemId]) return;
    const task = { ...newMap[itemId], durationMinutes };
    newMap[itemId] = task;
    movingTimeAndDurationOfTasks.value = newMap;
  }

  const durationOffset = useSharedValue(0);
  const height = useDerivedValue(() => {
    const oldHeight = calculateHeight();
    const numberOfSteps = Math.trunc(durationOffset.value / calendarStepHeight);
    const newHeight = oldHeight + numberOfSteps * calendarStepHeight;
    //TODO: height shouldn't exceed calendar end
    return Math.max(newHeight, MIN_TASK_DURATION_MINUTES/DEFAULT_CALENDAR_STEP_MINUTES * calendarStepHeight);
  });

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
  const updateTaskDuration = (durationMin: number) => {
    console.log(
      `updating task ${name}, id: ${id}, new durationMin: ${durationMin}`
    );
    updateTask.mutate({ id, data: { durationMin } });
  };

  const heightDragPan = Gesture.Pan()
    .enabled(isEdited)
    .onBegin(() => {
      durationOffset.value = 0;
      console.log(`heightDragPan started`);
    })
    .onChange((event) => {
      durationOffset.value = event.translationY;
    })
    .onFinalize(() => {
      const newDurationMin = mapHeightToDurationMin(
        height.value,
        minuteInPixels
      );
      const timeAndDuration = movingTimeAndDurationOfTasks.value[id];
      if (newDurationMin !== timeAndDuration?.durationMinutes) {
        updateDurationOnTasksMap(id, newDurationMin);
        runOnJS(updateTaskDuration)(newDurationMin);
      }
      durationOffset.value = 0;
    });

  return { heightDragPan, height };
};
