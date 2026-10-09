import jwt, { type JwtPayload } from 'jsonwebtoken';
import type { NextFunction, Request, Response } from 'express';
import { UserRole } from '../generated/prisma/client.js';
import { env } from '../config/environment.js';
import { prisma } from '../lib/db.js';

type TokenType = 'access' | 'refresh';

interface TokenPayload extends JwtPayload {
  sub: string;
  role: UserRole;
  type: TokenType;
}

export interface AuthenticatedRequest extends Request {
  auth?: {
    userId: string;
    role: UserRole;
  };
}

function verifyToken(token: string, type: TokenType): TokenPayload | null {
  try {
    const secret = type === 'access' ? env.jwtAccessSecret! : env.jwtRefreshSecret!;
    const payload = jwt.verify(token, secret);

    if (
      typeof payload === 'string'
      || typeof payload.sub !== 'string'
      || payload.type !== type
      || !Object.values(UserRole).includes(payload.role as UserRole)
    ) {
      return null;
    }

    return payload as TokenPayload;
  } catch {
    return null;
  }
}

export function createAccessToken(user: { id: string; role: UserRole }): string {
  return jwt.sign({ role: user.role, type: 'access' }, env.jwtAccessSecret!, {
    subject: user.id,
    expiresIn: '15m',
  });
}

export function createRefreshToken(user: { id: string; role: UserRole }): string {
  return jwt.sign({ role: user.role, type: 'refresh' }, env.jwtRefreshSecret!, {
    subject: user.id,
    expiresIn: '7d',
  });
}

export function readRefreshToken(token: string | undefined): TokenPayload | null {
  return token ? verifyToken(token, 'refresh') : null;
}

export async function authenticate(request: Request, response: Response, next: NextFunction): Promise<void> {
  const authorization = request.get('authorization');
  const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : undefined;
  const payload = token ? verifyToken(token, 'access') : null;

  if (!payload) {
    response.status(401).json({ message: 'Authentication is required.' });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) {
      response.status(401).json({ message: 'Authentication is required.' });
      return;
    }

    (request as AuthenticatedRequest).auth = { userId: user.id, role: user.role };
    next();
  } catch (error) {
    next(error);
  }
}

export function authorizeRoles(...roles: UserRole[]) {
  return (request: Request, response: Response, next: NextFunction): void => {
    const auth = (request as AuthenticatedRequest).auth;

    if (!auth) {
      response.status(401).json({ message: 'Authentication is required.' });
      return;
    }

    if (!roles.includes(auth.role)) {
      response.status(403).json({ message: 'You do not have permission to access this resource.' });
      return;
    }

    next();
  };
}

export const requireAdmin = authorizeRoles(UserRole.Admin);
