import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import {
  DailyPlannerScreen,
} from "../../../src/features/dailyPlanner/screens/DailyPlannerScreen";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { Button, SizableText } from "tamagui";
import { ExpoIcon } from "../../../src/core/components/ExpoIcon";
import { DAY_FORMAT } from "../../../config/constants";
import { useDailyPlannerViewMode } from "../../../src/features/dailyPlanner/logic/UseDailyPlannerViewMode";

//TODO: screen transition animations https://reactnavigation.org/docs/stack-navigator/#animation-related-options
//TODO: handle swipe left and right
//TODO: always preload next and previous day screen in background
export default function DailyPlanner() {
  const { day } = useLocalSearchParams<{ day: string }>();
  const isDateValid = day && dayjs(day, DAY_FORMAT).isValid();
  const navigation = useNavigation();
  const router = useRouter();
  const {changeViewModeButton, viewMode} = useDailyPlannerViewMode();
  console.log(`${day} render viewMode: ${viewMode}`)

  useEffect(() => {
    if (!isDateValid) return;
    console.log(`${day} useEffect viewMode: ${viewMode}`)
    const nextDay = dayjs(day, DAY_FORMAT).add(1, "day").format(DAY_FORMAT);
    const previousDay = dayjs(day, DAY_FORMAT)
      .subtract(1, "day")
      .format(DAY_FORMAT);
    const title = day; //TODO: if year is the same, title should be just day & month, otherwise day & month & year
    navigation.setOptions({
      headerShown: true,
      title,
      headerLeft: () => (
        <>
          <Button
            onPress={() =>
              router.replace({
                pathname: "/(tabs)/dailyPlanner/[day]",
                params: { day: previousDay },
              })
            }
            variant="outlined"
          >
            <ExpoIcon
              iconSet="MaterialIcons"
              name="keyboard-arrow-left"
              size={24}
              color="color"
            />
          </Button>
          {changeViewModeButton}
        </>
      ),
      headerRight: () => (
        <Button
          onPress={() =>
            router.replace({
              pathname: "/(tabs)/dailyPlanner/[day]",
              params: { day: nextDay },
            })
          }
          variant="outlined"
        >
          <ExpoIcon
            iconSet="MaterialIcons"
            name="keyboard-arrow-right"
            size={24}
            color="color"
          />
        </Button>
      ),
    });
  }, [day, changeViewModeButton]);

  if (!isDateValid) {
    return <SizableText>{`day not valid, ${day}`}</SizableText>;
  }
  return <DailyPlannerScreen day={day} viewMode={viewMode} />;
}
