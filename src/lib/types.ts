export interface Participant {
  id: string;
  name: string;
  time: number | null; // seconds
  errors: number;
  wpm: number;
  completed: boolean;
}
