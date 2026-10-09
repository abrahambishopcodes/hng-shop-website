# Morrow Goods

A full-stack market-stall storefront. See [`PRODUCT.md`](./PRODUCT.md) for what it is and [`DESIGN.md`](./DESIGN.md) for the complete visual language shared across all platforms.

## Structure

```
hng-shop-website/
├── backend/   Express + TypeScript API (OAuth, sessions, DB, email)
├── web-fe/    Next.js + React frontend
├── app/       Mobile app (planned)
├── DESIGN.md  Single source of truth for colours, type, spacing and components
└── PRODUCT.md Product purpose, platforms and principles
```

## Quick start

**First-time setup** (once per machine):

```bash
# 1. Fill in env files
cp backend/.env.example backend/.env       # add your secrets
cp web-fe/.env.local.example web-fe/.env.local

# 2. Install all dependencies
npm install                 # root (concurrently)
npm install --prefix backend
npm install --prefix web-fe
```

**Start everything:**

```bash
npm run dev
```

This spins up both services in one terminal — backend on `:3001`, web on `:3000` — with labelled, colour-coded output. `Ctrl+C` stops both. Open `http://localhost:3000`.

## Environment variables

Each sub-project keeps its own env file — see the `.env.example` / `.env.local.example` inside each directory for what's needed and why.

## OAuth setup

1. In Google Cloud Console create a **Web application** OAuth client.
2. Add `http://localhost:3001` to **Authorized JavaScript origins**.
3. Add `http://localhost:3001/auth/google/callback` to **Authorized redirect URIs**.
4. Fill in `backend/.env` with the client ID and secret.

For production, update `GOOGLE_REDIRECT_URI` and `FRONTEND_URL` in `backend/.env`, add the production origin and callback URL to the OAuth client, and set `NODE_ENV=production`.

## More detail

Each sub-project has its own README with setup specifics, API contracts and component notes. All of them point back here for the overall picture.
