import { useEffect } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { Spinner } from "tamagui";
import { useGetProjects } from "../../../clients/time-planner-server/client";
import { getRefreshInterval } from "../../../core/logic/config/utils";
import { IProject } from "../../dailyPlanner/model/model";
import { ProjectsList } from "./ProjectsList";
export const ProjectsListLoad = () => {
  const {
    data: projects,
    isLoading: isLoadingProjects,
    isError,
    error,
  } = useGetProjects({
    query: { refetchInterval: getRefreshInterval() },
  });
  const { showBoundary } = useErrorBoundary();
  useEffect(() => {
    if (isError) {
      showBoundary(error);
    }
  }, [isError]);
  if (isLoadingProjects) {
    return <Spinner />;
  }

  return <ProjectsList projects={projects as IProject[]} />;
};
