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
  async getAllAsync(sql: string, ...params: (string | number)[]) { return db.prepare(sql).all(...params); },
  async withTransactionAsync(action: () => Promise<void>) {
    db.exec('BEGIN');
    try { await action(); db.exec('COMMIT'); }
    catch (error) { db.exec('ROLLBACK'); throw error; }
  },
};
const notifications = {
  setNotificationHandler() {},
  IosAuthorizationStatus: { PROVISIONAL: 3 },
  SchedulableTriggerInputTypes: { DATE: 'date' },
  async getPermissionsAsync() { return { granted: permitted }; },
  async requestPermissionsAsync() { return { granted: permitted }; },
  async cancelScheduledNotificationAsync(id: string) { events.push('cancel'); pending.delete(id); },
  async scheduleNotificationAsync(request: { identifier: string; content: { title: string }; trigger: { date: Date } }) {
    events.push('schedule');
    if (failSchedule) { failSchedule = false; throw new Error('Simulated scheduling failure'); }
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
    assert.equal(pending.get(`inder-note-${id}`).content.title, 'Tugas RPL');
    events.length = 0;
    await ReminderService.save(id, new Date(future.getTime() + 60000));
    assert.deepEqual(events, ['cancel', 'schedule']);
    assert.equal((await ReminderRepository.list()).length, 1);
    assert.equal(filterNotes(await NoteService.list(), '', 'Memiliki reminder').length, 1);
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
  await t.test('hapus pengingat membatalkan notifikasi', async () => {
    await ReminderService.delete(id);
    assert.equal(pending.size, 0);
    assert.equal(await ReminderRepository.get(id), null);
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
