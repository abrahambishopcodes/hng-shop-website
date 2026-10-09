# Backend

Express + TypeScript API for Morrow Goods. For the overall product purpose see [`../PRODUCT.md`](../PRODUCT.md). For visual design (if building email templates or error pages) see [`../DESIGN.md`](../DESIGN.md).

## Project structure

```text
src/
├── config/       # environment validation and application configuration
├── controllers/  # request handlers and application logic
├── lib/          # shared infrastructure, including the database client
├── routes/       # endpoint declarations
├── services/     # integrations such as email delivery
└── server.ts     # application composition and startup
```

## Setup

```bash
cp .env.example .env   # fill in values
npm install
npm run dev            # tsx watch, port 3001
```

## Scripts

| Command         | Description                   |
| --------------- | ----------------------------- |
| `npm run dev`   | Watch mode via `tsx`          |
| `npm run build` | Compile to `dist/` with `tsc` |
| `npm start`     | Run compiled `dist/server.js` |

## Environment variables

See `.env.example` for the full list. Key ones:

| Variable                              | Notes                                                                                   |
| ------------------------------------- | --------------------------------------------------------------------------------------- |
| `PORT`                                | Default `3001`                                                                          |
| `FRONTEND_URL`                        | Where to redirect after OAuth (e.g. `http://localhost:3000`)                            |
| `GOOGLE_REDIRECT_URI`                 | Must match the URI registered in Google Cloud Console                                   |
| `SESSION_SECRET`                      | Long random string; signs the `morrow_session` cookie                                   |
| `SUPABASE_DATABASE_CONNECTION_STRING` | Postgres URL; its `[YOUR-PASSWORD]` token is replaced with `SUPABASE_DATABASE_PASSWORD` |
| `DATABASE_URL`                        | Optional complete Postgres URL for Prisma CLI commands                                  |
| `BREVO_API_KEY`                       | Sends the welcome email on first sign-in                                                |

## API routes

| Method | Path                    | Description                                                 |
| ------ | ----------------------- | ----------------------------------------------------------- |
| `GET`  | `/auth/google`          | Starts the Google OAuth flow                                |
| `GET`  | `/auth/google/callback` | OAuth callback; sets cookie and redirects to `FRONTEND_URL` |
| `GET`  | `/api/me`               | Returns the session user or `{ user: null }`                |
| `POST` | `/api/logout`           | Clears the session cookie                                   |

## Auth flow

1. Frontend links to `/auth/google`.
2. Backend generates a state nonce, redirects to Google.
3. Google redirects back to `/auth/google/callback`.
4. Backend verifies the ID token, upserts the user in Supabase, sets a signed HTTP-only cookie, and redirects to `FRONTEND_URL/?auth=success`.
5. Frontend reads `?auth=` to show a toast; calls `/api/me` to hydrate the session.

## Database

Postgres via Prisma (Supabase). The schema is defined in `prisma/schema.prisma`; migrations are intentionally not applied automatically. The models are `User`, `Product`, `Cart`, and `CartItem`.

```sql
google_id        text  primary key
email            text  not null unique
full_name        text  not null
avatar_url       text
created_at       timestamptz
last_sign_in_at  timestamptz
```
