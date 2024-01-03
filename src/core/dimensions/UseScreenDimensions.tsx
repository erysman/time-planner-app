import React, {useContext, useMemo} from "react";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {Dimensions} from "react-native";

interface ScreenDimensions {
    // screenWidth: number,
    screenHeight: number,
    tabBarHeight: number,
    headerHeight: number,
    headerTotalHeight: number,
    topInset: number,
}

const ScreenDimensionsContext = React.createContext<ScreenDimensions>({
    screenHeight: 0,
    // screenWidth: 0,
    tabBarHeight: 0,
    headerHeight: 0,
    headerTotalHeight: 0,
    topInset: 0
});

export const ScreenDimensionsProvider = (props: any) => {
    const {height, width: screenWidth} = Dimensions.get("screen");
    const {top: topInset} = useSafeAreaInsets();
    

    
    const value = useMemo(() => {
        const headerHeight = 0.093*height;
        const headerTotalHeight = headerHeight + topInset;
        const tabBarHeight = height * 0.1;
        const screenHeight = height - headerTotalHeight - tabBarHeight;
        return {
            screenHeight,
            // screenWidth,
            tabBarHeight,
            headerHeight,
            headerTotalHeight,
            topInset
        }
    }, [height, topInset]);

    console.log(value.headerHeight/height)
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