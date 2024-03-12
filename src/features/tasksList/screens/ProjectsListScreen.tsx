import React from "react";
import { GenericFallback, logError } from "../../../core/components/fallback/GenericFallback";
import { ProjectsListLoad } from "../components/ProjectsListLoad";
import { ErrorBoundary } from "react-error-boundary";
import { Button } from "tamagui";

export const ProjectsListScreen = () => {
  return (
    <ErrorBoundary FallbackComponent={GenericFallback} onError={logError}>
      <ProjectsListLoad />
    </ErrorBoundary>
  );
};
