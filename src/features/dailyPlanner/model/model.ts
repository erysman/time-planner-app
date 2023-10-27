
export interface ITask {
  id: string;
  name: string;
  startDate?: string;
  startTime?: string;
  durationMin?: number;
}

export interface ITaskWithTime {
  id: string;
  name: string;
  startDate: string;
  startTime: string;
  durationMin: number;
}
