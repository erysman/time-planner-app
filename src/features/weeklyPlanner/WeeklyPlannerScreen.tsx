import { H1, H6, Stack } from "tamagui";
import { useScreenDimensions } from "../../core/dimensions/UseScreenDimensions";
import { SafeAreaView } from "react-native-safe-area-context";

export const WeeklyPlannerScreen = () => {
  const {} = useScreenDimensions();
  return (
    <SafeAreaView>
      <Stack>
        <H6>list of tasks and weekly calendar</H6>
      </Stack>
    </SafeAreaView>
  );
};
