export interface Note {
  avatarUrl: string;
  date: Date;
  displayName: string;
  note_id: number;
  status: 'cancelled' | 'completed' | 'in-progress';
  text: string;
}
