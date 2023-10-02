import { Link } from "expo-router"
import { Button, H1, Stack, YStack } from "tamagui"

export const TasksListScreen = () => {
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
        </YStack>
    )
}