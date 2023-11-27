import { Button, H6, YStack } from "tamagui";
import { useAuth } from "../auth/hooks/UseAuth";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApiHealth } from "../../core/debug/UseApiHealth";

export const SettingsScreen = () => {
  const {
    user, actions: { logout },
  } = useAuth();
  const { isServerAlive } = useApiHealth();
  return (
    <SafeAreaView>
      <YStack mt={16}  space={"$2"} marginHorizontal={24}>
        <Button  onPress={logout}>
          {"Logout"}
        </Button>
        <H6>{`Server connected: ${isServerAlive}`}</H6>
            <Button variant="outlined" size="$3"  onPress={async () => console.log(await user?.getIdToken())}>
                {"Log auth token"}
            </Button>
            
 
      </YStack>
    </SafeAreaView>
  );
};
