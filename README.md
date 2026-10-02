# Morrow Goods

## Google OAuth setup

1. In Google Cloud Console, create a **Web application** OAuth client.
2. Add `http://localhost:3000` to **Authorized JavaScript origins**.
3. Add `http://localhost:3000/auth/google/callback` to **Authorized redirect URIs**.
4. Complete `.env` using `.env.example` as a reference. Keep this file private and never commit it.
5. Run `npm start`, then open `http://localhost:3000`.

For deployment, update `GOOGLE_REDIRECT_URI` and add the exact production origin and `/auth/google/callback` URL to the OAuth client. Set `NODE_ENV=production` so the signed session cookie is HTTPS-only.

## Brevo welcome emails

After a customer signs in with Google for the first time, the server sends a transactional welcome email through Brevo. Configure these server-only environment variables:

```env
BREVO_API_KEY=...
EMAIL_FROM=hello@example.com
EMAIL_FROM_NAME="Morrow Goods"
```

`EMAIL_FROM` must be a verified Brevo sender. The API key is never exposed to the browser.

## User persistence with Supabase

The server uses `SUPABASE_DATABASE_CONNECTION_STRING` to connect directly to Postgres and creates `public.users` automatically at startup. After Google verifies a profile, the server upserts its Google subject ID, verified email, display name, avatar URL, and last sign-in time. Keep both Supabase environment values server-only.
