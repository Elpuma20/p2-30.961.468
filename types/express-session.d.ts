import 'express-session';

declare module 'express-session' {
  interface SessionData {
    user?: { id: string; email: string }; // Ajusta según la estructura de tu usuario
  }
}
