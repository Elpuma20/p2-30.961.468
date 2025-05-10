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

// body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



// Implementar la ruta para la página inicial
app.get('/', (req: Request, res: Response) => {
    res.render('index', {});

});

const contactsCtrl = new ContactsController();
const paymentCtrl = new PaymentController();


app.get('/contacto', (req: Request, res: Response) => {

    res.render('contacto', { success : false });
  });

  app.post(
    '/enviar-contacto',
    (req: Request, res: Response, next: NextFunction) => {
      contactsCtrl
        .add(req, res, next)
        .catch(next);      // Para que Express capture el error
    }
  );
  
  app.get(
    '/admin/contacts',
    (req: Request, res: Response, next: NextFunction) => {
      contactsCtrl
        .index(req, res, next)
        .catch(next);
    }
  );

// Mostrar formulario de pago
app.get('/payment', (req, res) => {
    res.render('payment', { success: false, errors: [], data: {} });
  });
  
  // Recibir el POST del pago
  app.post(
    '/payment/add',
    (req, res, next) => paymentCtrl.add(req, res, next).catch(next)
  );

app.get('/recursos', (req: Request, res: Response) => {
    res.render('recusrsos', {});

});
app.get('/servicio', (req: Request, res: Response) => {
    res.render('servicio', {});

});
// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en ${port}`);
});