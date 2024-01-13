import { useEffect, useState } from "react";
import { Button, Input, XStack } from "tamagui";
import { useScreenDimensions } from "../../dimensions/UseScreenDimensions";
import { ExpoIcon } from "../ExpoIcon";

interface TaskFormHeaderProps {
  name: string;
  updateName: (name: string) => void;
  onClose: () => void;
  onSave?: () => void;
  setNamePressed: React.Dispatch<React.SetStateAction<boolean>>;
  namePressed: boolean;
  autofocus?: boolean;
  isNameValid: boolean;
  validateName: (name:string) => boolean;
}

export const TaskFormHeader = ({
  isNameValid,
  name,
  updateName,
  onClose,
  onSave,
  namePressed,
  setNamePressed,
  autofocus,
  validateName,
}: TaskFormHeaderProps) => {
  const { screenWidth } = useScreenDimensions();
  const [inputName, setInputName] = useState<string | undefined>(name);

  useEffect(() => {
    setInputName(name);
  }, [name]);

  return (
    <XStack justifyContent="center" alignItems="center" w={"100%"}>
      <Input
        autoFocus={autofocus}
        position="absolute"
        maxWidth={screenWidth * 0.75}
        size="$4"
        fontSize={"$5"}
        value={inputName}
        placeholder={"Name..."}
        placeholderTextColor={"$color"}
        onPress={() => setNamePressed(true)}
        borderWidth={namePressed || !isNameValid ? 1 : 0}
        borderColor={!isNameValid ? "$red9" : "$borderColor"}
        onChangeText={(text) => {
          setInputName(text);
          if(!validateName(text)) return;
          updateName(text);
        }}
        onSubmitEditing={() => setNamePressed(false)}
      />
      <XStack flexGrow={1} alignItems="center">
        <Button
          size="$3"
          circular
          icon={
            <ExpoIcon
              iconSet="MaterialIcons"
              name="close"
              size={24}
              color="color"
            />
          }
          onPress={onClose}
        />
      </XStack>
      <XStack flexGrow={1} justifyContent="center"></XStack>
      <XStack flexGrow={1} justifyContent="flex-end" alignItems="center">
        {onSave ? <Button size="$4" onPress={onSave}>
          {"Save"}
        </Button> : null}
        
      </XStack>
    </XStack>
  );
};
