import { H1, YStack } from "tamagui";
import { useAuth } from "../hooks/UseAuth";
import { EmailAndPasswordForm } from "../components/EmailAndPasswordForm";
import { AuthFooter } from "../components/AuthFooter";
import { ErrorBoundary } from "react-error-boundary";
import { GenericFallback } from "../../../core/components/fallback/GenericFallback";
import i18n from "../../../../config/i18n";

export const SignUpForm = () => {
  const {
    loggingInProgress,
    actions: { signUpWithPassword, loginWithGoogle },
  } = useAuth();
  return (
    <YStack alignItems={"center"} backgroundColor={"$background"} fullscreen>
      <H1 marginTop={100} marginBottom={50}>
        {i18n.t("auth.app_title")}
      </H1>
      <EmailAndPasswordForm
        heading={i18n.t("auth.create_account_title")}
        buttonText={i18n.t("auth.signup_title")}
        authenticate={signUpWithPassword}
        loginWithGoogle={loginWithGoogle}
        loggingInProgress={loggingInProgress}
      />

      <AuthFooter
        onPress={loginWithGoogle}
        disabled={loggingInProgress}
        redirectInfo={i18n.t("auth.login_title")}
        redirectButtonText={i18n.t("auth.account_question")}
        redirectHref={"/(auth)/login"}
      />
    </YStack>
  );
};

export const SignUpScreen = () => {
  return (
    <ErrorBoundary FallbackComponent={GenericFallback}>
      <SignUpForm />
    </ErrorBoundary>
  );
};
