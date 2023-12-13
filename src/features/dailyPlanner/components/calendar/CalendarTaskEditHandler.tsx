import { createContext, useContext } from "react";
import { GestureDetector } from "react-native-gesture-handler";
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Circle } from "tamagui";
import { useTaskHeightDrag } from "../../logic/UseTaskHeightDrag";
import { mapDurationToHeight } from "../../logic/utils";
import { useDraggableCalendarListContext } from "../../logic/UseCalendarListContext";
import { TimeAndDurationMap } from "../../model/model";

export interface CalendarTaskEditHandlerProps {
  isEdited: boolean;
  id: string;
  name: string;
  day: string;
  movingTimeAndDurationOfTasks: SharedValue<TimeAndDurationMap>;
  children: any;
}

/*
  TODO:
    * in editMode bottom circle should be animated
*/
export const DailyCalendarTaskHeightEditHandler = ({
  isEdited,
  id,
  name,
  day,
  movingTimeAndDurationOfTasks,
  children,
}: CalendarTaskEditHandlerProps) => {
  const { heightDragPan, height: height } = useTaskHeightDrag(
    isEdited,
    id,
    name,
    day,
    movingTimeAndDurationOfTasks
  );
  const style = useAnimatedStyle(() => {
    return {
      height: height.value,
      width: "100%",
    };
  });

  return (
    <Animated.View style={[style]}>
      <HeightContext.Provider value={{ height }}>
        {children}
      </HeightContext.Provider>
      {!isEdited ? null : (
        <GestureDetector gesture={heightDragPan}>
          <Circle
            size={"$4"}
            backgroundColor="$blue8"
            alignSelf="center"
            mt={-22}
            zIndex={0}
          />
        </GestureDetector>
      )}
    </Animated.View>
  );
};

interface IHeightContext {
  height: SharedValue<number> | null;
}

const HeightContext = createContext<IHeightContext>({ height: null });

export function useAnimatedHeight(): IHeightContext {
  const context = useContext(HeightContext);
  if (!context) {
    throw new Error("HeightContext doesn't exist!");
  }
  return context;
}
