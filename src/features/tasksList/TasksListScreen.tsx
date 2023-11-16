import { Link } from "expo-router"
import { Button, H6, YStack } from "tamagui"
import { useApiAuthValidate } from "../../core/debug/UseApiAuthValidate"
import { useApiHealth } from "../../core/debug/UseApiHealth"
import { useAuth } from "../auth/hooks/UseAuth"

export const TasksListScreen = () => {
    
    const auth = useAuth();

    return (
        <YStack space={"$2"}>
            {/* <Link href={{
                pathname: "/(tabs)/(tasks)/tasks/[taskId]",
                params: {
                    taskId: "1"
                }
            }} asChild>
                <Button>
                    {"Task 1"}
                </Button>
            </Link> */}
        </YStack>
    )
}