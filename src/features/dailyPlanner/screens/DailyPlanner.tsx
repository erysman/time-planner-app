import dayjs from "dayjs";
import { useCallback, useEffect } from "react";
import { Button, SizableText } from "tamagui";
import {
  DAY_FORMAT,
  DAY_SHORT_READ_FORMAT,
  DAY_LONG_READ_FORMAT,
} from "../../../../config/constants";
import { ExpoIcon } from "../../../core/components/ExpoIcon";
import { DatePickerStackHeader } from "../../../core/navigation/Header";
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
  // const { day } = useLocalSearchParams<{ day: string }>();
  // const state = useNavigationState(state => state);
  const { viewModeProperties, setSelectedDay } = useDailyPlannerContext();
  // const isFocused = useIsFocused();
  const day = route.name;
  // useEffect(() => {
  //     if(!isFocused) return;
  //     console.log("selected day:", day)
  //     setSelectedDay(day);

  // }, [isFocused])
  const state = useNavigationState((state) => state);
  useEffect(() => {
    const routeName = state.routeNames[state.index];
    if (routeName !== day) return;
    console.log("selected day:", routeName);
    setSelectedDay(routeName);
  }, [state.index]);

//   useFocusEffect(
//     useCallback(() => {
//         console.log("useFocusEffect day:", day);
//     }, [])
//   );

//   useEffect(() => {
//     const unsubscribe = navigation.addListener('transitionStart', () => {
//       console.log("focus ", day )
//     });

//     return unsubscribe;
//   }, [navigation]);

  const isDateValid = day && dayjs(day, DAY_FORMAT).isValid();
  if (!viewModeProperties) return null;
  const { changeViewModeButton, viewMode, setViewMode } = viewModeProperties;

  if (!isDateValid) {
    return <SizableText>{`day not valid, ${day}`}</SizableText>;
  }
  return <DailyPlannerScreen day={day} viewMode={viewMode} />;
}
