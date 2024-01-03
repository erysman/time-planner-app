import { ReactNode } from "react";
import { DragAndDropList } from "../../../core/components/list/DragAndDropList";
import { IProject } from "../../dailyPlanner/model/model";
import { ProjectsListScreenProps } from "../screens/ProjectsListScreen";
import { Circle, SizableText, XStack, YStack } from "tamagui";
import { PlusIcon } from "../../../core/components/ExpoIcon";
import i18n from "../../../../config/i18n";

interface ProjectsListProps {
  projects: IProject[];
}

export const ProjectsList = ({ projects }: ProjectsListProps) => {
  return (
    // <DragAndDropList
    //   items={projects}
    //   itemsOrder={[]}
    //   setItemsOrder={function (itemsOrder: string[]): void {
    //     throw new Error("Function not implemented.");
    //   }}
    //   renderItem={function (id: string): ReactNode {
    //     throw new Error("Function not implemented.");
    //   }}
    // />
    <YStack fullscreen mt={24} marginHorizontal={24} space={12}>
      {projects.map((project) => {
        return <ProjectView key={project.id} name={project.name} color={project.color} />;
      })}
      <AddProjectView/>
    </YStack>
  );
};

export interface ProjectViewProps {
  name: string;
  color: string;
}

export const ProjectView = ({ color, name }: ProjectViewProps) => {
  return (
    <XStack height={52} width="100%" borderRadius={"$6"} alignItems="center" elevation={10} backgroundColor={"$background"}>
      <Circle backgroundColor={color} size="$1.5" marginHorizontal={16} />
      <SizableText size="$5" ellipsizeMode="tail" numberOfLines={1} >
        {name}
      </SizableText>
    </XStack>
  );
};

export const AddProjectView = () => {
    return (
      <XStack height={52} width="100%" borderRadius={"$6"} alignItems="center" elevation={10} backgroundColor={"$backgroundHover"}>
        <PlusIcon size={24} color={"color"} marginHorizontal={16}/>
        <SizableText size="$5" ellipsizeMode="tail" numberOfLines={1} >
            {i18n.t("project.add_project")}
        </SizableText>
      </XStack>
    );
  };
  