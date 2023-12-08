import { useEffect, useMemo, useState } from "react";
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Button } from "tamagui";
import { ExpoIcon } from "../../../core/components/ExpoIcon";
import { DimensionInPercent, Layout } from "../../../core/model/types";

export type DailyPlannerViewMode = "list" | "calendar" | "both";

export const useDailyPlannerViewMode = () => {
  const [viewMode, setViewMode] = useState<DailyPlannerViewMode>("both");

  function getNextViewMode(
    current: DailyPlannerViewMode
  ): DailyPlannerViewMode {
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
  }

  function getIconForViewMode(viewMode: DailyPlannerViewMode) {
    switch (viewMode) {
      case "both":
        return "calendar-minus";
      case "calendar":
        return "calendar-import";
      case "list":
        return "calendar-export";
    }
  }

  const changeViewModeButton: JSX.Element = useMemo(
    () => (
      <Button
        onPress={() => setViewMode((prev) => getNextViewMode(prev))}
        variant="outlined"
      >
        <ExpoIcon
          iconSet="MaterialCommunityIcons"
          name={getIconForViewMode(getNextViewMode(viewMode))}
          size={24}
          color="color"
        />
      </Button>
    ),
    [viewMode]
  );

  return { viewMode, changeViewModeButton, setViewMode };
};

export const useHeightByViewMode = (
  viewMode: DailyPlannerViewMode,
  getHeight: (viewMode: DailyPlannerViewMode) => DimensionInPercent
) => {
  const height = useSharedValue(getHeight(viewMode));
  useEffect(() => {
    height.value = withTiming(getHeight(viewMode));
  }, [viewMode]);
  const style = useAnimatedStyle(() => ({
    height: height.value,
  }));

  return style;
};

export const useDimensionsByViewMode = (viewMode: DailyPlannerViewMode, layout: Layout) => {
  const {height} = layout;
  const [calendarProportion, listProportion] = getViewsProportions(viewMode);
  const listViewHeight = useSharedValue(height * listProportion);
  const calendarViewHeight = useSharedValue(height * calendarProportion);

  useEffect(() => {
    console.log(`useDimensionsByViewMode: viewMode or height changed`)
    listViewHeight.value = height * listProportion;
    calendarViewHeight.value = height * calendarProportion;
  }, [viewMode, layout.height]);

  return {
    calendarViewHeight,
    listViewHeight
  }
} 

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