import { getHeaderTitle } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import dayjs from "dayjs";
import React, { useCallback, useMemo, useState } from "react";
import Animated, {
  useAnimatedReaction,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Button, SizableText, XStack, useTheme } from "tamagui";
import {
  DAY_FORMAT,
  DAY_LONG_READ_FORMAT,
  DAY_SHORT_READ_FORMAT,
} from "../../../config/constants";
import { useDailyPlannerContext } from "../../features/dailyPlanner/logic/UseDailyPlannerContext";
import { useScheduleDayTasks } from "../../features/dailyPlanner/logic/UseScheduleDay";
import { DatePicker } from "../components/calendar/DatePicker";
import { useScreenDimensions } from "../dimensions/UseScreenDimensions";
import { SafeAreaView } from "react-native-safe-area-context";
import { ExpoIcon } from "../components/ExpoIcon";

export interface IStackHeaderProps extends NativeStackHeaderProps {
  headerLeft: () => JSX.Element;
  headerRight: () => JSX.Element;
}

// export const StackHeader = ({
//   options,
//   route,
//   headerLeft,
//   headerRight,
//   navigation,
// }: IStackHeaderProps) => {
//   const headerTitle = getHeaderTitle(options, route.name);
//   return (
//     <Header
//       title={headerTitle}
//       headerLeft={headerLeft}
//       headerRight={headerRight}
//     />
//   );
// };

export interface IHeaderProps {
  title: JSX.Element | string;
  headerLeft?: () => JSX.Element;
  headerRight?: () => JSX.Element;
}

export const Header = (props: {
  navigation;
  route;
  options;
  back?: any;
  headerLeft?: any;
  headerRight?: any;
}) => {
  const { navigation, route, options, back, headerLeft, headerRight } = props;
  const title = getHeaderTitle(options, route.name);
  const { topInset, headerHeight, headerTotalHeight } = useScreenDimensions();

  return (
    <SafeAreaView>
      <XStack
        width={"100%"}
        backgroundColor={"$background"}
        height={headerHeight}
        alignItems={"center"}
        justifyContent={"center"}
        borderBottomWidth={1}
        borderColor={"$backgroundFocus"}
      >
        <XStack flexGrow={1} flexShrink={1} height={headerHeight} alignItems="center">
        <ExpoIcon
              iconSet="MaterialIcons"
              name="arrow-back"
              color="color"
              size={24}
            />
          <Button variant="outlined" size={24}>
            <ExpoIcon
              iconSet="MaterialIcons"
              name="arrow-back"
              color="color"
              size={24}
            />
          </Button>
          {headerLeft && headerLeft()}
        </XStack>
        <XStack flexGrow={1} justifyContent="flex-end">
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
    </SafeAreaView>
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
  const theme = useTheme();
  const backgroundFocus = theme.backgroundFocus.get();

  useAnimatedReaction(
    () => open,
    (current, prev) => {
      if (current) {
        height.value = withTiming(datePickerHeight);
      } else {
        height.value = withTiming(headerHeight);
      }
    }
  );

  const onChangeDayPress = useCallback(() => {
    setOpen((prev) => {
      if (prev) {
        onClose();
      } else {
        onOpen();
      }
      return !prev;
    });
  }, []);

  return (
    <Animated.View
      style={[
        {
          height: headerHeight,
          overflow: "hidden",
          display: "flex",
          borderBottomWidth: 1,
          borderColor: backgroundFocus,
        },
        { height },
      ]}
    >
      <XStack
        backgroundColor={"$background"}
        height={headerHeight}
        alignItems={"center"}
      >
        <XStack flexGrow={1} flexShrink={1}>
          {headerLeft && headerLeft()}
        </XStack>
        <XStack flexGrow={1} justifyContent="flex-end">
          <Button variant="outlined" onPress={onChangeDayPress}>
            <SizableText size="$6" textAlign={"center"}>
              {title}
            </SizableText>
          </Button>
        </XStack>
        <XStack flexGrow={1} flexShrink={1} justifyContent="flex-end">
          {headerRight && headerRight()}
        </XStack>
      </XStack>
      <DatePicker
        onDayPress={(day) => {
          setOpen(false);
          onClose();
          onDayPress(day);
        }}
        initialDay={initialDay}
      />
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
