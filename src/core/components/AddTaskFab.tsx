import { Button } from "tamagui";
import { ExpoIcon } from "./ExpoIcon";
import { useTaskModal } from "./taskModal/TaskModal";

export const AddTaskFab = () => {
   const {openModal, taskModal} = useTaskModal()
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
