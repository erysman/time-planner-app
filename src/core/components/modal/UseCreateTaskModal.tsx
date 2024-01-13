import { useCallback, useMemo, useState } from "react";
import { TaskCreateForm } from "../taskForm/TaskCreateForm";
import { Modal } from "./Modal";

export const useCreateTaskModal = (projectId: string) => {
  const [open, setOpen] = useState(false);

  const taskModal = useMemo(
    () => (
      <Modal open={open} setOpen={setOpen}>
        <TaskCreateForm
            isOpen={open}
            projectId={projectId}
            onClose={() => setOpen(false)}
          />
      </Modal>
    ),
    [open, setOpen, projectId]
  );
  const openModal = useCallback(() => setOpen(true), [setOpen]);
  return { taskModal, openModal };
};
