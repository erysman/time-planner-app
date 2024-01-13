import { useState, useMemo, useEffect } from "react";
import {
  Adapt,
  Circle,
  Select,
  SelectProps,
  Sheet,
  SizableText,
  XStack,
  YStack,
} from "tamagui";
import { ExpoIcon } from "../ExpoIcon";
import { useGetProjects } from "../../../clients/time-planner-server/client";
import { IProject } from "../../../features/dailyPlanner/model/model";
import { UseUpdateTaskReturnType } from "./TaskForm";

interface SelectProjectProps  {
  taskId: string;
  projectId: string;
  updateTask: UseUpdateTaskReturnType
}

export function SelectProject({projectId, taskId, updateTask}: SelectProjectProps) {
  // const [val, setVal] = useState(projectId);

  const { data, isLoading, isError } = useGetProjects();

  const selectedProject = useMemo(() => {
    return data?.find((p) => p.id === projectId);
  }, [projectId, data]);
  return (
    <XStack>
      <Select
        id="project"
        value={projectId}
        onValueChange={(value) => {
          updateTask.mutate({id: taskId, data: {projectId: value}})
        }}
        disablePreventBodyScroll
      >
        <Select.Trigger
          width={"auto"}
          maxWidth={300}
          icon={
            <ExpoIcon
              iconSet="MaterialIcons"
              name="drive-file-move-outline"
              size={24}
            />
          }
        >
          <SizableText>{"Project:"}</SizableText>
          {selectedProject ? (
            <XStack justifyContent="center" alignItems="center" space={10} marginLeft={16}>
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
              <Select.Label>{"Select project"}</Select.Label>
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
