import { useState } from "react";
import Animated from "react-native-reanimated";
import { YStack } from "tamagui";
import { ITaskWithTime } from "../../model/model";
import { CalendarCurrentTime } from "./CalendarCurrentTime";
import { DailyCalendarSlots } from "./DailyCalendarSlots";
import { DailyCalendarTasks } from "./DailyCalendarTasks";
import { useDraggableCalendarListContext } from "../../logic/UseCalendarListContext";

interface DraggableCalendarProps {
    day: string;
    tasksWithStartTime: ITaskWithTime[];
    calendarScrollRef: React.RefObject<Animated.ScrollView>;
    calendarStyle: {height: number};
    movingItemId: string | null;
  }
  
  export const DraggableCalendar = ({
    day,
    tasksWithStartTime,
    movingItemId,
    calendarScrollRef,
    calendarStyle,
  }: DraggableCalendarProps) => {
    const {calendarHeight} = useDraggableCalendarListContext();
    const [editedTaskId, setEditedTaskId] = useState<string | null>(null);
    const onTaskPress = (taskId: string) => {
      setEditedTaskId((prevTaskId) => {
        if (prevTaskId === taskId) return null;
        return taskId;
      });
    };
    
  
    return (
      <Animated.View style={[calendarStyle]}>
        <Animated.ScrollView
          ref={calendarScrollRef}
          alwaysBounceHorizontal={false}
          alwaysBounceVertical={false}
          bounces={false}
          overScrollMode="never"
          scrollEventThrottle={16}
          contentContainerStyle={{
            height: calendarHeight,
          }}
        >
          <YStack backgroundColor="$backgroundFocus" height={calendarHeight}>
            <DailyCalendarSlots/>
            <DailyCalendarTasks
              editedTaskId={editedTaskId}
              tasks={tasksWithStartTime}
              pressedTaskId={movingItemId}
              onTaskPress={onTaskPress}
            />
            <CalendarCurrentTime day={day} />
          </YStack>
        </Animated.ScrollView>
      </Animated.View>
    );
  };
  