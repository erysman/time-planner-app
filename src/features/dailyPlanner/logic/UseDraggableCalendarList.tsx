import { useMemo } from "react";
import { ITask } from "../model/model";
import { useDailyPlannerContext } from "./UseDailyPlannerContext";
import { useDraggableCalendarListGesture } from "./UseDraggableCalendarListGesture";

export const useDraggableCalendarList = (
  day: string,
  itemsOrder: string[],
  tasks: ITask[]
) => {
  const {dimensions, styles} = useDailyPlannerContext();
  
  const {
    dragGesture,
    movingItemsOrder,
    calendarScrollRef,
    calendarScrollDuration,
    calendarScrollTargetY,
    movingItemId,
    movingItemType,
    movingItemViewY,
    listPointerIndex,
    movingTimeAndDurationOfTasks
  } = useDraggableCalendarListGesture(
    day,
    itemsOrder,
    dimensions.calendarViewHeight,
    dimensions.listViewHeight,
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
      movingTimeAndDurationOfTasks
    },
    calendarScrollRef,
    calendarScrollDuration,
    calendarScrollTargetY,
    styles,
    movingTask,
  };
};
