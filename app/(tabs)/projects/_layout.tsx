import { Stack } from "expo-router";
import { Header } from "../../../src/core/navigation/Header";
import i18n from "../../../config/i18n";


export default function ProjectsLayout() {

  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center"
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          // header: (props) => (<Header {...props}/>),
          title: i18n.t("tabs.projects_list_header")
        }}
      />
      <Stack.Screen
        name="[projectId]"
        options={{
          // header: (props) => (<Header {...props}/>),
        }}
      />
    </Stack>
  );
}
