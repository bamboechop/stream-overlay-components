export interface Note {
  avatarUrl: string;
  date: Date;
  displayName: string;
  id: number;
  status: 'cancelled' | 'completed' | 'in-progress';
  text: string;
}
