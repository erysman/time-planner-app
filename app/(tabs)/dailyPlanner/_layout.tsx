import { Stack } from "expo-router";


export default function DailyPlannerLayout() {

  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center"
      }}
    >
      <Stack.Screen
        name="index"
        options={{ 
          headerShown: false
        }}
      />
      <Stack.Screen
        name="[day]"
        options={{ 
          title: '',
          headerShown: false //this is override inside component, when proper title is set
        }}
      />
    </Stack>
  );
}
