import dayjs from "dayjs";
import { useState } from "react";
import { z } from "zod";
import {
  DEFAULT_CALENDAR_STEP_MINUTES,
  MIN_TASK_DURATION_MINUTES,
} from "../../../../../config/constants";

export const useValidateTime = () => {
  const startTimeSchema = z.string();
  // .refine(
  //   (value) => {
  //     const minutes = parseInt(value.split(":")[1], 10);
  //     return minutes % DEFAULT_CALENDAR_STEP_MINUTES === 0; // Only allow multiples of 15 for minutes
  //   },
  //   {
  //     message: `Invalid time format or minutes are not a multiple of ${DEFAULT_CALENDAR_STEP_MINUTES}`,
  //   }
  // );
  const [isStartTimeValid, setIsStartTimeValid] = useState(true);
  const [startTimeMessage, setStartTimeMessage] = useState<string>();
  const validateStartTime = (startTime?: string) => {
    const result = startTimeSchema.safeParse(startTime);
    setIsStartTimeValid(result.success);
    if (result.success === false) {
      setStartTimeMessage(JSON.parse(result.error.message)[0].message);
    } else {
      setStartTimeMessage(undefined);
    }
    return result.success;
  };
  return { isStartTimeValid, startTimeMessage, validateStartTime };
};

export const useValidateStartDay = () => {
  const minDay = dayjs().startOf("day").toDate();
  const maxDay = dayjs().add(1, "year").endOf("year").toDate();
  const startDaySchema = z.coerce
    .date()
    .min(minDay, { message: "Can't set planned day in past" })
    .max(maxDay);
  const [isStartDayValid, setIsStartDayValid] = useState(true);
  const [startDayMessage, setStartDayMessage] = useState<string>();
  const validateStartDay = (startDay?: string) => {
    const result = startDaySchema.safeParse(startDay);
    setIsStartDayValid(result.success);
    if (result.success === false) {
      setStartDayMessage(JSON.parse(result.error.message)[0].message);
    } else {
      setStartDayMessage(undefined);
    }
    return result.success;
  };
  return { isStartDayValid, startDayMessage, validateStartDay };
};

export const useValidateDuration = () => {
  const durationMinSchema = z
    .number()
    .max(24 * 60)
    .min(MIN_TASK_DURATION_MINUTES)
    .multipleOf(DEFAULT_CALENDAR_STEP_MINUTES)
    .nullable();
  const [isDurationValid, setIsDurationValid] = useState(true);
  const [durationMessage, setDurationMessage] = useState<string>();
  const validateDuration = (durationMin?: number) => {
    const result = durationMinSchema.safeParse(durationMin);
    if (result.success === false) {
      setDurationMessage(JSON.parse(result.error.message)[0].message);
    } else {
      setDurationMessage(undefined);
    }
    setIsDurationValid(result.success);
    return result.success;
  };
  return { isDurationValid, durationMessage, validateDuration };
};

export const useValidateName = () => {
  const nameSchema = z
    .string()
    .max(25)
    .min(1, { message: "Name can't be empty" });
  const [isNameValid, setIsNameValid] = useState(true);
  const [nameMessage, setNameMessage] = useState<string>();
  const validateName = (name?: string) => {
    const result = nameSchema.safeParse(name);
    if (result.success === false) {
      setNameMessage(JSON.parse(result.error.message)[0].message);
    } else {
      setNameMessage(undefined);
    }
    setIsNameValid(result.success);
    return result.success;
  };
  return { isNameValid, nameMessage, validateName };
};
