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

export interface CalendarTaskEditHandlerProps {
  isEdited: boolean;
  id: string;
  name: string;
  durationMin: number;
  day: string;
  children: any;
}

/*
  TODO:
    * in editMode bottom circle should be animated
*/
export const CalendarTaskEditHandler = ({
  isEdited,
  id,
  name,
  durationMin,
  day,
  children,
}: CalendarTaskEditHandlerProps) => {
  const { minuteInPixels, calendarStepHeight } =
    useDraggableCalendarListContext();
  const heightTmp = mapDurationToHeight(durationMin, minuteInPixels);
  const height = isEdited ? heightTmp : heightTmp - 2;

  const { heightDragPan, newHeight } = useTaskHeightDrag(
    isEdited,
    height,
    minuteInPixels,
    id,
    name,
    durationMin,
    day,
    calendarStepHeight
  );
  const style = useAnimatedStyle(() => {
    return {
      height: newHeight.value ?? height, //- 2
      width: "100%",
    };
  });

  return (
    <Animated.View style={[style]}>
      <HeightContext.Provider value={{ newHeight }}>
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
  newHeight: SharedValue<number> | null;
}

const HeightContext = createContext<IHeightContext>({ newHeight: null });

export function useAnimatedHeight(): IHeightContext {
  const context = useContext(HeightContext);
  if (!context) {
    throw new Error("HeightContext doesn't exist!");
  }
  return context;
}
