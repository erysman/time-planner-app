import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedProps,
} from "react-native-reanimated";
import { Button, Checkbox, SizableText, XStack } from "tamagui";
import { PriorityIcons } from "../../../../core/components/PriorityIcons";

import { useAnimatedHeight } from "./CalendarTaskHeightEditHandler";
import { ExpoIcon } from "../../../../core/components/ExpoIcon";
import { useEditTaskModal } from "../../../../core/components/modal/UseEditTaskModal";

interface CalendarTaskViewProps {
  id: string;
  name: string;
  isEdited: boolean;
  isMoving?: boolean;
  onPress?: (taskId: string) => void;
  onEditPress?: (taskId: string) => void;
  hourSlotHeight: number;
  height?: number;
  isUrgent: boolean;
  isImportant: boolean;
  projectColor?: string;
  zIndex?: number;
}

const AnimatedXStack = Animated.createAnimatedComponent(XStack);
const AnimatedSizableText = Animated.createAnimatedComponent(SizableText);

export const CalendarTaskView = ({
  hourSlotHeight,
  id,
  name,
  isImportant,
  isUrgent,
  isEdited,
  isMoving,
  onPress,
  onEditPress,
  projectColor,
  zIndex,
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
    <>
      <XStack
        zIndex={100}
        borderColor={isEdited || isMoving ? "$blue8" : "$borderColor"}
        borderWidth={isEdited || isMoving ? 2 : 0}
        backgroundColor={"$background"}
        borderRadius={"$4"}
        overflow="hidden"
        height={"100%"}
        pressStyle={{
          backgroundColor: "$backgroundHover",
        }}
        onPress={() => {
          onPress?.(id);
        }}
      >
        <AnimatedXStack
          flexGrow={1}
          flexShrink={1}
          height={"100%"}
          borderColor={projectColor ?? "$background"}
          borderLeftWidth={8}
          animatedProps={xstackProps}
        >
          <XStack width={44}>
            <Checkbox size="$1.5" circular marginHorizontal={12}>
              <Checkbox.Indicator>
                <ExpoIcon
                  iconSet="MaterialIcons"
                  name="check"
                  size={24}
                  color="color"
                />
              </Checkbox.Indicator>
            </Checkbox>
          </XStack>
          <AnimatedSizableText
            flexGrow={1}
            flexShrink={1}
            marginLeft={8}
            size={"$5"}
            ellipsizeMode="tail"
            animatedProps={nameProps}
          >
            {name}
          </AnimatedSizableText>
          <PriorityIcons isImportant={isImportant} isUrgent={isUrgent} />
        </AnimatedXStack>

        {isEdited ? (
          <Button
            borderRadius={"$3"}
            h="auto"
            icon={
              <ExpoIcon
                iconSet="MaterialIcons"
                name="info-outline"
                size={24}
                color="color"
              />
            }
            onPress={() => onEditPress?.(id)}
          />
        ) : null}
      </XStack>
    </>
  );
};
