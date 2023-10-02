import { Stack } from "expo-router";


export default function TasksLayout() {

  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center"
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Projects and tasks"
        }}
      />
      <Stack.Screen
        name="tasks/[taskId]"
        options={{
          
        }}
      />
    </Stack>
  );
}
