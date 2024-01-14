import { ErrorBoundary } from "react-error-boundary";
import { GenericFallback } from "../../../core/components/fallbacks/GenericFallback";
import { ProjectsListLoad } from "../components/ProjectsListLoad";

export const ProjectsListScreen = () => {
  return (
    <ErrorBoundary FallbackComponent={GenericFallback}>
      <ProjectsListLoad />
    </ErrorBoundary>
  );
};
