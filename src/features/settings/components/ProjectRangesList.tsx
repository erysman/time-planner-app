import { useQueryClient } from "@tanstack/react-query";
import { Dayjs } from "dayjs";
import { Circle, SizableText, Spinner, XStack, YStack } from "tamagui";
import { TIME_FORMAT } from "../../../../config/constants";
import {
  getGetProjectsQueryKey,
  useGetProjects,
  useUpdateProject,
} from "../../../clients/time-planner-server/client";
import { getRefreshInterval } from "../../../core/logic/config/utils";
import { mapToDayjs } from "../../../core/utils";
import { IProject } from "../../dailyPlanner/model/model";
import { useValidateTime } from "../logic/UseValidateTime";
import { SelectTime } from "./SelectTime";

export const ProjectRangesList = (props: { data: IProject[] }) => {
  const { data } = props;
  return (
    <YStack>
      {data?.map((project) => (
        <ProjectRangeItem
          key={project.id}
          id={project.id}
          scheduleStartTime={project.scheduleStartTime}
          scheduleEndTime={project.scheduleEndTime}
          name={project.name}
          color={project.color}
        />
      ))}
    </YStack>
  );
};

interface ProjectRangeItemProps {
  id: string;
  name: string;
  scheduleStartTime: string;
  scheduleEndTime: string;
  color: string;
}

export const ProjectRangeItem = ({
  scheduleEndTime,
  id,
  scheduleStartTime,
  name,
  color,
}: ProjectRangeItemProps) => {
  const queryClient = useQueryClient();
  const updateProject = useUpdateProject({
    mutation: {
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: getGetProjectsQueryKey(),
        });
      },
    },
  });
  const startTime = mapToDayjs(undefined, scheduleStartTime);
  const endTime = mapToDayjs(undefined, scheduleEndTime);
  const updateStartTime = (startTime: Dayjs) => {
    if (!validateTime(startTime, endTime, true)) return;
    updateProject.mutate({
      id,
      data: {
        scheduleStartTime: startTime?.format(TIME_FORMAT),
      },
    });
  };
  const updateEndTime = (endTime: Dayjs) => {
    if (!validateTime(startTime, endTime, true)) return;
    updateProject.mutate({
      id,
      data: {
        scheduleEndTime: endTime?.format(TIME_FORMAT),
      },
    });
  };

  const { isValid, errorMessage, validateTime } = useValidateTime();
  return (
    <YStack backgroundColor={"$background"}>
      <XStack alignItems="center" width="100%">
        <XStack alignItems="center" flexGrow={1}>
          <Circle backgroundColor={color} size="$1" marginHorizontal={16} />
          <SizableText size="$5" ellipsizeMode="tail" numberOfLines={1}>
            {name}
          </SizableText>
        </XStack>
        <XStack alignItems="center">
          <SelectTime
            validateTime={validateTime}
            startTime={startTime}
            endTime={endTime}
            timeType="start"
            updateTime={updateStartTime}
          />
          <SizableText marginHorizontal={0}>-</SizableText>
          <SelectTime
            validateTime={validateTime}
            startTime={startTime}
            endTime={endTime}
            timeType="end"
            updateTime={updateEndTime}
          />
        </XStack>
      </XStack>
      {errorMessage ? (
        <SizableText color={"$red9"}>{errorMessage}</SizableText>
      ) : null}
    </YStack>
  );
};

export const ProjectRangesListLoad = () => {
  const { data, isError, isLoading } = useGetProjects({
    query: { refetchInterval: getRefreshInterval() },
  });
  if (isLoading) return <Spinner />;
  return <ProjectRangesList data={data as IProject[]} />;
};
