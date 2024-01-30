import { Link, useRouter } from "expo-router";
import {
  Button,
  Circle,
  H6,
  Input,
  ScrollView,
  SizableText,
  XStack,
  YStack,
} from "tamagui";
import i18n from "../../../../config/i18n";
import { ExpoIcon, PlusIcon } from "../../../core/components/ExpoIcon";
import { IProject } from "../../dailyPlanner/model/model";
import { FallbackProps } from "react-error-boundary";
import { useCallback, useMemo, useState } from "react";
import { useValidateName } from "../../../core/components/taskForm/logic/UseValidateTask";
import ColorPicker from "react-native-wheel-color-picker";
import { Modal } from "../../../core/components/modal/Modal";
import { useScreenDimensions } from "../../../core/logic/dimensions/UseScreenDimensions";
import {
  getGetProjectsQueryKey,
  useCreateProject,
} from "../../../clients/time-planner-server/client";
import { useQueryClient } from "@tanstack/react-query";
import { DEFAULT_PROJECT_COLOR } from "../../../../config/constants";

interface ProjectsListProps {
  projects: IProject[];
}

export const ProjectsList = ({ projects }: ProjectsListProps) => {
  return (
    <ScrollView
      h="100%"
      w="100%"
      alwaysBounceHorizontal={false}
      alwaysBounceVertical={false}
      bounces={false}
      overScrollMode="never"
    >
      <YStack marginVertical={24} marginHorizontal={24} space={12}>
        {projects?.map((project) => {
          return (
            <ProjectView
              key={project.id}
              id={project.id}
              name={project.name}
              color={project.color}
            />
          );
        })}
        <AddProject />
      </YStack>
    </ScrollView>
  );
};

export interface ProjectItemProps {
  id: string;
  name: string;
  color: string;
}

const PROJECT_CARD_HEIGHT = 52;

export const ProjectView = ({ color, name, id }: ProjectItemProps) => {
  const router = useRouter();
  return (
    <Link
      href={{ pathname: `/projects/[projectId]`, params: { projectId: id, name } }}
      asChild
    >
      <XStack
        height={PROJECT_CARD_HEIGHT}
        width="100%"
        borderRadius={"$6"}
        alignItems="center"
        elevation={10}
        backgroundColor={"$background"}
        pressStyle={{
          backgroundColor: "$backgroundHover",
        }}
      >
        <Circle backgroundColor={color} size="$1.5" marginHorizontal={16} />
        <SizableText size="$5" ellipsizeMode="tail" numberOfLines={1}>
          {name}
        </SizableText>
      </XStack>
    </Link>
  );
};

export const AddProject = () => {
  const [isEdit, setIsEdit] = useState(false);

  const [namePressed, setNamePressed] = useState(false);
  const [name, setName] = useState("");

  const { isNameValid, nameMessage, validateName } = useValidateName();

  return (
    <XStack
      width="100%"
      paddingHorizontal={16}
      paddingVertical={12}
      borderRadius={"$6"}
      alignItems="center"
      elevation={10}
      backgroundColor={"$backgroundHover"}
      onPress={() => setIsEdit((prev) => !prev)}
      borderWidth={namePressed || !isNameValid ? 1 : 0}
      borderColor={!isNameValid && isEdit ? "$red9" : "$borderColor"}
    >
      {isEdit ? (
        <AddProjectForm
          name={name}
          setName={setName}
          setNamePressed={setNamePressed}
          validateName={validateName}
          isNameValid={isNameValid}
          nameMessage={nameMessage}
          onReset={() => setIsEdit(false)}
        />
      ) : (
        <>
          <PlusIcon size={24} color={"color"} marginRight={16} />
          <SizableText size="$5" ellipsizeMode="tail" numberOfLines={1}>
            {i18n.t("project.add_project")}
          </SizableText>
        </>
      )}
    </XStack>
  );
};

interface AddProjectFormProps {
  name: string;
  setName: (n: string) => void;
  validateName: (n: string) => boolean;
  setNamePressed: (p: boolean) => void;
  nameMessage?: string;
  isNameValid: boolean;
  onReset: () => void;
}

export const AddProjectForm = ({
  name,
  setName,
  validateName,
  setNamePressed,
  nameMessage,
  isNameValid,
  onReset,
}: AddProjectFormProps) => {
  const { screenWidth } = useScreenDimensions();
  const [color, setColor] = useState(DEFAULT_PROJECT_COLOR);
  const { openModal, taskModal } = useColorPickerModal(color, setColor);
  const queryClient = useQueryClient();
  const createProject = useCreateProject({
    mutation: {
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: getGetProjectsQueryKey(),
        });
      },
    },
  });

  const resetState = () => {
    setColor(DEFAULT_PROJECT_COLOR);
    setName("");
    setNamePressed(false);
    onReset();
  };

  const onSave = () => {
    if (!validateName(name)) return;
    createProject.mutate({
      data: {
        name,
        color,
      },
    });
    if (!createProject.isError) {
      resetState();
    }
  };

  return (
    <YStack width="100%">
      <XStack alignItems="center" justifyContent="space-between">
        <XStack alignItems="center">
          <Circle backgroundColor={color} size="$1.5" onPress={openModal} />
          <Input
            autoFocus={true}
            maxWidth={screenWidth * 0.5}
            size="$4"
            fontSize={"$5"}
            borderWidth={0}
            backgroundColor={"$backgroundHover"}
            value={name}
            placeholder={i18n.t("project.name_placeholder")}
            placeholderTextColor={"$color"}
            onPress={() => setNamePressed(true)}
            onChangeText={(text) => {
              validateName(text);
              setName(text);
            }}
            onSubmitEditing={() => setNamePressed(false)}
          />
        </XStack>
        {onSave ? (
          <Button size="$4" onPress={onSave}>
            {i18n.t("common.save")}
          </Button>
        ) : null}
      </XStack>
      {nameMessage ? (
        <SizableText color="$red9">{nameMessage}</SizableText>
      ) : null}
      {taskModal}
    </YStack>
  );
};

export const useColorPickerModal = (
  color: string,
  setColor: (color: string) => void
) => {
  const [open, setOpen] = useState(false);

  const taskModal = useMemo(
    () => (
      <Modal open={open} setOpen={setOpen} snapPoints={[50]}>
        <YStack padding={24}>
          <ColorPicker
            color={color}
            onColorChange={(color) => setColor(color)}
            thumbSize={30}
            sliderSize={30}
            noSnap={true}
            row={false}
          />
        </YStack>
      </Modal>
    ),
    [open, setOpen]
  );
  const openModal = useCallback(() => setOpen(true), [setOpen]);
  return { taskModal, openModal };
};
