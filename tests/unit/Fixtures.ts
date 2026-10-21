import type { NoteWithReminder } from '../../src/models/Note';
import type { Reminder } from '../../src/models/Reminder';

export const referenceTime = Date.parse('2026-10-22T03:00:00Z');

export function makeReminder(overrides: Partial<Reminder> = {}): Reminder {
  return { Id: 1, NoteId: 1, ReminderDateTime: '2026-10-22T03:01:00Z', IsActive: true,
    CreatedAt: '2026-10-22T02:00:00Z', ...overrides };
}

export function makeNote(overrides: Partial<NoteWithReminder> = {}): NoteWithReminder {
  return { Id: 1, Title: 'Tugas RPL', Content: 'Baca bab dua', IsCompleted: false,
    CreatedAt: '2026-10-22T02:00:00Z', UpdatedAt: '2026-10-22T02:00:00Z', Reminder: null, ...overrides };
}
