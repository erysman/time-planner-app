import { Stack, useLocalSearchParams } from "expo-router";
import { TasksListScreen } from "../../../../src/features/tasksList/TasksListScreen";
import { SizableText } from "tamagui";


export default function TasksList() {
  const { taskId } = useLocalSearchParams<{ taskId: string }>();
  return (
    <>
      <Stack.Screen
        options={{
          title: `Task ${taskId}`
        }}
      />
      <SizableText>Task id: {taskId}</SizableText>
    </>
  );
}