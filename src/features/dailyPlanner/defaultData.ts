import dayjs, { Dayjs } from "dayjs";
import { DAY_FORMAT, TIME_FORMAT } from "../../../config/constants";

export interface IDate {
  date: string;
  time?: string;
}

export interface IDateWithTime {
  date: string; //DAY_FORMAT
  time: string; //TIME_FORMAT
}

export interface ITask {
  id: string;
  name: string;
  startDate?: IDate;
  durationMin?: number;
}

export interface ITaskWithTime {
  id: string;
  name: string;
  startDate: IDateWithTime;
  durationMin: number;
}

export const DEFAULT_TASKS: ITask[] = [
  {
    id: "1",
    name: "Sprzatanie",
    startDate: {
      date: dayjs().format(DAY_FORMAT),
      time: dayjs().startOf('D').add(9, 'h').format(TIME_FORMAT),
    },
    durationMin: 60,
  },
  {
    id: "2",
    name: "Gotowanie",
    startDate: {
      date: dayjs().format(DAY_FORMAT),
      time: dayjs().startOf('D').add(10, 'h').add(15, 'm').format(TIME_FORMAT),
    },
    durationMin: 120,
  },
  {
    id: "7",
    name: "Zakupy",
    startDate: {
      date: dayjs().format(DAY_FORMAT),
      time: dayjs().startOf('D').format(TIME_FORMAT),
    },
    durationMin: 60,
  },
  {
    id: "6",
    name: "Zakupy",
    startDate: {
      date: dayjs().format(DAY_FORMAT),
      time: dayjs().startOf('D').add(1, 'h').add(15, 'm').format(TIME_FORMAT),
    },
    durationMin: 30,
  },
  {
    id: "5",
    name: "Zakupy",
    startDate: {
      date: dayjs().format(DAY_FORMAT),
      time: dayjs().startOf('D').add(2, 'h').format(TIME_FORMAT),
    },
    durationMin: 45,
  },
  {
    id: "3",
    name: "Gotowanie bardzo dlugo rosolu w kuchni babci",
    startDate: {
      date: dayjs().format(DAY_FORMAT)
    },
  },
  {
    id: "4",
    name: "Zakupy",
    startDate: {
      date: dayjs().subtract(1, 'd').format(DAY_FORMAT),
      time: dayjs().startOf('D').add(2, 'h').add(15, 'm').format(TIME_FORMAT),
    },
    durationMin: 60,
  },
];
