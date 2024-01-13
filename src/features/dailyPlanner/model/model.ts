
export interface ITask {
  id: string;
  name: string;
  startDay?: string;
  startTime?: string;
  durationMin?: number;
  isImportant: boolean;
  isUrgent: boolean;
  projectId: string;
}

export interface ITaskWithTime extends ITask{
  startDay: string;
  startTime: string;
  durationMin: number;
}

export interface TimeAndDuration {
  startTimeMinutes: number | null;
  durationMinutes: number | null;
}

export type TimeAndDurationMap = {
  [k: string]: {
      startTimeMinutes: number | null;
      durationMinutes: number | null;
  };
}

export interface IProject {
  id: string;
  name: string;
  color: string;
}