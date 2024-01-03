import { getHeaderTitle } from "@react-navigation/elements";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import React, { useCallback, useMemo, useState } from "react";
import Animated, {
  Layout,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, SizableText, XStack, YStack, useTheme } from "tamagui";
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
      height={headerHeight-topInset}
      alignItems={"center"}
      justifyContent={"center"}
      borderBottomWidth={1}
      borderColor={"$backgroundFocus"}
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
  const datePickerHeight = 330 + headerHeight;

  const [open, setOpen] = useState(false);
  const height = useSharedValue(headerHeight);
  const theme = useTheme()
  const backgroundFocus = theme.backgroundFocus.get()

  return (
    <Animated.View
      style={[
        {
          height: headerHeight,
          overflow: "hidden",
          display: "flex",
          borderBottomWidth: 1,
          borderColor: backgroundFocus
        },
        { height },
      ]}
    >
      <XStack
        backgroundColor={"$background"}
        mt={topInset}
        alignItems={"flex-start"}
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
                  height.value = withTiming(headerHeight);
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
      <DatePicker onDayPress={onDayPress} initialDay={initialDay} />
    </Animated.View>
  );
};

export const DatePickerTabHeader = (props: { day: string }) => {
  const { day } = props;
  const { viewModeProperties } = useDailyPlannerContext();
  const navigation = useNavigation();
  const { stack } = useScheduleDayTasks(day);
  const { setViewMode } = viewModeProperties;
  const title = useMemo(() => {
    const selectedDay = dayjs(day, DAY_FORMAT);
    const isCurrentYear: boolean = selectedDay.year() === dayjs().year();
    return selectedDay.format(
      isCurrentYear ? DAY_SHORT_READ_FORMAT : DAY_LONG_READ_FORMAT
    );
  }, [day]);
  const onDayPress = useCallback(
    (newDay: string) => {
      navigation.navigate(`${newDay}`, { day: newDay });
    },
    [navigation]
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
      onDayPress={onDayPress}
      headerLeft={() => <>{viewModeProperties.changeViewModeButton}</>}
      headerRight={() => <>{stack}</>}
    />
  );
};
