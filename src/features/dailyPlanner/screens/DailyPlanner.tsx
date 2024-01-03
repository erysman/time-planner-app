import dayjs from "dayjs";
import { SizableText, YStack } from "tamagui";
import {
  DAY_FORMAT
} from "../../../../config/constants";
import { DatePickerTabHeader } from "../../../core/navigation/Header";
import { DailyPlannerScreen } from "./DailyPlannerScreen";

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
