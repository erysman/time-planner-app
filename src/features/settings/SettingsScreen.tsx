import { Accordion, Button, H5, H6, Paragraph, Separator, Square, YStack } from "tamagui";
import { useAuth } from "../auth/hooks/UseAuth";
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

export const MainSettingsList = () => {
  const {
    user,
    actions: { logout },
  } = useAuth();
  return (
    <YStack mt={16} space={"$2"} marginHorizontal={24}>
      <SettingsMenu>
        
        <SettingsMenuItem
          id="autoschedule"
          title="Automatic schedule"
          titleType={H5}
        >
          <AutoscheduleSubMenu />
        </SettingsMenuItem>
        <Separator width="100%" alignSelf="center"/>
        <SettingsMenuItem id="user" title="User profile" titleType={H5}>
          <Button onPress={logout}>{"Log out"}</Button>
        </SettingsMenuItem>
        <Separator width="100%" alignSelf="center"/>
        <SettingsMenuItem id="debug" title="Debug" titleType={H5}>
          <DebugSettings user={user}/>
        </SettingsMenuItem>
      </SettingsMenu>
    </YStack>
  );
};

export const AutoscheduleSubMenu = () => {
  return (
    <SettingsMenu>
      <Separator width="100%" alignSelf="center"/>
      <SettingsMenuItem id="banned-ranges" title="Banned ranges" iconSize={20}>
        <YStack>
          <BannedRangesListLoad />
          <AddBannedRangeItem />
        </YStack>
      </SettingsMenuItem>
      <Separator width="100%" alignSelf="center"/>
      <SettingsMenuItem id="projects-ranges" title="Projects ranges" iconSize={20}>
        <YStack>
          <ProjectRangesListLoad />
        </YStack>
      </SettingsMenuItem>
    </SettingsMenu>
  );
};

export const DebugSettings = (props:{user: FirebaseAuthTypes.User | null}) => {
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
      <Accordion.Content paddingTop={0} paddingRight={0}>{children}</Accordion.Content>
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
