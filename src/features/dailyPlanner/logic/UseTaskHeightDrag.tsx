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
  getGetTasksQueryKey,
  useUpdateTask,
} from "../../../clients/time-planner-server/client";
import { TaskDTO } from "../../../clients/time-planner-server/model";
import { mapHeightToDurationMin } from "../logic/utils";
import { ITaskWithTime } from "../model/model";

export const useTaskHeightDrag = (
  isEdited: boolean,
  height: number,
  minuteInPixels: number,
  id: string,
  name: string,
  durationMin: number,
  day: string,
) => {
  const stepHeight = minuteInPixels * 15;
  const pressed = useSharedValue(false);
  const durationOffset = useSharedValue(0);
  const newHeight = useDerivedValue(() => {
    const numberOfSteps = Math.trunc(durationOffset.value / stepHeight);
    const newHeight = height + numberOfSteps * stepHeight;
    //TODO: height shouldn't exceed calendar end
    return Math.max(newHeight, 2*stepHeight);
  });

  useEffect(() => {
    durationOffset.value = 0;
  }, [durationMin]);
  
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
  const updateTaskDurationFn = (newHeight: SharedValue<number>) => {
    const duration = mapHeightToDurationMin(newHeight.value, minuteInPixels);
    console.log(
      `updating task ${name}, id: ${id}, new durationMin: ${duration}`
    );
    updateTask.mutate({ id, data: { durationMin: duration } });
  };

  const heightDragPan = Gesture.Pan()
    .enabled(isEdited)
    .onBegin(() => {
      pressed.value = true;
    })
    .onChange((event) => {
      durationOffset.value = event.translationY;
    })
    .onFinalize(() => {
      pressed.value = false;
      if (height !== newHeight.value) {
        runOnJS(updateTaskDurationFn)(newHeight);
      }
    });

  return { heightDragPan, newHeight };
};
