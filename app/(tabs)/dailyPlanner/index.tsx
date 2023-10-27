import { Redirect } from "expo-router";
import {
  DailyPlannerScreen,
} from "../../../src/features/dailyPlanner/screens/DailyPlannerScreen";
import dayjs from "dayjs";
import { DAY_FORMAT } from "../../../config/constants";
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
