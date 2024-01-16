import { Dayjs } from "dayjs";
import { useState } from "react";

export const useValidateTime = () => {
    //   const timeSchema = z.string();
    const [isValid, setIsValid] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string>();
    const validateTime = (
      startTime?: Dayjs,
      endTime?: Dayjs,
      required = false
    ) => {
      // const parsedStartTime = timeSchema.safeParse(startTime?.toDate());
      // const parsedEndTime = timeSchema.safeParse(endTime?.toDate());
      // const success = parsedStartTime.success && parsedEndTime.success;
      // setIsValid(success);
      // const errorMessage = !parsedStartTime.success
      //   ? JSON.parse(parsedStartTime.error.message)[0].message
      //   : !parsedEndTime.success
      //   ? JSON.parse(parsedEndTime.error.message)[0].message
      //   : undefined;
      // if (errorMessage) {
      //     setErrorMessage(errorMessage);
      // }
      if (required && (!startTime || !endTime)) {
        setIsValid(false);
        setErrorMessage("startTime or endTime not set");
        return false;
      }
      if (startTime && endTime && startTime.isAfter(endTime)) {
        setIsValid(false);
        setErrorMessage("startTime must be before endTime");
        return false;
      }
      setErrorMessage(undefined);
      return true;
    };
    return {
      isValid,
      errorMessage,
      validateTime,
    };
  };