import { useEffect, useState } from "react";
import { Button, Input, XStack } from "tamagui";
import { useScreenDimensions } from "../../logic/dimensions/UseScreenDimensions";
import { ExpoIcon } from "../ExpoIcon";
import i18n from "../../../../config/i18n";

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
      {/* <Input
        autoFocus={autofocus}
        position="absolute"
        maxWidth={screenWidth * 0.6}
        size="$4"
        fontSize={"$5"}
        value={inputName}
        placeholder={i18n.t("task.name_placeholder")}
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
      /> */}
      {/* <XStack flexGrow={1} alignItems="center">
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
      </XStack> */}
      <XStack flexGrow={1} >
      <Input
        multiline
        autoFocus={autofocus}
        // position="absolute"
        width={onSave ? screenWidth*0.75 : "100%"}
        size="$4"
        fontSize={"$5"}
        value={inputName}
        placeholder={i18n.t("task.name_placeholder")}
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
      </XStack>
      <XStack justifyContent="flex-end" alignItems="center">
        {onSave ? <Button size="$4" onPress={onSave}>
          {i18n.t("common.save")}
        </Button> : null}
        
      </XStack>
    </XStack>
  );
};
