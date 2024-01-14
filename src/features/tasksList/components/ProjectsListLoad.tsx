import { Spinner } from "tamagui";
import { useGetProjects } from "../../../clients/time-planner-server/client";
import { getRefreshInterval } from "../../../core/logic/config/utils";
import { IProject } from "../../dailyPlanner/model/model";
import { ProjectsList } from "./ProjectsList";

export const ProjectsListLoad = () => {
  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    query: { refetchInterval: getRefreshInterval(), useErrorBoundary: true },
  });

  if (isLoadingProjects) {
    return <Spinner />;
  }
  return <ProjectsList projects={projects as IProject[]} />;
};
