import { Stack } from "expo-router";
import { Header } from "../../../src/core/navigation/Header";


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
          header: (props) => (<Header title={"Projects and tasks"} {...props}/>),
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
