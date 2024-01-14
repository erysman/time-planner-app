import { ErrorBoundary } from "react-error-boundary";
import { AddTaskFab } from "../components/AddTaskFab";
import { GenericFallback } from "../../../core/components/fallback/GenericFallback";
import { ProjectTasksList } from "../components/ProjectTasksList";

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
