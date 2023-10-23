import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import {
  DailyPlannerScreen,
} from "../../../src/features/dailyPlanner/DailyPlannerScreen";
import dayjs from "dayjs";
import { useEffect } from "react";
import { Button, SizableText } from "tamagui";
import { ExpoIcon } from "../../../src/core/components/ExpoIcon";
import { DAY_FORMAT } from "../../../config/constants";


//TODO: screen transition animations https://reactnavigation.org/docs/stack-navigator/#animation-related-options
//TODO: always preload next and previous day screen in background
export default function DailyPlanner() {
  const { day } = useLocalSearchParams<{ day: string }>();
  const isDateValid = day && dayjs(day, DAY_FORMAT).isValid();
  const navigation = useNavigation();
  const router = useRouter();
  useEffect(() => {
    if (!isDateValid) return;
    const nextDay = dayjs(day, DAY_FORMAT).add(1, "day").format(DAY_FORMAT);
    const previousDay = dayjs(day, DAY_FORMAT).subtract(1, "day").format(DAY_FORMAT);
    const title =  day; //TODO: if year is the same, title should be just day & month, otherwise day & month & year
    navigation.setOptions({
      headerShown: true,
      title,
      headerLeft: () => (
        <Button
          onPress={() =>
            router.replace({
              pathname: "/(tabs)/dailyPlanner/[day]",
              params: { day: previousDay },
            })
          }
          variant="outlined"
        >
          <ExpoIcon iconSet="MaterialIcons" name="keyboard-arrow-left" size={24} color="color" /> 
        </Button>
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
          <ExpoIcon iconSet="MaterialIcons" name="keyboard-arrow-right" size={24} color="color" /> 
        </Button>
        
      ),
    });
  }, [day]);

  if (!isDateValid) {
    return <SizableText>{`day not valid, ${day}`}</SizableText>;
  }
  return <DailyPlannerScreen day={day} />;
}
