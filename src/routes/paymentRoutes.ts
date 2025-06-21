import express from "express";
import { PaymentController } from "../controllers/PaymentController";
import { isAuthenticated } from "../middlewares/authMiddleware";
import { PaymentModel } from "../models/PaymentModel";
import { guardarPago, listarPagos } from '../controllers/PaymentController';


const router = express.Router();
const paymentCtrl = new PaymentController();

router.post('/pagos', guardarPago);
router.get('/pagos', listarPagos);

router.get("/", (req, res) => res.render("payment", { success: false, errors: [], data: {} }));

router.post("/add", async (req, res, next) => {
  try {
    await paymentCtrl.add(req, res, next);
    // Redirigir a la página de "Pago realizado" tras una transacción exitosa
      return res.render('payment', {
        success: true,
        errors: [],
        data: {}
      });
      } catch (error) {
    console.error("Error al procesar el pago:", error);
    next(error);
  }
});

router.get('/admin/payments', isAuthenticated, async (req, res) => {
  const payments = await PaymentModel.getAll();
  res.render('admin_payments', { payments });
});

export default router;