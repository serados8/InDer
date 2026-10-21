{
  require('./Setup.ts');
  const { test } = require('node:test');
  const assert = require('node:assert/strict');
  const { prepareNoteInput } = require('../../src/services/NoteRules.ts');

  test('US1: judul kosong/whitespace tidak dapat disimpan', () => {
    for (const title of ['', ' ', '\n\t', '\u00a0']) {
      assert.throws(() => prepareNoteInput(title, 'Isi tetap ada'), /Judul catatan wajib diisi/);
    }
  });
  test('US1: isi opsional dan spasi luar dibuang', () => {
    assert.deepEqual(prepareNoteInput('  Tugas RPL  ', ' \n '), { Title: 'Tugas RPL', Content: '' });
  });
  test('US1: baris dan spasi di dalam isi tidak dirusak', () => {
    assert.equal(prepareNoteInput('Judul', '  Bab 1\n  subbab\nBab 2  ').Content, 'Bab 1\n  subbab\nBab 2');
  });
  test('US1: Unicode ekuivalen dinormalisasi tanpa membuang emoji/apostrof', () => {
    assert.deepEqual(prepareNoteInput('Cafe\u0301 📚', "O'Brien"), { Title: 'Café 📚', Content: "O'Brien" });
  });
}
