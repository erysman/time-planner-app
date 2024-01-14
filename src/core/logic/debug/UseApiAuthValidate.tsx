import { useEffect, useState } from "react";
import { API_HEALTH_INTERVAL } from "../../../config/constants";
import { useValidate } from "../../clients/time-planner-server/client";

export const useApiAuthValidate = () => {
    const {data, isError, isLoading, isRefetching} = useValidate({
        query: {
            cacheTime: 0,
            refetchInterval: API_HEALTH_INTERVAL
        }
    })

    const [isApiAuthValid, setIsApiAuthValid] = useState(false);

    useEffect(() => {
        if(isLoading || isError || isRefetching || !data) {
            setIsApiAuthValid(false);
            return;
        } 
        setIsApiAuthValid(data.valueOf())
    }, [isLoading, isError, isRefetching, data]);

    return {isApiAuthValid}
}