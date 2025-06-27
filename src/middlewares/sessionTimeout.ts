import { Request, Response, NextFunction } from 'express';
import session from 'express-session';

export const sessionMiddleware = session({ 
  secret: 'tu_clave',
  resave: false,
  saveUninitialized: false
});

declare module 'express-session' {
  interface SessionData {
    lastActivity?: number;
  }
}

export function sessionTimeout(req: Request, res: Response, next: NextFunction) {
  if (!req.session) return next();

  const now = Date.now();
  const timeout = 15 * 60 * 1000;
  const lastActivity = req.session.lastActivity || now;

  if (now - lastActivity > timeout) {
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      return res.status(440).send('Sesión expirada por inactividad');
    });
  } else {
    req.session.lastActivity = now;
    next();
  }
}

