import dayjs from "dayjs";
import React, { useCallback, useState } from "react";
import Animated, {
  useSharedValue,
  useAnimatedReaction,
  withTiming,
  useAnimatedProps,
} from "react-native-reanimated";
import { SizableText, Button, YStack } from "tamagui";
import { DAY_FORMAT, DAY_LONG_READ_FORMAT } from "../../../../config/constants";
import { ExpoIcon } from "../ExpoIcon";
import { DatePicker } from "../calendar/DatePicker";
import { UseUpdateTaskReturnType } from "./TaskForm";

const AnimatedYStack = Animated.createAnimatedComponent(YStack);

interface SelectDayProps {
  taskId: string;
  day?: string;
  updateTask: UseUpdateTaskReturnType;
}

export const SelectDay = ({ day, updateTask, taskId: id }: SelectDayProps) => {
  const updateDay = useCallback(
    (day: string) => updateTask.mutate({ id, data: { startDay: day } }),
    [updateTask, id]
  );
  const [dayPickerOpen, setDayPickerOpen] = useState(false);
  const dayPickerHeightMin = 45;
  const dayPickerHeightMax = 330 + dayPickerHeightMin;
  const dayPickerHeight = useSharedValue(dayPickerHeightMin);

  useAnimatedReaction(
    () => dayPickerOpen,
    (current, prev) => {
      if (current) {
        dayPickerHeight.value = withTiming(dayPickerHeightMax);
      } else {
        dayPickerHeight.value = withTiming(dayPickerHeightMin);
      }
    }
  );

  const onChangeDayPress = useCallback(() => {
    setDayPickerOpen((prev) => !prev);
  }, [setDayPickerOpen]);

  const dayYStackProps = useAnimatedProps(() => ({
    height: dayPickerHeight.value,
  }));
  return (
    <AnimatedYStack animatedProps={dayYStackProps} overflow={"hidden"}>
      <Button onPress={onChangeDayPress}>
        <ExpoIcon iconSet="MaterialIcons" name="today" size={24} />
        <SizableText>
          {day
            ? `Day: ${dayjs(day, DAY_FORMAT).format(DAY_LONG_READ_FORMAT)}`
            : `Set planned day`}
        </SizableText>
      </Button>
      <DatePicker
        onDayPress={(newDay) => {
          setDayPickerOpen(false);
          updateDay(newDay);
        }}
        initialDay={day ?? dayjs().format(DAY_FORMAT)}
      />
    </AnimatedYStack>
  );
};
