import {
  Accordion,
  Button,
  H5,
  H6,
  Paragraph,
  Separator,
  Square,
  YStack,
  Image,
  Circle,
} from "tamagui";
import { IAuthContextActions, useAuth } from "../auth/hooks/UseAuth";
import { SafeAreaView } from "react-native-safe-area-context";

import { ErrorBoundary } from "react-error-boundary";
import { GenericFallback } from "../../core/components/fallback/GenericFallback";
import { useApiHealth } from "../../core/logic/debug/UseApiHealth";
import { ExpoIcon } from "../../core/components/ExpoIcon";
import { Children, ComponentType } from "react";
import {
  AddBannedRangeItem,
  BannedRangesListLoad,
} from "./components/BannedRangesList";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { ProjectRangesListLoad } from "./components/ProjectRangesList";
import i18n from "../../../config/i18n";

export const MainSettingsList = () => {
  const { user, actions } = useAuth();
  return (
    <YStack mt={16} space={"$2"} marginHorizontal={24}>
      <SettingsMenu>
        <SettingsMenuItem
          id="autoschedule"
          title={i18n.t("settings.autoschedule_title")}
          titleType={H5}
        >
          <AutoscheduleSubMenu />
        </SettingsMenuItem>
        <Separator width="100%" alignSelf="center" />
        <SettingsMenuItem id="user" title={i18n.t("settings.user_profile_title")} titleType={H5}>
          <UserSettings user={user} userActions={actions} />
        </SettingsMenuItem>
        <Separator width="100%" alignSelf="center" />
        <SettingsMenuItem id="debug" title="Debug" titleType={H5}>
          <DebugSettings user={user} />
        </SettingsMenuItem>
      </SettingsMenu>
    </YStack>
  );
};

export const AutoscheduleSubMenu = () => {
  return (
    <SettingsMenu>
      <Separator width="100%" alignSelf="center" />
      <SettingsMenuItem id="banned-ranges" title={i18n.t("settings.banned_ranges_title")} iconSize={20}>
        <YStack>
          <BannedRangesListLoad />
          <AddBannedRangeItem />
        </YStack>
      </SettingsMenuItem>
      <Separator width="100%" alignSelf="center" />
      <SettingsMenuItem
        id="projects-ranges"
        title={i18n.t("settings.projects_ranges_title")}
        iconSize={20}
      >
        <YStack>
          <ProjectRangesListLoad />
        </YStack>
      </SettingsMenuItem>
    </SettingsMenu>
  );
};

export const UserSettings = (props: {
  user: FirebaseAuthTypes.User | null;
  userActions: IAuthContextActions;
}) => {
  return (
    <>
      <Circle size={75} overflow="hidden" alignSelf="center">
        {props.user ? (
          <Image
            h={75}
            w={75}
            alignSelf="center"
            source={{ uri: props.user.photoURL ?? undefined }}
          />
        ) : null}
      </Circle>
      <H6 marginTop={12}>{`${i18n.t("settings.user_name_title")}: ${props.user?.displayName}`}</H6>
      <H6>{`${i18n.t("settings.user_email_title")}: ${props.user?.email}`}</H6>
      <Button marginTop={12} onPress={props.userActions.logout}>
        {i18n.t("auth.logout")}
      </Button>
    </>
  );
};

export const DebugSettings = (props: {
  user: FirebaseAuthTypes.User | null;
}) => {
  const { isServerAlive } = useApiHealth();
  return (
    <>
      <H6>{`Server connected: ${isServerAlive}`}</H6>
      <Button onPress={async () => console.log(await props.user?.getIdToken())}>
        {"Log auth token"}
      </Button>
    </>
  );
};

export const SettingsMenu = (props: { children: any }) => {
  return (
    <Accordion overflow="hidden" width="100%" type="multiple">
      {props.children}
    </Accordion>
  );
};

interface SettingsMenuItemProps {
  id: string;
  title: string;
  children: any;
  titleType?: ComponentType;
  iconSize?: number;
}

export const SettingsMenuItem = ({
  id,
  children,
  title,
  titleType,
  iconSize,
}: SettingsMenuItemProps) => {
  const TitleType = titleType ?? H6;
  return (
    <Accordion.Item value={id}>
      <Accordion.Trigger
        borderTopWidth={0}
        borderBottomWidth={0}
        borderLeftWidth={0}
        borderRightWidth={0}
        flexDirection="row"
        borderRadius={"$5"}
      >
        {({ open }) => (
          <>
            <Square
              animation="slow"
              rotate={open ? "270deg" : "0deg"}
              marginRight={16}
            >
              <ExpoIcon
                iconSet="MaterialIcons"
                name="arrow-forward"
                size={iconSize ?? 24}
              />
            </Square>
            <TitleType>{title}</TitleType>
          </>
        )}
      </Accordion.Trigger>
      <Accordion.Content paddingTop={0} paddingRight={0}>
        {children}
      </Accordion.Content>
    </Accordion.Item>
  );
};

export const SettingsScreen = () => {
  return (
    <SafeAreaView>
      <ErrorBoundary FallbackComponent={GenericFallback}>
        <MainSettingsList />
      </ErrorBoundary>
    </SafeAreaView>
  );
};
