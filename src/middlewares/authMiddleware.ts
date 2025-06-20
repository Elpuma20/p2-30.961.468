import { Request, Response, NextFunction } from 'express';

// Extiende la interfaz de Session para incluir 'user'
declare module 'express-session' {
  interface SessionData {
    user?: any;
  }
}

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.session && req.session.user) {
    return next();
  }
    res.redirect('/login');
  }
