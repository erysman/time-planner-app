import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import dayjs, { Dayjs } from "dayjs";
import { useMemo } from "react";
import { useTheme } from "tamagui";
import {
  DAY_FORMAT
} from "../../../config/constants";
import DailyPlannerScreen from "../../../src/features/dailyPlanner/screens/DailyPlannerScreen";

const Tab = createMaterialTopTabNavigator();

function getAllDaysOfYearSince(initialDate: Dayjs) {
  const firstDay = dayjs(initialDate);
  const lastDayOfYear = firstDay.endOf("year");

  // Initialize an array to store the days
  const allDays = [];

  // Loop through each day of the year and add it to the array
  for (
    let day = firstDay;
    day.isBefore(lastDayOfYear);
    day = day.add(1, "day")
  ) {
    allDays.push(day.format(DAY_FORMAT)); // Format the date as "YYYY-MM-DD"
  }

  return allDays;
}

//Render daily planner for each day of current and next year. Only load current and next day in background, rest should be lazy
export default function DailyPlannerLayout() {
  const theme = useTheme();
  const today = dayjs();
  const days = useMemo(
    () => [
      // ...getAllDaysOfYearSince(today.subtract(1, "year").startOf("year")),
      ...getAllDaysOfYearSince(today.startOf("year")),
      // ...getAllDaysOfYearSince(today),
      ...getAllDaysOfYearSince(dayjs().add(1, "year").startOf("year")),
    ],
    []
  );
  const screens = useMemo(() => {
    return days.map((day) => {
      // console.log("Mounting screen", day);
      return (
        <Tab.Screen
          key={day}
          name={day}
          component={DailyPlannerScreen}
          options={{ tabBarLabel: "index", lazy: true, lazyPreloadDistance: 0 }}
        />
      );
    });
  }, [days]);

  return (
    
      <Tab.Navigator
        initialRouteName={today.format(DAY_FORMAT)}
        screenOptions={{
          tabBarStyle: {
            display: "none",
          },
          // headerTitleAlign: "center",
          // headerStyle: {
          //   backgroundColor: theme.background.get(),
          // },
          // headerShadowVisible: false,
          // headerTintColor: theme.color.get(),
        }}
      >
        {/* <Tab.Screen
        name="index"
        component={DailyPlannerIndex}
        options={{ tabBarLabel: "index" }}
      /> */}
        {screens}
      </Tab.Navigator>
    // <Stack
    //   screenOptions={{
    //     headerTitleAlign: "center",
    //     headerStyle: {
    //       backgroundColor: theme.background.get(),
    //     },
    //     headerShadowVisible: false,
    //     headerTintColor: theme.color.get(),
    //   }}
    // >
    //   <Stack.Screen
    //     name="index"
    //     options={{
    //       headerShown: false
    //     }}
    //   />
    //   <Stack.Screen
    //     name="[day]"
    //     options={{
    //       title: '',
    //       headerShown: false //this is override inside component, when proper title is set
    //     }}
    //   />
    // </Stack>
  );
}
