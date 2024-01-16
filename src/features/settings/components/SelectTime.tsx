import { useMemo, useState } from "react";
import { useScreenDimensions } from "../../../core/logic/dimensions/UseScreenDimensions";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Button, SizableText } from "tamagui";
import { TIME_FORMAT } from "../../../../config/constants";
import dayjs, { Dayjs } from "dayjs";
import { ExpoIcon } from "../../../core/components/ExpoIcon";
import { mapToDayjs } from "../../../core/utils";

interface SelectTimeProps {
  startTime?: Dayjs;
  endTime?: Dayjs;
  timeType: "start" | "end";
  updateTime: (time: Dayjs) => void;
  validateTime: (startTime?: Dayjs, endTime?: Dayjs) => boolean;
}

export const SelectTime = ({
  updateTime,
  startTime,
  endTime,
  validateTime,
  timeType,
}: SelectTimeProps) => {
  const time = useMemo(
    () => (timeType === "start" ? startTime : endTime),
    [timeType, startTime, endTime]
  );
  const { screenWidth } = useScreenDimensions();
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const setTime = (event: DateTimePickerEvent, date?: Date) => {
    setTimePickerOpen(false);
    const { type } = event;
    if (type !== "set") return;
    const newTime = dayjs(date);
    if (
      !validateTime(
        timeType === "start" ? newTime : startTime,
        timeType === "end" ? newTime : endTime
      )
    ) {
      return;
    }
    updateTime(newTime);
  };
  const initTime = useMemo(
    () =>
      time ? time.toDate() : dayjs().add(1, "hour").startOf("hour").toDate(),
    [time]
  );
  return (
    <>
      <Button
        justifyContent="flex-start"
        variant="outlined"
        paddingHorizontal={8}
        onPress={() => {
          setTimePickerOpen(true);
        }}
        // borderWidth={!isTimeValid ? 1 : 0}
        // borderColor={!isTimeValid ? "$red9" : "$borderColor"}
      >
        <SizableText>
          {time ? `${time.format(TIME_FORMAT)}` : `${timeType} time`}
        </SizableText>
      </Button>
      {timePickerOpen ? (
        <DateTimePicker mode="time" value={initTime} onChange={setTime} />
      ) : null}
    </>
  );
};
