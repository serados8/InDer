{
  require('./Setup.ts');
  const { test } = require('node:test');
  const assert = require('node:assert/strict');
  const { matchesNoteSearch } = require('../../src/services/NoteRules.ts');
  const { makeNote } = require('./Fixtures.ts');

  test('US2: judul dan isi dapat dicari tanpa peka kapital', () => {
    const note = makeNote();
    assert.equal(matchesNoteSearch(note, '  rPl  '), true);
    assert.equal(matchesNoteSearch(note, 'BAB DUA'), true);
    assert.equal(matchesNoteSearch(note, 'tidak ada'), false);
  });
  test('US2: query kosong atau whitespace cocok dengan setiap catatan', () => {
    assert.equal(matchesNoteSearch(makeNote({ Content: '' }), ' \t'), true);
  });
  test('US2: frasa yang hanya terbentuk dari sambungan judul dan isi tidak cocok', () => {
    assert.equal(matchesNoteSearch(makeNote({ Title: 'Tugas', Content: 'RPL' }), 'Tugas RPL'), false);
  });
  test('US2: Unicode dengan bentuk berbeda tetap cocok', () => {
    assert.equal(matchesNoteSearch(makeNote({ Title: 'Café' }), 'CAFE\u0301'), true);
  });
  test('US2: simbol wildcard SQL diperlakukan sebagai karakter biasa', () => {
    assert.equal(matchesNoteSearch(makeNote(), '%'), false);
    assert.equal(matchesNoteSearch(makeNote({ Content: 'Target 100% _selesai' }), '% _'), true);
  });
}
