// Service worker: network-first for pages, stale-while-revalidate for static assets.
const CACHE = "eb-v2"; // bump on release so returning visitors get fresh assets
const SHELL = ["./", "./index.html", "./404.html", "./styles.css", "./manifest.webmanifest", "./assets/favicon.svg", "./assets/og-image.jpg", "./js/a11y.js", "./js/ambience.js", "./js/analytics.js", "./js/arrival.js", "./js/beans.js", "./js/boxes.js", "./js/brew.js", "./js/cart.js", "./js/catering.js", "./js/celebrate.js", "./js/checkout-extras.js", "./js/core.js", "./js/customize.js", "./js/data.js", "./js/deals.js", "./js/detail.js", "./js/events.js", "./js/experiments.js", "./js/faq.js", "./js/feedback.js", "./js/filters.js", "./js/flavor.js", "./js/forward.js", "./js/fresh.js", "./js/gifts.js", "./js/glossary.js", "./js/hero.js", "./js/i18n.js", "./js/impact.js", "./js/latteart.js", "./js/loyalty.js", "./js/me.js", "./js/menu.js", "./js/motion.js", "./js/numbers.js", "./js/online.js", "./js/outbox.js", "./js/peek.js", "./js/progress.js", "./js/gallery.js", "./js/hubs.js", "./js/feedback-ask.js", "./js/habit.js", "./js/sticky-tabs.js", "./js/greet.js", "./js/surprise.js", "./js/prefill.js", "./js/split.js", "./js/config.js", "./js/orderbar.js", "./js/palette.js", "./js/prefs.js", "./js/print.js", "./js/pwa.js", "./js/quiz.js", "./js/rail.js", "./js/reengage.js", "./js/referral.js", "./js/reorder.js", "./js/reviews.js", "./js/share.js", "./js/subs.js", "./js/tabbar.js", "./js/team.js", "./js/theme.js", "./js/tracker.js", "./js/upsell.js", "./js/voice.js", "./js/weather.js", "./js/welcome.js", "./js/winter.js"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).then((r) => { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); return r; })
      .catch(() => caches.match(req).then((r) => r || caches.match("./index.html"))));
    return;
  }
  const sameOrigin = url.origin === location.origin;
  const fonts = /fonts\.(googleapis|gstatic)\.com|images\.unsplash\.com/.test(url.host);
  if (!sameOrigin && !fonts) return;
  e.respondWith(caches.open(CACHE).then((c) => c.match(req).then((hit) => {
    const net = fetch(req).then((r) => { if (r.ok || r.type === "opaque") c.put(req, r.clone()); return r; }).catch(() => hit);
    return hit || net;
  })));
});
