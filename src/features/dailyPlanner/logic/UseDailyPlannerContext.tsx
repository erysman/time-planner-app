import React, { useContext, useEffect, useState } from "react";
import { useScreenDimensions } from "../../../core/dimensions/UseScreenDimensions";
import {
  DailyPlannerViewMode,
  DailyPlannerViewModeProperties,
  useDailyPlannerViewMode,
} from "./UseDailyPlannerViewMode";
import dayjs from "dayjs";
import { DAY_FORMAT } from "../../../../config/constants";
import { useNavigationState } from "@react-navigation/native";

interface IDailyPlannerContext {
  selectedDay: string;
  setSelectedDay: React.Dispatch<React.SetStateAction<string>>;
  viewModeProperties: DailyPlannerViewModeProperties | null;
}

const DailyPlannerContext = React.createContext<IDailyPlannerContext>({
  selectedDay: dayjs().format(DAY_FORMAT),
  setSelectedDay: () => {},
  viewModeProperties: null,
});

export const DailyPlannerContextProvider = (props: any) => {
  const { changeViewModeButton, viewMode, setViewMode } =
    useDailyPlannerViewMode();

  const [selectedDay, setSelectedDay] = useState(dayjs().format(DAY_FORMAT));

  return (
    <DailyPlannerContext.Provider
      value={{
        viewModeProperties: { changeViewModeButton, viewMode, setViewMode },
        selectedDay,
        setSelectedDay,
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
