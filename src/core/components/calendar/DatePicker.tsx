import React, { useCallback, useMemo, useRef, useState } from "react";
import { Calendar, CalendarUtils } from "react-native-calendars";
import { Button, SizableText, Stack, XStack, useTheme } from "tamagui";
import { ExpoIcon } from "../ExpoIcon";
import { DAY_FORMAT, MONTH_READ_FORMAT } from "../../../../config/constants";
import dayjs from "dayjs";

export interface DatePickerProps {
  onDayPress: (day: string) => void;
  initialDay: string;
}

export const DatePicker = ({ onDayPress, initialDay }: DatePickerProps) => {
  const theme = useTheme();
  const backgroundColor = theme.background.val;
  const selectedDayBackgroundColor = theme.backgroundFocus.val;
  const color = theme.color.val;

  const [currentMonth, setCurrentMonth] = useState(initialDay);
  const customHeaderProps: any = useRef();

  const setCustomHeaderNewMonth = (next = false) => {
    const add = next ? 1 : -1;
    const month = new Date(customHeaderProps?.current?.month);
    const newMonth = new Date(month.setMonth(month.getMonth() + add));
    customHeaderProps?.current?.addMonth(add);
    setCurrentMonth(newMonth.toISOString().split("T")[0]);
  };
  const moveNext = () => {
    setCustomHeaderNewMonth(true);
  };
  const movePrevious = () => {
    setCustomHeaderNewMonth(false);
  };
  const CustomHeader = useMemo(() => React.forwardRef((props: any, ref) => {
    customHeaderProps.current = props;
    return (
      <XStack alignItems="center" justifyContent="space-between">
        <Button variant="outlined" onPress={movePrevious}>
          <ExpoIcon
            iconSet="MaterialCommunityIcons"
            name={"chevron-double-left"}
            size={24}
            color="color"
          />
        </Button>
        <SizableText size="$5">
          {dayjs(props.month, DAY_FORMAT).format(MONTH_READ_FORMAT)}
        </SizableText>
        <Button variant="outlined" onPress={moveNext}>
          <ExpoIcon
            iconSet="MaterialCommunityIcons"
            name={"chevron-double-right"}
            size={24}
            color="color"
          />
        </Button>
      </XStack>
    );
  }), [])

  return (
    <Stack>
      <Calendar
        theme={{
          textDayHeaderFontFamily: "Inter",
          textDayFontFamily: "Inter",
          todayButtonFontFamily: "Inter",
          calendarBackground: backgroundColor,
          todayTextColor: "red",
          selectedDayBackgroundColor: selectedDayBackgroundColor,
        }}
        customHeader={CustomHeader}
        hideArrows
        markedDates={{
          [initialDay]: {
            selected: true,
            selectedColor: selectedDayBackgroundColor,
            selectedTextColor: color,
            disableTouchEvent: true,
          },
        }}
        enableSwipeMonths
        current={initialDay}
        firstDay={1}
        onDayPress={(date) => onDayPress(date.dateString)}
      />
    </Stack>
  );
};
