import { Link } from "expo-router"
import { Button, H6, YStack } from "tamagui"
import { useApiAuthValidate } from "../../core/debug/UseApiAuthValidate"
import { useApiHealth } from "../../core/debug/UseApiHealth"

export const TasksListScreen = () => {
    const { isServerAlive } = useApiHealth();
    const { isApiAuthValid } = useApiAuthValidate();

    return (
        <YStack space={"$2"}>
            <Link href={{
                pathname: "/(tabs)/(tasks)/tasks/[taskId]",
                params: {
                    taskId: "1"
                }
            }} asChild>
                <Button>
                    {"Task 1"}
                </Button>
            </Link>
            <Button>
                {"Add new project"}
            </Button>
            <H6>{`Server connected: ${isServerAlive}`}</H6>
            <H6>{`Authentication valid: ${isApiAuthValid}`}</H6>
        </YStack>
    )
}