# Changelog — 100 bold iterations

Each entry is one shipped, user-facing change aimed at conversions or look & feel.

1. **Order-ahead pickup** — every menu item gets an "Add" button; a slide-in cart drawer with quantity controls, a pickup-time picker (15-min slots within today's hours) and pay-at-pickup confirmation. Menu is now data-driven (`js/data.js`). Mobile header gets an always-visible cart icon.
2. **Drink builder** — tapping "Add" on a drink opens a customization sheet (size, hot/iced, milk, extra shots, sweetness) with live pricing and an animated SVG cup whose layers change with every choice. Bottom-sheet on mobile.
3. **Hero quick-order card** — a frosted-glass card in the hero with a live "Open · closes in Xh" status (pulsing dot), ready-time estimate and one-tap add for the three most popular drinks. Also hides the closed drawer so its shadow no longer bleeds onto the page.
