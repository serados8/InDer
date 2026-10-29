import { NoteRepository } from '../database/NoteRepository';
import { ReminderRepository } from '../database/ReminderRepository';
import { NoteWithReminder } from '../models/Note';
import { prepareNoteInput } from './NoteRules';
import { isUpcomingReminder } from './ReminderRules';
import { NotificationService } from './NotificationService';

export { filterNotes } from './NoteRules';
export { getUpcomingNotes } from './ReminderRules';

export const NoteService = {
  async list(): Promise<NoteWithReminder[]> {
    try {
      const notes = await NoteRepository.list();
      const reminders = await ReminderRepository.list();
      const byNote = new Map(reminders.map(reminder => [reminder.NoteId, reminder]));
      return notes.map(note => ({ ...note, Reminder: byNote.get(note.Id) ?? null }));
    } catch {
      throw new Error('Catatan gagal dimuat. Database belum dapat diakses. Silakan coba lagi.');
    }
  },
  async save(title: string, content: string, id?: number) {
    const input = prepareNoteInput(title, content);
    if (id === undefined) {
      try { return await NoteRepository.create(input.Title, input.Content); }
      catch { throw new Error('Catatan gagal disimpan.'); }
    }
    const previous = await NoteRepository.get(id);
    const reminder = await ReminderRepository.get(id);
    const active = isUpcomingReminder(reminder);
    try {
      if (active) {
        await NotificationService.cancel(id);
        await NotificationService.schedule({ ...previous, ...input },
          new Date(reminder.ReminderDateTime));
      }
      await NoteRepository.update(id, input.Title, input.Content);
      return id;
    } catch {
      if (active) {
        try {
          await NotificationService.cancel(id);
          await NotificationService.schedule(previous, new Date(reminder.ReminderDateTime));
        } catch {
          throw new Error('Catatan gagal diperbarui dan jadwal gagal dipulihkan. Atur ulang pengingat catatan ini.');
        }
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
      if (isUpcomingReminder(reminder)) {
        try { await NotificationService.schedule(note, new Date(reminder.ReminderDateTime)); }
        catch { throw new Error('Catatan gagal dihapus dan jadwal gagal dipulihkan. Atur ulang pengingat catatan ini.'); }
      }
      throw new Error('Catatan gagal dihapus.');
    }
  },
};
