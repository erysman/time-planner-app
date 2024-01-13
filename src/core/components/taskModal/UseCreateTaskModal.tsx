import { useCallback, useMemo, useState } from "react";
import { TaskCreateForm } from "../taskForm/TaskCreateForm";
import { TaskModal } from "./TaskModal";

export const useCreateTaskModal = (projectId: string) => {
  const [open, setOpen] = useState(false);

  const taskModal = useMemo(
    () => (
      <TaskModal open={open} setOpen={setOpen}>
        <TaskCreateForm
            isOpen={open}
            projectId={projectId}
            onClose={() => setOpen(false)}
          />
      </TaskModal>
    ),
    [open, setOpen, projectId]
  );
  const openModal = useCallback(() => setOpen(true), [setOpen]);
  return { taskModal, openModal };
};
