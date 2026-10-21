{
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { validateTitle } = require('../src/utils/ValidationUtils.ts');

test('N1: judul kosong dan whitespace ditolak dengan pesan Indonesia', () => {
  for (const title of ['', '   ', '\t\n', '\u00a0']) {
    assert.throws(() => validateTitle(title), { message: 'Judul catatan wajib diisi.' });
  }
});

test('N2: judul valid termasuk karakter Indonesia, apostrof, dan emoji diterima', () => {
  for (const title of ['Tugas RPL', '  Baca bab 2  ', "Catatan O'Brien", 'Rencana 📚']) {
    assert.doesNotThrow(() => validateTitle(title));
  }
});
}
