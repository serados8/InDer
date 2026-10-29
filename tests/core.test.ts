const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const { DatabaseSync } = require('node:sqlite');
const { mkdtempSync, readFileSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');

const directory = mkdtempSync(path.join(tmpdir(), 'inder-tests-'));
const filename = path.join(directory, 'inder.db');
let db = new DatabaseSync(filename);
let permitted = true;
let failSchedule = false;
let failWrite = false;
let dropSchedule = false;
let failCancel = false;
let failRead = false;
const pending = new Map();
const events: string[] = [];
const adapter = {
  async execAsync(sql: string) { db.exec(sql); },
  async runAsync(sql: string, ...params: (string | number)[]) {
    if (failWrite) { failWrite = false; throw new Error('Simulated write failure'); }
    const result = db.prepare(sql).run(...params);
    return { changes: Number(result.changes), lastInsertRowId: Number(result.lastInsertRowid) };
  },
  async getFirstAsync(sql: string, ...params: (string | number)[]) { return db.prepare(sql).get(...params) ?? null; },
  async getAllAsync(sql: string, ...params: (string | number)[]) {
    if (failRead) { failRead = false; throw new Error('Simulated read failure'); }
    return db.prepare(sql).all(...params);
  },
  async withTransactionAsync(action: () => Promise<void>) {
    db.exec('BEGIN');
    try { await action(); db.exec('COMMIT'); }
    catch (error) { db.exec('ROLLBACK'); throw error; }
  },
};
const notifications = {
  async getAllScheduledNotificationsAsync() { return [...pending.values()]; },
  setNotificationHandler() {},
  IosAuthorizationStatus: { PROVISIONAL: 3 },
  SchedulableTriggerInputTypes: { DATE: 'date' },
  async getPermissionsAsync() { return { granted: permitted }; },
  async requestPermissionsAsync() { return { granted: permitted }; },
  async cancelScheduledNotificationAsync(id: string) {
    events.push('cancel');
    if (failCancel) { failCancel = false; throw new Error('Simulated cancellation failure'); }
    pending.delete(id);
  },
  async scheduleNotificationAsync(request: { identifier: string; content: { title: string }; trigger: { date: Date } }) {
    events.push('schedule');
    if (failSchedule) { failSchedule = false; throw new Error('Simulated scheduling failure'); }
    if (dropSchedule) { dropSchedule = false; return request.identifier; }
    pending.set(request.identifier, request);
    return request.identifier;
  },
};
const originalLoad = Module._load;
Module._load = function (id: string, parent: NodeModule, main: boolean) {
  if (id === 'expo-sqlite') return { openDatabaseAsync: async () => adapter };
  if (id === 'expo-notifications') return notifications;
  if (id === 'react-native') return { Platform: { OS: 'ios' } };
  return originalLoad.call(Module, id, parent, main);
};
require.extensions['.ts'] = function (module, filename: string) {
  const output = ts.transpileModule(readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const compiledModule = module as NodeModule & { _compile: (code: string, name: string) => void };
  compiledModule._compile(output.outputText, filename);
};

const { NoteService, filterNotes } = require('../src/services/NoteService.ts');
const { ReminderService } = require('../src/services/ReminderService.ts');
const { ReminderRepository } = require('../src/database/ReminderRepository.ts');
const { NoteRepository } = require('../src/database/NoteRepository.ts');
const { NotificationService } = require('../src/services/NotificationService.ts');
const { mergePickerDate } = require('../src/utils/DateUtils.ts');

test('pemilih jam mempertahankan tanggal dan pemilih tanggal mempertahankan jam', () => {
  const current = new Date(2026, 9, 20, 15, 30, 45);
  const selected = new Date(2026, 9, 10, 9, 10);
  const time = mergePickerDate(current, selected, 'time');
  assert.equal(time.getDate(), 20);
  assert.equal(time.getHours(), 9);
  assert.equal(time.getMinutes(), 10);
  assert.equal(time.getSeconds(), 0);
  const date = mergePickerDate(current, selected, 'date');
  assert.equal(date.getDate(), 10);
  assert.equal(date.getHours(), 15);
  assert.equal(date.getMinutes(), 30);
});

test('Alur catatan dan pengingat dengan SQLite nyata', async (t: import('node:test').TestContext) => {
  let id = 0;
  const future = new Date(Date.now() + 3600000);
  await t.test('validasi judul dan pembuatan catatan', async () => {
    await assert.rejects(NoteService.save('  ', ''), /wajib diisi/);
    id = await NoteService.save('  Tugas RPL  ', "Bab 1: desain O'Brien");
    const note = await NoteRepository.get(id);
    assert.equal(note.Title, 'Tugas RPL');
    assert.equal(note.IsCompleted, false);
    assert.ok(note.CreatedAt);
    assert.equal(note.CreatedAt, note.UpdatedAt);
  });
  await t.test('pencarian judul, isi, dan filter', async () => {
    const notes = await NoteService.list();
    assert.equal(filterNotes(notes, 'rpl', 'Semua').length, 1);
    assert.equal(filterNotes(notes, "o'brien", 'Belum selesai').length, 1);
    assert.equal(filterNotes(notes, '%', 'Semua').length, 0);
    assert.equal(filterNotes(notes, '', 'Selesai').length, 0);
  });
  await t.test('waktu lampau dan penolakan izin tidak membuat pengingat', async () => {
    await assert.rejects(ReminderService.save(id, new Date(0)), /lebih dari/);
    permitted = false;
    await assert.rejects(ReminderService.save(id, future), /Izin notifikasi/);
    assert.equal(await ReminderRepository.get(id), null);
    assert.equal(pending.size, 0);
    permitted = true;
  });
  await t.test('membuat dan mengganti satu pengingat', async () => {
    await ReminderService.save(id, future);
    assert.equal(pending.size, 1);
    assert.equal(await NotificationService.isScheduled(id), true);
    assert.equal(pending.get(`inder-note-${id}`).content.title, 'Tugas RPL');
    events.length = 0;
    await ReminderService.save(id, new Date(future.getTime() + 60000));
    assert.deepEqual(events, ['cancel', 'schedule']);
    assert.equal((await ReminderRepository.list()).length, 1);
    assert.equal(filterNotes(await NoteService.list(), '', 'Memiliki reminder').length, 1);
  });
  await t.test('jadwal yang tidak masuk antrean tidak dianggap berhasil', async () => {
    const previous = await ReminderRepository.get(id);
    dropSchedule = true;
    await assert.rejects(ReminderService.save(id, future), /gagal disimpan/);
    assert.deepEqual(await ReminderRepository.get(id), previous);
    assert.equal(pending.get(`inder-note-${id}`).trigger.date.toISOString(), previous.ReminderDateTime);
  });
  await t.test('uji 10 detik memakai jadwal terpisah dari pengingat catatan', async () => {
    const before = Date.now();
    await NotificationService.test();
    const request = pending.get('inder-test');
    assert.ok(request.trigger.date.getTime() >= before + 10000);
    assert.equal(request.trigger.channelId, undefined);
    assert.ok(pending.has(`inder-note-${id}`));
    await notifications.cancelScheduledNotificationAsync('inder-test');
  });
  await t.test('kegagalan penjadwalan dan penyimpanan memulihkan pengingat lama', async () => {
    const previous = await ReminderRepository.get(id);
    failSchedule = true;
    await assert.rejects(ReminderService.save(id, future), /gagal disimpan/);
    assert.deepEqual(await ReminderRepository.get(id), previous);
    assert.equal(pending.get(`inder-note-${id}`).trigger.date.toISOString(), previous.ReminderDateTime);
    failWrite = true;
    await assert.rejects(ReminderService.save(id, future), /gagal disimpan/);
    assert.deepEqual(await ReminderRepository.get(id), previous);
    assert.equal(pending.get(`inder-note-${id}`).trigger.date.toISOString(), previous.ReminderDateTime);
  });
  await t.test('edit catatan memperbarui isi notifikasi dan status dapat dibalik', async () => {
    await NoteService.save('Judul baru', 'Isi baru', id);
    assert.equal(pending.get(`inder-note-${id}`).content.title, 'Judul baru');
    await NoteService.complete(id, true);
    assert.equal(filterNotes(await NoteService.list(), '', 'Selesai').length, 1);
    await NoteService.complete(id, false);
    assert.equal((await NoteRepository.get(id)).IsCompleted, false);
  });
  await t.test('catatan dan pengingat bertahan setelah database dibuka ulang', async () => {
    db.close();
    db = new DatabaseSync(filename);
    db.exec('PRAGMA foreign_keys = ON');
    assert.equal((await NoteRepository.get(id)).Title, 'Judul baru');
    assert.ok(await ReminderRepository.get(id));
  });
  await t.test('foreign key dan batas satu pengingat ditegakkan', () => {
    assert.throws(() => db.prepare(`INSERT INTO Reminders
      (NoteId, ReminderDateTime, IsActive, CreatedAt) VALUES (?, ?, 1, ?)`).run(id, future.toISOString(), future.toISOString()));
    assert.throws(() => db.prepare(`INSERT INTO Reminders
      (NoteId, ReminderDateTime, IsActive, CreatedAt) VALUES (999, ?, 1, ?)`).run(future.toISOString(), future.toISOString()));
  });
  await t.test('catatan tanpa isi dapat dibuat, diedit, dan dihapus tanpa pengingat', async () => {
    const emptyId = await NoteService.save('Tanpa isi', '');
    assert.equal((await NoteRepository.get(emptyId)).Content, '');
    await NoteService.save('Judul disunting', '', emptyId);
    assert.equal((await NoteRepository.get(emptyId)).Title, 'Judul disunting');
    await NoteService.delete(emptyId);
    await assert.rejects(NoteRepository.get(emptyId), /tidak ditemukan/);
  });
  await t.test('gagal membaca database memberi pesan Indonesia dan dapat dicoba lagi', async () => {
    failRead = true;
    await assert.rejects(NoteService.list(), /Catatan gagal dimuat/);
    assert.equal((await NoteService.list()).length, 1);
  });
  await t.test('gagal menyimpan catatan tidak membuat record baru', async () => {
    failWrite = true;
    await assert.rejects(NoteService.save('Gagal simpan', ''), /gagal disimpan/);
    assert.equal((await NoteService.list()).length, 1);
  });
  await t.test('gagal edit mempertahankan isi catatan dan mengembalikan isi notifikasi', async () => {
    const before = await NoteRepository.get(id);
    failWrite = true;
    await assert.rejects(NoteService.save('Tidak boleh tersimpan', 'Isi gagal', id), /gagal diperbarui/);
    assert.deepEqual(await NoteRepository.get(id), before);
    assert.equal(pending.get(`inder-note-${id}`).content.title, before.Title);
  });
  await t.test('gagal menyelesaikan catatan tidak mengubah statusnya', async () => {
    failWrite = true;
    await assert.rejects(NoteService.complete(id, true), /gagal diperbarui/);
    assert.equal((await NoteRepository.get(id)).IsCompleted, false);
  });
  await t.test('gagal hapus pengingat memulihkan jadwal tanpa kehilangan record', async () => {
    const before = await ReminderRepository.get(id);
    failWrite = true;
    await assert.rejects(ReminderService.delete(id), /gagal dihapus/);
    assert.deepEqual(await ReminderRepository.get(id), before);
    assert.equal(pending.get(`inder-note-${id}`).trigger.date.toISOString(), before.ReminderDateTime);
  });
  await t.test('gagal hapus catatan menjaga catatan, pengingat, dan jadwal', async () => {
    failWrite = true;
    await assert.rejects(NoteService.delete(id), /gagal dihapus/);
    assert.ok(await NoteRepository.get(id));
    assert.ok(await ReminderRepository.get(id));
    assert.equal(await NotificationService.isScheduled(id), true);
  });
  await t.test('gagal membatalkan notifikasi tidak menghapus pengingat', async () => {
    failCancel = true;
    await assert.rejects(ReminderService.delete(id), /gagal dibatalkan/);
    assert.ok(await ReminderRepository.get(id));
    assert.equal(await NotificationService.isScheduled(id), true);
  });
  await t.test('operasi pada catatan hilang ditolak tanpa menambah jadwal', async () => {
    const count = pending.size;
    await assert.rejects(NoteService.save('Tidak ada', '', 999), /tidak ditemukan/);
    await assert.rejects(NoteService.complete(999, true), /tidak ditemukan/);
    await assert.rejects(ReminderService.save(999, future), /tidak ditemukan/);
    assert.equal(pending.size, count);
  });
  await t.test('hapus pengingat membatalkan notifikasi', async () => {
    await ReminderService.delete(id);
    assert.equal(pending.size, 0);
    assert.equal(await ReminderRepository.get(id), null);
    assert.equal(await NotificationService.isScheduled(id), false);
  });
  await t.test('hapus catatan menghapus pengingat dan notifikasi', async () => {
    await ReminderService.save(id, future);
    await NoteService.delete(id);
    assert.equal(pending.size, 0);
    assert.equal((await NoteService.list()).length, 0);
    assert.equal((await ReminderRepository.list()).length, 0);
    await assert.rejects(NoteRepository.get(id), /tidak ditemukan/);
  });
});

after(() => {
  db.close();
  const resolved = path.resolve(directory);
  assert.equal(path.dirname(resolved), path.resolve(tmpdir()));
  assert.ok(path.basename(resolved).startsWith('inder-tests-'));
  rmSync(resolved, { recursive: true, force: true });
  Module._load = originalLoad;
});
