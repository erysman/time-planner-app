import React from "react";
import { YStack } from "tamagui";
import { HourglassIcon, StartIcon } from "../ExpoIcon";
import { SwitchWithLabel } from "./SwitchWithLabel";

interface SelectPriorityProps {
  isImportant: boolean;
  isUrgent: boolean;
  updateUrgent: (isUrgent: boolean) => void;
  updateImportant: (isImportant: boolean) => void;
}

export const SelectPriority = ({
  isImportant,
  isUrgent,
  updateUrgent,
  updateImportant,
}: SelectPriorityProps) => {
  return (
    <YStack>
      <SwitchWithLabel
        size={"$4"}
        name={"Important"}
        icon={<StartIcon size={16} color={"color"} />}
        value={isImportant}
        setValue={(v) => updateImportant(v)}
      />
      <SwitchWithLabel
        size={"$4"}
        name={"Urgent"}
        icon={<HourglassIcon size={16} color={"color"} />}
        value={isUrgent}
        setValue={(v) => updateUrgent(v)}
      />
    </YStack>
  );
};
