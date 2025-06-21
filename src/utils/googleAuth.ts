import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: '/auth/google/callback'
}, async (_accessToken, _refreshToken, profile, done) => {
    const db = await open({ filename: './data/users.sqlite', driver: sqlite3.Database });
    let user = await db.get('SELECT * FROM users WHERE username = ?', profile.emails?.[0].value);
    if (!user) {
        // Crea usuario con email de Google y sin contraseña
        await db.run(
            'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)',

            profile.emails?.[0].value,
            '', // Sin contraseña
            'usuario'
        );
        user = await db.get('SELECT * FROM users WHERE username = ?', profile.emails?.[0].value);
    }
    return done(null, user);
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user: Express.User, done) => {
    done(null, user);
});