import { useMemo } from "react";
import { ITask } from "../model/model";
import { useDailyPlannerContext } from "./UseDailyPlannerContext";
import { useDraggableCalendarListGesture } from "./UseDraggableCalendarListGesture";

export const useDraggableCalendarList = (
  day: string,
  itemsOrder: string[],
  tasks: ITask[]
) => {
  

  const {
    dragGesture,
    movingItemsOrder,
    scroll,
    movingItemId,
    movingItemType,
    movingItemViewY,
    listPointerIndex,
    movingTimeAndDurationOfTasks,
  } = useDraggableCalendarListGesture(
    day,
    itemsOrder,
    tasks
  );

  const movingTask: ITask = useMemo(
    () => (tasks.find((task) => task.id === movingItemId) as ITask) ?? null,
    [movingItemId]
  );

  return {
    dragGesture,
    movingItem: {
      id: movingItemId,
      itemsOrder: movingItemsOrder,
      viewY: movingItemViewY,
      type: movingItemType,
      listPointerIndex,
      movingTimeAndDurationOfTasks,
    },
    scroll,
    movingTask,
  };
};
