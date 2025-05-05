import express, { Request, Response } from 'express';
import path from 'path';

const app = express();
const port = 3000;

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, '../public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));


// Implementar la ruta para la página inicial
app.get('/', (req: Request, res: Response) => {
    res.render('index', {});

});
app.get('/contacto', (req: Request, res: Response) => {
    res.render('contacto', {});

});
app.get('/recursos', (req: Request, res: Response) => {
    res.render('recursos', {});

});
app.get('/servicio', (req: Request, res: Response) => {
    res.render('servicio', {});

});
app.get('/beneficios', (req: Request, res: Response) => {
    res.render('beneficios', {});

});
// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en ${port}`);
});