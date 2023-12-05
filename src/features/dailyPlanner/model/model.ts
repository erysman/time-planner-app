
export interface ITask {
  id: string;
  name: string;
  startDay?: string;
  startTime?: string;
  durationMin?: number;
}

export interface ITaskWithTime extends ITask{
  startDay: string;
  startTime: string;
  durationMin: number;
}
