import { useCallback, useMemo } from "react";
import * as Localization from "expo-localization";
import { Separator, SizableText, YStack } from "tamagui";

export const DailyCalendarSlots = (props: {hourSlotHeight: number}) => {

    const listAllHours = useCallback((locale: string): string[] => {
        return [...Array(24).keys()].map((i) => {
          const date = new Date(2000, 0, 1, i, 0, 0); // January is used just for reference, you can use any month
          return date.toLocaleTimeString(locale, { hour: "numeric" });
        });
      }, []);
    
      const hoursInLocale = useMemo(
        () => listAllHours(Localization.locale),
        [listAllHours]
      );

    return (
        <>
        {hoursInLocale.map((hour) => (
            <DailyCalendarSlot key={hour} hour={hour} height={props.hourSlotHeight} />
          ))}
        </>
    )
}


export interface DailyCalendarSlotProps {
    hour: string;
    height: number;
  }
  
  export const DailyCalendarSlot = ({ hour, height }: DailyCalendarSlotProps) => {
    return (
      <YStack h={height}>
        <Separator borderBottomWidth={2} />
        <SizableText paddingLeft={10}>{hour}</SizableText>
      </YStack>
    );
  };
  