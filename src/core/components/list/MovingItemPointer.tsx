import Animated, { SharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { Separator } from "tamagui";

export const AnimatedSeparator = Animated.createAnimatedComponent(Separator);

type MovingItemPointerProps = {
  visible: boolean;
  pointerIndex: SharedValue<number | null>;
  itemHeight: number;
};

export const MovingItemPointer = ({
  visible,
  pointerIndex,
  itemHeight,
}: MovingItemPointerProps) => {
  const separatorStyle = useAnimatedStyle(() => ({
    top: withTiming((pointerIndex.value || 0) * itemHeight, { duration: 50 }),
    display: pointerIndex.value === null ? "none" : "flex",
  }));
  if (!visible) {
    return null;
  }
  return (
    <AnimatedSeparator
      position={"absolute"}
      borderBottomWidth={2}
      width={"100%"}
      borderColor={"red"}
      style={[separatorStyle]}
      elevationAndroid={10}
    />
  );
};
