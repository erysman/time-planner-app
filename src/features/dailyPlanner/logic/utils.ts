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

export function mapCalendarPositionToMinutes(
  position: number,
  minuteInPixels: number
): number {
  'worklet'
  const totalHeight = 3600 * minuteInPixels;
  return Math.trunc(position / totalHeight * 3600);
}

export function mapCalendarPositionToTime(
  position: number,
  minuteInPixels: number
): string {
  const minutes = mapCalendarPositionToMinutes(position, minuteInPixels);
  return dayjs.utc(dayjs.duration({minutes}).asMilliseconds()).format(TIME_FORMAT)
}

export function mapDurationToHeight(
  durationMin: number,
  minuteInPixels: number
): number {
  'worklet'
  const durationPx = durationMin * minuteInPixels;
  return durationPx || 0;
}

export function mapHeightToDurationMin(
  height: number,
  minuteInPixels: number
): number {
  'worklet'
  const durationMin = height / minuteInPixels;
  const durationMinPinnedToMinStep = Math.floor(durationMin/15)*15
  return durationMinPinnedToMinStep || 0;
}

export function mapToDayjs(date: string, time: string): Dayjs {
  return dayjs(`${date}${time}`, `${DAY_FORMAT}${TIME_FORMAT}`);
}

export function timeToMinutes(time: string) {
  'worklet'
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

export function minutesToTime(minutes: number) {
  'worklet'
  const minutesPinnedToMinStep = Math.floor(minutes/15)*15
  console.log("minutes", minutes, "pinned", minutesPinnedToMinStep)
  const hours = Math.floor(minutesPinnedToMinStep / 60);
  const remainingMinutes = minutesPinnedToMinStep % 60;

  // Ensure leading zeros for single-digit hours and minutes
  const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
  const formattedMinutes = remainingMinutes < 10 ? `0${remainingMinutes}` : `${remainingMinutes}`;

  // Combine hours and minutes in the "HH:mm" format
  return `${formattedHours}:${formattedMinutes}`;
}

export function minutesToShortTime(minutes: number) {
  'worklet'
  const minutesPinnedToMinStep = Math.floor(minutes/15)*15
  const hours = Math.floor(minutesPinnedToMinStep / 60);
  const remainingMinutes = minutesPinnedToMinStep % 60;

  // Ensure leading zeros for single-digit minutes
  const formattedMinutes = remainingMinutes < 10 ? `0${remainingMinutes}` : `${remainingMinutes}`;

  // Combine hours and minutes in the "HH:mm" format
  return `${hours}:${formattedMinutes}`;
}