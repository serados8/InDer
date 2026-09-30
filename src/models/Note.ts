import { Reminder } from './Reminder';

export interface Note {
  Id: number;
  Title: string;
  Content: string;
  CreatedAt: string;
  UpdatedAt: string;
  IsCompleted: boolean;
}

export interface NoteWithReminder extends Note {
  Reminder: Reminder | null;
}

export type NoteFilter = 'Semua' | 'Belum selesai' | 'Selesai' | 'Memiliki reminder';
