import { Stack, Tabs } from "expo-router";
import { TabBar } from "../../src/core/navigation/TabBar";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";


export default function AuthLayout() {

  return (
    <Stack
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
    </Stack>
  );
}
