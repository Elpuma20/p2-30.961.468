import express from 'express';
import passport from 'passport';

const router = express.Router();

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/auth/login' }),
    (req, res) => {
        res.redirect('/dashboard');
    }
);

router.get('/logout', (req, res) => {
    (req as any).logout((err: any) => {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

router.post('/login', (req, res, next) => {
  console.log('✅ Se recibió el formulario con:');
  console.log(req.body); // para ver si llegan username y password

  next();
}, passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
  failureFlash: true
}));

function next(err: any): void {
    console.error(err);
}

export default router;
