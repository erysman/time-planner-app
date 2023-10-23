import {
  Checkbox,
  SizableText,
  Stack,
  StackProps,
  XStack,
  YStack,
} from "tamagui";
import { ExpoIcon } from "../../../core/components/ExpoIcon";
import { IDate, IDateWithTime, ITaskWithTime } from "../defaultData";
import { DAY_FORMAT, TIME_FORMAT } from "../../../../config/constants";
import dayjs, { Dayjs } from "dayjs";

export interface DailyCalendarItemsProps {
  slotHeight: number;
  tasks: ITaskWithTime[];
}

export const DailyCalendarTasks = ({
  tasks,
  slotHeight,
}: DailyCalendarItemsProps) => {
  return (
    <YStack fullscreen position="absolute" paddingLeft={60} paddingRight={15}>
      {tasks.map((item) => (
        <DailyCalendarTask key={item.id} slotHeight={slotHeight} task={item} />
      ))}
    </YStack>
  );
};

export function mapTimeToCalendarPosition(
  time: Dayjs,
  // {date, time}: IDateWithTime,
  slotHeight: number
): number {
  const timeFromDayStartMin = time.diff(time.startOf("D"), "m", true);
  const position = (slotHeight * timeFromDayStartMin) / 60;
  return position;
}

function mapDurationToHeight(durationMin: number, slotHeight: number): number {
  const durationPx = (durationMin / 60) * slotHeight;
  return durationPx;
}

function mapToDayjs({ date, time }: IDateWithTime): Dayjs {
  return dayjs(`${date}${time}`, `${DAY_FORMAT}${TIME_FORMAT}`);
}

export interface DailyCalendarTaskProps extends StackProps {
  slotHeight: number;
  task: ITaskWithTime;
}
export const DailyCalendarTask = ({
  slotHeight,
  task,
}: DailyCalendarTaskProps) => {
  const { name, durationMin, startDate } = task;

  const top = mapTimeToCalendarPosition(mapToDayjs(startDate), slotHeight);
  const height = mapDurationToHeight(durationMin, slotHeight);
  const isSmall = height < slotHeight;
  return (
    <Stack>
      <XStack
        position="absolute"
        w={"100%"}
        paddingTop={isSmall ? 0 : 10}
        borderColor="$borderColor"
        backgroundColor={"$background"}
        borderRadius={"$4"}
        top={top}
        height={height - 2} //small margin to see boundry between tasks
        alignItems={isSmall ? "center" : "flex-start"}
      >
        <Checkbox size="$1.5" circular marginHorizontal={16}>
          <Checkbox.Indicator>
            <ExpoIcon
              iconSet="MaterialIcons"
              name="check"
              size={24}
              color="color"
            />
          </Checkbox.Indicator>
        </Checkbox>
        <SizableText
          flexGrow={1}
          flexShrink={1}
          size={"$5"}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {name}
        </SizableText>
        <SizableText size={"$3"} marginHorizontal={16}>
          Important
        </SizableText>
      </XStack>
    </Stack>
  );
};
