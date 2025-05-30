import express from "express";
import { ContactsController } from "../controllers/ContactsController";

const router = express.Router();
const contactsCtrl = new ContactsController();

router.post("/enviar-contacto", async (req, res, next) => {
  try {
    await contactsCtrl.add(req, res, next);
  } catch (error) {
    console.error("Error al enviar contacto:", error);
    next(error);
  }
});

export default router;