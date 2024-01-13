import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import React, { useState } from "react";
import { Button, SizableText } from "tamagui";
import { TIME_FORMAT } from "../../../../config/constants";
import { mapToDayjs } from "../../utils";
import { ExpoIcon } from "../ExpoIcon";

interface SelectStartTimeProps {
  startTime?: string;
  updateStartTime: (startTime: string) => void;
}

export const SelectStartTime = ({
  updateStartTime,
  startTime,
}: SelectStartTimeProps) => {
  const [startTimePickerOpen, setStartTimePickerOpen] = useState(false);
  const setStartTime = (event: DateTimePickerEvent, date?: Date) => {
    setStartTimePickerOpen(false);
    const { type } = event;
    if (type !== "set") return;
    const time = dayjs(date).format(TIME_FORMAT);
    updateStartTime(time);
  };
  return (
    <>
      <Button
        onPress={() => {
          setStartTimePickerOpen(true);
        }}
      >
        <ExpoIcon iconSet="MaterialIcons" name="access-time" size={24} />
        <SizableText>
          {startTime ? `Start time: ${startTime}` : `Set start time`}
        </SizableText>
      </Button>
      {startTimePickerOpen ? (
        <DateTimePicker
          mode="time"
          value={
            startTime ? mapToDayjs(undefined, startTime).toDate() : new Date()
          }
          onChange={setStartTime}
        />
      ) : null}
    </>
  );
};
