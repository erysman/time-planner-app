import { H1, YStack } from "tamagui";
import { useAuth } from "../hooks/UseAuth";
import { EmailAndPasswordForm } from "../components/EmailAndPasswordForm";
import { AuthFooter } from "../components/AuthFooter";
import { ErrorBoundary } from "react-error-boundary";
import { GenericFallback } from "../../../core/components/fallback/GenericFallback";

export const LogInForm = () => {
  const {
    loggingInProgress,
    actions: { logInWithPassword, loginWithGoogle },
  } = useAuth();
  return (
    <YStack alignItems={"center"} backgroundColor={"$background"} fullscreen>
      <H1 marginTop={100} marginBottom={50}>
        {"TIME PLANNER"}
      </H1>
      <EmailAndPasswordForm
        heading={"WITAJ PONOWNIE"}
        buttonText={"Zaloguj się"}
        authenticate={logInWithPassword}
        loginWithGoogle={loginWithGoogle}
        loggingInProgress={loggingInProgress}
      />

      <AuthFooter
        onPress={loginWithGoogle}
        disabled={loggingInProgress}
        redirectInfo={"Załóż teraz"}
        redirectButtonText={"Jeszcze nie masz konta? "}
        redirectHref={"/(auth)/signup"}
      />
    </YStack>
  );
};

export const LogInScreen = () => {
  return (
    <ErrorBoundary FallbackComponent={GenericFallback}>
      <LogInForm />
    </ErrorBoundary>
  );
};
