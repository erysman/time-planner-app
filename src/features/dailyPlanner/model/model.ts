
export interface ITask {
  id: string;
  name: string;
  startDate?: string;
  startTime?: string;
  durationMin?: number;
  listPosition?: number;
}

export interface ITaskWithTime extends ITask{
  startDate: string;
  startTime: string;
  durationMin: number;
}

export interface ITaskWithPosition extends ITask {
  listPosition: number;
}
