# Product

## Morrow Goods

A market-stall storefront with a real backend and accounts — currently a demo, built to grow into a full-stack product across web and mobile.

## Platforms

| Directory | Platform  | Status      |
|-----------|-----------|-------------|
| `web-fe`  | Web (Next.js + React) | Active |
| `backend` | API (Express + TypeScript) | Active |
| `app`     | Mobile (TBD) | Planned |

All platforms share the same visual language defined in [`DESIGN.md`](./DESIGN.md). Any colour, typography, spacing or component decision that applies to both web and mobile lives there.

## Users

Shoppers browsing a small retail catalog, signing in for a persistent bag, and collecting products before checkout.

## Purpose

Demonstrate a complete shop interface — product discovery, cart management, and Google account entry — wired to a real backend (Supabase database, Google OAuth, Brevo email). Mock checkout only; no payment integration yet.

## Capabilities

- Google OAuth sign-in (real) with a Supabase-backed user record and a welcome email via Brevo.
- Product browsing, filtering by category, sorting, quick-view.
- Cart with a free-delivery meter, quantity controls and an undo-on-remove toast.
- Session persistence via a signed HTTP-only cookie.

## Principles

- Show the goods immediately — the catalog is above the fold from the first load.
- Treat mock behaviors (checkout) as clearly demo, never as production claims.
- Keep bag and account visible without crowding browsing.
- Design decisions made once in `DESIGN.md` flow to every platform without re-negotiation.
