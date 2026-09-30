import * as SQLite from 'expo-sqlite';
import { schema } from './Schema';

let database: Promise<SQLite.SQLiteDatabase> | undefined;

async function openDatabase() {
  try {
    const db = await SQLite.openDatabaseAsync('inder.db');
    await db.execAsync('PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;');
    const version = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
    if (!version?.user_version) {
      await db.withTransactionAsync(async () => { await db.execAsync(schema); });
    }
    return db;
  } catch {
    database = undefined;
    throw new Error('Database gagal dibuka. Silakan coba lagi.');
  }
}

export function getDatabase() {
  database ??= openDatabase();
  return database;
}
