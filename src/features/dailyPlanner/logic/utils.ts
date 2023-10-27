import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import utc from "dayjs/plugin/utc";
import { Dayjs } from "dayjs";
import { DAY_FORMAT, TIME_FORMAT } from "../../../../config/constants";

dayjs.extend(duration)
dayjs.extend(utc)



export function mapTimeToCalendarPosition(
  dateTime: Dayjs,
  minuteInPixels: number
): number {
  const timeFromDayStartMin = dateTime.diff(dateTime.startOf("D"), "m", true);
  const position = minuteInPixels * timeFromDayStartMin
  return position || 0;
}

export function mapCalendarPositionToTime(
  position: number,
  minuteInPixels: number
): string {
  const totalHeight = 3600 * minuteInPixels;
  const minutes = position/totalHeight * 3600;
  // console.log(`total: ${totalHeight}, top: ${position}, minutes ${minutes}`)
  return dayjs.utc(dayjs.duration({minutes}).asMilliseconds()).format(TIME_FORMAT)
}

export function mapDurationToHeight(
  durationMin: number,
  minuteInPixels: number
): number {
  const durationPx = durationMin * minuteInPixels;
  return durationPx || 0;
}

export function mapHeightToDurationMin(
  height: number,
  minuteInPixels: number
): number {
  const durationMin = height / minuteInPixels;
  // console.log(`height: ${height}, minToPx: ${minuteInPixels}, durationMin: ${durationMin}`)
  return durationMin || 0;
}

export function mapToDayjs(date: string, time: string): Dayjs {
  return dayjs(`${date}${time}`, `${DAY_FORMAT}${TIME_FORMAT}`);
}
