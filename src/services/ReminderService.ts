import { NoteRepository } from '../database/NoteRepository';
import { ReminderRepository } from '../database/ReminderRepository';
import { Note } from '../models/Note';
import { Reminder } from '../models/Reminder';
import { validateReminderDate } from '../utils/ValidationUtils';
import { NotificationService } from './NotificationService';

async function restore(note: Note, previous: Reminder | null) {
  if (previous?.IsActive && new Date(previous.ReminderDateTime).getTime() > Date.now()) {
    await NotificationService.schedule(note, new Date(previous.ReminderDateTime));
  }
}

export const ReminderService = {
  async save(noteId: number, date: Date) {
    validateReminderDate(date);
    if (!await NotificationService.permission(true)) {
      throw new Error('Izin notifikasi diperlukan agar pengingat dapat bekerja. Buka Pengaturan untuk memberikan izin.');
    }
    const note = await NoteRepository.get(noteId);
    const previous = await ReminderRepository.get(noteId);
    await NotificationService.cancel(noteId);
    try {
      await NotificationService.schedule(note, date);
      await ReminderRepository.save(noteId, date.toISOString());
    } catch {
      try {
        await NotificationService.cancel(noteId);
        await restore(note, previous);
      } catch {
        throw new Error('Pengingat gagal disimpan dan jadwal gagal dipulihkan. Atur ulang pengingat ini.');
      }
      throw new Error('Pengingat gagal disimpan. Silakan coba lagi.');
    }
  },
  async delete(noteId: number) {
    const note = await NoteRepository.get(noteId);
    const previous = await ReminderRepository.get(noteId);
    await NotificationService.cancel(noteId);
    try {
      await ReminderRepository.delete(noteId);
    } catch {
      await restore(note, previous);
      throw new Error('Pengingat gagal dihapus. Silakan coba lagi.');
    }
  },
};
