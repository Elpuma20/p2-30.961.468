import { Request, Response, NextFunction } from 'express';
import { PaymentModel, Payment } from '../models/PaymentModel';
import axios from 'axios';

export class PaymentController {
  private model = new PaymentModel();
  private FAKE_PAYMENT_API_URL = process.env.FAKE_PAYMENT_API_URL || 'https://fakepayment.onrender.com';

  async add(req: Request, res: Response, next: NextFunction) {
    const errors: string[] = [];
    const { service, email, cardName, cardNumber, expMonth, expYear, cvv, amount, currency } = req.body as Record<string, string>;

    // --- Validaciones básicas ---
    if (!service) errors.push('Debes seleccionar un servicio.');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Correo inválido.');
    if (!cardName) errors.push('El nombre de la tarjeta es obligatorio.');
    if (!cardNumber || !/^\d{13,19}$/.test(cardNumber.replace(/\s+/g, ''))) errors.push('Número de tarjeta inválido.');
    if (!expMonth || Number(expMonth) < 1 || Number(expMonth) > 12) errors.push('Mes de expiración inválido.');

    const yearNum = Number(expYear);
    const monthNum = Number(expMonth);
    const now = new Date();

    // --- Validación de tarjeta expirada ---
    if (!expYear || yearNum < now.getFullYear() || (yearNum === now.getFullYear() && monthNum < now.getMonth() + 1)) {
      return res.redirect('/expired_card'); // Redirige a página de error
    }

    if (!cvv || !/^\d{3,4}$/.test(cvv)) errors.push('CVV inválido.');
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) errors.push('Monto debe ser mayor que cero.');
    if (!['USD', 'EUR', 'MXN'].includes(currency)) errors.push('Moneda no permitida.');

    // Si hubo errores, re-renderizamos el formulario con mensajes
    if (errors.length > 0) {
      return res.status(400).render('payment', {
        success: false,
        errors,
        data: { service, email, cardName, cardNumber, expMonth, expYear, cvv, amount, currency }
      });
    }

    try {
      const pago: Payment = {
        service,
        email,
        cardName,
        cardNumber: cardNumber.replace(/\s+/g, ''),
        expMonth,
        expYear,
        cvv,
        amount: amt,
        currency,
        created_at: new Date().toISOString()
      };

      await this.model.addPayment(pago);

      // --- Integración con Fake Payment API ---
      const paymentData = {
        cardNumber: pago.cardNumber,
        expirationDate: `${pago.expMonth}/${pago.expYear}`,
        cvv: pago.cvv,
        amount: pago.amount,
        currency: pago.currency,
      };

      console.log('Datos enviados a la API:', paymentData); // 🔍 Revisa qué datos se envían

      const response = await axios.post(`${this.FAKE_PAYMENT_API_URL}/pay`, paymentData);

      console.log('Respuesta de la API:', response.data); // 🔍 Verifica la respuesta

      if (response.data && response.data.transactionId) {
        return res.redirect(`/success?transactionId=${response.data.transactionId}`);
      } else {
        throw new Error('No se recibió un transactionId válido desde la API.');
      }
    } catch (err) {
    }
  }
}