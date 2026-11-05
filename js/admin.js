// Launch checklist for the shop owner: open the site with ?admin to see what's still placeholder.
(function () {
  if (!/[?&]admin\b/.test(location.search)) return;
  const C = window.SHOP_CONFIG || {};
  const checks = [
    ["Order endpoint configured (js/config.js → ORDER_ENDPOINT)", !!C.ORDER_ENDPOINT, "Orders are demo-only until this is set."],
    ["Real address and phone (index.html, JSON-LD, footer)", !/123 Roast Street|555-0123/.test(document.body.innerText), "Still showing 123 Roast Street / (555) 555-0123."],
    ["Real reviews (js/reviews.js)", false, "Sample reviews. Replace with real quotes, with permission."],
    ["Map coordinates (js/weather.js, js/arrival.js → SHOP lat/lon)", false, "Set to your shop's latitude and longitude."],
    ["Google review link (js/feedback-ask.js → REVIEW_URL)", false, "Point to your Google Business review link."],
    ["Social links (footer)", ![...document.querySelectorAll(".socials a")].every((a) => a.getAttribute("href") === "#"), "Footer icons link to #."],
    ["Hours & holidays (js/core.js → HOURS, holidayFor)", true, "Check these match your real schedule."],
    ["Menu & prices (js/data.js)", true, "Single source of truth for menu, cart, print menu and search."],
    ["Analytics (window.dataLayer → GTM/GA4)", !!window.google_tag_manager, "Events are emitted. Add your GTM snippet to collect them."],
  ];
  const el = document.createElement("aside");
  el.className = "admin";
  const done = checks.filter((c) => c[1]).length;
  el.innerHTML = `<div class="admin-head"><strong>🚀 Launch checklist</strong><span>${done}/${checks.length}</span><button class="link-btn" aria-label="Close">✕</button></div>
    <ul>${checks.map(([t, ok, hint]) => `<li class="${ok ? "ok" : ""}"><b>${ok ? "✓" : "○"}</b><div>${t}${ok ? "" : `<small>${hint}</small>`}</div></li>`).join("")}</ul>
    <p>Tip: <code>?debug=funnel</code> shows the live conversion funnel · <code>?ab=hero_cta:skip</code> forces an A/B variant.</p>`;
  document.body.appendChild(el);
  el.querySelector("button").onclick = () => el.remove();
})();
