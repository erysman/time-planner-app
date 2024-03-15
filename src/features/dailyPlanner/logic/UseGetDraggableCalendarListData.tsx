import { useEffect, useMemo } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { useGetDayTasks, useGetProjects, useGetTasksDayOrder } from "../../../clients/time-planner-server/client";
import { getRefreshInterval } from "../../../core/logic/config/utils";
import { IProject, ITask } from "../model/model";

export const useGetDraggableCalendarListData = (day: string) => {
    const {
        data: tasksData,
        isError,
        error,
        isLoading: isDayTasksLoading,
      } = useGetDayTasks(day, { query: { refetchInterval: getRefreshInterval() } });
      const {
        data: tasksOrderData,
        isError: isErrorOrder,
        error: errorOrder,
        isLoading: isLoadingOrder,
      } = useGetTasksDayOrder(day, {
        query: { refetchInterval: getRefreshInterval() },
      });
    
      const {
        data: projectsData,
        isError: isErrorProjects,
        error: errorProjects,
        isLoading: isLoadingProjects,
      } = useGetProjects({ query: { refetchInterval: getRefreshInterval() } });
    
      const { showBoundary } = useErrorBoundary();
      useEffect(() => {
        if (isError) {
          showBoundary(error);
        }
        if (isErrorOrder) {
          showBoundary(errorOrder);
        }
        if (isErrorProjects) {
          showBoundary(errorProjects);
        }
      }, [isError, isErrorOrder, isErrorProjects]);
    
      const isLoading = useMemo(
        () => isDayTasksLoading || isLoadingOrder || isLoadingProjects,
        [isDayTasksLoading, isLoadingOrder, isLoadingProjects]
      );
    
      const tasks = (tasksData ?? []) as ITask[];
      const tasksOrder = (tasksOrderData ?? []) as string[];
      const projects = (projectsData ?? []) as IProject[];

      return {isLoading, tasks, tasksOrder, projects}

}