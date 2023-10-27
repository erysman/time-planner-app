import { useEffect, useMemo, useState } from "react";
import { Button } from "tamagui";
import { ExpoIcon } from "../../../core/components/ExpoIcon";
import { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { DimensionValue } from "react-native";
import { DimensionInPercent } from "../../../core/model/types";

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
        onPress={() => {
          setViewMode((prev) => {
            console.log(`set new view mode, from ${prev} to ${getNextViewMode(prev)}`)
            return getNextViewMode(prev)});
        }}
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

  return { viewMode, changeViewModeButton };
};

export const useHeightByViewMode = (viewMode: DailyPlannerViewMode, getHeight: (viewMode: DailyPlannerViewMode) => DimensionInPercent) => {
  const height = useSharedValue(getHeight(viewMode));
  useEffect(() => {
    height.value = withTiming(getHeight(viewMode))
  }, [viewMode])
  const style = useAnimatedStyle(() => ({
    height: height.value
  }))

  return style;
}