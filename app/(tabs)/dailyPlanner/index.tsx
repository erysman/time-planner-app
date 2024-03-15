import dayjs from "dayjs";
import { DAY_FORMAT } from "../../../config/constants";
export default function DailyPlannerIndex({navigation}) {
  // const nav = useNavigation()
  const today = dayjs().format(DAY_FORMAT);
  navigation.navigate(`${today}`, {day: today})
  return (
    null
    // <Redirect
    //   href={{
    //     pathname: `/(tabs)/dailyPlanner/${today}`,
    //     // params: { day: today },
    //   }}
    // />
  );
}
