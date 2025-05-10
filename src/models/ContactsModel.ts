import { open, Database } from 'sqlite';
import sqlite3 from 'sqlite3';

export interface Contact {
  id?: number;
  nombre: string;
  email: string;
  mensaje: string;
  ip: string;
  created_at: string;
}

export class ContactsModel {
  private dbPromise: Promise<Database<sqlite3.Database, sqlite3.Statement>>;

  constructor() {
    this.dbPromise = open({
      filename: './data/contacts.sqlite',
      driver: sqlite3.Database
    }).then(async db => {
      // crear tabla si no existe
      await db.run(`
        CREATE TABLE IF NOT EXISTS contacts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT NOT NULL,
          email TEXT NOT NULL,
          mensaje TEXT NOT NULL,
          ip TEXT NOT NULL,
          created_at TEXT NOT NULL
        )
      `);
      return db;
    });
  }

  async addContact(c: Contact): Promise<void> {
    const db = await this.dbPromise;
    await db.run(
      `INSERT INTO contacts (nombre, email, mensaje, ip, created_at)
       VALUES (?, ?, ?, ?, ?)`,
       c.nombre, c.email, c.mensaje, c.ip, c.created_at
    );
  }

  async getAllContacts(): Promise<Contact[]> {
    const db = await this.dbPromise;
    return db.all<Contact[]>(`SELECT * FROM contacts ORDER BY created_at DESC`);
  }
}
