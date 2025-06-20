import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from 'passport';
import setupLocalStrategy from './passport/localStrategy';
import { isAuthenticated } from './middlewares/authMiddleware';
import { ContactsController } from './controllers/ContactsController';
import { PaymentController } from './controllers/PaymentController';
import authRoutes from './routes/authRoutes';
import './utils/googleAuth'; // <-- Esto debe ir antes de usar authRoutes
import { initUserTable } from './models/UserModel';
initUserTable();

const app = express();
const port = 3000;

// Configurar sesiones para Passport
app.use(session({
    secret: 'secretKey',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, '../public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'clave-super-secreta',
  resave: false,
  saveUninitialized: false
}));

app.use('/auth', authRoutes);

app.use(express.urlencoded({ extended: true }));

export default app;

// Implementar la ruta para la página inicial
app.get('/', (req: Request, res: Response) => {
    res.render('index', {});
});

const contactsCtrl = new ContactsController();
const paymentCtrl = new PaymentController();

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

// Mostrar formulario de pago
app.get('/payment', (req: Request, res: Response) => {
    res.render('payment', { success: false, errors: [], data: {} });
});

// Recibir el POST del pago y redirigir a "Pago realizado"
app.post('/payment/add', async (req: Request, res: Response, next: NextFunction) => {
    try {
        await paymentCtrl.add(req, res, next);
        return res.render('payment', {
            success: true,
            errors: [],
            data: {}
        });
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

setupLocalStrategy(passport);

app.use(passport.initialize());
app.use(passport.session());

// serialización
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

passport.deserializeUser(async (id, done) => {
  const db = await open({ filename: './data/users.sqlite', driver: sqlite3.Database });
  const user = await db.get(`SELECT * FROM users WHERE id = ?`, id);
  done(null, user);
});

console.log('🔍 Vistas configuradas en:', path.join(__dirname, '../views'));

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en ${port}`);
});

app.get('/login', (req, res) => {
  res.redirect('/auth/login');
});