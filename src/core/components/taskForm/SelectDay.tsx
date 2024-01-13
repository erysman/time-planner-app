import dayjs from "dayjs";
import React, { useCallback, useState } from "react";
import Animated, {
  useAnimatedProps,
  useAnimatedReaction,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Button, SizableText, YStack } from "tamagui";
import { DAY_FORMAT, DAY_LONG_READ_FORMAT } from "../../../../config/constants";
import { ExpoIcon } from "../ExpoIcon";
import { DatePicker } from "../calendar/DatePicker";
import { useScreenDimensions } from "../../dimensions/UseScreenDimensions";

const AnimatedYStack = Animated.createAnimatedComponent(YStack);

interface SelectDayProps {
  day?: string;
  updateDay: (day: string) => void;
  isStartDayValid: boolean;
  validateStartDay: (startDay: string) => boolean;
  errorMessage?: string;
}

export const SelectDay = ({
  day,
  updateDay,
  isStartDayValid,
  validateStartDay,
  errorMessage,
}: SelectDayProps) => {
  const {screenWidth} = useScreenDimensions();
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
    <>
      <AnimatedYStack animatedProps={dayYStackProps} overflow={"hidden"}>
        <Button
        justifyContent="flex-start"
          // width={0.5* screenWidth}
          onPress={onChangeDayPress}
          borderWidth={!isStartDayValid ? 1 : 0}
          borderColor={!isStartDayValid ? "$red9" : "$borderColor"}
        >
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
            if (!validateStartDay(newDay)) return;
            updateDay(newDay);
          }}
          initialDay={day ?? dayjs().format(DAY_FORMAT)}
        />
      </AnimatedYStack>
      {errorMessage ? (
        <SizableText color={"$red9"}>{errorMessage}</SizableText>
      ) : null}
    </>
  );
};
