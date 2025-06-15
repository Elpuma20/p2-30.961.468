import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  const db = await open({ filename: './data/users.sqlite', driver: sqlite3.Database });
  let user = await db.get('SELECT * FROM users WHERE username = ?', [profile.emails?.[0].value]);

  if (!user) {
    await db.run('INSERT INTO users (username, password_hash) VALUES (?, ?)', [profile.emails?.[0].value, '']);
    user = await db.get('SELECT * FROM users WHERE username = ?', [profile.emails?.[0].value]);
  }

  return done(null, user);
}));