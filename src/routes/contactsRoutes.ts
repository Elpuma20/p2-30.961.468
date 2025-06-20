import express from "express";
import { ContactsController } from "../controllers/ContactsController";
import { isAuthenticated } from "../middlewares/authMiddleware";
import { ContactsModel } from "../models/ContactsModel";

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

router.get('/admin/contacts', isAuthenticated, async (req, res) => {
  const contactos = await ContactsModel.getAll();
});

export default router;