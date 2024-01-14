import { useCallback, useMemo, useState } from "react";
import { Button, SizableText, Theme, ThemeName, XStack, YStack } from "tamagui";
import { Modal } from "./Modal";

export const useConfirmDeleteModal = (action: () => void, message: string) => {
  const [open, setOpen] = useState(false);

  const confirmDeleteModal = useMemo(
    () => (
      <Modal open={open} setOpen={setOpen} snapPoints={[25]}>
        <ConfirmActionForm
          message={message}
          confirm="Delete"
          cancel="Cancel"
          onCancel={() => setOpen(false)}
          onConfirm={() => {
            action();
            setOpen(false);
          }}
          confirmTheme="red_alt1"
        />
      </Modal>
    ),
    [open, setOpen, action]
  );
  const openConfirmDeleteModal = useCallback(() => setOpen(true), [setOpen]);
  return { confirmDeleteModal, openConfirmDeleteModal };
};

const ConfirmActionForm = (props: {
  message: string;
  onConfirm: () => void;
  cancel: string;
  confirm: string;
  onCancel: () => void;
  confirmTheme?: ThemeName;
}) => {
  const { onConfirm, cancel, confirm, message, onCancel, confirmTheme } = props;
  return (
    <YStack
      justifyContent="center"
      alignItems="center"
      width="100%"
      height="100%"
      space={24}
      padding={16}
    >
      <SizableText fontSize={"$6"}>{message}</SizableText>
      <XStack space={16}>
        <Button flexGrow={1} onPress={onCancel}>
          {cancel}
        </Button>
        {confirmTheme ? (
          <Theme reset>
            <Button theme={confirmTheme} flexGrow={1} onPress={onConfirm}>
              {confirm}
            </Button>
          </Theme>
        ) : (
          <Button flexGrow={1} onPress={onConfirm}>
            {confirm}
          </Button>
        )}
      </XStack>
    </YStack>
  );
};
