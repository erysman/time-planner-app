import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import React, { useState } from "react";
import { Button, SizableText } from "tamagui";
import { DEFAULT_CALENDAR_STEP_MINUTES, TIME_FORMAT } from "../../../../../config/constants";
import { mapToDayjs } from "../../../utils";
import { ExpoIcon } from "../../ExpoIcon";
import { useScreenDimensions } from "../../../logic/dimensions/UseScreenDimensions";
import i18n from "../../../../../config/i18n";

interface SelectStartTimeProps {
  startTime?: string;
  updateStartTime: (startTime: string) => void;
  validateStartTime: (startTime: string) => boolean;
  isStartTimeValid: boolean;
  errorMessage?: string;
}

export const SelectStartTime = ({
  updateStartTime,
  startTime,
  isStartTimeValid,
  validateStartTime,
  errorMessage,
}: SelectStartTimeProps) => {
  const { screenWidth } = useScreenDimensions();
  const [startTimePickerOpen, setStartTimePickerOpen] = useState(false);
  const setStartTime = (event: DateTimePickerEvent, date?: Date) => {
    setStartTimePickerOpen(false);
    const { type } = event;
    if (type !== "set") return;
    const time = dayjs(date).format(TIME_FORMAT);
    if (!validateStartTime(time)) return;
    updateStartTime(time);
  };
  return (
    <>
      <Button
        justifyContent="flex-start"
        // width={0.5 * screenWidth}
        onPress={() => {
          setStartTimePickerOpen(true);
        }}
        borderWidth={!isStartTimeValid ? 1 : 0}
        borderColor={!isStartTimeValid ? "$red9" : "$borderColor"}
      >
        <ExpoIcon iconSet="MaterialIcons" name="access-time" size={24} />
        <SizableText>
          {startTime ? `${i18n.t("task.start_time_title")}: ${startTime}` : i18n.t("task.set_start_time")}
        </SizableText>
      </Button>
      {startTimePickerOpen ? (
        <DateTimePicker
          mode="time"
          value={
            startTime ? mapToDayjs(undefined, startTime).toDate() : dayjs().add(1, 'hour').startOf('hour').toDate()
          }
          minuteInterval={DEFAULT_CALENDAR_STEP_MINUTES}
          onChange={setStartTime}
        />
      ) : null}
      {errorMessage ? (
        <SizableText color={"$red9"}>{errorMessage}</SizableText>
      ) : null}
    </>
  );
};
