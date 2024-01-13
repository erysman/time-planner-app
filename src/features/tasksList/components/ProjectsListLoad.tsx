import { SafeAreaView } from "react-native";
import { Spinner } from "tamagui";
import { useGetProjects } from "../../../clients/time-planner-server/client";
import { getRefreshInterval } from "../../../core/config/utils";
import { IProject } from "../../dailyPlanner/model/model";
import { ProjectsList } from "./ProjectsList";

export const ProjectsListLoad = () => {
  const {
    data: projects,
    isError: isErrorProjects,
    isLoading: isLoadingProjects,
  } = useGetProjects({
    query: { refetchInterval: getRefreshInterval(), useErrorBoundary: true },
  });

  if (isLoadingProjects) {
    return <Spinner />;
  }
  return (
    <SafeAreaView>
      <ProjectsList projects={projects as IProject[]} />
    </SafeAreaView>
  );
};
