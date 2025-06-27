import { Request, Response, NextFunction } from 'express';

// If you are using express-session, import SessionData and extend it
import { Session, SessionData } from 'express-session';

interface CustomSession extends Session {
    language?: string;
}

interface LocaleRequest extends Request {
    session: CustomSession;
}

export function setLocale(req: LocaleRequest, res: Response, next: NextFunction): void {
    res.locals.locale = req.session.language || req.headers['accept-language']?.split(',')[0] || 'es-VE';
    next();
}