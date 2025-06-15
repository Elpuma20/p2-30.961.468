import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { Request, Response, NextFunction } from 'express';

// Estrategia de login con passport-local
passport.use(new LocalStrategy(async (username, password, done) => {
  const db = await open({ filename: './data/users.sqlite', driver: sqlite3.Database });
  const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);

  if (!user) return done(null, false, { message: 'Usuario no encontrado' });

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return done(null, false, { message: 'Contraseña incorrecta' });

  return done(null, user);
}));

// Serialización y deserialización del usuario
passport.serializeUser((user: any, done) => done(null, user.id));
passport.deserializeUser(async (id: number, done) => {
  const db = await open({ filename: './data/users.sqlite', driver: sqlite3.Database });
  const user = await db.get('SELECT * FROM users WHERE id = ?', [id]);
  done(null, user);
});

// ✅ Middleware para proteger rutas
export function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}
