import { Switch, SizeTokens, useTheme, XStack, Label } from "tamagui";

interface SwitchWithLabelProps {
  size: SizeTokens;
  name: string;
  icon: React.JSX.Element;
  value: boolean;
  setValue: (value: boolean) => void;
}

export function SwitchWithLabel({
  name,
  size,
  icon,
  value,
  setValue,
}: SwitchWithLabelProps) {
  const id = `switch-${name}-${size.toString().slice(1)}}}`;
  const theme = useTheme();
  const thumbColor = theme.background.get();
  return (
    <XStack alignItems="center" justifyContent="space-between">
      <XStack alignItems="center" space={8}>
        {icon}
        <Label
          minWidth={90}
          paddingRight="$0"
          justifyContent="flex-end"
          size={size}
          htmlFor={id}
        >
          {name}
        </Label>
      </XStack>

      <Switch
        id={id}
        size={size}
        backgroundColor={"$background"}
        checked={value}
        onCheckedChange={(checked) => {
          setValue(checked);
        }}
      >
        <Switch.Thumb animation="medium" backgroundColor={thumbColor} />
      </Switch>
    </XStack>
  );
}
