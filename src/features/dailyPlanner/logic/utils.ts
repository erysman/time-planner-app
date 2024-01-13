import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import utc from "dayjs/plugin/utc";
import { Dayjs } from "dayjs";
import { DEFAULT_CALENDAR_STEP_MINUTES, TIME_FORMAT } from "../../../../config/constants";

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
  const durationMinPinnedToMinStep = Math.floor(durationMin/DEFAULT_CALENDAR_STEP_MINUTES)*DEFAULT_CALENDAR_STEP_MINUTES
  return durationMinPinnedToMinStep || 0;
}

export function timeToMinutes(time: string) {
  'worklet'
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

export function minutesToTime(minutes: number) {
  'worklet'
  const minutesPinnedToMinStep = Math.round(minutes/DEFAULT_CALENDAR_STEP_MINUTES)*DEFAULT_CALENDAR_STEP_MINUTES
  const hours = Math.floor(minutesPinnedToMinStep / 60);
  const remainingMinutes = minutesPinnedToMinStep % 60;

  // Ensure leading zeros for single-digit hours and minutes
  const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
  const formattedMinutes = remainingMinutes < 10 ? `0${remainingMinutes}` : `${remainingMinutes}`;

  // Combine hours and minutes in the "HH:mm" format
  return `${formattedHours}:${formattedMinutes}`;
}

