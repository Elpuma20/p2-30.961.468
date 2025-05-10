import { Request, Response, NextFunction } from 'express';
import { ContactsModel, Contact } from '../models/ContactsModel';

export class ContactsController {
  private model = new ContactsModel();

  // POST /enviar-contacto
  async add(req: Request, res: Response, next: NextFunction) {
    try {
      // validación básica
      const { nombre, email, mensaje } = req.body;
      if (!nombre || !email || !mensaje) {
        return res.status(400).send('Faltan campos obligatorios');
      }

      const contact: Contact = {
        nombre: nombre.trim(),
        email: email.trim(),
        mensaje: mensaje.trim(),
        ip: req.ip || '0.0.0.0',
        created_at: new Date().toISOString()
      };

      await this.model.addContact(contact);

      // redirigimos con mensaje de éxito o renderizamos parcial
      res.render('contacto', { success: true });
    } catch (err) {
      console.error(err);
      next(err);    // llama a Express error handler
    }
  }

  // GET /admin/contacts
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const lista = await this.model.getAllContacts();
      res.render('admin_contacts', { contactos: lista });
    } catch (err) {
      console.error(err);
      next(err);
    }
  }
}
