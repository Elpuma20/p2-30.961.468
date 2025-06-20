import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcrypt';

export const initUserTable = async () => {
  const db = await open({
    filename: './data/users.sqlite',
    driver: sqlite3.Database
  });

  // Crear tabla si no existe
  await db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password_hash TEXT,
      role TEXT DEFAULT 'usuario',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Crear usuario administrador predeterminado si no existe
  const existingAdmin = await db.get(
    `SELECT * FROM users WHERE username = ?`,
    ['admin']
  );

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    await db.run(
      `INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)`,
      ['admin', hashedPassword, 'admin']
    );

    console.log('✅ Usuario admin creado con éxito: admin / admin123');
  }
};