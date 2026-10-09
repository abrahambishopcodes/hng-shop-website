# Web Frontend

Next.js 16 + React 19 + TypeScript storefront for Morrow Goods. For the overall product purpose see [`../PRODUCT.md`](../PRODUCT.md). For colours, typography, spacing and component specs see [`../DESIGN.md`](../DESIGN.md) — that file is the single source of truth shared with the mobile app.

## Setup

```bash
cp .env.local.example .env.local
npm install
npm run dev    # http://localhost:3000
```

## Environment variables

| Variable | Notes |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | Backend origin, e.g. `http://localhost:3001`. Empty string falls back to same-origin (for proxied deployments). |

## Structure

```
web-fe/
├── app/
│   ├── layout.tsx      Root layout — fonts, metadata
│   ├── page.tsx        Entry point (renders ShopApp)
│   └── globals.css     Design tokens + all styles from DESIGN.md
├── components/
│   ├── ShopApp.tsx     Root client component; wraps ShopProvider
│   ├── Header.tsx      Sticky nav, bag pill, sign-in button
│   ├── Board.tsx       Hero band with featured product
│   ├── ProductGrid.tsx Category filter, sort, product cards
│   ├── CartPanel.tsx   Bag drawer + scrim
│   ├── QuickView.tsx   Product detail dialog
│   ├── AuthDialog.tsx  Sign-in dialog (Google OAuth + email demo)
│   ├── Announcement.tsx Dismissable banner
│   ├── Toast.tsx       Bottom toast
│   └── Icons.tsx       SVG sprite + Icon helper
└── lib/
    ├── products.ts     Product data, types and utilities
    └── shop-context.tsx React context — all cart/auth/UI state
```

## State

All client state lives in `ShopContext` (`lib/shop-context.tsx`). Components call `useShop()` to read and mutate. No external state library needed — the product catalog is static and the cart is local.

## Design tokens

`app/globals.css` maps directly to `../DESIGN.md`:
- CSS custom properties (`--board`, `--mustard`, etc.) for colours
- `--font-big-shoulders` and `--font-figtree` injected by `next/font/google` in `layout.tsx`
- `--crate` / `--crate-ink` per-category pairs used by the crate colour system

When building the mobile app, use `DESIGN.md` as the reference and keep token names consistent.
