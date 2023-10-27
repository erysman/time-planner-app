import {BottomTabBarProps} from "@react-navigation/bottom-tabs";
import {GetProps, SizableText, Stack, useProps, useTheme, XStack, YStack} from "tamagui";
import {tokens} from "@tamagui/themes";
import { useScreenDimensions } from "../dimensions/UseScreenDimensions";

type StackProps = GetProps<typeof Stack>;

export interface TabBarProps extends BottomTabBarProps, StackProps {
}

export const TabBar = ({state, insets, descriptors, navigation}: TabBarProps) => {
    const {color} = useTheme();
    const {screenHeight, screenWidth, tabBarHeight} = useScreenDimensions();
    return (
        <XStack backgroundColor={"$background"}
                width={screenWidth}
                height={tabBarHeight}
                // borderTopLeftRadius={"$9"}
                // borderTopRightRadius={"$9"}
                borderTopWidth={1}
                // borderLeftWidth={1}
                // borderRightWidth={1}
                borderColor={"$backgroundFocus"}
                // position={"absolute"}
                // top={screenHeight - tabBarHeight}
                justifyContent={"space-evenly"}
                alignItems={"center"}
                elevation={25}
        >
            {
                state.routes.map((route, index) => {
                    const {options} = descriptors[route.key];
                    const label = options.tabBarLabel;
                    const icon = options.tabBarIcon;
                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            // The `merge: true` option makes sure that the params inside the tab screen are preserved
                            navigation.navigate({name: route.name, merge: true});
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        });
                    };
                    return (
                        <YStack
                            width={screenWidth/state.routes.length}
                            key={index}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            testID={options.tabBarTestID}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            accessibilityState={isFocused ? {selected: true} : {}}
                            alignItems={"center"}
                            justifyContent={"center"}
                            borderTopLeftRadius={"$9"}
                borderTopRightRadius={"$9"}
                        >
                            <XStack
                                width={"$6"}
                                height={"$2.5"}
                                borderRadius={"$6"}
                                onPress={onPress}
                                onLongPress={onLongPress}
                                backgroundColor={isFocused ? "$backgroundFocus" : "$background"}
                                justifyContent={"center"}
                                alignItems={"center"}
                            >
                                {icon ? icon({focused: true, color: color?.val as string, size: tokens.size["1.5"].val}) : null}
                            </XStack>
                            <SizableText mt={"$2"}>{label}</SizableText>
                        </YStack>
                    );
                })
            }
        </XStack>
    )
}