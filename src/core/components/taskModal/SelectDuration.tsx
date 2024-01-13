import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import React, { useCallback, useMemo, useState } from "react";
import { SizableText, Button } from "tamagui";
import { minutesToShortTime } from "../../utils";
import { ExpoIcon } from "../ExpoIcon";
import { UseUpdateTaskReturnType } from "./TaskForm";

interface SelectDurationMinProps {
  taskId: string;
  durationMin?: number;
  updateTask: UseUpdateTaskReturnType;
}

export const SelectDurationMin = ({
  taskId: id,
  updateTask,
  durationMin,
}: SelectDurationMinProps) => {
  const updateDuration = useCallback(
    (durationMin: number) => updateTask.mutate({ id, data: { durationMin } }),
    [updateTask, id]
  );

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
