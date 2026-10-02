---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: ["app.js","styles.css"]
---

# Storefront (index.html)

Mode: Persuade (storefront home + catalog). Audience: shoppers browsing a small homewares catalog on phone and desktop. Job: find a piece, add it, check the bag. Constraints: mock catalog, Google sign-in via auth.js (keep #open-auth, #google-signin, #email-signin, #auth-panel, global showToast). Bag button fixed top-right at every width (user requirement).

Requested features: category filter + sort, product quick view, persisted bag (localStorage), free-delivery progress toward $75.

## Direction contract

THESIS: A market stall, not a magazine. Products are on the first screen, sorted into colored crates, priced with big painted signs. Refuses the incumbent cream/serif editorial hero that pushed the catalog below the fold.

OWN-WORLD: Deep green-black sign board (#18231d) for header band, hero and footer; flat crate colors own whole regions, one per category: tomato (Kitchen), mustard (Candlelight), crate blue (Desk), leaf green (Linen). Off-white stall ground. Big Shoulders Display for signs and prices, Figtree for UI. Flat color, no gradients, no shadows except the bag drawer. Borrowed from Du Bois's posters: total commitment to flat saturated color fields.

STORY: The visitor sees what's for sale and what it costs right away, filters by crate, opens a piece for detail, adds it, watches it drop into the bag, and sees how close they are to free delivery.

FIRST VIEWPORT: Sticky header: wordmark left, nav, Sign in + bag pill far right. A compact board band (~380px) with a giant sign headline, "Shop the stall" action and a featured product with its price sign. Crate tabs and the first product row start above the fold at 1440x900.

FORM: Market stall, candidate 5 of 7, seed key a1bc9184. Signature interaction: an added item's thumbnail flies into the top-right bag and the count ticks over.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
