import { Button } from "tamagui";
import { ExpoIcon } from "./ExpoIcon";
import { useCreateTaskModal } from "./taskModal/UseCreateTaskModal";

interface AddTaskFabProps {
  projectId: string;
}

export const AddTaskFab = ({ projectId }: AddTaskFabProps) => {
  const { openModal, taskModal } = useCreateTaskModal(projectId);
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
      ></Button>
      {taskModal}
    </>
  );
};
