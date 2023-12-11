import { useMemo, useState } from "react";
import { LayoutChangeEvent } from "react-native";
import { useAnimatedStyle, withTiming } from "react-native-reanimated";
import {
  DailyPlannerViewMode,
  useDimensionsByViewMode,
} from "../../logic/UseDailyPlannerViewMode";
import { ITask, ITaskWithTime } from "../../model/model";
import { useDraggableCalendarListGesture } from "./UseDraggableCalendarListGesture";

export const useDraggableCalendarList = (
  day: string,
  viewMode: DailyPlannerViewMode,
  itemsOrder: string[],
  tasks: ITask[]
) => {
  const [layout, setLayout] = useState({ height: 1, width: 0 });
  const {
    calendarViewHeight,
    listViewHeight,
  } = useDimensionsByViewMode(viewMode, layout);
  const calendarStyle = useAnimatedStyle(() => ({
    height: withTiming(calendarViewHeight.value),
  }));
  const listStyle = useAnimatedStyle(() => ({
    height: withTiming(listViewHeight.value),
  }));

  const onLayoutChange = (e: LayoutChangeEvent) => {
    setLayout({
      height: e.nativeEvent.layout.height,
      width: e.nativeEvent.layout.width,
    });
  };
  
  const {
    dragGesture,
    movingItemsOrder,
    calendarScrollRef,
    movingItemId,
    movingItemType,
    movingItemViewY,
    listPointerIndex,
  } = useDraggableCalendarListGesture(
    day,
    itemsOrder,
    calendarViewHeight,
    listViewHeight,
    tasks
  );

  const tasksWithoutStartTime =
    (tasks.filter((t) => !t.startTime || !t.durationMin) as ITask[]) ?? [];
  const tasksWithStartTime =
    (tasks.filter(
      (t) => !!t.startTime && !!t.durationMin
    ) as ITaskWithTime[]) ?? [];

  const movingTask: ITask = useMemo(
    () => (tasks.find((task) => task.id === movingItemId) as ITask) ?? null,
    [movingItemId]
  );

  return {
    dragGesture,
    movingItem: {
      id: movingItemId,
      listOrder: movingItemsOrder,
      viewY: movingItemViewY,
      type: movingItemType,
      listPointerIndex,
    },
    calendarScrollRef,
    layout: {
      onChange: onLayoutChange,
      listStyle,
      calendarStyle,
    },
    tasksWithoutStartTime,
    tasksWithStartTime,
    movingTask,
  };
};
