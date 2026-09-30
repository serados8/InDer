import { NoteRepository } from '../database/NoteRepository';
import { ReminderRepository } from '../database/ReminderRepository';
import { NoteFilter, NoteWithReminder } from '../models/Note';
import { validateTitle } from '../utils/ValidationUtils';
import { NotificationService } from './NotificationService';

export function filterNotes(notes: NoteWithReminder[], query: string, filter: NoteFilter) {
  const search = query.trim().toLocaleLowerCase('id-ID');
  return notes.filter(note => {
    const matches = `${note.Title} ${note.Content}`.toLocaleLowerCase('id-ID').includes(search);
    return matches && (filter === 'Semua'
      || (filter === 'Selesai' && note.IsCompleted)
      || (filter === 'Belum selesai' && !note.IsCompleted)
      || (filter === 'Memiliki reminder' && note.Reminder !== null));
  });
}

export const NoteService = {
  async list(): Promise<NoteWithReminder[]> {
    const notes = await NoteRepository.list();
    const reminders = await ReminderRepository.list();
    return notes.map(note => ({ ...note, Reminder: reminders.find(item => item.NoteId === note.Id) ?? null }));
  },
  async save(title: string, content: string, id?: number) {
    validateTitle(title);
    if (id === undefined) {
      try { return await NoteRepository.create(title.trim(), content.trim()); }
      catch { throw new Error('Catatan gagal disimpan.'); }
    }
    const previous = await NoteRepository.get(id);
    const reminder = await ReminderRepository.get(id);
    const active = reminder?.IsActive && new Date(reminder.ReminderDateTime).getTime() > Date.now();
    try {
      if (active) {
        await NotificationService.cancel(id);
        await NotificationService.schedule({ ...previous, Title: title.trim(), Content: content.trim() },
          new Date(reminder.ReminderDateTime));
      }
      await NoteRepository.update(id, title.trim(), content.trim());
      return id;
    } catch {
      if (active) {
        await NotificationService.cancel(id);
        await NotificationService.schedule(previous, new Date(reminder.ReminderDateTime));
      }
      throw new Error('Catatan gagal diperbarui.');
    }
  },
  async complete(id: number, completed: boolean) {
    await NoteRepository.get(id);
    try { await NoteRepository.complete(id, completed); }
    catch { throw new Error('Catatan gagal diperbarui.'); }
  },
  async delete(id: number) {
    const note = await NoteRepository.get(id);
    const reminder = await ReminderRepository.get(id);
    try {
      await NotificationService.cancel(id);
      await NoteRepository.delete(id);
    } catch {
      if (reminder?.IsActive && new Date(reminder.ReminderDateTime).getTime() > Date.now()) {
        await NotificationService.schedule(note, new Date(reminder.ReminderDateTime));
      }
      throw new Error('Catatan gagal dihapus.');
    }
  },
};
