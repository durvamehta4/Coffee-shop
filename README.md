# Ember & Bean Coffee

A responsive, conversion-focused website for a neighborhood coffee shop. Plain HTML, CSS and vanilla JavaScript: no framework and no build step.

See [`CHANGELOG.md`](CHANGELOG.md) for every feature, shipped one bold iteration at a time.

## Highlights

- **Order ahead for pickup** with a drink builder (live price, cup illustration, caffeine and calories), cart, pickup slots and pay-at-pickup checkout
- **Smart selling:** pastry pairing, happy hour, loyalty stamps, reorder-your-usual, gift cards, beans and subscriptions, catering quotes
- **Delight:** quiz, voice ordering, ⌘K palette, café ambience, live order tracker, confetti and pickup QR code
- **Always correct:** a holiday-aware hours engine, a weather-aware hero, and copy that changes with the time of day
- **Solid foundations:** dark theme, accessibility (focus trap, skip link, reduced motion), PWA/offline, structured data, GA4 `dataLayer` events

## Run it

```bash
npm start          # http://localhost:8080 (zero-dependency static server)
```

Or open `index.html` directly. A few features (service worker, share links) need `http://`.

## Test it

```bash
npm install
npx playwright install chromium
npm test
```

The end-to-end suite (`tests/e2e.mjs`) covers page errors and horizontal overflow at phone and desktop widths, the full order flow, discount maths, the voice parser, holiday hours and shared-order links. CI runs it on every push (`.github/workflows/ci.yml`).

Add `?debug=funnel` to the URL to see a live conversion funnel.

## Structure

| Path | Purpose |
| --- | --- |
| `index.html` | All page sections and markup |
| `styles.css` | Design tokens (light and dark), layout and components |
| `js/data.js` | Menu data: the single source for menu, cart, filters, quiz and more |
| `js/core.js` | Hours engine (holidays), open status, shared helpers |
| `js/cart.js` | Cart state, drawer, pickup slots and checkout |
| `js/*.js` | One file per feature (builder, quiz, loyalty, voice, palette and more) |
| `sw.js`, `manifest.webmanifest` | Offline support and installability |
| `assets/` | Favicon and social share image |
| `tests/` | Static server and end-to-end checks |

## Launch checklist

Open the site with `?admin` (e.g. `http://localhost:8080/?admin`) to see what's still placeholder: order endpoint, address and phone, reviews, map coordinates, review link and social links. Everything the shop edits lives in a few places:

| What | Where |
| --- | --- |
| Menu, prices, badges, allergens | `js/data.js` |
| Hours and holidays | `js/core.js` (`HOURS`, `holidayFor`) |
| Order delivery | `js/config.js` |
| Sell-out times | `js/stock.js` (`RULES`) |
| Events | `js/events.js` |
| Reviews | `js/reviews.js` |

## Going live: receiving orders

Orders work end-to-end in the browser, but they reach the shop only once you set an endpoint in `js/config.js`:

```js
window.SHOP_CONFIG = { ORDER_ENDPOINT: "https://your-webhook.example/orders", ORDER_EMAIL_FALLBACK: "orders@yourshop.com" };
```

Any URL that accepts a JSON `POST` works (Formspree, a Zapier or Make webhook, Google Apps Script, or your POS). Failed sends wait in an on-device outbox and retry automatically when the connection returns. Until an endpoint is set, the confirmation screen says the site is in demo mode.

## Placeholder content

The shop name, address, phone, prices, events and the reviews in `js/reviews.js` are sample content. Replace the reviews with real customer quotes (with permission) before going live.

## Security

`index.html` ships a strict Content Security Policy: scripts only from the site, cdnjs and SHA-256-hashed inline blocks, with no inline event handlers (actions use `data-call="fn"`). If you edit an inline `<script>`, run `node tests/csp-hash.mjs` to refresh the hashes. The test suite fails on any CSP violation.

## Experiments

`js/experiments.js` runs lightweight A/B tests with sticky per-visitor variants. Each exposure pushes `experiment_exposure` and each purchase pushes `experiment_conversion` to `window.dataLayer`. Force a variant for QA with `?ab=hero_cta:skip,checkout_cta:paylater`.
