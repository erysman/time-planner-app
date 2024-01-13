import dayjs, { Dayjs } from "dayjs";
import { DAY_FORMAT, TIME_FORMAT } from "../../config/constants";


export function minutesToShortTime(minutes: number) {
  'worklet';
  const minutesPinnedToMinStep = Math.round(minutes / 15) * 15;
  const hours = Math.floor(minutesPinnedToMinStep / 60);
  const remainingMinutes = minutesPinnedToMinStep % 60;

  // Ensure leading zeros for single-digit minutes
  const formattedMinutes = remainingMinutes < 10 ? `0${remainingMinutes}` : `${remainingMinutes}`;

  // Combine hours and minutes in the "HH:mm" format
  return `${hours}:${formattedMinutes}`;
}export function mapToDayjs(date: string | undefined, time: string): Dayjs {
  const d = date ?? dayjs().format(DAY_FORMAT)
  return dayjs(`${d}${time}`, `${DAY_FORMAT}${TIME_FORMAT}`);
}

