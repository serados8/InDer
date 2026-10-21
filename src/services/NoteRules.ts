import type { Note, NoteFilter, NoteWithReminder } from '../models/Note';
import { validateTitle } from '../utils/ValidationUtils';

export function prepareNoteInput(title: string, content: string): Pick<Note, 'Title' | 'Content'> {
  validateTitle(title);
  return { Title: title.trim().normalize('NFC'), Content: content.trim().normalize('NFC') };
}

function normalizeSearch(value: string) {
  return value.normalize('NFC').toLocaleLowerCase('id-ID');
}

export function matchesNoteSearch(note: Note, query: string) {
  const search = normalizeSearch(query.trim());
  return normalizeSearch(note.Title).includes(search) || normalizeSearch(note.Content).includes(search);
}

export function matchesNoteFilter(note: NoteWithReminder, filter: NoteFilter) {
  switch (filter) {
    case 'Semua': return true;
    case 'Selesai': return note.IsCompleted;
    case 'Belum selesai': return !note.IsCompleted;
    case 'Memiliki reminder': return note.Reminder !== null;
    default: return false;
  }
}

export function filterNotes(notes: NoteWithReminder[], query: string, filter: NoteFilter) {
  return notes.filter(note => matchesNoteSearch(note, query) && matchesNoteFilter(note, filter));
}
