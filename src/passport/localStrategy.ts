import { Strategy as LocalStrategy } from 'passport-local';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcrypt';
import { PassportStatic } from 'passport';

interface User {
    id: number;
    username: string;
    password_hash: string;
    [key: string]: any;
}


export default function setupLocalStrategy(passport: PassportStatic): void {
    passport.use(
        new LocalStrategy(async (username: string, password: string, done: (error: any, user?: User | false, options?: { message: string }) => void) => {
            try {
                const db = await open({ filename: './data/users.sqlite', driver: sqlite3.Database });

                const user: User | undefined = await db.get<User>(`SELECT * FROM users WHERE username = ?`, username);
                if (!user) return done(null, false, { message: 'Usuario no encontrado' });

                const isMatch: boolean = await bcrypt.compare(password, user.password_hash);
                if (!isMatch) return done(null, false, { message: 'Contraseña incorrecta' });

                return done(null, user);
            } catch (err) {
                return done(err);
            }
        })
    );
}