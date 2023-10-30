import { H1, YStack } from "tamagui";
import { useAuth } from "../hooks/UseAuth";
import { EmailAndPasswordForm } from "../components/EmailAndPasswordForm";
import { AuthFooter } from "../components/AuthFooter";

export const SignUpScreen = () => {
  const {
    loggingInProgress,
    actions: { signUpWithPassword, loginWithGoogle },
  } = useAuth();
  return (
    <YStack alignItems={"center"} backgroundColor={"$background"} fullscreen>
        <H1 marginTop={100} marginBottom={50}>{"TIME PLANNER"}</H1>
      <EmailAndPasswordForm
        heading={"UTWÓRZ KONTO"}
        buttonText={"Załóż konto"}
        authenticate={signUpWithPassword}
        loginWithGoogle={loginWithGoogle}
        loggingInProgress={loggingInProgress}
        
      />

      <AuthFooter
        onPress={loginWithGoogle}
        disabled={loggingInProgress}
        redirectInfo={"Zaloguj się"}
        redirectButtonText={"Jeszcze nie masz konta? "}
        redirectHref={"/(auth)/login"}
      />
    </YStack>
  );
};
