import { Href, Link } from "expo-router";
import { SizableText, XStack, YStack } from "tamagui";

import { Button } from "tamagui";
import { ExpoIcon } from "../../../core/components/ExpoIcon";

export interface AuthFooterProps {
  onPress: () => Promise<void>;
  disabled: boolean;
  redirectInfo: string;
  redirectButtonText: string;
  redirectHref: Href<string>;
}

export const AuthFooter = ({
  onPress,
  disabled,
  redirectButtonText,
  redirectInfo,
  redirectHref,
}: AuthFooterProps) => {
  return (
    <>
      <XStack alignItems="center" mt={"$3"}>
        <SizableText>{redirectButtonText}</SizableText>
        <Link href={redirectHref}>
          <SizableText>{redirectInfo}</SizableText>
        </Link>
      </XStack>
      <YStack mt={"$4"} alignItems={"center"}>
        <SizableText>{"lub zaloguj się przez"}</SizableText>
        <XStack space={"$3"} mt={"$3"}>
          <Button
            circular
            disabled={true}
            icon={
              <ExpoIcon
                iconSet={"FontAwesome"}
                name={"facebook"}
                size={16}
                color={"color"}
              />
            }
          />
          <Button
            circular
            onPress={onPress}
            disabled={disabled}
            icon={
              <ExpoIcon
                iconSet={"FontAwesome"}
                name={"google"}
                size={16}
                color={"color"}
              />
            }
          />
        </XStack>
      </YStack>
    </>
  );
};
