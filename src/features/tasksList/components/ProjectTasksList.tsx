import { useQueryClient } from "@tanstack/react-query";
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useMemo } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { Button, Spinner, YStack } from "tamagui";
import {
  getGetProjectQueryKey,
  getGetProjectsQueryKey,
  useDeleteProject,
  useGetProject,
  useGetProjectTasks,
} from "../../../clients/time-planner-server/client";
import { ExpoIcon } from "../../../core/components/ExpoIcon";
import ListItem from "../../../core/components/list/ListItem";
import { useConfirmDeleteModal } from "../../../core/components/modal/UseConfirmActionModal";
import { getRefreshInterval } from "../../../core/logic/config/utils";
import { IProject, ITask } from "../../dailyPlanner/model/model";
import { useErrorBoundary } from "react-error-boundary";

export const ProjectTasksListLoad = (props: { projectId: string }) => {
  const { projectId } = props;
  const {
    data: tasks,
    isLoading,
    isError: isErrorTasks,
    error: errorTasks,
  } = useGetProjectTasks(projectId, {
    query: { refetchInterval: getRefreshInterval() },
  });
  const {
    data: project,
    isLoading: isLoadingProject,
    isError: isErrorProject,
    error: errorProject,
  } = useGetProject(projectId, {
    query: { refetchInterval: getRefreshInterval() },
  });
  const { showBoundary } = useErrorBoundary();
  useEffect(() => {
    if (isErrorTasks) {
      showBoundary(errorTasks);
    }
    if (isErrorProject) {
      showBoundary(errorProject);
    }
  }, [isErrorTasks, isErrorProject]);

  if (isLoading || isLoadingProject) {
    return <Spinner />; //print skeleton, not Spinner
  }

  return (
    <ProjectTasksList
      project={project as IProject}
      projectId={projectId}
      tasks={tasks as ITask[]}
    />
  );
};

interface ProjectTasksListProps {
  projectId: string;
  project: IProject;
  tasks: ITask[];
}

export const ProjectTasksList = ({
  project,
  projectId,
  tasks,
}: ProjectTasksListProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const deleteProject = useDeleteProject({
    mutation: {
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: getGetProjectsQueryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: getGetProjectQueryKey(projectId),
        });
      },
    },
  });
  const onProjectDelete = () => {
    deleteProject.mutate({ id: projectId });
    router.back();
  };

  const { confirmDeleteModal, openConfirmDeleteModal } = useConfirmDeleteModal(
    onProjectDelete,
    `Do you want to delete project ${project?.name} and all related tasks?`
  );
  const onProjectDeletePress = () => {
    openConfirmDeleteModal();
  };
  const deleteButton = useMemo(() => {
    return (
      <Button variant="outlined" onPress={onProjectDeletePress}>
        <ExpoIcon
          iconSet="MaterialCommunityIcons"
          name="delete-outline"
          size={24}
        />
      </Button>
    );
  }, [deleteProject, router, projectId]);

  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      title: `${project?.name ?? ""}`,
      headerRight: () => <>{deleteButton}</>,
    });
  }, [project?.name, navigation]);

  return (
    <ScrollView
      alwaysBounceHorizontal={false}
      alwaysBounceVertical={false}
      bounces={false}
      overScrollMode="never"
    >
      <YStack h={"100%"} w={"100%"}>
        {(tasks as ITask[])?.map((task) => (
          <ListItem
            key={task.id}
            id={task.id}
            name={task.name}
            isEdited={false}
            isImportant={task.isImportant}
            isUrgent={task.isUrgent}
            durationMin={task.durationMin}
            projectColor={project?.color ?? undefined}
            height={55}
          />
        ))}
      </YStack>
      {confirmDeleteModal}
    </ScrollView>
  );
};
