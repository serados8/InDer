import { Reminder } from '../models/Reminder';
import { getDatabase } from './Database';

export const ReminderRepository = {
  async list(): Promise<Reminder[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<Reminder>('SELECT * FROM Reminders');
    return rows.map(row => ({ ...row, IsActive: Boolean(row.IsActive) }));
  },
  async get(noteId: number) {
    const db = await getDatabase();
    const row = await db.getFirstAsync<Reminder>('SELECT * FROM Reminders WHERE NoteId = ?', noteId);
    return row ? { ...row, IsActive: Boolean(row.IsActive) } : null;
  },
  async save(noteId: number, date: string) {
    const db = await getDatabase();
    await db.runAsync(`INSERT INTO Reminders (NoteId, ReminderDateTime, IsActive, CreatedAt) VALUES (?, ?, 1, ?)
      ON CONFLICT(NoteId) DO UPDATE SET ReminderDateTime = excluded.ReminderDateTime, IsActive = 1`,
    noteId, date, new Date().toISOString());
  },
  async delete(noteId: number) {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM Reminders WHERE NoteId = ?', noteId);
  },
};
