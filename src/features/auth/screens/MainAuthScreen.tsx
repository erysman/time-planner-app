import { tokens } from "@tamagui/themes";
import { Link } from "expo-router";
import { Button, H1, SizableText, XStack, YStack } from "tamagui";
import i18n from "../../../../config/i18n";
import { ExpoIcon } from "../../../core/components/ExpoIcon";
import { useAuth } from "../hooks/UseAuth";

export const MainAuthScreen = () => {
  const {
    loggingInProgress,
    actions: { loginWithGoogle },
  } = useAuth();
  return (
    <YStack
      fullscreen
      backgroundColor={"$background"}
      alignSelf={"center"}
      alignItems={"center"}
      top={"$16"}
    >
      <H1 marginVertical="$10">{"TIME PLANNER"}</H1>
      <YStack space={"$4"} mt={"$5"}>
        <Link href="/(auth)/login" asChild>
          <Button width={"$20"} borderRadius={"$6"}>
            <SizableText size="$3">
              {i18n.t("auth.email_login_button")}
            </SizableText>
          </Button>
        </Link>
        <Link href="/(auth)/signup" asChild>
          <Button width={"$20"} borderRadius={"$6"}>
            <SizableText size="$3">
              {i18n.t("auth.email_signup_button")}
            </SizableText>
          </Button>
        </Link>
        <Button
          width={"$20"}
          borderRadius={"$6"}
          onPress={loginWithGoogle}
          disabled={loggingInProgress}
          space={"$3"}
          justifyContent={"flex-start"}
          paddingHorizontal={"$5"}
        >
          <XStack space="$4">
            <ExpoIcon
              iconSet={"FontAwesome"}
              name={"google"}
              size={tokens.size["1.5"].val}
              color={"color"}
            />
            <SizableText size="$3">
              {i18n.t("auth.google_login_text")}
            </SizableText>
          </XStack>
        </Button>
      </YStack>
    </YStack>
  );
};
