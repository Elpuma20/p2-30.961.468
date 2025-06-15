import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export const initUserTable = async () => {
  const db = await open({ filename: './data/users.sqlite', driver: sqlite3.Database });
  await db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password_hash TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};