
import { AddTaskFab } from "../../../core/components/list/AddTaskFab";
import { GenericFallback } from "../../../core/components/fallback/GenericFallback";
import { ProjectTasksList, ProjectTasksListLoad } from "../components/ProjectTasksList";
import { uniqueId } from "lodash";
import { useState } from "react";
import React from "react";
import { ErrorBoundary } from "react-error-boundary";

export interface ProjectScreenProps {
  projectId: string;
}

export const ProjectScreen = ({ projectId }: ProjectScreenProps) => {
  return (
    <>
      <ErrorBoundary FallbackComponent={GenericFallback} >
        <ProjectTasksListLoad projectId={projectId}/>
      </ErrorBoundary>
    </>
  );
};
