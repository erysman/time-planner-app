import { createContext, useContext } from "react";
import { GestureDetector } from "react-native-gesture-handler";
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Circle, Stack } from "tamagui";
import { useTaskHeightDrag } from "../logic/UseTaskHeightDrag";
import { useTaskVerticalCalendarMovement } from "../logic/UseTaskVerticalCalendarMovement";
import { ITaskWithTime } from "../model/model";

export interface CalendarTaskEditHandlerProps {
  isEdited: boolean;
  top: number;
  height: number;
  minuteInPixels: number;
  task: ITaskWithTime;
  children: any;
}

/*
  TODO:
    * in editMode bottom circle should be animated
*/
export const CalendarTaskEditHandler = ({
  isEdited,
  top,
  height,
  minuteInPixels,
  task,
  children,
}: CalendarTaskEditHandlerProps) => {
  const { verticalMovementPan, newTop } = useTaskVerticalCalendarMovement(
    isEdited,
    top,
    minuteInPixels,
    task
  );

  const { heightDragPan, newHeight } = useTaskHeightDrag(
    isEdited,
    height,
    minuteInPixels,
    task
  );

  const style = useAnimatedStyle(() => ({
    height: newHeight.value, //- 2
  }));

  return (
    <Stack zIndex={isEdited ? 300 : 100}>
      <GestureDetector gesture={verticalMovementPan}>
        <Animated.View
          style={[
            {
              position: "absolute",
              top,
              height,
              width: "100%",
            },
            {
              top: newTop,
            },
            style,
          ]}
        >
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
      </GestureDetector>
    </Stack>
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
