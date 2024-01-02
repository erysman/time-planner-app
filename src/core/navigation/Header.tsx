import { getHeaderTitle } from "@react-navigation/elements";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import Animated, {
  Layout,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, SizableText, XStack, YStack } from "tamagui";
import { DatePicker } from "../components/calendar/DatePicker";
import { transform } from "@babel/core";
import { useScreenDimensions } from "../dimensions/UseScreenDimensions";
import dayjs from "dayjs";
import day from "react-native-calendars/src/calendar/day";
import {
  DAY_FORMAT,
  DAY_SHORT_READ_FORMAT,
  DAY_LONG_READ_FORMAT,
} from "../../../config/constants";
import { useDailyPlannerContext } from "../../features/dailyPlanner/logic/UseDailyPlannerContext";
import { ExpoIcon } from "../components/ExpoIcon";
import {
  ParamListBase,
  RouteProp,
  useNavigation,
} from "@react-navigation/native";
import { useScheduleDayTasks } from "../../features/dailyPlanner/logic/UseScheduleDay";

export interface IStackHeaderProps extends NativeStackHeaderProps {
  headerLeft: () => JSX.Element;
  headerRight: () => JSX.Element;
}

export const StackHeader = ({
  options,
  route,
  headerLeft,
  headerRight,
  navigation,
}: IStackHeaderProps) => {
  const headerTitle = getHeaderTitle(options, route.name);
  return (
    <Header
      title={headerTitle}
      headerLeft={headerLeft}
      headerRight={headerRight}
    />
  );
};

export interface IHeaderProps {
  title: JSX.Element | string;
  headerLeft?: () => JSX.Element;
  headerRight?: () => JSX.Element;
}

export const Header = ({ title, headerLeft, headerRight }: IHeaderProps) => {
  const { topInset, headerHeight, headerTotalHeight } = useScreenDimensions();

  return (
    <XStack
      width={"100%"}
      backgroundColor={"$background"}
      mt={topInset}
      height={headerHeight}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <XStack flexGrow={1} flexShrink={1}>
        {headerLeft && headerLeft()}
      </XStack>
      <XStack flexGrow={1}>
        {typeof title === "string" ? (
          <SizableText size="$6" flexGrow={1} textAlign={"center"}>
            {title}
          </SizableText>
        ) : (
          title
        )}
      </XStack>
      <XStack flexGrow={1} flexShrink={1} justifyContent="flex-end">
        {headerRight && headerRight()}
      </XStack>
    </XStack>
  );
};

export interface DatePickerStackHeaderProps extends IHeaderProps {
  onDayPress: (day: string) => void;
  onOpen: () => void;
  onClose: () => void;
  initialDay: string;
}

export const DatePickerStackHeader = ({
  title,
  headerLeft,
  headerRight,
  onDayPress,
  onOpen,
  onClose,
  initialDay,
}: DatePickerStackHeaderProps) => {
  const { topInset, headerHeight, headerTotalHeight } = useScreenDimensions();
  const datePickerHeight = 330;

  const [open, setOpen] = useState(false);
  const height = useSharedValue(0);

  return (
    <YStack>
      <XStack
        width={"100%"}
        backgroundColor={"$background"}
        mt={topInset}
        height={headerHeight}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <XStack flexGrow={1} flexShrink={1}>
          {headerLeft && headerLeft()}
        </XStack>
        <XStack flexGrow={1} justifyContent="flex-end">
          <Button
            variant="outlined"
            onPress={() => {
              setOpen((prev) => {
                if (prev) {
                  onClose();
                  height.value = withTiming(0);
                } else {
                  onOpen();
                  height.value = withTiming(datePickerHeight);
                }
                return !prev;
              });
            }}
          >
            <SizableText size="$6" textAlign={"center"}>
              {title}
            </SizableText>
          </Button>
        </XStack>
        <XStack flexGrow={1} flexShrink={1} justifyContent="flex-end">
          {headerRight && headerRight()}
        </XStack>
      </XStack>

      <Animated.View style={[{ height: 0, overflow: "hidden" }, { height }]}>
        <DatePicker onDayPress={onDayPress} initialDay={initialDay} />
      </Animated.View>
    </YStack>
  );
};

export const DatePickerTabHeader = () => {
  const { selectedDay: day, viewModeProperties } = useDailyPlannerContext();
  console.log("DatePickerTabHeader", day);
  const navigation = useNavigation();
  const isDateValid = day && dayjs(day, DAY_FORMAT).isValid();
  const {stack} = useScheduleDayTasks(day)

  if (!viewModeProperties) return;
  const { setViewMode } = viewModeProperties;
  if (!isDateValid) return;
  const selectedDay = dayjs(day, DAY_FORMAT);
  const isCurrentYear: boolean = selectedDay.year() === dayjs().year();
  const title = selectedDay.format(
    isCurrentYear ? DAY_SHORT_READ_FORMAT : DAY_LONG_READ_FORMAT
  );
  return (
    <DatePickerStackHeader
      title={title}
      initialDay={day}
      onOpen={() => {
        setViewMode("list");
      }}
      onClose={() => {
        setViewMode("both");
      }}
      onDayPress={(newDay) => {
        navigation.navigate(`${newDay}`, { day: newDay });
      }}
      headerLeft={() => <>{viewModeProperties.changeViewModeButton}</>}
      headerRight={() => (
        <>
          {stack}
        </>
      )}
    />
  );
};
