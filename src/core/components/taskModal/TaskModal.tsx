import React, { useState } from "react";
import { Sheet } from "tamagui";

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
      open={!open}
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
