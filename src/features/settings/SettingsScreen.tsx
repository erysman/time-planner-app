import { Button, YStack } from "tamagui";
import { useAuth } from "../auth/hooks/UseAuth";
import { SafeAreaView } from "react-native-safe-area-context";

export const SettingsScreen = () => {
  const {
    actions: { logout },
  } = useAuth();
  return (
    <SafeAreaView>
      <YStack>
        <Button mt={16} marginHorizontal={24} onPress={logout}>
          {"Logout"}
        </Button>
      </YStack>
    </SafeAreaView>
  );
};
