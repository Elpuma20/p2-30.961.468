import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from 'passport';
import i18n from 'i18n';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

import setupLocalStrategy from './passport/localStrategy';
import { isAuthenticated } from './middlewares/authMiddleware';
import { ContactsController } from './controllers/ContactsController';
import { PaymentController } from './controllers/PaymentController';
import { sessionTimeout } from './middlewares/sessionTimeout';
import authRoutes from './routes/authRoutes';
import { initUserTable } from './models/UserModel';
import './utils/googleAuth';

dotenv.config();

const app = express();

// 🧠 Configuración de i18n
i18n.configure({
  locales: ['en', 'es'],
  defaultLocale: 'es',
  directory: path.join(__dirname, '..', 'locales'),
  cookie: 'lang',
  queryParameter: 'lang',
  autoReload: true,
  syncFiles: true
});

// 🧱 Middleware base
app.use(cookieParser());
app.use(i18n.init);

// 🌐 Middleware para mantener idioma en navegación
app.use((req, res, next) => {
  const langRaw = req.query.lang;
  const lang = Array.isArray(langRaw) ? langRaw[0] : langRaw;

  if (typeof lang === 'string' && ['es', 'en'].includes(lang)) {
    res.cookie('lang', lang, { maxAge: 1000 * 60 * 60 * 24 * 7 }); // 7 días
    req.setLocale(lang);
  } else if (req.cookies.lang) {
    req.setLocale(req.cookies.lang);
  }

  res.locals.locale = req.getLocale();
  res.locals.__ = res.__;
  next();
});

// 🔐 Configuración de sesión
app.set('trust proxy', 1);
app.use(session({
  secret: process.env.SESSION_SECRET || 'una_clave_segura',
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000 // 15 minutos
  }
}));

app.set('trust proxy', 1);

// 🛠️ Extiende interfaz para sesión personalizada
declare module 'express-session' {
  interface SessionData {
    visitas?: number;
    language?: string;
  }
}

// 🗃️ Base de datos
initUserTable();

// 🧠 Middlewares funcionales
app.use(sessionTimeout);
app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// 🔑 Passport
app.use(passport.initialize());
app.use(passport.session());
setupLocalStrategy(passport);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const db = await open({ filename: './data/users.sqlite', driver: sqlite3.Database });
  const user = await db.get('SELECT * FROM users WHERE id = ?', id);
  done(null, user);
});

// 🎨 Vistas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
console.log('🔍 Vistas configuradas en:', path.join(__dirname, '../views'));

// 🌍 Rutas principales
app.use('/auth', authRoutes);
const contactsCtrl = new ContactsController();
const paymentCtrl = new PaymentController();

app.get('/', (req: Request, res: Response) => {
  res.render('index', {});
});

app.get('/check', (req, res) => {
  req.session.visitas = (req.session.visitas || 0) + 1;
  res.send(`Visitas en esta sesión: ${req.session.visitas}`);
});

app.get('/contacto', (req: Request, res: Response) => {
  res.render('contacto', { success: false });
});

app.post('/enviar-contacto', (req: Request, res: Response, next: NextFunction) => {
  contactsCtrl.add(req, res, next).catch(next);
});

app.get('/admin/contacts', isAuthenticated, (req, res, next) => {
  contactsCtrl.index(req, res, next).catch(next);
});

app.get('/admin/payments', isAuthenticated, (req, res, next) => {
  paymentCtrl.index(req, res, next).catch(next);
});

app.get('/dashboard', isAuthenticated, (req, res) => {
  res.render('dashboard', { user: req.user });
});

app.get('/payment', (req: Request, res: Response) => {
  res.render('payment', { success: false, errors: [], data: {} });
});

app.get('/setlang/:lang', (req, res) => {
  const lang = req.params.lang;
  if (['es', 'en'].includes(lang)) {
    res.cookie('lang', lang, { maxAge: 1000 * 60 * 60 * 24 * 7 });
    res.send(`Idioma "${lang}" guardado en cookie`);
  } else {
    res.send('Idioma no válido');
  }
});

app.post('/payment/add', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await paymentCtrl.add(req, res, next);
    res.render('payment', { success: true, errors: [], data: {} });
  } catch (error) {
    console.error('Error al procesar el pago:', error);
    next(error);
  }
});

app.get('/servicio', (req: Request, res: Response) => {
  res.render('servicio', {});
});

app.get('/inicio', (req: Request, res: Response) => {
  res.render('inicio', {});
});

app.get('/beneficios', (req: Request, res: Response) => {
  res.render('beneficios', {});
});

app.get('/login', (req, res) => {
  res.redirect('/auth/login');
});

// 🚀 Iniciar servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en puerto ${port}`);
});