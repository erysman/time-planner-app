import React from "react";
import { YStack } from "tamagui";
import { HourglassIcon, StartIcon } from "../../ExpoIcon";
import { SwitchWithLabel } from "./SwitchWithLabel";
import i18n from "../../../../../config/i18n";

interface SelectPriorityProps {
  id: string;
  isImportant: boolean;
  isUrgent: boolean;
  updateUrgent: (isUrgent: boolean) => void;
  updateImportant: (isImportant: boolean) => void;
}

export const SelectPriority = ({
  id,
  isImportant,
  isUrgent,
  updateUrgent,
  updateImportant,
}: SelectPriorityProps) => {
  return (
    <YStack>
      <SwitchWithLabel
        id={id}
        size={"$4.5"}
        name={i18n.t("task.important_title")}
        icon={<StartIcon size={16} color={"color"} />}
        value={isImportant}
        setValue={(v) => updateImportant(v)}
      />
      <SwitchWithLabel
        id={id}
        size={"$4.5"}
        name={i18n.t("task.urgent_title")}
        icon={<HourglassIcon size={16} color={"color"} />}
        value={isUrgent}
        setValue={(v) => updateUrgent(v)}
      />
    </YStack>
  );
};
