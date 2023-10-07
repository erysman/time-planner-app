import { useEffect, useState } from "react";
import { useHealth } from "../../clients/time-planner-server/client";

export const useApiHealth = () => {
    const {data, isError, isLoading, isRefetching, refetch} = useHealth({
        query: {
            cacheTime: 0
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

    return {isServerAlive, refetch}
}