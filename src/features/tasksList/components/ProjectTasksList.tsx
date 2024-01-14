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
import ListItem from "../../../core/components/list/ListItem";
import { useEditTaskModal } from "../../../core/components/modal/UseEditTaskModal";
import { getRefreshInterval } from "../../../core/config/utils";
import { ITask } from "../../dailyPlanner/model/model";
import { ExpoIcon } from "../../../core/components/ExpoIcon";
import { useConfirmDeleteModal } from "../../../core/components/modal/UseConfirmActionModal";

export const ProjectTasksList = (props: { projectId: string }) => {
  const { projectId } = props;
  const router = useRouter();
  const { data: tasks, isLoading } = useGetProjectTasks(projectId, {
    query: { refetchInterval: getRefreshInterval(), useErrorBoundary: true },
  });
  const { data: project, isLoading: isLoadingProject } = useGetProject(
    projectId,
    {
      query: { refetchInterval: getRefreshInterval(), useErrorBoundary: true },
    }
  );
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
  }

  const {confirmDeleteModal,openConfirmDeleteModal} = useConfirmDeleteModal(onProjectDelete, `Do you want to delete project ${project?.name}?`)
  const onProjectDeletePress = () => {
    openConfirmDeleteModal()
  }
  const deleteButton = useMemo(() => {
    return (
      <Button
        variant="outlined"
        onPress={onProjectDeletePress}
      >
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

  if (isLoading || isLoadingProject) {
    return <Spinner />; //print skeleton, not Spinner
  }

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
