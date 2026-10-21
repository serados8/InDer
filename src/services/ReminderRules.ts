import type { NoteWithReminder } from '../models/Note';
import type { Reminder } from '../models/Reminder';

export function isUpcomingReminder(reminder: Reminder | null, now = Date.now()): reminder is Reminder {
  return reminder !== null && reminder.IsActive && Date.parse(reminder.ReminderDateTime) > now;
}

export function getUpcomingNotes(notes: NoteWithReminder[], now = Date.now()) {
  return notes.filter(note => isUpcomingReminder(note.Reminder, now))
    .sort((a, b) => Date.parse(a.Reminder!.ReminderDateTime) - Date.parse(b.Reminder!.ReminderDateTime) || a.Id - b.Id);
}
