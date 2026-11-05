# Changelog — 100 bold iterations

Each entry is one shipped, user-facing change aimed at conversions or look & feel.

1. **Order-ahead pickup** — every menu item gets an "Add" button; a slide-in cart drawer with quantity controls, a pickup-time picker (15-min slots within today's hours) and pay-at-pickup confirmation. Menu is now data-driven (`js/data.js`). Mobile header gets an always-visible cart icon.
2. **Drink builder** — tapping "Add" on a drink opens a customization sheet (size, hot/iced, milk, extra shots, sweetness) with live pricing and an animated SVG cup whose layers change with every choice. Bottom-sheet on mobile.
3. **Hero quick-order card** — a frosted-glass card in the hero with a live "Open · closes in Xh" status (pulsing dot), ready-time estimate and one-tap add for the three most popular drinks. Also hides the closed drawer so its shadow no longer bleeds onto the page.
4. **Pastry pairing upsell** — when the cart has more drinks than pastries, the drawer suggests a croissant or muffin at "$1 off with every drink", applied automatically as a discount line. Adds a pluggable discount-rules system (`Cart.rules`).
5. **Visual menu cards** — the text list becomes a card grid; each drink shows an SVG illustration drawn from its real recipe (same renderer as the builder), food gets a big illustrated badge. Hover lift + tilt; compact 2-column grid on phones.
6. **Floating order bar** — once the cart has items, a pinned "N items · Checkout → $total" bar appears (full-width on phones, pill on desktop), bouncing on every add and hiding while the drawer is open.
