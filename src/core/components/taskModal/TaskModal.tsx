import React, { useCallback, useMemo, useState } from "react";
import { Sheet } from "tamagui";
import { TaskFormLoad } from "./TaskFormLoad";

export const useTaskModal = () => {
  const [open, setOpen] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const taskModal = useMemo(
    () => (
      <TaskModal open={open} setOpen={setOpen}>
        {taskId ? (
          <TaskFormLoad id={taskId} onClose={() => setOpen(false)} />
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

export interface TaskModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: any;
}

export const TaskModal = ({ open, setOpen, children }: TaskModalProps) => {
  const [position, setPosition] = useState(0);
  return (
    <Sheet
      forceRemoveScrollEnabled={open}
      modal={true}
      open={open}
      onOpenChange={setOpen}
      // snapPoints={snapPoints}
      // snapPointsMode={snapPointsMode}
      dismissOnSnapToBottom
      position={position}
      onPositionChange={setPosition}
      zIndex={100_000}
      animation="medium"
    >
      <Sheet.Overlay
        animation="lazy"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <Sheet.Handle />
      <Sheet.Frame
        padding={8}
        // justifyContent="center"
        alignItems="center"
        space={8}
      >
        {children}
      </Sheet.Frame>
    </Sheet>
  );
};
