import 'dotenv/config';
import { defineConfig } from 'prisma/config';

const connectionTemplate = process.env.SUPABASE_DATABASE_CONNECTION_STRING;
const databaseUrl = process.env.DATABASE_URL
  ?? connectionTemplate?.replace('[YOUR-PASSWORD]', encodeURIComponent(process.env.SUPABASE_DATABASE_PASSWORD ?? ''));

if (!databaseUrl) {
  throw new Error('Set DATABASE_URL or SUPABASE_DATABASE_CONNECTION_STRING before running Prisma commands.');
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: databaseUrl,
  },
});
