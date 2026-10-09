import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import type { Request, Response } from 'express';
import type { z } from 'zod';
import { env } from '../config/environment.js';
import type { AuthenticatedGoogleUser } from '../config/passport.js';
import {
  createAccessToken,
  createRefreshToken,
  readRefreshToken,
} from '../middlewares/auth.middleware.js';
import { prisma } from '../lib/db.js';
import type { loginSchema, signUpSchema } from '../schemas/auth.schemas.js';
import { sendWelcomeEmail } from '../services/email.service.js';

function setSession(response: Response, user: object): void {
  const payload = Buffer.from(
    JSON.stringify({ user, exp: Date.now() + 1000 * 60 * 60 * 24 * 7 }),
  ).toString('base64url');
  const signature = crypto
    .createHmac('sha256', env.sessionSecret!)
    .update(payload)
    .digest('base64url');
  response.cookie('morrow_session', `${payload}.${signature}`, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7,
    path: '/',
  });
}

function readSession(token: string | undefined): object | null {
  if (!token || !token.includes('.')) return null;
  const [payload, signature] = token.split('.');
  const expected = crypto
    .createHmac('sha256', env.sessionSecret!)
    .update(payload)
    .digest('base64url');
  if (
    signature.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  )
    return null;
  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString()) as {
      user: object;
      exp: number;
    };
    return session.exp > Date.now() ? session.user : null;
  } catch {
    return null;
  }
}

function setRefreshToken(response: Response, token: string): void {
  response.cookie('morrow_refresh', token, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7,
    path: '/',
  });
}

function sendTokenResponse(
  response: Response,
  user: {
    id: string;
    fullName: string;
    email: string;
    role: 'Admin' | 'User';
    avatarUrl: string | null;
  },
  status = 200,
): void {
  setRefreshToken(response, createRefreshToken(user));
  response.status(status).json({
    accessToken: createAccessToken(user),
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
    },
  });
}

export async function signUp(request: Request, response: Response): Promise<void> {
  const { fullName, email, password } = request.body as z.infer<typeof signUpSchema>;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      response.status(409).json({ message: 'An account with that email already exists.' });
      return;
    }

    const user = await prisma.user.create({
      data: { fullName, email, passwordHash: await bcrypt.hash(password, 12) },
    });

    sendTokenResponse(response, user, 201);
  } catch (error) {
    console.error('Sign-up failed:', (error as Error).message);
    response.status(500).json({ message: 'Unable to create your account.' });
  }
}

export async function login(request: Request, response: Response): Promise<void> {
  const { email, password } = request.body as z.infer<typeof loginSchema>;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    const passwordIsValid = user?.passwordHash
      ? await bcrypt.compare(password, user.passwordHash)
      : false;

    if (!user || !passwordIsValid) {
      response.status(401).json({ message: 'Invalid email or password.' });
      return;
    }

    if (!user.isActive) {
      response.status(403).json({ message: 'This account is inactive.' });
      return;
    }

    sendTokenResponse(response, user);
  } catch (error) {
    console.error('Login failed:', (error as Error).message);
    response.status(500).json({ message: 'Unable to sign in.' });
  }
}

export async function refreshAccessToken(request: Request, response: Response): Promise<void> {
  const payload = readRefreshToken(request.cookies.morrow_refresh as string | undefined);
  if (!payload) {
    response.status(401).json({ message: 'A valid refresh token is required.' });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        avatarUrl: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      response.status(401).json({ message: 'A valid refresh token is required.' });
      return;
    }

    setRefreshToken(response, createRefreshToken(user));
    response.json({ accessToken: createAccessToken(user) });
  } catch (error) {
    console.error('Token refresh failed:', (error as Error).message);
    response.status(500).json({ message: 'Unable to refresh the access token.' });
  }
}

export function handleGoogleCallback(request: Request, response: Response): void {
  const user = request.user as AuthenticatedGoogleUser | undefined;

  if (!user) {
    response.redirect(`${env.frontendUrl}/?auth=failed`);
    return;
  }

  setSession(response, {
    id: user.googleId,
    name: user.fullName,
    email: user.email,
    picture: user.avatarUrl,
  });
  if (user.isNew) {
    sendWelcomeEmail({ email: user.email, name: user.fullName }).catch((error: Error) =>
      console.error('Welcome email failed:', error.message),
    );
  }

  response.redirect(`${env.frontendUrl}/?auth=success`);
}

export function getCurrentUser(request: Request, response: Response): void {
  response.json({ user: readSession(request.cookies.morrow_session as string | undefined) });
}

export function logout(_request: Request, response: Response): void {
  response.clearCookie('morrow_session', {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: 'lax',
    path: '/',
  });
  response.clearCookie('morrow_refresh', {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: 'lax',
    path: '/',
  });
  response.status(204).end();
}
