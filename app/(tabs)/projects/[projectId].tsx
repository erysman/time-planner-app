import { Stack, useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { Button, SizableText, XStack } from "tamagui";
import { Header } from "../../../src/core/navigation/Header";
import { ExpoIcon } from "../../../src/core/components/ExpoIcon";
import { ProjectScreen } from "../../../src/features/tasksList/screens/ProjectScreen";

export default function ProjectTasksList() {
  const { projectId } = useLocalSearchParams<{ projectId: string }>();
  return (
    <ProjectScreen projectId={projectId}/>
  );
}
