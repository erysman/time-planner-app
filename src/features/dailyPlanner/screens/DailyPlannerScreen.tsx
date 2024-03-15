import dayjs from "dayjs";
import { ErrorBoundary } from "react-error-boundary";
import { SafeAreaView } from "react-native-safe-area-context";
import { SizableText, YStack } from "tamagui";
import { DAY_FORMAT } from "../../../../config/constants";
import { GenericFallback } from "../../../core/components/fallback/GenericFallback";
import { DatePickerTabHeader } from "../../../core/navigation/Header";
import { DraggableCalendarList } from "../components/draggableCalendarList/DraggableCalendarList";
import { CalendarListDataProvider } from "../logic/UseCalendarListContext";

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
          <CalendarListDataProvider>
            <DraggableCalendarList
              day={day}
            />
          </CalendarListDataProvider>
        </ErrorBoundary>
      </YStack>
    </SafeAreaView>
  );
}
