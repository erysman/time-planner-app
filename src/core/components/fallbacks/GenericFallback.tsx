import { FallbackProps } from "react-error-boundary";
import { Button, H6, SizableText, YStack } from "tamagui";
import { AddProjectView } from "../../../features/tasksList/components/ProjectsList";
import { ExpoIcon } from "../ExpoIcon";

export const GenericFallback = ({
    error,
    resetErrorBoundary,
  }: FallbackProps) => {
    return (
      <YStack mt={24} marginHorizontal={24} space={12}>
        <H6>{`Something went wrong:`}</H6>
        <SizableText>{error.message}</SizableText>
        <Button
          icon={<ExpoIcon iconSet="MaterialIcons" name="refresh" size={16} />}
          onPress={resetErrorBoundary}
        >
          {"Retry"}
        </Button>
        <AddProjectView />
      </YStack>
    );
  };
