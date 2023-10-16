import { Redirect } from "expo-router";
import {
  DAY_FORMAT,
  DailyPlannerScreen,
} from "../../../src/features/dailyPlanner/DailyPlannerScreen";
import dayjs from "dayjs";
export default function DailyPlannerIndex() {
  const today = dayjs().format(DAY_FORMAT);
  return (
    <Redirect
      href={{
        pathname: "/(tabs)/dailyPlanner/[day]",
        params: { day: today },
      }}
    />
  );
}
