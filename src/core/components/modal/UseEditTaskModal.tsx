import { useCallback, useMemo, useState } from "react";
import { TaskEditFormLoad } from "../taskForm/TaskEditFormLoad";
import { Modal } from "./Modal";

export const useEditTaskModal = () => {
  const [open, setOpen] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const taskModal = useMemo(
    () => (
      <Modal open={open} setOpen={setOpen}>
        {taskId ? (
          <TaskEditFormLoad id={taskId} onClose={() => setOpen(false)} />
        ) : null}
      </Modal>
    ),
    [open, setOpen, taskId]
  );
  const openTaskModal = useCallback(
    (id: string) => {
      setTaskId(id);
      setOpen(true);
    },
    [setTaskId, setOpen]
  );
  return { taskModal, openTaskModal };
};
