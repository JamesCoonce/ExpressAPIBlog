import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import { generateToken, respond } from '../middleware/authMiddleware';
import passport from 'passport';

const router = new Router();

router.post('/register', (req, res) => {
    AuthController.register(req, res);
});

router.post('/login', (req, res, next) => {
    AuthController.login(req, res, next);
});
/*router.post('/login', passport.authenticate(
    'local', {
        session: false,
        scope: []
    }), generateToken, respond); */

router.post('/profile', (req, res) => {
    AuthController.profile(req, res);
});

export default router;