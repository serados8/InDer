import { Note } from '../models/Note';
import { getDatabase } from './Database';

export const NoteRepository = {
  async list(): Promise<Note[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<Note>('SELECT * FROM Notes ORDER BY UpdatedAt DESC, Id DESC');
    return rows.map(row => ({ ...row, IsCompleted: Boolean(row.IsCompleted) }));
  },
  async get(id: number): Promise<Note> {
    const db = await getDatabase();
    const row = await db.getFirstAsync<Note>('SELECT * FROM Notes WHERE Id = ?', id);
    if (!row) throw new Error('Catatan tidak ditemukan.');
    return { ...row, IsCompleted: Boolean(row.IsCompleted) };
  },
  async create(title: string, content: string) {
    const db = await getDatabase();
    const now = new Date().toISOString();
    const result = await db.runAsync(
      'INSERT INTO Notes (Title, Content, CreatedAt, UpdatedAt) VALUES (?, ?, ?, ?)', title, content, now, now,
    );
    return result.lastInsertRowId;
  },
  async update(id: number, title: string, content: string) {
    const db = await getDatabase();
    await db.runAsync('UPDATE Notes SET Title = ?, Content = ?, UpdatedAt = ? WHERE Id = ?',
      title, content, new Date().toISOString(), id);
  },
  async complete(id: number, completed: boolean) {
    const db = await getDatabase();
    await db.runAsync('UPDATE Notes SET IsCompleted = ?, UpdatedAt = ? WHERE Id = ?',
      Number(completed), new Date().toISOString(), id);
  },
  async delete(id: number) {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM Notes WHERE Id = ?', id);
  },
};
