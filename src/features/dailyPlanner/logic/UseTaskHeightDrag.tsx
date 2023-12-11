import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Gesture } from "react-native-gesture-handler";
import {
  runOnJS,
  useDerivedValue,
  useSharedValue
} from "react-native-reanimated";
import {
  getGetDayTasksQueryKey,
  useUpdateTask
} from "../../../clients/time-planner-server/client";
import { TaskDTO } from "../../../clients/time-planner-server/model";
import { mapHeightToDurationMin } from "../logic/utils";

export const useTaskHeightDrag = (
  isEdited: boolean,
  height: number,
  minuteInPixels: number,
  id: string,
  name: string,
  durationMin: number,
  day: string,
  stepHeight: number
) => {
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
    })
    .onChange((event) => {
      durationOffset.value = event.translationY;
    })
    .onFinalize(() => {
      const newDurationMin = mapHeightToDurationMin(newHeight.value, minuteInPixels);
      if (newDurationMin !== durationMin) {
        runOnJS(updateTaskDuration)(newDurationMin);
      }
    });

  return { heightDragPan, newHeight };
};
