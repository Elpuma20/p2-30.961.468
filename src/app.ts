import express, { Request, Response } from 'express';
import path from 'path';

const app = express();
const port = process.env.PORT || 3000;

// Configurar archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configurar motor de vistas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rutas
app.get('/', (req: Request, res: Response) => {
    res.render('index');
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});