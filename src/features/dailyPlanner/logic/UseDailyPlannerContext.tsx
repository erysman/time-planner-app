import React, { useContext, useEffect, useState } from "react";
import { useScreenDimensions } from "../../../core/dimensions/UseScreenDimensions";
import {
  DailyPlannerViewMode,
  DailyPlannerViewModeProperties,
  useDailyPlannerViewMode,
  useDimensionsByViewMode,
} from "./UseDailyPlannerViewMode";
import dayjs from "dayjs";
import { DAY_FORMAT } from "../../../../config/constants";
import { useNavigationState } from "@react-navigation/native";
import { useAnimatedStyle, withTiming } from "react-native-reanimated";

interface IDailyPlannerContext {
  viewModeProperties: DailyPlannerViewModeProperties;
  dimensions: any;
  styles: any;
}

const DailyPlannerContext = React.createContext<IDailyPlannerContext>({
  viewModeProperties: {
    changeViewModeButton: <></>,
    viewMode: "both",
    setViewMode: () => {},
  },
  dimensions: null,
  styles: null,
});

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
