import dayjs from "dayjs";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect } from "react";
import { Button, SizableText } from "tamagui";
import {
  DAY_FORMAT,
  DAY_LONG_READ_FORMAT,
  DAY_SHORT_READ_FORMAT,
} from "../../../config/constants";
import { ExpoIcon } from "../../../src/core/components/ExpoIcon";
import { DatePickerStackHeader } from "../../../src/core/navigation/Header";
import { useDailyPlannerViewMode } from "../../../src/features/dailyPlanner/logic/UseDailyPlannerViewMode";
import { DailyPlannerScreen } from "../../../src/features/dailyPlanner/screens/DailyPlannerScreen";

//TODO: screen transition animations https://reactnavigation.org/docs/stack-navigator/#animation-related-options
//TODO: handle swipe left and right
//TODO: always preload next and previous day screen in background
export default function DailyPlanner() {
  const { day } = useLocalSearchParams<{ day: string }>();
  const isDateValid = day && dayjs(day, DAY_FORMAT).isValid();
  const navigation = useNavigation();
  const router = useRouter();
  const { changeViewModeButton, viewMode, setViewMode } =
    useDailyPlannerViewMode();

  useEffect(() => {
    if (!isDateValid) return;
    const selectedDay = dayjs(day, DAY_FORMAT);
    const nextDay = selectedDay.add(1, "day").format(DAY_FORMAT);
    const previousDay = selectedDay.subtract(1, "day").format(DAY_FORMAT);
    const isCurrentYear: boolean = selectedDay.year() === dayjs().year();
    const title = selectedDay.format(
      isCurrentYear ? DAY_SHORT_READ_FORMAT : DAY_LONG_READ_FORMAT
    );
    navigation.setOptions({
      headerShown: true,
      title,
      header: () => (
        <DatePickerStackHeader
          title={title}
          initialDay={day}
          onOpen={() => {
            setViewMode("list");
          }}
          onClose={() => {
            setViewMode("both");
          }}
          onDayPress={(newDay) => {
            router.replace({
              pathname: "/(tabs)/dailyPlanner/[day]",
              params: { day: newDay },
            });
          }}
          headerLeft={() => (
            <>
              <Button
                marginLeft={4}
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
                  name="chevron-left"
                  size={24}
                  color="color"
                />
              </Button>
              {changeViewModeButton}
            </>
          )}
          headerRight={() => (
            <Button
              marginRight={4}
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
                name="chevron-right"
                size={24}
                color="color"
              />
            </Button>
          )}
        />
      ),
    });
  }, [day, changeViewModeButton]);

  if (!isDateValid) {
    return <SizableText>{`day not valid, ${day}`}</SizableText>;
  }
  return <DailyPlannerScreen day={day} viewMode={viewMode} />;
}
