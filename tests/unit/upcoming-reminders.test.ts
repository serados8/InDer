{
  require('./Setup.ts');
  const { test } = require('node:test');
  const assert = require('node:assert/strict');
  const { getUpcomingNotes } = require('../../src/services/ReminderRules.ts');
  const { makeNote, makeReminder, referenceTime: now } = require('./Fixtures.ts');
  const ids = (items: { Id: number }[]) => items.map(item => item.Id);

  test('US5: hanya pengingat aktif di masa depan yang muncul', () => {
    const notes = [makeNote(), makeNote({ Id: 2, Reminder: makeReminder({ IsActive: false }) }),
      makeNote({ Id: 3, Reminder: makeReminder({ ReminderDateTime: new Date(now).toISOString() }) }),
      makeNote({ Id: 4, Reminder: makeReminder() })];
    assert.deepEqual(ids(getUpcomingNotes(notes, now)), [4]);
  });
  test('US5: urutkan berdasarkan waktu absolut, bukan urutan leksikografis ISO', () => {
    const notes = [makeNote({ Id: 1, Reminder: makeReminder({ ReminderDateTime: '2026-10-22T04:00:00Z' }) }),
      makeNote({ Id: 2, Reminder: makeReminder({ ReminderDateTime: '2026-10-22T10:30:00+07:00' }) })];
    assert.deepEqual(ids(getUpcomingNotes(notes, now)), [2, 1]);
  });
  test('US5: waktu sama diurutkan dengan Id agar hasil konsisten', () => {
    assert.deepEqual(ids(getUpcomingNotes([makeNote({ Id: 9, Reminder: makeReminder() }),
      makeNote({ Id: 2, Reminder: makeReminder() })], now)), [2, 9]);
  });
  test('US5: menyelesaikan catatan tidak otomatis membatalkan pengingat', () => {
    assert.equal(getUpcomingNotes([makeNote({ IsCompleted: true, Reminder: makeReminder() })], now).length, 1);
  });
  test('US5: array sumber tidak berubah dan daftar kosong didukung', () => {
    const notes = [makeNote({ Id: 9, Reminder: makeReminder() }), makeNote({ Id: 2, Reminder: makeReminder() })];
    const before = JSON.stringify(notes);
    getUpcomingNotes(notes, now);
    assert.equal(JSON.stringify(notes), before);
    assert.deepEqual(getUpcomingNotes([], now), []);
  });
}
