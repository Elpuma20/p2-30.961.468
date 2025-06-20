import { open, Database } from "sqlite";
import sqlite3 from "sqlite3";

export interface Contact {
  id?: number;
  nombre: string;
  email: string;
  mensaje: string;
  ip: string;
  pais: string; 
  created_at: Date;
}

export class ContactsModel {
  static getAll: any;
  static getAllContacts() {
    throw new Error("Method not implemented.");
  }
  private dbPromise: Promise<Database<sqlite3.Database, sqlite3.Statement>>;

  constructor() {
    this.dbPromise = open({
      filename: "./data/contacts.sqlite",
      driver: sqlite3.Database
    }).then(async (db) => {
      // Crear tabla si no existe con el campo pais
      await db.run(`
        CREATE TABLE IF NOT EXISTS contacts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT NOT NULL,
          email TEXT NOT NULL,
          mensaje TEXT NOT NULL,
          ip TEXT NOT NULL,
          pais TEXT NOT NULL,  -- ✅ Ahora no permite valores null
          created_at TEXT NOT NULL
        )
      `);
      return db;
    });
  }

  async addContact(c: Contact): Promise<void> {
     console.log("Datos recibidos en addContact:", c);
    const db = await this.dbPromise;

    await db.run(
      `INSERT INTO contacts (nombre, email, mensaje, ip, pais, created_at) 
       VALUES (?, ?, ?, ?, ?, ?)`,  
      c.nombre,
      c.email,
      c.mensaje,
      c.ip,
      c.pais ?? "Desconocido",
      c.created_at.toISOString()
    );
  }

  async getAllContacts(): Promise<Contact[]> {
    const db = await this.dbPromise;
    const contactos = await db.all<Contact[]>('SELECT * FROM contacts ORDER BY created_at DESC');

    // ✅ Convertir created_at a Date antes de devolverlo
    return contactos.map((contacto) => ({
      ...contacto,
      created_at: new Date(contacto.created_at),
    }));
  }
}