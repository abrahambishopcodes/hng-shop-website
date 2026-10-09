import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';
import { env } from '../config/environment.js';

const databaseUrl = env.supabaseConnectionString!.replace(
  '[YOUR-PASSWORD]',
  encodeURIComponent(env.supabasePassword),
);

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
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
