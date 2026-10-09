import { Router } from 'express';
import { env } from '../config/environment.js';
import { passport } from '../config/passport.js';
import { getCurrentUser, handleGoogleCallback, login, logout, refreshAccessToken, signUp } from '../controllers/auth.controller.js';

export const authRouter = Router();

authRouter.post('/auth/signup', signUp);
authRouter.post('/auth/login', login);
authRouter.post('/auth/refresh', refreshAccessToken);
authRouter.get('/auth/google', passport.authenticate('google', {
  scope: ['openid', 'email', 'profile'],
  prompt: 'select_account',
  session: false,
}));
authRouter.get('/auth/google/callback', passport.authenticate('google', {
  failureRedirect: `${env.frontendUrl}/?auth=failed`,
  session: false,
}), handleGoogleCallback);
authRouter.get('/api/me', getCurrentUser);
authRouter.post('/api/logout', logout);
