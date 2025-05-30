import express, { Request, Response, NextFunction, Express } from "express";
import path from "path";
import dotenv from "dotenv";
import contactRoutes from "./routes/contactsRoutes"; // Importa las rutas de contacto
import paymentRoutes from "./routes/paymentRoutes"; // Importa las rutas de pago
import { ContactsController } from "./controllers/ContactsController";
import { PaymentController } from "./controllers/PaymentController";

dotenv.config();

const app: Express = express(); // ✅ Se declara antes de usarla
const port = process.env.PORT || 3000; // Usamos .env para definir el puerto

// 📌 Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, "../public")));

// 📌 Configuración del motor de vistas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

// 📌 Middleware de procesamiento de datos (sin `body-parser`, Express ya lo maneja)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 📌 Definición de rutas principales
app.use("/api", contactRoutes);
app.use("/payment", paymentRoutes);

// 📌 Rutas de la página inicial
app.get("/", (req: Request, res: Response) => {
  res.render("index", {});
});

const contactsCtrl = new ContactsController();
const paymentCtrl = new PaymentController();

// 📌 Rutas de contacto
app.get("/contacto", (req: Request, res: Response) => {
  res.render("contacto", { success: false });
});
app.post("/enviar-contacto", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await contactsCtrl.add(req, res, next);
  } catch (error) {
    console.error("Error al enviar contacto:", error);
    next(error);
  }
});
app.get("/admin/contacts", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await contactsCtrl.index(req, res, next);
  } catch (error) {
    console.error("Error al obtener contactos:", error);
    next(error);
  }
});

// 📌 Rutas de pago
app.get("/payment", (req: Request, res: Response) => {
  res.render("payment", { success: false, errors: [], data: {} });
});
app.post("/payment/add", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await paymentCtrl.add(req, res, next);
  } catch (error) {
    console.error("Error al procesar el pago:", error);
    next(error);
  }
});

// 📌 Otras rutas
app.get("/servicio", (req: Request, res: Response) => res.render("servicio", {}));
app.get("/inicio", (req: Request, res: Response) => res.render("inicio", {}));
app.get("/beneficios", (req: Request, res: Response) => res.render("beneficios", {}));
app.get("/success", (req: Request, res: Response) => res.render("success", {}));

// 📌 Manejo de errores centralizado
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err.message);
  res.status(500).json({ error: "Ocurrió un error interno en el servidor" });
});

// 📌 Iniciar el servidor
app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});