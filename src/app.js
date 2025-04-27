"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const port = 3000;
// Configurar archivos estáticos
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
// Configurar motor de vistas EJS
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, 'views'));
// Rutas
app.get('/', (req, res) => {
    res.render('index');
});
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
