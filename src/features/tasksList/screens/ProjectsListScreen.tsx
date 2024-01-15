import React from "react";
import { GenericFallback } from "../../../core/components/fallback/GenericFallback";
import { ProjectsListLoad } from "../components/ProjectsListLoad";
import { ErrorBoundary } from "react-error-boundary";

export const ProjectsListScreen = () => {
  return (
    <ErrorBoundary FallbackComponent={GenericFallback}>
      <ProjectsListLoad />
    </ErrorBoundary>
  );
};
