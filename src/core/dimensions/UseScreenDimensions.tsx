import React, {useContext, useMemo} from "react";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {Dimensions} from "react-native";
import { isDevice } from "expo-device";

interface ScreenDimensions {
    screenWidth: number,
    screenHeight: number,
    tabBarHeight: number,
    headerHeight: number,
    headerTotalHeight: number,
    topInset: number,
}

const ScreenDimensionsContext = React.createContext<ScreenDimensions>({
    screenHeight: 0,
    screenWidth: 0,
    tabBarHeight: 0,
    headerHeight: 0,
    headerTotalHeight: 0,
    topInset: 0
});

export const ScreenDimensionsProvider = (props: any) => {
    const {height, width: screenWidth} = Dimensions.get("window");
    const {top: topInset} = useSafeAreaInsets();
    
    const value = useMemo(() => {
        const isEmulator = !isDevice;
        const headerHeight = Math.floor(0.063*height);
        const headerTotalHeight = headerHeight + topInset;
        const tabBarHeight = Math.floor(height * 0.1);
        const screenHeight = height - tabBarHeight - (isEmulator ? headerTotalHeight : headerHeight);
        return {
            screenHeight,
            screenWidth,
            tabBarHeight,
            headerHeight,
            headerTotalHeight,
            topInset
        }
    }, [height, topInset, screenWidth]);

    return (
        <ScreenDimensionsContext.Provider value={value}>
            {props.children}
        </ScreenDimensionsContext.Provider>
    )
}

export function useScreenDimensions(): ScreenDimensions {
    const context = useContext(ScreenDimensionsContext);
    if (!context) {
        throw new Error("User's ScreenDimensions context doesn't exist!");
    }
    return context;
}