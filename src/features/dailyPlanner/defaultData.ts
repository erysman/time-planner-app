import dayjs, { Dayjs } from "dayjs";
import { DAY_FORMAT, TIME_FORMAT } from "../../../config/constants";
import { ITask } from "./model/model";




export const DEFAULT_TASKS: ITask[] = [
  {
    id: "1",
    name: "Gotowanie bardzo dlugo rosolu w kuchni babci",
    startDate: dayjs().format(DAY_FORMAT),
    startTime: dayjs().startOf('D').format(TIME_FORMAT),
    durationMin: 30,
  },
  {
    id: "2",
    name: "Gotowanie bardzo dlugo rosolu w kuchni babci",
    startDate: dayjs().format(DAY_FORMAT),
    startTime:dayjs().startOf('D').add(45, 'm').format(TIME_FORMAT),
    durationMin: 45,
  },
  {
    id: "3",
    name: "Gotowanie bardzo dlugo rosolu w kuchni babci",
    startDate: dayjs().format(DAY_FORMAT)
  },
  {
    id: "4",
    name: "Gotowanie bardzo dlugo rosolu w kuchni babci",
    startDate: dayjs().format(DAY_FORMAT),
    startTime:dayjs().startOf('D').add(2, 'h').format(TIME_FORMAT),
    durationMin: 60,
  },
  {
    id: "5",
    name: "Gotowanie bardzo dlugo rosolu w kuchni babci",
    startDate: dayjs().format(DAY_FORMAT),
    startTime:dayjs().startOf('D').add(3, 'h').format(TIME_FORMAT),
    durationMin: 75,
  },
  {
    id: "6",
    name: "Gotowanie bardzo dlugo rosolu w kuchni babci",
    startDate: dayjs().format(DAY_FORMAT),
    startTime: dayjs().startOf('D').add(4, 'h').add(15, 'm').format(TIME_FORMAT),
    durationMin: 90,
  },
  {
    id: "7",
    name: "Gotowanie bardzo dlugo rosolu w kuchni babci",
    startDate: dayjs().format(DAY_FORMAT),
    startTime:dayjs().startOf('D').add(7, 'h').format(TIME_FORMAT),
    durationMin: 105,
  },
  {
    id: "49",
    name: "Gotowanie bardzo dlugo rosolu w kuchni babci",
    startDate: dayjs().subtract(1, 'd').format(DAY_FORMAT),
    startTime:dayjs().startOf('D').add(2, 'h').format(TIME_FORMAT),
    durationMin: 60,
  },
];
