import { useEffect, useState } from "react";
import { API_HEALTH_INTERVAL } from "../../../config/constants";
import { useHealth } from "../../clients/time-planner-server/client";

export const useApiHealth = () => {
    const {data, isError, isLoading, isRefetching} = useHealth({
        query: {
            cacheTime: 0,
            refetchInterval: API_HEALTH_INTERVAL
        }
    })

    const [isServerAlive, setIsServerAlive] = useState(false);

    useEffect(() => {
        if(isLoading || isError || isRefetching || !data) {
            setIsServerAlive(false);
            return;
        } 
        if (data) {
            const isStatusUp = data.status === "UP"
            setIsServerAlive(isStatusUp)
        }
    }, [isLoading, isError, isRefetching, data]);

    return {isServerAlive}
}