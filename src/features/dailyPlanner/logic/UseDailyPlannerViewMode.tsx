import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Button } from "tamagui";
import { ExpoIcon } from "../../../core/components/ExpoIcon";
import { DimensionInPercent, Layout } from "../../../core/model/types";

export type DailyPlannerViewMode = "list" | "calendar" | "both";

export type DailyPlannerViewModeProperties = {
  viewMode: DailyPlannerViewMode;
  changeViewModeButton: JSX.Element;
  setViewMode: React.Dispatch<React.SetStateAction<DailyPlannerViewMode>>;
};

export const useDailyPlannerViewMode = (): DailyPlannerViewModeProperties => {
  const [viewMode, setViewMode] = useState<DailyPlannerViewMode>("both");

  const getNextViewMode = useCallback(
    (current: DailyPlannerViewMode): DailyPlannerViewMode => {
      switch (current) {
        case "both":
          return "calendar";
        case "calendar":
          return "list";
        case "list":
          return "both";
        default:
          return "both";
      }
    },
    []
  );

  const getIconForViewMode = useCallback((viewMode: DailyPlannerViewMode) => {
    switch (viewMode) {
      case "both":
        return "calendar-minus";
      case "calendar":
        return "calendar-import";
      case "list":
        return "calendar-export";
    }
  }, []);

  const onPress = useCallback(
    () => setViewMode((prev) => getNextViewMode(prev)),
    [setViewMode, getNextViewMode]
  );

  const name = useMemo(
    () => getIconForViewMode(getNextViewMode(viewMode)),
    [getIconForViewMode, getNextViewMode, viewMode]
  );

  const changeViewModeButton: JSX.Element = useMemo(
    () => (
      <Button paddingHorizontal={12} onPress={onPress} variant="outlined">
        <ExpoIcon
          iconSet="MaterialCommunityIcons"
          name={name}
          size={24}
          color="color"
        />
      </Button>
    ),
    [viewMode]
  );

  return { viewMode, changeViewModeButton, setViewMode };
};

export const useDimensionsByViewMode = (
  viewMode: DailyPlannerViewMode,
  height: number
) => {
  const [calendarProportion, listProportion] = useMemo(
    () => getViewsProportions(viewMode),
    [viewMode]
  );
  const listViewHeight = useSharedValue(height * listProportion);
  const calendarViewHeight = useSharedValue(height * calendarProportion);

  useEffect(() => {
    listViewHeight.value = height * listProportion;
    calendarViewHeight.value = height * calendarProportion;
  }, [viewMode, height]);

  return {
    calendarViewHeight,
    listViewHeight,
  };
};

function getViewsProportions(viewMode: DailyPlannerViewMode): [number, number] {
  switch (viewMode) {
    case "both":
      return [0.5, 0.5];
    case "calendar":
      return [1, 0];
    case "list":
      return [0, 1];
  }
}
