import { Request, Response, NextFunction } from "express";
import { sendEmailNotification } from "../utils/emailService";
import { ContactsModel } from "../models/ContactsModel";
import { Contact } from "../models/ContactsModel";
import { getCountryFromIp } from "../utils/geolocationService"; 
import axios from "axios";

export const submitForm = async (req: Request, res: Response) => {
  const { nombre, correo, comentario } = req.body;
  const ip: string = req.ip || "0.0.0.0";
  const pais = await getCountryFromIp(ip);
  const fechaHora = new Date().toISOString();

  const formData = { nombre, correo, comentario, ip, pais, fechaHora };

  if (!nombre || !correo || !comentario) {
  return res.status(400).json({ message: "Todos los campos son obligatorios" });
  } 
  await sendEmailNotification(formData);
  
  res.status(200).json({ message: "Formulario enviado y notificación enviada correctamente" });
};

// Definir la estructura esperada de la respuesta de reCAPTCHA
interface RecaptchaResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  "error-codes"?: string[];
}

export class ContactsController {
  private model = new ContactsModel();
  private readonly RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET || "6LeF50krAAAAACbs_fT4YFtbSpCr6AQ7K8GJELF0"; // 🔥 Usa variables de entorno

  // Método para validar reCAPTCHA
  private async validateRecaptcha(recaptchaToken: string): Promise<boolean> {
    try {
      if (!recaptchaToken) {
        console.error("❌ Error: reCAPTCHA token no recibido.");
        return false;
      }

      const params = new URLSearchParams();
      params.append("secret", this.RECAPTCHA_SECRET);
      params.append("response", recaptchaToken);

      console.log(`🔍 Verificando reCAPTCHA con Google: response=${recaptchaToken}`);

      const recaptchaVerify = await axios.post("https://www.google.com/recaptcha/api/siteverify", params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      const recaptchaData: RecaptchaResponse = recaptchaVerify.data;
      console.log("📢 Respuesta de Google reCAPTCHA:", recaptchaData);

      return recaptchaData.success;
    } catch (error) {
      console.error("❌ Error al validar reCAPTCHA:", error);
      return false;
    }
  }

  // POST /enviar-contacto
  async add(req: Request, res: Response, next: NextFunction) {
    try {
      const { nombre, email, mensaje, recaptchaToken } = req.body; // 🔥 Corrigiendo el nombre del parámetro
      
      if (!nombre || !email || !mensaje || !recaptchaToken) {
        return res.status(400).json({ success: false, message: "Faltan campos obligatorios o reCAPTCHA no verificado." });
      }

      const isRecaptchaValid = await this.validateRecaptcha(recaptchaToken);
      if (!isRecaptchaValid) {
        return res.status(400).json({ success: false, message: "Fallo en la verificación de reCAPTCHA." });
      }

      // Capturar la IP del usuario
      const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "0.0.0.0";
      const pais = ip ? await getCountryFromIp(ip.toString()) ?? "Desconocido" : "Desconocido";

      const contact: Contact = {
        nombre: nombre.trim(),
        email: email.trim(),
        mensaje: mensaje.trim(),
        ip: ip.toString(),
        pais,
        created_at: new Date(),
      };

      await this.model.addContact(contact);
      return res.json({ success: true, message: "Formulario enviado correctamente.", pais });
      
    } catch (err) {
      console.error("❌ Error al procesar el contacto:", err);
      return next(err);
    }
  }

  // GET /admin/contacts
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const lista = await this.model.getAllContacts();
      const contactos = lista.map((contacto) => ({
        ...contacto,
        created_at: new Date(contacto.created_at),
      }));

      return res.render("list_contacts", { contactos });
    } catch (err) {
      console.error("❌ Error obteniendo los contactos:", err);
      return next(err);
    }
  }
  
}
