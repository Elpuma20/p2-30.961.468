import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "joselrodri544@gmail.com",
    pass: "szym dbtd mspt rfqk",
  }
});

export const sendEmailNotification = async (formData: {
  nombre: string;
  correo: string;
  comentario: string;
  ip: string;
  pais: string;
  fechaHora: string;
}) => {
  const mailOptions = {
    from: "joselrodri544@gmail.com",
    to: ["programacion2ais@yopmail.com"],
    subject: "Nueva solicitud enviada",
    text: `Nombre: ${formData.nombre}
    Correo: ${formData.correo}
    Comentario: ${formData.comentario}
    Dirección IP: ${formData.ip}
    País: ${formData.pais}
    Fecha/Hora: ${formData.fechaHora}`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Correo enviado correctamente");
  } catch (error) {
    console.error("Error enviando correo:", error);
  }
};