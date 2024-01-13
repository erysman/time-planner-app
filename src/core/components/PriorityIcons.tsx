import { XStack } from "tamagui";
import {} from "../../features/dailyPlanner/model/model";
import { HourglassIcon, StartIcon } from "./ExpoIcon";

export const PriorityIcons = (props: {
  isImportant: boolean;
  isUrgent: boolean;
}) => {
  return (
    <XStack marginHorizontal={16} marginVertical={4} space={4}>
      {props.isImportant ? <StartIcon size={16} color={"color"} /> : null}
      {props.isUrgent ? <HourglassIcon size={16} color={"color"} /> : null}
    </XStack>
  );
};
