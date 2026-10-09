import { Router } from 'express';
import { env } from '../config/environment.js';
import { passport } from '../config/passport.js';
import {
  getCurrentUser,
  handleGoogleCallback,
  login,
  logout,
  refreshAccessToken,
  signUp,
} from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { loginSchema, signUpSchema } from '../schemas/auth.schemas.js';

const router = Router();

router.post('/signup', validate({ body: signUpSchema }), signUp);
router.post('/login', validate({ body: loginSchema }), login);
router.post('/refresh', refreshAccessToken);
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['openid', 'email', 'profile'],
    prompt: 'select_account',
    session: false,
  }),
);
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${env.frontendUrl}/?auth=failed`,
    session: false,
  }),
  handleGoogleCallback,
);
router.get('/me', getCurrentUser);
router.post('/logout', logout);

export const authRouter = Router();
authRouter.use('/auth', router);
