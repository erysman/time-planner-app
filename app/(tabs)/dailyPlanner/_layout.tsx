import { Stack } from "expo-router";
import { useTheme } from "tamagui";


export default function DailyPlannerLayout() {
  const theme = useTheme();
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: theme.background.get(),
        },
        headerShadowVisible: false,
        headerTintColor: theme.color.get(),
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
