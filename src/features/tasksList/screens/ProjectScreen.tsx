import { useNavigation, useRouter } from "expo-router";
import { useEffect } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { H6, Spinner, YStack } from "tamagui";
import {
  useGetProject,
  useGetProjectTasks,
} from "../../../clients/time-planner-server/client";
import { AddTaskFab } from "../../../core/components/AddTaskFab";
import ListItem from "../../../core/components/list/ListItem";
import { useEditTaskModal } from "../../../core/components/taskModal/UseEditTaskModal";
import { getRefreshInterval } from "../../../core/config/utils";
import { ITask } from "../../dailyPlanner/model/model";
import { GenericFallback } from "../../../core/components/fallbacks/GenericFallback";
import { ErrorBoundary } from "react-error-boundary";
import { SafeAreaView } from "react-native-safe-area-context";

export interface ProjectScreenProps {
  projectId: string;
}

export const ProjectScreen = ({ projectId }: ProjectScreenProps) => {
  return (
    <>
      <ErrorBoundary FallbackComponent={GenericFallback}>
        <ProjectTasksList projectId={projectId} />
      </ErrorBoundary>
      <AddTaskFab projectId={projectId} />
    </>
  );
};

export const ProjectTasksList = (props: { projectId: string }) => {
  const { projectId } = props;
  const {
    data: tasks,
    isError,
    isLoading,
  } = useGetProjectTasks(projectId, {
    query: { refetchInterval: getRefreshInterval(), useErrorBoundary: true },
  });
  const {
    data: project,
    isError: isErrorProject,
    isLoading: isLoadingProject,
  } = useGetProject(projectId, {
    query: { refetchInterval: getRefreshInterval(), useErrorBoundary: true },
  });
  const router = useRouter();
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({ title: `${project?.name ?? ""}` });
  }, [project?.name, navigation]);

  const { taskModal, openModal } = useEditTaskModal();

  if (isLoading || isLoadingProject) {
    return <Spinner />; //TODO: print skeleton, not Spinner
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
            name={task.name}
            isEdited={false}
            isImportant={task.isImportant}
            isUrgent={task.isUrgent}
            durationMin={task.durationMin}
            projectColor={project?.color ?? undefined}
            height={55}
            onPress={() => {
              openModal(task.id);
            }}
          />
        ))}
      </YStack>
      {taskModal}
    </ScrollView>
  );
};
