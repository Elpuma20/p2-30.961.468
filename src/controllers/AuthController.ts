import bcrypt from 'bcrypt';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { Request, Response } from 'express';

interface RegisterUserRequestBody {
    username: string;
    password: string;
}

interface User {
    id?: number;
    username: string;
    password_hash: string;
}

export const registerUser = async (
    req: Request<{}, any, RegisterUserRequestBody>,
    res: Response
): Promise<void> => {
    const { username, password } = req.body;

    const db = await open({ filename: './data/users.sqlite', driver: sqlite3.Database });

    const existingUser: User | undefined = await db.get<User>(`SELECT * FROM users WHERE username = ?`, username);
    if (existingUser) {
        res.send('El usuario ya existe');
        return;
    }

    const password_hash: string = await bcrypt.hash(password, 10);

    await db.run(`INSERT INTO users (username, password_hash) VALUES (?, ?)`, username, password_hash);

    res.redirect('/login');
};