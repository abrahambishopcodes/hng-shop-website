---
name: Morrow Goods
description: A market stall storefront — flat crate colours, painted price signs, a green-black sign board.
colors:
  board: "#18231d"
  board-raised: "#233229"
  chalk: "#f4f1e8"
  chalk-dim: "#c9cbbf"
  ground: "#f1f3ef"
  surface: "#ffffff"
  ink: "#161a17"
  ink-muted: "#4a514c"
  line: "rgba(22, 26, 23, 0.14)"
  crate-tomato: "#cf3b20"
  crate-mustard: "#eab12b"
  crate-mustard-hover: "#f4c449"
  crate-blue: "#2c59c9"
  crate-leaf: "#23743f"
  tomato-text: "#b0301a"
typography:
  display:
    fontFamily: "Big Shoulders Display, Arial Narrow, sans-serif"
    fontSize: "clamp(3.4rem, 7.4vw, 6rem)"
    fontWeight: 900
    lineHeight: 0.88
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Big Shoulders Display, Arial Narrow, sans-serif"
    fontSize: "clamp(40px, 5vw, 64px)"
    fontWeight: 900
    lineHeight: 0.9
  title:
    fontFamily: "Big Shoulders Display, Arial Narrow, sans-serif"
    fontSize: "28px"
    fontWeight: 800
    lineHeight: 1
  price:
    fontFamily: "Big Shoulders Display, Arial Narrow, sans-serif"
    fontSize: "30px"
    fontWeight: 800
    lineHeight: 1
    fontFeature: "tnum"
  crate-label:
    fontFamily: "Big Shoulders Display, Arial Narrow, sans-serif"
    fontSize: "19px"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "0.03em"
  body:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.55
  item-name:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: 1.3
  label:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1
  tag:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.06em"
rounded:
  sign: "6px"
  field: "12px"
  crate: "14px"
  dialog: "20px"
  pill: "999px"
spacing:
  gutter: "clamp(16px, 4vw, 56px)"
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "28px"
  grid-row: "44px"
  header: "68px"
components:
  button-sign:
    backgroundColor: "{colors.crate-mustard}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 22px"
    height: "48px"
  button-sign-hover:
    backgroundColor: "{colors.crate-mustard-hover}"
  button-board:
    backgroundColor: "{colors.board}"
    textColor: "{colors.chalk}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 22px"
    height: "48px"
  button-board-hover:
    backgroundColor: "{colors.board-raised}"
  button-add:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 22px"
    height: "48px"
  button-add-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.chalk}"
  bag-button:
    backgroundColor: "{colors.chalk}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 8px 0 16px"
    height: "44px"
  price-sign:
    backgroundColor: "{colors.board}"
    textColor: "{colors.chalk}"
    typography: "{typography.price}"
    rounded: "{rounded.sign}"
    padding: "6px 12px 6px 10px"
  crate-tab:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.crate-label}"
    rounded: "{rounded.pill}"
    padding: "0 10px 0 18px"
    height: "46px"
  product-tag:
    backgroundColor: "{colors.chalk}"
    textColor: "{colors.ink}"
    typography: "{typography.tag}"
    rounded: "{rounded.pill}"
    padding: "5px 10px"
  input-text:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.field}"
    padding: "0 16px"
    height: "50px"
  site-header:
    backgroundColor: "{colors.board}"
    textColor: "{colors.chalk}"
    height: "{spacing.header}"
    padding: "0 {spacing.gutter}"
---

# Design System: Morrow Goods

## Overview

**Creative North Star: "The Market Stall"**

A market stall, not a magazine. The goods are out on the table from the first screen, sorted into coloured crates and priced with big painted signs. A deep green-black sign board frames the stall at the top and bottom; between them, an off-white stall ground holds product cards whose frames are solid crate colour. Everything is flat: colour fields do the work that shadows and gradients do elsewhere, in the manner of Du Bois's data posters, where saturated flat colour is total and unapologetic.

Density is generous but busy in the way a stall is busy: prices are always visible on the goods, category is always visible as colour, and the bag is always reachable top-right. Type has two voices only: condensed, uppercase, heavy sign lettering for anything that is shouted (headlines, prices, crate names, totals), and a friendly humanist sans for everything that is read or operated.

The world explicitly rejects the cream background and editorial serif hero that preceded it, which pushed the catalog below the fold.

**Key Characteristics:**
- Green-black sign board for header, hero band, drawer head and footer.
- One flat crate colour per category, owning whole regions (card frames, filter tabs, filtered headers, thumbnails).
- Painted price signs: dark board chips with a mustard dollar sign, set in the sign face.
- Pill-shaped controls everywhere; softly rounded crates; tight 6px corners on signs and images.
- Flat at rest. Depth appears only on things that physically move over the page: the bag drawer and the item flying into the bag.

## Colors

A dark sign board, an off-white ground, and four saturated crate colours used as flat fields, never tints.

### Primary
- **Sign Board Green-Black** (board): the stall's frame. Sticky header, hero band, footer, bag-drawer head, toast, and the price-sign chip. Also the "All" crate colour.
- **Raised Board** (board-raised): hover fill for controls sitting on the board, and the hairline dividing header from hero.

### Secondary (the crates)
Each category owns exactly one crate colour, exposed to components as a local `--crate` / `--crate-ink` pair.
- **Tomato** (crate-tomato): Kitchen crate. Also the Journal band, the remove-hover colour, the invalid-field border and the input caret. White ink on it.
- **Market Mustard** (crate-mustard): Candlelight crate, and the stall's highlight: announcement bar, primary "sign" button, the accent word in the wordmark and headline, the dollar mark on price signs, the bag count when it holds items, focus ring on dark grounds, text selection. Ink (never white) on it.
- **Crate Blue** (crate-blue): Desk crate, and the focus ring on light grounds. White ink on it.
- **Leaf Green** (crate-leaf): Linen crate, and the free-delivery progress fill. White ink on it.

### Neutral
- **Chalk** (chalk): primary text on the board; bag pill and product tags on light grounds.
- **Dim Chalk** (chalk-dim): secondary text and resting nav on the board.
- **Stall Ground** (ground): page background, drawer and dialog body.
- **Surface White** (surface): fields, unselected crate tabs, sort select, cart footer.
- **Ink** (ink): body text on light grounds and on mustard.
- **Muted Ink** (ink-muted): metadata, result counts, helper text.
- **Line** (line): 14% ink hairlines, field borders at rest, empty count backgrounds, track of the delivery meter.
- **Error Tomato** (tomato-text): darkened tomato used only for inline field-error text, where full tomato is too light for small type.

### Named Rules
**The One Crate, One Colour Rule.** A category is identified by its crate colour everywhere it appears: card frame, filter tab border and fill, filtered shop header, crate dot, cart thumbnail, quick-view media panel. Never introduce a second colour for a category, and never use a crate colour for a different category.

**The Flat Field Rule.** Crate colours are applied at full strength as solid fields. No gradients, no tints, no translucent washes of a crate colour.

**The Mustard Takes Ink Rule.** Text on mustard is always ink; text on tomato, blue and leaf is always white; text on the board is chalk.

## Typography

**Display Font:** Big Shoulders Display (with Arial Narrow, sans-serif), weights 600–900
**Body Font:** Figtree (with system-ui, sans-serif), weights 400–700

**Character:** Big Shoulders is the painted stall sign: condensed, uppercase, very heavy, set tight. Figtree is the stallholder talking: round, plain and legible.

### Hierarchy
- **Display** (900, clamp(3.4rem, 7.4vw, 6rem), 0.88, uppercase, balanced): the board headline only.
- **Headline** (900, clamp(40px, 5vw, 64px), 0.9, uppercase): section signs ("The stall", Journal, quick-view and auth titles scale within 40–80px on the same recipe).
- **Title** (800, 28–34px, 0.95–1, uppercase): wordmark, drawer head, featured product name, empty-bag and total signs.
- **Price** (800, 30px; 48px large, 24px on phones; tabular figures): price signs and the bag total.
- **Crate label** (800, 19px, 0.03em, uppercase): the crate filter tabs.
- **Body** (400, 16px, 1.55): running copy; hero lede at 16–18px capped at 40ch, descriptions at 44–46ch.
- **Item name** (600, 18px, 1.3): product names in the grid (16px on phones and in the bag).
- **Label** (600, 15px): buttons, nav (500), bag pill.
- **Tag** (700, 12px, 0.06em, uppercase): product tags pinned on product images.

### Named Rules
**The Two Voices Rule.** Big Shoulders is always uppercase and always 800 or heavier; it is for signs, prices and totals, never for paragraphs or controls other than the crate tabs. Everything read or operated is Figtree.

**The Tabular Money Rule.** Every price, total and count uses tabular figures so numbers do not jitter as the bag changes.

## Layout

A single full-bleed column with a fluid side gutter (clamp(16px, 4vw, 56px)). Bands stack edge to edge: mustard announcement bar (40px), sticky board header (68px; 60px under 640px), board hero, the stall, the tomato Journal band, the board footer.

The board hero is a two-column grid (1.1fr / 1fr) holding the sign headline and a featured product framed in its crate colour; it collapses to one column under 1000px. The stall is a three-column product grid with 44px row and 28px column gaps; two columns under 1000px, and still two (tighter, 28px / 12px) on phones. On phones the crate tabs become a single horizontally scrolling row that bleeds into the gutter, and the sort select stretches full width.

The header is a three-part grid: wordmark left, nav, actions with the bag pill pinned right at every width. Under 1000px the nav moves into a board-coloured dropdown behind a menu button on the left. Dialogs are centered (max 940px quick view, 820px auth) and become bottom sheets with 20px top corners on phones. The bag is a right drawer, min(440px, 100%) wide.

## Elevation & Depth

Flat by default. Depth is conveyed by colour bands (board vs ground vs surface vs crate) and by framing images inside solid crate-colour mats, not by shadow. Dialogs and the drawer sit over a green-black scrim (rgba(24, 35, 29, .55–.6)).

### Shadow Vocabulary
- **Drawer edge** (`box-shadow: -12px 0 40px rgba(24, 35, 29, .25)`): the bag drawer only, to separate it from the page it slides over.
- **In flight** (`box-shadow: 0 8px 20px rgba(24, 35, 29, .3)`): the transient thumbnail that flies into the bag after an add; it exists for 650ms and is then removed.

### Named Rules
**The Only Things That Move Get Shadows Rule.** No resting component carries a shadow. A shadow is allowed only on a surface that is physically travelling over the page (the drawer, the flying thumbnail).

## Shapes

Three corner families. Every control is a full pill (999px): buttons, crate tabs, nav links, bag pill, counts, steppers, tags, toast. Containers are softly rounded: crate frames and the filtered shop header at 14px, cart thumbnails 10px, text fields 12px, dialogs 20px. Images and price signs inside a crate frame use a tight 6px corner, so the frame reads as a mat around a print. Borders are 2px and solid when used for control outlines (crate tabs, ghost and add buttons, fields, steppers); dividers are 1px line hairlines. Crate dots are 10px squares with 3px corners.

## Components

### Buttons
Confident, pill-shaped, 48px tall, Figtree 600 at 15px, with a press that scales to .97.
- **Shape:** full pill (999px).
- **Sign (primary):** mustard fill, ink text; hover brightens the mustard. The main call to action ("Shop the stall", Add to bag in quick view).
- **Board:** board fill, chalk text; hover lifts to raised board. Used on crate-coloured or light grounds (featured product, checkout).
- **Add:** 2px ink outline on light ground; hover fills ink with chalk text.
- **Ghost:** 2px currentColor outline for dark grounds; hover fills chalk.
- **Icon button:** 44px circle, line-tinted hover.
- **Focus:** 3px crate-blue outline, 3px offset; mustard outline on board, journal and toast grounds.

### Chips (crate tabs)
- **Style:** pill, 46px tall, 2px border in the crate colour, white surface, Big Shoulders 800 19px uppercase, with a round count badge filled with the crate colour.
- **State:** selected (`aria-pressed`) fills with the crate colour and inverts the badge to white. Hover lifts 2px.

### Cards / Containers
- **Product card:** the image sits in a crate-colour mat (10px padding, 14px radius; 6px/12px on phones), with a chalk product tag top-left and a painted price sign bottom-right. Name, material line with a crate dot, and an Add button sit below on the ground. Images zoom to 1.03 on hover.
- **Featured product:** the same mat idea at hero scale, a crate-colour panel holding image, name sign, large price sign and a board button.
- **Shadow Strategy:** none (see Elevation & Depth).

### Inputs / Fields
- **Style:** 50px tall, 12px radius, 2px line border, white surface, tomato caret.
- **Focus:** border shifts to crate blue (no outline ring).
- **Error:** tomato border, error text in error tomato at 13px.
- **Select:** pill, 46px, 2px line border, inline chevron; border darkens to muted ink on hover.
- **Google button:** pill, 52px, white with 2px line border; disabled at 60% opacity.

### Navigation
- **Header:** board band, Big Shoulders 800 wordmark with the second word in mustard. Nav links are dim-chalk Figtree 500 15px pills that brighten to chalk on a raised-board fill on hover. Sign-in is a text button in the same style.
- **Bag pill:** chalk pill pinned top-right at every width, with an icon, "Bag" label (hidden on phones) and a count badge that turns mustard once the bag holds items and bumps (scale 1.35, 500ms) when an item lands.
- **Mobile:** menu button left of the wordmark; nav opens as a full-width board dropdown with 18px links divided by raised-board hairlines.

### Price Sign (signature)
A small board chip in Big Shoulders 800 with tabular figures and a half-size mustard "$" set high. 30px standard, 48px large (40px phones), 24px on phone product cards. Always shown on the goods themselves, pinned to the product image corner.

### Bag Drawer and Add-to-Bag Flight (signature)
The drawer slides from the right (350ms, expo-out) with a board head, a free-delivery meter (8px pill track, leaf fill that scales in; the band turns pale green when the $75 threshold is met), crate-matted thumbnails, small pill steppers, and a white footer carrying the total as a Big Shoulders sign. Adding an item launches a 72px copy of its image on an arcing 650ms flight into the bag pill while the count bumps; under reduced motion only the count bump remains.

### Toast
Board pill at the bottom center, chalk text, with a mustard action pill ("View bag"). Rises 140% from below.

### Motion
One easing for the whole system, an expo-out (cubic-bezier(0.16, 1, 0.3, 1)). Colour and fill transitions at 200ms; panels, dialogs and toasts 300–400ms; product cards settle in from 10px below in 450ms. All animation and transition collapses under `prefers-reduced-motion`.

## Do's and Don'ts

### Do:
- **Do** give every category exactly one crate colour and use it as a solid field wherever that category shows up.
- **Do** put the price on the goods, as a board price sign with a mustard dollar, in tabular figures.
- **Do** set signs, prices and totals in Big Shoulders Display, uppercase, 800–900, with tight leading (0.88–1).
- **Do** keep controls as full pills (999px) at 44px minimum height, and frame images in crate-colour mats with 6px inner corners.
- **Do** use ink on mustard and white on tomato, blue and leaf.
- **Do** keep the bag pill pinned top-right at every width.

### Don't:
- **Don't** use gradients, tints or translucent washes of crate colours.
- **Don't** put shadows on resting cards, buttons or bands; shadows belong only to the drawer and the in-flight thumbnail.
- **Don't** set paragraphs or most controls in Big Shoulders, or set it in lowercase.
- **Don't** return to a cream ground or an editorial serif hero that pushes products below the fold.
