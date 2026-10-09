import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, type User } from '../generated/prisma/client.js';
import { env } from '../config/environment.js';

const databaseUrl = env.supabaseConnectionString!.replace(
  '[YOUR-PASSWORD]',
  encodeURIComponent(env.supabasePassword),
);

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  adapter: new PrismaPg({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
    max: 5,
    idleTimeoutMillis: 30_000,
  }),
});

if (!env.isProduction) {
  globalForPrisma.prisma = prisma;
}

export default prisma;

export interface GoogleProfile { sub: string; email: string; email_verified: boolean; name?: string; picture?: string; }
export type DbUser = User & { isNew?: boolean };

export async function saveGoogleUser(profile: GoogleProfile): Promise<DbUser> {
  const existingUser = await prisma.user.findUnique({
    where: { googleId: profile.sub },
    select: { googleId: true },
  });

  const user = await prisma.user.upsert({
    where: { googleId: profile.sub },
    create: {
      googleId: profile.sub,
      email: profile.email,
      fullName: profile.name || profile.email,
      avatarUrl: profile.picture || null,
    },
    update: {
      email: profile.email,
      fullName: profile.name || profile.email,
      avatarUrl: profile.picture || null,
      lastSignInAt: new Date(),
    },
  });

  return { ...user, isNew: !existingUser };
}
