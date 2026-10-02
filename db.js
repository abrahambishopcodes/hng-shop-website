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
  const inserted = await db.query(
    `insert into public.users (google_id, email, full_name, avatar_url)
     values ($1, $2, $3, $4)
     on conflict (google_id) do nothing
     returning google_id, email, full_name, avatar_url, created_at, last_sign_in_at`,
    [profile.sub, profile.email, profile.name || profile.email, profile.picture || null]
  );

  if (inserted.rowCount) return { ...inserted.rows[0], isNew: true };

  const updated = await db.query(
    `update public.users set
       email = $2,
       full_name = $3,
       avatar_url = $4,
       last_sign_in_at = now()
     returning google_id, email, full_name, avatar_url, created_at, last_sign_in_at`,
    [profile.sub, profile.email, profile.name || profile.email, profile.picture || null]
  );
  return { ...updated.rows[0], isNew: false };
}
