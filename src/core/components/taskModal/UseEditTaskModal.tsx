import { useState, useMemo, useCallback } from "react";
import { TaskEditFormLoad } from "./TaskEditFormLoad";
import { TaskModal } from "./TaskModal";

export const useEditTaskModal = () => {
    const [open, setOpen] = useState(false);
    const [taskId, setTaskId] = useState<string | null>(null);
    const taskModal = useMemo(
      () => (
        <TaskModal open={open} setOpen={setOpen}>
          {taskId ? (
            <TaskEditFormLoad id={taskId} onClose={() => setOpen(false)} />
          ) : null}
        </TaskModal>
      ),
      [open, setOpen, taskId]
    );
    const openModal = useCallback(
      (id: string) => {
        setTaskId(id);
        setOpen(true);
      },
      [setTaskId, setOpen]
    );
    return { taskModal, openModal };
  };
  