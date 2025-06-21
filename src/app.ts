import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from 'passport';
import setupLocalStrategy from './passport/localStrategy';
import { isAuthenticated } from './middlewares/authMiddleware';
import { ContactsController } from './controllers/ContactsController';
import { PaymentController } from './controllers/PaymentController';
import { sessionTimeout } from './middlewares/sessionTimeout';
import authRoutes from './routes/authRoutes';
import './utils/googleAuth';
import { initUserTable } from './models/UserModel';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import dotenv from 'dotenv';

dotenv.config();

// Extender sesión para propiedad personalizada
declare module 'express-session' {
  interface SessionData {
    visitas?: number;
  }
}

initUserTable();

const app = express();
const port = process.env.PORT || 3000;

// Configuración de sesión
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

// Middleware de tiempo de sesión
app.use(sessionTimeout);

// Configuraciones de Express
app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de Passport
app.use(passport.initialize());
app.use(passport.session());
setupLocalStrategy(passport);

// Serialización de usuario
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const db = await open({ filename: './data/users.sqlite', driver: sqlite3.Database });
  const user = await db.get(`SELECT * FROM users WHERE id = ?`, id);
  done(null, user);
});

// Configuración de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

console.log('🔍 Vistas configuradas en:', path.join(__dirname, '../views'));

// Rutas de autenticación
app.use('/auth', authRoutes);

// Rutas principales
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

// Iniciar servidor
app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en puerto ${port}`);
});