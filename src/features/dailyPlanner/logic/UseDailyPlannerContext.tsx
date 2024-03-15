import React, { useContext } from "react";
import { SharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useScreenDimensions } from "../../../core/logic/dimensions/UseScreenDimensions";
import {
  DailyPlannerViewModeProperties,
  useDailyPlannerViewMode,
  useDimensionsByViewMode
} from "./UseDailyPlannerViewMode";

interface IDailyPlannerContext {
  viewModeProperties: DailyPlannerViewModeProperties;
  dimensions: {calendarViewHeight: SharedValue<number>, listViewHeight: SharedValue<number>};
  styles: any;
}

const DailyPlannerContext = React.createContext<IDailyPlannerContext| undefined>(undefined);

export const DailyPlannerContextProvider = (props: any) => {
  const { changeViewModeButton, viewMode, setViewMode } =
    useDailyPlannerViewMode();

  const { screenHeight, topInset } = useScreenDimensions();
  const { calendarViewHeight, listViewHeight } = useDimensionsByViewMode(
    viewMode,
    screenHeight
  );

  const calendarStyle = useAnimatedStyle(() => ({
    height: withTiming(calendarViewHeight.value),
  }));
  const listStyle = useAnimatedStyle(() => ({
    height: withTiming(listViewHeight.value),
  }));

  return (
    <DailyPlannerContext.Provider
      value={{
        viewModeProperties: { changeViewModeButton, viewMode, setViewMode },
        dimensions: {
          calendarViewHeight,
          listViewHeight,
        },
        styles: {
          listStyle,
          calendarStyle,
        },
      }}
    >
      {props.children}
    </DailyPlannerContext.Provider>
  );
};

export function useDailyPlannerContext(): IDailyPlannerContext {
  const context = useContext(DailyPlannerContext);
  if (!context) {
    throw new Error("User's DailyPlannerContext doesn't exist!");
  }
  return context;
}
