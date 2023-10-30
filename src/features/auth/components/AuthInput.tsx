import { ReactElement, useState } from "react";
import { InputModeOptions } from "react-native";
import { Button, Input, StackProps, XStack } from "tamagui";
import { ExpoIcon } from "../../../core/components/ExpoIcon";

export interface AuthInputProps extends StackProps {
  value: string;
  setValue: any;
  placeholder: string;
  type?: "text" | "password";
  inputMode?: InputModeOptions;
  icon?: ReactElement;
}

export const AuthInput = ({
  value,
  setValue,
  placeholder,
  icon,
  type,
  inputMode,
  ...props
}: AuthInputProps) => {
  const [passwordHidden, setPasswordHidden] = useState(true);
  return (
    <XStack
      alignItems={"center"}
      backgroundColor={"$background"}
      borderRadius={"$6"}
      borderColor={"$blue8"}
      borderWidth={0}
      pressStyle={{ borderWidth: 2 }}
      focusStyle={{ borderWidth: 2 }}
      {...props}
    >
      {icon}
      <Input
        value={value}
        placeholder={placeholder}
        placeholderTextColor={"$color"}
        inputMode={inputMode}
        secureTextEntry={type === "password" && passwordHidden}
        flexGrow={2}
        flexShrink={1}
        height={"95%"}
        borderWidth={0}
        borderRadius={"$6"}
        onChangeText={(text) => setValue(text)}
      />
      {type !== "password" ? null : (
        <Button
          flexShrink={0}
          paddingHorizontal={"$2.5"}
          backgroundColor={"$background"}
          onPress={() => setPasswordHidden((p) => !p)}
          variant="outlined"
        >
          {passwordHidden ? (
            <ExpoIcon
              iconSet={"MaterialIcons"}
              name={"visibility-off"}
              size={24}
              color={"color"}
            />
          ) : (
            <ExpoIcon
              iconSet={"MaterialIcons"}
              name={"visibility"}
              size={24}
              color={"color"}
            />
          )}
        </Button>
      )}
    </XStack>
  );
};
