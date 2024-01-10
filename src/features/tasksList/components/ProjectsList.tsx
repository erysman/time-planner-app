import { ReactNode } from "react";
import { DragAndDropList } from "../../../core/components/list/DragAndDropList";
import { IProject } from "../../dailyPlanner/model/model";
import { ProjectsListScreenProps } from "../screens/ProjectsListScreen";
import { Circle, SizableText, XStack, YStack } from "tamagui";
import { PlusIcon } from "../../../core/components/ExpoIcon";
import i18n from "../../../../config/i18n";
import { Link, Redirect, useNavigation, useRouter } from "expo-router";

interface ProjectsListProps {
  projects: IProject[];
}

export const ProjectsList = ({ projects }: ProjectsListProps) => {
  return (
    <YStack fullscreen mt={24} marginHorizontal={24} space={12}>
      {projects.map((project) => {
        return (
          <ProjectView
            key={project.id}
            id={project.id}
            name={project.name}
            color={project.color}
          />
        );
      })}
      <AddProjectView />
    </YStack>
  );
};

export interface ProjectItemProps {
  id: string;
  name: string;
  color: string;
}

export const ProjectView = ({ color, name, id }: ProjectItemProps) => {
  const router = useRouter();
  return (
    <Link href={{pathname: `/projects/[projectId]`, params: {projectId: id}}} asChild>
      <XStack
        height={52}
        width="100%"
        borderRadius={"$6"}
        alignItems="center"
        elevation={10}
        backgroundColor={"$background"}
      >
        <Circle backgroundColor={color} size="$1.5" marginHorizontal={16} />
        <SizableText size="$5" ellipsizeMode="tail" numberOfLines={1}>
          {name}
        </SizableText>
      </XStack>
    </Link>
  );
};

export const AddProjectView = () => {
  return (
    <XStack
      height={52}
      width="100%"
      borderRadius={"$6"}
      alignItems="center"
      elevation={10}
      backgroundColor={"$backgroundHover"}
    >
      <PlusIcon size={24} color={"color"} marginHorizontal={16} />
      <SizableText size="$5" ellipsizeMode="tail" numberOfLines={1}>
        {i18n.t("project.add_project")}
      </SizableText>
    </XStack>
  );
};
