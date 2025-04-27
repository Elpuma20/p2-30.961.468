import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import path from 'path';

const app = express();
const port: number = Number(process.env.PORT) || 3000;

// Configurar archivos estáticos
app.use('/stylesheets', express.static(path.join(__dirname, 'public/stylesheets')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Configurar motor de vistas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rutas
app.get('/', (req: Request, res: Response): void => {
    res.render('index');
});

// Manejo de errores
const errorHandler: ErrorRequestHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
};

app.use(errorHandler);

app.listen(port, '0.0.0.0', (): void => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});