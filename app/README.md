# App (Mobile)

Planned mobile client for Morrow Goods.

For the overall product purpose see [`../PRODUCT.md`](../PRODUCT.md). For the visual language — colours, typography, spacing, component rules — see [`../DESIGN.md`](../DESIGN.md). All design decisions are defined there so that the mobile app and the web frontend stay consistent without duplicating specs.

## Notes

- The backend API (`../backend`) is platform-agnostic. The same routes (`/api/me`, `/auth/google`, etc.) serve both web and mobile.
- Design tokens in `../DESIGN.md` use absolute values (hex colours, px/rem sizes) so they map cleanly to any mobile framework.
- The session cookie approach used on web will need to be adapted for mobile (token storage).

## Status

Not yet started. This directory is a placeholder.
