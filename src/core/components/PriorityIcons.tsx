import { XStack } from "tamagui";
import {} from "../../features/dailyPlanner/model/model";
import { HourglassIcon, StartIcon } from "./ExpoIcon";
import { Priority } from "../model/types";

export const PriorityIcons = (props: { priority: Priority }) => {
  return (
    <XStack marginHorizontal={16} marginVertical={4} space={4}>
      {renderPriority(props.priority)}
    </XStack>
  );
};

export function renderPriority(priority: Priority): React.JSX.Element | null {
  switch (priority) {
    case "IMPORTANT_URGENT":
      return (
        <>
          <HourglassIcon size={16} color={"color"} />
          <StartIcon size={16} color={"color"} />
        </>
      );
    case "IMPORTANT":
      return (
        <>
          <StartIcon size={16} color={"color"} />
        </>
      );
    case "URGENT":
      return (
        <>
          <HourglassIcon size={16} color={"color"} />
        </>
      );
    case "NORMAL":
      return null;
  }
}
