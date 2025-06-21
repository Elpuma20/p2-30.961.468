import { open, Database } from 'sqlite';
import sqlite3 from 'sqlite3';

export interface Payment {
  id?: number;
  service: string;
  email: string;
  cardName: string;
  cardNumber: string;
  expMonth: string;
  expYear: string;
  cvv: string;
  amount: number;
  currency: string;
  created_at: string;
}

export class PaymentModel {
  static getAll() {
    throw new Error("Method not implemented.");
  }
  private dbPromise: Promise<Database<sqlite3.Database, sqlite3.Statement>>;

  constructor() {
    this.dbPromise = open({
      filename: './data/payments.sqlite',
      driver: sqlite3.Database
    }).then(async db => {
      await db.run(`
        CREATE TABLE IF NOT EXISTS payments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          service TEXT NOT NULL,
          email TEXT NOT NULL,
          cardName TEXT NOT NULL,
          cardNumber TEXT NOT NULL,
          expMonth TEXT NOT NULL,
          expYear TEXT NOT NULL,
          cvv TEXT NOT NULL,
          amount REAL NOT NULL,
          currency TEXT NOT NULL,
          created_at TEXT NOT NULL
        )
      `);
      return db;
    });
  }

  async addPayment(p: Payment): Promise<void> {
    const db = await this.dbPromise;
    await db.run(
      `INSERT INTO payments
        (service,email,cardName,cardNumber,expMonth,expYear,cvv,amount,currency,created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      p.service, p.email, p.cardName, p.cardNumber,
      p.expMonth, p.expYear, p.cvv, p.amount, p.currency,
      p.created_at
    );
  }

  async getAllPayments(): Promise<Payment[]> {
    const db = await this.dbPromise;
    return db.all<Payment[]>(`SELECT * FROM payments ORDER BY created_at DESC`);
  }
}

const db = new sqlite3.Database('./data/payments.sqlite');

export function crearTablaPagos() {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS pagos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT,
      email TEXT,
      monto REAL,
      fecha TEXT,
      pais TEXT
    )
  `).run();
}

export interface Pago {
  nombre: string;
  email: string;
  monto: number;
  fecha?: string;
  pais: string;
}

export function registrarPago(pago: Pago): void {
  const stmt = db.prepare('INSERT INTO pagos (nombre, email, monto, fecha, pais) VALUES (?, ?, ?, ?, ?)');
  stmt.run(pago.nombre, pago.email, pago.monto, new Date().toISOString(), pago.pais);
}

export function obtenerPagos() {
  return db.prepare('SELECT * FROM pagos ORDER BY fecha DESC').all();
}
