import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  FontAwesome,
} from "@expo/vector-icons";
import { Stack, StackProps, ThemeParsed, useTheme } from "tamagui";
import { Path, Svg } from "react-native-svg";

const vectorIconsSets = {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  FontAwesome,
};
type VectorIconSetName = keyof typeof vectorIconsSets;

type IoniconsNames = keyof typeof Ionicons.glyphMap;
type MaterialCommunityIconsNames = keyof typeof MaterialCommunityIcons.glyphMap;
type MaterialIconsNames = keyof typeof MaterialIcons.glyphMap;
type FontAwesomeNames = keyof typeof FontAwesome.glyphMap;

export interface ExpoIconProps extends StackProps {
  iconSet: VectorIconSetName;
  name:
    | IoniconsNames
    | MaterialCommunityIconsNames
    | MaterialIconsNames
    | FontAwesomeNames;
  color: keyof ThemeParsed;
  size: number;
  iconStyle?: any;
}

export const ExpoIcon = ({
  iconSet,
  name,
  color,
  size,
  iconStyle,
  ...props
}: ExpoIconProps) => {
  const SelectedIcon = vectorIconsSets[iconSet];
  const theme = useTheme();
  const iconColor = theme[color]?.val as string;
  return (
    <Stack {...props}>
      <SelectedIcon
        name={name as any}
        size={size}
        color={iconColor}
        {...iconStyle}
      />
    </Stack>
  );
};

export interface IIconProps {
  color: keyof ThemeParsed;
  size: number;
}

const Icon = (props: { children: any }) => {
  return (
    <Stack flexGrow={0} flexShrink={0}>
      {props.children}
    </Stack>
  );
};

export const StartIcon = ({ size, color }: IIconProps) => {
  const theme = useTheme();
  const iconColor = theme[color]?.val as string;
  return (
    <Icon>
      <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
        <Path
          d="M5.08332 4.26668L6.94999 1.85001C7.08332 1.67223 7.24176 1.54179 7.42532 1.45868C7.60888 1.37557 7.80043 1.33379 7.99999 1.33334C8.19999 1.33334 8.39176 1.37512 8.57532 1.45868C8.75888 1.54223 8.9171 1.67268 9.04999 1.85001L10.9167 4.26668L13.75 5.21668C14.0389 5.30557 14.2667 5.46957 14.4333 5.70868C14.6 5.94779 14.6833 6.21157 14.6833 6.50001C14.6833 6.63334 14.6638 6.76668 14.6247 6.90001C14.5855 7.03334 14.5218 7.16112 14.4333 7.28334L12.6 9.88334L12.6667 12.6167C12.6778 13.0056 12.55 13.3333 12.2833 13.6C12.0167 13.8667 11.7055 14 11.35 14C11.3278 14 11.2055 13.9833 10.9833 13.95L7.99999 13.1167L5.01665 13.95C4.9611 13.9722 4.89999 13.9862 4.83332 13.992C4.76665 13.9978 4.70554 14.0005 4.64999 14C4.29443 14 3.98332 13.8667 3.71665 13.6C3.44999 13.3333 3.32221 13.0056 3.33332 12.6167L3.39999 9.86668L1.58332 7.28334C1.49443 7.16112 1.43043 7.03334 1.39132 6.90001C1.35221 6.76668 1.33288 6.63334 1.33332 6.50001C1.33332 6.22223 1.41399 5.96401 1.57532 5.72534C1.73665 5.48668 1.96154 5.31712 2.24999 5.21668L5.08332 4.26668ZM5.89999 5.41668L2.66665 6.48334L4.73332 9.46668L4.66665 12.65L7.99999 11.7333L11.3333 12.6667L11.2667 9.46668L13.3333 6.51668L10.1 5.41668L7.99999 2.66668L5.89999 5.41668Z"
          fill={iconColor}
        />
      </Svg>
    </Icon>
  );
};

export const HourglassIcon = ({ size, color }: IIconProps) => {
  const theme = useTheme();
  const iconColor = theme[color]?.val as string;
  return (
    <Icon>
      <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
        <Path
          d="M5.33329 13.3333H10.6666V11.3333C10.6666 10.6 10.4055 9.97223 9.88329 9.45001C9.36107 8.92779 8.73329 8.66668 7.99996 8.66668C7.26663 8.66668 6.63885 8.92779 6.11663 9.45001C5.5944 9.97223 5.33329 10.6 5.33329 11.3333V13.3333ZM7.99996 7.33334C8.73329 7.33334 9.36107 7.07223 9.88329 6.55001C10.4055 6.02779 10.6666 5.40001 10.6666 4.66668V2.66668H5.33329V4.66668C5.33329 5.40001 5.5944 6.02779 6.11663 6.55001C6.63885 7.07223 7.26663 7.33334 7.99996 7.33334ZM2.66663 14.6667V13.3333H3.99996V11.3333C3.99996 10.6556 4.1584 10.0193 4.47529 9.42468C4.79218 8.83001 5.23374 8.35512 5.79996 8.00001C5.23329 7.64445 4.79174 7.16957 4.47529 6.57534C4.15885 5.98112 4.0004 5.3449 3.99996 4.66668V2.66668H2.66663V1.33334H13.3333V2.66668H12V4.66668C12 5.34445 11.8417 5.98068 11.5253 6.57534C11.2088 7.17001 10.7671 7.6449 10.2 8.00001C10.7666 8.35557 11.2084 8.83068 11.5253 9.42534C11.8422 10.02 12.0004 10.656 12 11.3333V13.3333H13.3333V14.6667H2.66663Z"
          fill={iconColor}
        />
      </Svg>
    </Icon>
  );
};
