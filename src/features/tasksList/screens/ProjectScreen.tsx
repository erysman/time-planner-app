import { ErrorBoundary } from "react-error-boundary";
import { AddTaskFab } from "../../../core/components/AddTaskFab";
import { GenericFallback } from "../../../core/components/fallbacks/GenericFallback";
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
