import { Button, H1, SizableText, Stack, XStack, YStack } from "tamagui";
import { useAuth } from "../hooks/UseAuth";
import { useScreenDimensions } from "../../../core/dimensions/UseScreenDimensions";
import { Link } from "expo-router";
import { ExpoIcon } from "../../../core/components/ExpoIcon";
import { tokens } from "@tamagui/themes";
import i18n from "../../../../config/i18n";

export const MainAuthScreen = () => {
    const { loggingInProgress, actions: { loginWithGoogle } } = useAuth();
    const { screenHeight, screenWidth } = useScreenDimensions();
    return (
        <Stack
            height={screenHeight}
            width={screenWidth}
            backgroundColor={"$background"}
        >
            <Stack
                alignSelf={"center"}
                alignItems={"center"}
                justifyContent={"center"}
                top={"$16"}
            >
                <H1 marginVertical="$10">{"TIME PLANNER"}</H1>
                <YStack space={"$4"} mt={"$5"}>
                    <Link href="/(auth)/login" asChild>
                        <Button width={"$20"} borderRadius={"$6"}>
                            <SizableText size="$3">{i18n.t("auth.email_login_button")}</SizableText>
                        </Button>
                    </Link>
                    <Link href="/(auth)/signup" asChild>
                        <Button width={"$20"} borderRadius={"$6"}>
                            <SizableText size="$3">{i18n.t("auth.email_signup_button")}</SizableText>
                        </Button>
                    </Link>
                    <Button width={"$20"}
                        borderRadius={"$6"}
                        onPress={loginWithGoogle}
                        disabled={loggingInProgress}
                        space={"$3"}
                        justifyContent={"flex-start"}
                        paddingHorizontal={"$5"}

                    >
                        <XStack space="$4">
                            <ExpoIcon iconSet={"FontAwesome"} name={"google"} size={tokens.size["1.5"].val} color={"color"} />
                            <SizableText size="$3">{i18n.t("auth.google_login_text")}</SizableText>
                        </XStack>
                    </Button>
                </YStack>

            </Stack>
        </Stack>
    );
};