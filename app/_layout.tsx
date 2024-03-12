import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  Theme as NavTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot, useNavigationContainerRef } from "expo-router";
import { Suspense, useEffect } from "react";
import { useColorScheme } from "react-native";
import { TamaguiProvider, Theme, useTheme } from "tamagui";
import tamaguiConfig from "../config/tamagui.config";
import { ScreenDimensionsProvider } from "../src/core/logic/dimensions/UseScreenDimensions";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "../src/features/auth/hooks/UseAuth";
export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";
import { UseThemeResult } from "@tamagui/web";
import { useSetupReactQuery } from "../config/react-query";
import { enableMapSet } from "immer";
import { routingInstrumentation } from "../config/sentry";
import * as Sentry from "@sentry/react-native";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";

enableMapSet();

export const unstable_settings = {
  initialRouteName: "(auth)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayout() {
  const ref = useNavigationContainerRef();
  useEffect(() => {
    if (ref) {
      routingInstrumentation.registerNavigationContainer(ref);
    }
  }, [ref]);
  const [loaded, error] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

const queryClient = new QueryClient();

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  useSetupReactQuery();

  return (
    <>
      <ScreenDimensionsProvider>
        <QueryClientProvider client={queryClient}>
          <TamaguiProvider config={tamaguiConfig}>
            <Theme name="light_blue">
              <NavigationTheme>
                <AuthProvider>
                  <GestureHandlerRootView style={{width: "100%", height: "100%"}}>
                    <Slot />
                  </GestureHandlerRootView>
                </AuthProvider>
              </NavigationTheme>
            </Theme>
          </TamaguiProvider>
        </QueryClientProvider>
      </ScreenDimensionsProvider>
    </>
  );
}

export function getTamaguiTheme(theme: UseThemeResult) {
  return {
    dark: false,
    colors: {
      primary: theme.color.get(),
      background: theme.background.get(),
      card: theme.background.get(),
      text: theme.color.get(),
      border: theme.backgroundFocus.get(),
      notification: theme.color.get(),
    },
  } as NavTheme;
}

export const NavigationTheme = (props: { children: any }) => {
  const theme = useTheme();
  return (
    <ThemeProvider value={getTamaguiTheme(theme)}>
      {props.children}
    </ThemeProvider>
  );
};

export default Sentry.wrap(RootLayout);
