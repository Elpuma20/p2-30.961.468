import { sendEmailNotification } from "./emailService";

const testData = {
  nombre: "Juan Pérez",
  correo: "juan@example.com",
  comentario: "¡Hola, esto es una prueba!",
  ip: "192.168.1.1",
  pais: "Venezuela",
  fechaHora: new Date().toLocaleString(),
};

sendEmailNotification(testData).then(() => {
  console.log("Prueba completada.");
}).catch((error) => {
  console.error("Error en la prueba:", error);
});