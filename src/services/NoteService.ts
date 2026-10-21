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
    const notes = await NoteRepository.list();
    const reminders = await ReminderRepository.list();
    return notes.map(note => ({ ...note, Reminder: reminders.find(item => item.NoteId === note.Id) ?? null }));
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
      if (isUpcomingReminder(reminder)) {
        await NotificationService.schedule(note, new Date(reminder.ReminderDateTime));
      }
      throw new Error('Catatan gagal dihapus.');
    }
  },
};
