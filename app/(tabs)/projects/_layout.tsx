import { Stack } from "expo-router";
import { Header } from "../../../src/core/navigation/Header";


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
          title: "Projects and tasks"
        }}
      />
      <Stack.Screen
        name="[projectId]"
        options={{
          // header: (props) => (<Header {...props}/>),
        }}
      />
      <Stack.Screen
        name="tasks/[taskId]"
        options={{
          // header: (props) => (<Header {...props}/>),
        }}
      />
    </Stack>
  );
}
