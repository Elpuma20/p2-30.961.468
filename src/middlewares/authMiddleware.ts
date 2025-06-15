import { Request, Response, NextFunction } from 'express';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.session && req.session.user) {
    return next();
  }
  res.redirect('/login'); // O puedes devolver un 403 si prefieres una API sin redirecciones
};
