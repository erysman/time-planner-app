import { useMemo } from "react";
import {
  Adapt,
  Circle,
  Select,
  Sheet,
  SizableText,
  XStack,
  YStack,
} from "tamagui";
import { useGetProjects } from "../../../../clients/time-planner-server/client";
import { IProject } from "../../../../features/dailyPlanner/model/model";
import { ExpoIcon } from "../../ExpoIcon";
import i18n from "../../../../../config/i18n";

interface SelectProjectProps {
  id: string;
  projectId?: string;
  updateProject: (projectId: string) => void;
}

export function SelectProject({
  id,
  projectId,
  updateProject,
}: SelectProjectProps) {
  const { data, isLoading, isError } = useGetProjects();

  const selectedProject = useMemo(() => {
    return data?.find((p) => p.id === projectId);
  }, [projectId, data]);

  return (
    <XStack>
      <Select
        id={`project-${projectId}-${id}`}
        value={projectId}
        onValueChange={updateProject}
        disablePreventBodyScroll
      >
        <Select.Trigger width={"100%"}>
          <XStack space={10}>
            <ExpoIcon
              iconSet="MaterialIcons"
              name="drive-file-move-outline"
              size={24}
            />
            <SizableText>{`${i18n.t("task.project_title")}:`}</SizableText>
          </XStack>
          {selectedProject ? (
            <XStack
              justifyContent="center"
              alignItems="center"
              space={10}
              marginLeft={16}
            >
              <Circle
                backgroundColor={selectedProject.color ?? "$background"}
                size={16}
              />
              <SizableText fontSize={"$4"}>{selectedProject.name}</SizableText>
            </XStack>
          ) : null}
        </Select.Trigger>

        <Adapt when="sm" platform="touch">
          <Sheet
            modal
            dismissOnSnapToBottom
            animation={"medium"}
            snapPoints={[50]}
          >
            <Sheet.Frame>
              <Sheet.ScrollView>
                <Adapt.Contents />
              </Sheet.ScrollView>
            </Sheet.Frame>
            <Sheet.Overlay
              animation="lazy"
              enterStyle={{ opacity: 0 }}
              exitStyle={{ opacity: 0 }}
            />
          </Sheet>
        </Adapt>

        <Select.Content zIndex={200000}>
          <Select.ScrollUpButton
            alignItems="center"
            justifyContent="center"
            position="relative"
            width="100%"
            height="$3"
          >
            <YStack zIndex={10}></YStack>
          </Select.ScrollUpButton>

          <Select.Viewport minWidth={200}>
            <Select.Group>
              <Select.Label>{i18n.t("task.select_project")}</Select.Label>
              {useMemo(
                () =>
                  data?.map((projectDto, i) => {
                    const project = projectDto as IProject;
                    return (
                      <Select.Item
                        index={i}
                        key={project.id}
                        value={project.id}
                      >
                        <XStack alignItems="center">
                          <Circle
                            backgroundColor={project.color ?? "$background"}
                            size={16}
                            marginHorizontal={16}
                          />
                          <Select.ItemText>{project.name}</Select.ItemText>
                        </XStack>

                        <Select.ItemIndicator marginLeft="auto">
                          <ExpoIcon
                            iconSet="MaterialCommunityIcons"
                            name="check"
                            size={24}
                          />
                        </Select.ItemIndicator>
                      </Select.Item>
                    );
                  }),
                [data]
              )}
            </Select.Group>
          </Select.Viewport>

          <Select.ScrollDownButton
            alignItems="center"
            justifyContent="center"
            position="relative"
            width="100%"
            height="$3"
          >
            <YStack zIndex={10}>
              <ExpoIcon
                iconSet="MaterialIcons"
                name="arrow-downward"
                size={24}
              />
            </YStack>
          </Select.ScrollDownButton>
        </Select.Content>
      </Select>
    </XStack>
  );
}
