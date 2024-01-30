import { useState } from "react";
import { Button, H1, H2, H3, H4, SizableText, Stack, StackProps, YStack } from "tamagui";
import { ExpoIcon } from "../../../core/components/ExpoIcon";
import { AuthInput } from "./AuthInput";
import i18n from "../../../../config/i18n";

export interface EmailAndPasswordFormProps extends StackProps {
  heading: string;
  buttonText: string;
  loggingInProgress: boolean;
  authenticate: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => void;
}

export function EmailAndPasswordForm({
  heading,
  buttonText,
  authenticate,
  loggingInProgress,
  loginWithGoogle,
  ...props
}: EmailAndPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  return (
    <YStack
      backgroundColor={"$backgroundHover"}
      padding={24}
      borderRadius={"$11"}
      alignItems={"center"}
      {...props}
    >
      <SizableText size="$7">{heading}</SizableText>
      <Stack height="$3.5" justifyContent={"flex-end"}>
        {error.length === 0 ? null : (
          <SizableText color={"red"} mb={"$2"}>
            {i18n.t("auth.email_password_error")}
          </SizableText>
        )}
      </Stack>

      <AuthInput
        value={email}
        setValue={setEmail}
        placeholder={i18n.t("auth.email_placeholder")}
        inputMode={"email"}
        icon={
          <ExpoIcon
            iconSet={"MaterialIcons"}
            name={"person-outline"}
            size={24}
            color={"color"}
            iconStyle={{ marginHorizontal: 16 }}
          />
        }
        width="$20"
        height={"$4.5"}
      />
      <AuthInput
        mt={"$3.5"}
        type={"password"}
        inputMode={"text"}
        value={password}
        setValue={setPassword}
        placeholder={i18n.t("auth.password_placeholder")}
        icon={
          <ExpoIcon
            iconSet={"MaterialIcons"}
            name={"lock-outline"}
            size={24}
            color={"color"}
            iconStyle={{ marginHorizontal: 16 }}
          />
        }
        width="$20"
        height={"$4.5"}
      />
      <Button
        width="$20"
        borderRadius={"$6"}
        mt={24}
        disabled={
          loggingInProgress || email.length === 0 || password.length === 0
        }
        onPress={async () => {
          try {
            await authenticate(email, password);
          } catch (e: any) {
            setError(e.code ?? e.message);
            console.log(error);
          }
        }}
      >
        <SizableText>{buttonText}</SizableText>
      </Button>
    </YStack>
  );
}
