import express, { Request, Response } from 'express';
import path from 'path';

const app = express();
const port = Number(process.env.PORT) || 3000;

// Configurar archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configurar motor de vistas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rutas
app.get('/', (req: Request, res: Response) => {
    res.render('index');
});

// Manejo de errores
app.use((err: Error, req: Request, res: Response, next: Function) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});