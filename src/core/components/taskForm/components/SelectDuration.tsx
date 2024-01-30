import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import React, { useMemo, useState } from "react";
import { Button, SizableText } from "tamagui";
import { minutesToShortTime } from "../../../utils";
import { ExpoIcon } from "../../ExpoIcon";
import { useScreenDimensions } from "../../../logic/dimensions/UseScreenDimensions";
import { DEFAULT_CALENDAR_STEP_MINUTES } from "../../../../../config/constants";
import i18n from "../../../../../config/i18n";

interface SelectDurationMinProps {
  isDurationValid: boolean;
  durationMin?: number;
  updateDuration: (durationMin: number) => void;
  validateDuration: (durationMin: number) => boolean;
  errorMessage?: string;
}

export const SelectDurationMin = ({
  updateDuration,
  durationMin,
  isDurationValid,
  validateDuration,
  errorMessage,
}: SelectDurationMinProps) => {
  const {screenWidth} = useScreenDimensions();
  const initialDurationMin = useMemo(() => {
    if (!durationMin) return dayjs().startOf("day").add(1, "hour").toDate();
    return dayjs().startOf("day").add(durationMin, "minute").toDate();
  }, [durationMin]);

  const [durationPickerOpen, setDurationPickerOpen] = useState(false);
  const setDurationTime = (event: DateTimePickerEvent, date?: Date) => {
    setDurationPickerOpen(false);
    const { type } = event;
    if (type !== "set") return;
    const durationMin =
      (date?.getHours() ?? 0) * 60 + (date?.getMinutes() ?? 0);
    console.log(durationMin);
    if (!durationMin) return;
    if (!validateDuration(durationMin)) return;
    updateDuration(durationMin);
  };
  return (
    <>
      <Button
      justifyContent="flex-start"
      // width={0.5* screenWidth}
        onPress={() => {
          setDurationPickerOpen(true);
        }}
        borderWidth={!isDurationValid ? 1 : 0}
        borderColor={!isDurationValid ? "$red9" : "$borderColor"}
      >
        <ExpoIcon iconSet="MaterialIcons" name="timelapse" size={24} />
        <SizableText>
          {durationMin
            ? `${i18n.t("task.duration_title")}: ${minutesToShortTime(durationMin)}`
            : i18n.t("task.set_duration")}
        </SizableText>
      </Button>
      {durationPickerOpen ? (
        <DateTimePicker
          mode="time"
          is24Hour
          minuteInterval={DEFAULT_CALENDAR_STEP_MINUTES}
          value={initialDurationMin}
          onChange={setDurationTime}
        />
      ) : null}
      {errorMessage ? (
        <SizableText color={"$red9"}>{errorMessage}</SizableText>
      ) : null}
    </>
  );
};
