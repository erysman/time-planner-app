import { Stack, useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { Button, SizableText, XStack } from "tamagui";
import { Header } from "../../../src/core/navigation/Header";
import { ExpoIcon } from "../../../src/core/components/ExpoIcon";
import { ProjectScreen } from "../../../src/features/tasksList/screens/ProjectScreen";
import { useEffect } from "react";

export default function ProjectTasksList() {
  const { projectId, name } = useLocalSearchParams<{ projectId: string, name: string }>();
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      title: `${name ?? ""}`
    });
  }, [name, navigation]);
  return (
    <ProjectScreen projectId={projectId} name={name}/>
  );
}
