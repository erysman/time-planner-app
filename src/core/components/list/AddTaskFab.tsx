import { Button, ButtonProps } from "tamagui";
import { ExpoIcon } from "../ExpoIcon";
import { useCreateTaskModal } from "../modal/UseCreateTaskModal";

interface AddTaskFabProps extends ButtonProps {
  projectId?: string;
  startDay?: string;
}

export const AddTaskFab = ({ projectId, startDay, ...props }: AddTaskFabProps) => {
  const { openModal, taskModal } = useCreateTaskModal(projectId, startDay);
  return (
    <>
      <Button
        size={"$6"}
        circular
        position="absolute"
        bottom={25}
        right={25}
        icon={<ExpoIcon iconSet="MaterialIcons" name="add" size={40} />}
        onPress={() => openModal()}
        {...props}
      />
      {taskModal}
    </>
  );
};
