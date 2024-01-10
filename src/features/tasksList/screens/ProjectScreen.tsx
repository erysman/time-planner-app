import { H6, Spinner, YStack } from "tamagui";
import {
  useGetProject,
  useGetProjectTasks,
} from "../../../clients/time-planner-server/client";
import { getRefreshInterval } from "../../../core/config/utils";
import { MovableItem } from "../../../core/components/list/MovableItem";
import { ITask } from "../../dailyPlanner/model/model";
import ListItem from "../../../core/components/list/ListItem";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "expo-router";
import { useEffect } from "react";

export interface ProjectScreenProps {
  id: string;
}

export const ProjectScreen = ({ id }: ProjectScreenProps) => {
  const {
    data: tasks,
    isError,
    isLoading,
  } = useGetProjectTasks(id, {
    query: { refetchInterval: getRefreshInterval() },
  });
  const {
    data: project,
    isError: isErrorProject,
    isLoading: isLoadingProject,
  } = useGetProject(id, {
    query: { refetchInterval: getRefreshInterval() },
  });

  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({ title: `${project?.name ?? ""}` });
  }, [project?.name, navigation]);

  if (isLoading || isLoadingProject) {
    return <Spinner />; //TODO: print skeleton, not Spinner
  }
  if (isError || isErrorProject) {
    return <H6>{"Error during loading tasks or projects, try again"}</H6>; //TODO: this should be toast!
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
            priority={task.priority}
            durationMin={task.durationMin}
            projectColor={project?.color ?? undefined}
            height={55}
          />
        ))}
      </YStack>
    </ScrollView>
  );
};
