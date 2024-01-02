import Animated, {
  useAnimatedProps,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { XStack, SizableText } from "tamagui";
import { PriorityIcons } from "../../../../core/components/PriorityIcons";
import { Priority } from "../../../../core/model/types";
import { useAnimatedHeight } from "./CalendarTaskHeightEditHandler";

interface CalendarTaskViewProps {
  id: string;
  name: string;
  isEdited: boolean;
  onPress?: (taskId: string) => void;
  hourSlotHeight: number;
  height?: number;
  priority: Priority;
}

const AnimatedXStack = Animated.createAnimatedComponent(XStack);
const AnimatedSizableText = Animated.createAnimatedComponent(SizableText);

export const CalendarTaskView = ({
  hourSlotHeight,
  id,
  name,
  priority,
  isEdited,
  onPress,
}: CalendarTaskViewProps) => {
  const { height } = useAnimatedHeight();
  const nameProps = useAnimatedProps(() => {
    const numberOfLines = Math.max(Math.trunc((height?.value || 0) / 30), 1);
    return { numberOfLines };
  });
  const xstackProps = useAnimatedProps(() => {
    const paddingTop = interpolate(
      height?.value || 0,
      [hourSlotHeight / 2, hourSlotHeight],
      [0, 10],
      Extrapolation.CLAMP
    );
    return { paddingTop };
  });

  return (
    <AnimatedXStack
      zIndex={100}
      borderColor={isEdited ? "$blue8" : "$borderColor"}
      borderWidth={isEdited ? 2 : 0}
      backgroundColor={"$background"}
      borderRadius={"$4"}
      height={"100%"}
      onPress={() => onPress?.(id)}
      animatedProps={xstackProps}
    >
      {/* <XStack width={60}>
          {isEdited ? null : (
            <Checkbox size="$1.5" circular marginHorizontal={16}>
              <Checkbox.Indicator>
                <ExpoIcon
                  iconSet="MaterialIcons"
                  name="check"
                  size={24}
                  color="color"
                />
              </Checkbox.Indicator>
            </Checkbox>
          )}
        </XStack> */}
      <AnimatedSizableText
        marginLeft={16}
        flexGrow={1}
        flexShrink={1}
        size={"$5"}
        ellipsizeMode="tail"
        onPress={() => onPress?.(id)}
        animatedProps={nameProps}
      >
        {name}
      </AnimatedSizableText>
      <PriorityIcons priority={priority} />
      {/* <SizableText size={"$3"} marginHorizontal={16}>
          Important
        </SizableText> */}
    </AnimatedXStack>
  );
};
