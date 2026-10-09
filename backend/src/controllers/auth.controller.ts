import crypto from 'node:crypto';
import type { Request, Response } from 'express';
import { env } from '../config/environment.js';
import type { AuthenticatedGoogleUser } from '../config/passport.js';
import { sendWelcomeEmail } from '../services/email.service.js';

function setSession(response: Response, user: object): void {
  const payload = Buffer.from(JSON.stringify({ user, exp: Date.now() + 1000 * 60 * 60 * 24 * 7 })).toString('base64url');
  const signature = crypto.createHmac('sha256', env.sessionSecret!).update(payload).digest('base64url');
  response.cookie('morrow_session', `${payload}.${signature}`, { httpOnly: true, secure: env.isProduction, sameSite: 'lax', maxAge: 1000 * 60 * 60 * 24 * 7, path: '/' });
}

function readSession(token: string | undefined): object | null {
  if (!token || !token.includes('.')) return null;
  const [payload, signature] = token.split('.');
  const expected = crypto.createHmac('sha256', env.sessionSecret!).update(payload).digest('base64url');
  if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString()) as { user: object; exp: number };
    return session.exp > Date.now() ? session.user : null;
  } catch {
    return null;
  }
}

export function handleGoogleCallback(request: Request, response: Response): void {
  const user = request.user as AuthenticatedGoogleUser | undefined;

  if (!user) {
    response.redirect(`${env.frontendUrl}/?auth=failed`);
    return;
  }

  setSession(response, { id: user.googleId, name: user.fullName, email: user.email, picture: user.avatarUrl });
  if (user.isNew) {
    sendWelcomeEmail({ email: user.email, name: user.fullName }).catch((error: Error) => console.error('Welcome email failed:', error.message));
  }

  response.redirect(`${env.frontendUrl}/?auth=success`);
}

export function getCurrentUser(request: Request, response: Response): void {
  response.json({ user: readSession(request.cookies.morrow_session as string | undefined) });
}

export function logout(_request: Request, response: Response): void {
  response.clearCookie('morrow_session', { httpOnly: true, secure: env.isProduction, sameSite: 'lax', path: '/' });
  response.status(204).end();
}
