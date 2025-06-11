import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import { ContactsController } from './controllers/ContactsController';
import { PaymentController } from './controllers/PaymentController';

const app = express();
const port = 3000;

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, '../public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

app.get('/admin/contacts', (req: Request, res: Response, next: NextFunction) => {
    contactsCtrl.index(req, res, next).catch(next);
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

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en ${port}`);
});