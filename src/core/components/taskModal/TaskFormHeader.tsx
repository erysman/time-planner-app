import { useState, useCallback, useEffect } from "react";
import { XStack, Input, Button } from "tamagui";
import { useScreenDimensions } from "../../dimensions/UseScreenDimensions";
import { ExpoIcon } from "../ExpoIcon";
import { UseUpdateTaskReturnType } from "./EditTaskForm";
import { debounce } from "lodash";

interface TaskFormHeaderProps {
  taskId: string;
  name: string;
  updateTask: UseUpdateTaskReturnType;
  onClose: () => void;
  setNamePressed: React.Dispatch<React.SetStateAction<boolean>>;
  namePressed: boolean;
}

export const TaskFormHeader = ({
  name,
  updateTask,
  taskId: id,
  onClose,
  namePressed,
  setNamePressed,
}: TaskFormHeaderProps) => {
  const { screenWidth } = useScreenDimensions();
  const [inputName, setInputName] = useState<string | undefined>(name);
  const updateName = useCallback(
    debounce((text) => updateTask.mutate({ id, data: { name: text } }), 1000),
    [updateTask, id]
  );

  useEffect(() => {
    setInputName(name);
  }, [name]);

  return (
    <XStack justifyContent="center" alignItems="center" w={"100%"}>
      <Input
        position="absolute"
        maxWidth={screenWidth * 0.75}
        size="$4"
        fontSize={"$5"}
        value={inputName}
        placeholder={name}
        placeholderTextColor={"$color"}
        onPress={() => setNamePressed(true)}
        borderWidth={namePressed ? 1 : 0}
        onChangeText={(text) => {
          setInputName(text);
          updateName(text);
        }}
        onSubmitEditing={() => setNamePressed(false)}
      />
      <XStack flexGrow={1} alignItems="center"></XStack>
      <XStack flexGrow={1} justifyContent="center"></XStack>
      <XStack flexGrow={1} justifyContent="flex-end">
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
    </XStack>
  );
};
