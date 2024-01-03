import { isLoading } from "expo-font";
import { isError } from "lodash";
import { Spinner, H6 } from "tamagui";
import { useGetProjects } from "../../../clients/time-planner-server/client";
import { getRefreshInterval } from "../../../core/config/utils";
import { ProjectsList } from "../components/ProjectsList";
import { IProject } from "../../dailyPlanner/model/model";

export interface ProjectsListScreenProps {

}

export const ProjectsListScreen = ({}:ProjectsListScreenProps) => {
    const {
        data: projects,
        isError: isErrorProjects,
        isLoading: isLoadingProjects,
      } = useGetProjects({ query: { refetchInterval: getRefreshInterval() } });
    
      if ( isLoadingProjects) {
        return <Spinner />;
      }
      if (isErrorProjects) {
        return <H6>{"Error during loading projects, try again"}</H6>; //TODO: this should be toast!
      }
      return (<ProjectsList projects={projects as IProject[]}/>)
}