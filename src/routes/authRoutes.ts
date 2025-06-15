// import { Router, Request, Response, NextFunction } from 'express';
// import bcrypt from 'bcrypt';
// import passport from 'passport';
// import sqlite3 from 'sqlite3';
// import { open } from 'sqlite';

// const router = Router();

// // Middleware para proteger rutas
// function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
//     if (req.isAuthenticated()) {
//         return next();
//     }
//     res.redirect('/login');
// }

// // Vista de Login
// router.get('/login', (req: Request, res: Response) => {
//     const error = req.flash('error');
//     res.render('login', { error: error.length ? error[0] : null });
// });

// // Procesar Login con Passport
// router.post('/login',
//     passport.authenticate('local', {
//         successRedirect: '/dashboard',
//         failureRedirect: '/login',
//         failureFlash: true
//     })
// );

// // Cerrar sesión
// router.get('/logout', (req: Request, res: Response) => {
//     req.logout((err) => {
//         if (err) {
//             return res.status(500).send('Error al cerrar sesión');
//         }
//         res.redirect('/');
//     });
// });

// // Vista de Registro
// router.get('/register', (req: Request, res: Response) => {
//     res.render('register', { error: null, success: null });
// });

// // Procesar Registro con validación
// router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { username, password } = req.body;

//         if (!username || !password) {
//             return res.render('register', { error: 'Todos los campos son obligatorios.', success: null });
//         }

//         const db = await open({ filename: './data/users.sqlite', driver: sqlite3.Database });

//         // Verificar si el usuario ya existe
//         const existingUser = await db.get('SELECT * FROM users WHERE username = ?', [username]);
//         if (existingUser) {
//             return res.render('register', { error: 'El usuario ya existe.', success: null });
//         }

//         // Hashear la contraseña
//         const hash = await bcrypt.hash(password, 10);
//         await db.run('INSERT INTO users (username, password_hash) VALUES (?, ?)', [username, hash]);

//         res.render('register', { success: 'Usuario registrado con éxito.', error: null });
//     } catch (error) {
//         console.error('Error en registro:', error);
//         res.render('register', { error: 'Hubo un problema en el registro.', success: null });
//     }
// });

// // Login con Google OAuth
// router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// router.get('/auth/google/callback',
//     passport.authenticate('google', { successRedirect: '/dashboard', failureRedirect: '/login' })
// );

// // Ruta protegida de Dashboard
// router.get('/dashboard', ensureAuthenticated, (req: Request, res: Response) => {
//     if (!req.user) {
//         return res.redirect('/login');
//     }
//     res.render('dashboard', { user: req.user });
// });

// export default router;