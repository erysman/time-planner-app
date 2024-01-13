import dayjs from "dayjs";
import { SafeAreaView } from "react-native-safe-area-context";
import { SizableText, YStack } from "tamagui";
import { DAY_FORMAT } from "../../../../config/constants";
import { DatePickerTabHeader } from "../../../core/navigation/Header";
import { DailyPlannerLoad } from "./DailyPlannerLoad";
import { ErrorBoundary } from "react-error-boundary";
import { GenericFallback } from "../../../core/components/fallbacks/GenericFallback";

export default function DailyPlannerScreen({ route, navigation }) {
  const day = route.name;
  const isDateValid = day && dayjs(day, DAY_FORMAT).isValid();

  if (!isDateValid) {
    return <SizableText>{`day not valid, ${day}`}</SizableText>;
  }
  return (
    <SafeAreaView>
      <YStack>
        <DatePickerTabHeader day={day} />
        <ErrorBoundary FallbackComponent={GenericFallback}>
          <DailyPlannerLoad day={day} />
        </ErrorBoundary>
      </YStack>
    </SafeAreaView>
  );
}
