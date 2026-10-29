{
  require('./Setup.ts');
  const { test } = require('node:test');
  const assert = require('node:assert/strict');
  const { performMutation } = require('../../src/services/MutationService.ts');

  test('aksi berhasil disimpan sebelum daftar dimuat ulang', async () => {
    const calls: string[] = [];
    const result = await performMutation(async () => { calls.push('save'); }, async () => { calls.push('refresh'); });
    assert.deepEqual(calls, ['save', 'refresh']);
    assert.deepEqual(result, { Saved: true, RefreshFailed: false });
  });
  test('gagal menyimpan tidak menampilkan sukses atau memuat ulang', async () => {
    let refreshed = false;
    const result = await performMutation(async () => { throw new Error('Catatan gagal disimpan.'); },
      async () => { refreshed = true; });
    assert.equal(refreshed, false);
    assert.deepEqual(result, { Saved: false, Error: 'Catatan gagal disimpan.' });
  });
  test('gagal memuat ulang setelah simpan tidak mengulangi aksi dan tetap dilaporkan tersimpan', async () => {
    let writes = 0;
    const result = await performMutation(async () => { writes++; }, async () => { throw new Error('Read failed'); });
    assert.equal(writes, 1);
    assert.deepEqual(result, { Saved: true, RefreshFailed: true });
  });
  test('kegagalan tanpa objek Error memakai pesan Indonesia', async () => {
    const result = await performMutation(async () => { throw null; }, async () => {});
    assert.deepEqual(result, { Saved: false, Error: 'Operasi database gagal. Silakan coba lagi.' });
  });
}
