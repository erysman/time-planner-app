import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import React, { useMemo, useState } from "react";
import { Button, SizableText } from "tamagui";
import { minutesToShortTime } from "../../utils";
import { ExpoIcon } from "../ExpoIcon";

interface SelectDurationMinProps {
  durationMin?: number;
  updateDuration: (durationMin: number) => void;
}

export const SelectDurationMin = ({
  updateDuration,
  durationMin,
}: SelectDurationMinProps) => {
  

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
    updateDuration(durationMin);
  };
  return (
    <>
      <Button
        onPress={() => {
          setDurationPickerOpen(true);
        }}
      >
        <ExpoIcon iconSet="MaterialIcons" name="access-time" size={24} />
        <SizableText>
          {durationMin
            ? `Duration: ${minutesToShortTime(durationMin)}`
            : `Set duration`}
        </SizableText>
      </Button>
      {durationPickerOpen ? (
        <DateTimePicker
          mode="time"
          is24Hour
          value={initialDurationMin}
          onChange={setDurationTime}
        />
      ) : null}
    </>
  );
};
