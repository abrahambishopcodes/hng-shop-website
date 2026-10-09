import { Router } from 'express';
import { getCurrentUser, handleGoogleCallback, logout, startGoogleAuthentication } from '../controllers/auth.controller.js';

export const authRouter = Router();

authRouter.get('/auth/google', startGoogleAuthentication);
authRouter.get('/auth/google/callback', handleGoogleCallback);
authRouter.get('/api/me', getCurrentUser);
authRouter.post('/api/logout', logout);
