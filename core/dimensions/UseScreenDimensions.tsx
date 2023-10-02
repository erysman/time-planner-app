import React, {useContext} from "react";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {Dimensions} from "react-native";

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
    headerHeight: 0,
    tabBarHeight: 0,
    headerTotalHeight: 0,
    topInset: 0
});

export const ScreenDimensionsProvider = (props: any) => {
    const {height, width: screenWidth} = Dimensions.get("screen");
    const {top: topInset} = useSafeAreaInsets();
    const screenHeight = height - topInset;

    const headerHeight = screenHeight * 0.065;
    const headerTotalHeight = headerHeight + topInset;
    const tabBarHeight = screenHeight * 0.1
    return (
        <ScreenDimensionsContext.Provider value={{
            screenHeight,
            screenWidth,
            headerHeight,
            headerTotalHeight,
            tabBarHeight,
            topInset
        }}>
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