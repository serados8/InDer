{
  require('./Setup.ts');
  const { test } = require('node:test');
  const assert = require('node:assert/strict');
  const { filterNotes } = require('../../src/services/NoteRules.ts');
  const { makeNote, makeReminder } = require('./Fixtures.ts');
  const notes = [makeNote({ Id: 1 }), makeNote({ Id: 2, IsCompleted: true }),
    makeNote({ Id: 3, Title: 'Belanja', Reminder: makeReminder({ NoteId: 3, ReminderDateTime: '2020-01-01T00:00:00Z' }) })];
  const ids = (items: { Id: number }[]) => items.map(item => item.Id);

  test('US3: semua mempertahankan seluruh catatan dan urutannya', () => {
    assert.deepEqual(ids(filterNotes(notes, '', 'Semua')), [1, 2, 3]);
  });
  test('US3: selesai dan belum selesai membagi catatan tanpa tumpang tindih', () => {
    assert.deepEqual(ids(filterNotes(notes, '', 'Selesai')), [2]);
    assert.deepEqual(ids(filterNotes(notes, '', 'Belum selesai')), [1, 3]);
  });
  test('US3: memiliki reminder tetap mencakup pengingat lampau', () => {
    assert.deepEqual(ids(filterNotes(notes, '', 'Memiliki reminder')), [3]);
  });
  test('US3: pencarian dan filter diterapkan bersama', () => {
    assert.deepEqual(ids(filterNotes(notes, 'RPL', 'Selesai')), [2]);
    assert.deepEqual(filterNotes(notes, 'Belanja', 'Selesai'), []);
  });
  test('US3: filter tidak mengubah array/objek asal dan menangani daftar kosong', () => {
    const before = JSON.stringify(notes);
    filterNotes(notes, '', 'Selesai');
    assert.equal(JSON.stringify(notes), before);
    assert.deepEqual(filterNotes([], '', 'Semua'), []);
  });
}
