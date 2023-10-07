import { Ionicons, MaterialCommunityIcons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { Stack, StackProps, ThemeParsed, useTheme } from "tamagui";

const vectorIconsSets = {Ionicons, MaterialCommunityIcons, MaterialIcons, FontAwesome};
type VectorIconSetName = keyof typeof vectorIconsSets;

type IoniconsNames = keyof typeof Ionicons.glyphMap
type MaterialCommunityIconsNames = keyof typeof MaterialCommunityIcons.glyphMap
type MaterialIconsNames = keyof typeof MaterialIcons.glyphMap
type FontAwesomeNames = keyof typeof FontAwesome.glyphMap

export interface ExpoIconProps extends StackProps {
    iconSet: VectorIconSetName,
    name: IoniconsNames|MaterialCommunityIconsNames|MaterialIconsNames|FontAwesomeNames
    color: keyof ThemeParsed,
    size: number,
    iconStyle?: any,
}

export const ExpoIcon = ({iconSet, name, color, size, iconStyle, ...props }: ExpoIconProps) => {
    const SelectedIcon = vectorIconsSets[iconSet];
    const theme = useTheme();
    const iconColor = theme[color]?.val as string
    return (
        <Stack {...props}>
            <SelectedIcon name={name as any} size={size} color={iconColor} {...iconStyle}/>
        </Stack>
    )
}