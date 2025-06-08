import express from "express";
import { PaymentController } from "../controllers/PaymentController";

const router = express.Router();
const paymentCtrl = new PaymentController();

router.get("/", (req, res) => res.render("payment", { success: false, errors: [], data: {} }));

router.post("/add", async (req, res, next) => {
  try {
    await paymentCtrl.add(req, res, next);
    // Redirigir a la página de "Pago realizado" tras una transacción exitosa
    res.redirect("/payments/pago-realizado");
  } catch (error) {
    console.error("Error al procesar el pago:", error);
    next(error);
  }
});

// Nueva ruta para la página de "Pago realizado"
router.get("/pago-realizado", (req, res) => {
  res.render("pago_realizado");
});

export default router;