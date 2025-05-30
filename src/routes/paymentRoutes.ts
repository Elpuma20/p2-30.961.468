import express from "express";
import { PaymentController } from "../controllers/PaymentController";

const router = express.Router();
const paymentCtrl = new PaymentController();

router.get("/", (req, res) => res.render("payment", { success: false, errors: [], data: {} }));
router.post("/add", async (req, res, next) => {
  try {
    await paymentCtrl.add(req, res, next);
  } catch (error) {
    console.error("Error al procesar el pago:", error);
    next(error);
  }
});

export default router;