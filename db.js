import 'dotenv/config';
import { Pool } from 'pg';

const connectionString = process.env.SUPABASE_DATABASE_CONNECTION_STRING;
const password = process.env.SUPABASE_DATABASE_PASSWORD;

if (!connectionString) {
  throw new Error('Missing SUPABASE_DATABASE_CONNECTION_STRING.');
}

// Supabase's Connect dialog commonly includes this placeholder. Encoding is
// necessary when a database password contains URL-reserved characters.
const databaseUrl = connectionString.replace('[YOUR-PASSWORD]', encodeURIComponent(password || ''));

export const db = new Pool({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false },
  max: 5,
  idleTimeoutMillis: 30_000
});

export async function initializeDatabase() {
  await db.query(`
    create table if not exists public.users (
      google_id text primary key,
      email text not null unique,
      full_name text not null,
      avatar_url text,
      created_at timestamptz not null default now(),
      last_sign_in_at timestamptz not null default now()
    )
  `);
}

export async function saveGoogleUser(profile) {
  const result = await db.query(
    `insert into public.users (google_id, email, full_name, avatar_url)
     values ($1, $2, $3, $4)
     on conflict (google_id) do update set
       email = excluded.email,
       full_name = excluded.full_name,
       avatar_url = excluded.avatar_url,
       last_sign_in_at = now()
     returning google_id, email, full_name, avatar_url, created_at, last_sign_in_at`,
    [profile.sub, profile.email, profile.name || profile.email, profile.picture || null]
  );
  return result.rows[0];
}
