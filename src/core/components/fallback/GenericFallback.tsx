import { FallbackProps } from "react-error-boundary";
import { Button, H6, SizableText, YStack } from "tamagui";
import { AddProject } from "../../../features/tasksList/components/ProjectsList";
import { ExpoIcon } from "../ExpoIcon";
import { useErrorBoundary } from "react-error-boundary";
import { uniqueId } from "lodash";
import { ErrorInfo, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import i18n from "../../../../config/i18n";
import * as Sentry from "@sentry/react-native";

export const GenericFallback = ({
  error,
  resetErrorBoundary,
}: FallbackProps) => {
  return (
    <YStack mt={24} marginHorizontal={24} space={12}>
      <H6 color={"$red9"}>{`${i18n.t("common.generic_error_title")}:`}</H6>
      <SizableText color={"$red9"}>{error.message}</SizableText>
      <Button
        icon={<ExpoIcon iconSet="MaterialIcons" name="refresh" size={16} />}
        onPress={resetErrorBoundary}
      >
        {i18n.t("common.retry")}
      </Button>
    </YStack>
  );
};

export const NoRetryFallback = (props: { error: { message?: string } }) => {
  return (
    <YStack mt={24} marginHorizontal={24} space={12}>
      <H6 color={"$red9"}>{`${i18n.t("common.generic_error_title")}:`}</H6>
      <SizableText color={"$red9"}>{props.error?.message}</SizableText>
    </YStack>
  );
};

export const logError = (error: Error, info: ErrorInfo) => {
  Sentry.captureException(error);
};
