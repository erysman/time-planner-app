import dayjs from "dayjs";
import { useCallback, useEffect } from "react";
import { Button, SizableText, Stack, YStack } from "tamagui";
import {
  DAY_FORMAT,
  DAY_SHORT_READ_FORMAT,
  DAY_LONG_READ_FORMAT,
} from "../../../../config/constants";
import { ExpoIcon } from "../../../core/components/ExpoIcon";
import { DatePickerStackHeader, DatePickerTabHeader } from "../../../core/navigation/Header";
import { useDailyPlannerViewMode } from "../logic/UseDailyPlannerViewMode";
import { DailyPlannerScreen } from "./DailyPlannerScreen";
import {
  getFocusedRouteNameFromRoute,
  useFocusEffect,
  useIsFocused,
  useNavigationState,
  useRoute,
} from "@react-navigation/native";
import { useDailyPlannerContext } from "../logic/UseDailyPlannerContext";

export default function DailyPlanner({ route, navigation }) {
  const day = route.name;
  const isDateValid = day && dayjs(day, DAY_FORMAT).isValid();

  if (!isDateValid) {
    return <SizableText>{`day not valid, ${day}`}</SizableText>;
  }
  return (
    <YStack h={100}>
      <DatePickerTabHeader day={day}/>
      <DailyPlannerScreen day={day}/>
    </YStack>
  );
}
