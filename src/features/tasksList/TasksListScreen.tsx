import { Link } from "expo-router"
import { Button, H1, H6, Stack, YStack } from "tamagui"
import axios from "axios"
import customInstance, { AXIOS_INSTANCE } from "../../../config/axios-instance"
import { useEffect, useState } from "react"
import { useApiHealth } from "../../core/debug/UseApiHealth"
import { useValidate } from "../../clients/time-planner-server/client"

export const TasksListScreen = () => {
    const {isServerAlive, refetch: refetchHealth} = useApiHealth();
    const { data, refetch: refetchValidate} = useValidate();
    

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
            <Button onPress={async () => {
                await refetchHealth();
            }}>
                {"Check server health"}
            </Button>
            <H6>{`Server connected: ${isServerAlive}`}</H6>
            <Button onPress={async () => {
                await refetchValidate();
            }}>
                {"Check server authentication"}
            </Button>
            <H6>{`Authentication valid: ${data?.valueOf()}`}</H6>
        </YStack>
    )
}