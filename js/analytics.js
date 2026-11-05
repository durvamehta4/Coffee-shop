// GA4-shaped ecommerce events → window.dataLayer (works with GTM/GA4/Plausible). ?debug=funnel shows a live funnel.
(function () {
  window.dataLayer = window.dataLayer || [];
  const item = (l) => ({ item_id: l.id, item_name: l.name || MENU_INDEX[l.id].name, price: l.price ?? MENU_INDEX[l.id].price, quantity: l.qty || 1, item_variant: l.opts ? Object.values(l.opts).filter(Boolean).join(" / ") : undefined });
  const counts = {};
  function track(event, params = {}) {
    window.dataLayer.push({ event, ...params });
    counts[event] = (counts[event] || 0) + 1;
    debug && renderDebug();
  }
  window.track = track;

  // Funnel events
  const menuObs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { track("view_item_list", { item_list_name: "menu" }); menuObs.disconnect(); } }, { threshold: 0.2 });
  menuObs.observe(document.getElementById("menu"));
  const builder = document.getElementById("builder");
  new MutationObserver(() => builder.classList.contains("open") && track("view_item", { items: [item({ id: builder.querySelector(".builder-title").textContent && Object.keys(MENU_INDEX).find((k) => MENU_INDEX[k].name === builder.querySelector(".builder-title").textContent) })] })).observe(builder, { attributes: true, attributeFilter: ["class"] });
  document.addEventListener("cart:changed", (e) => {
    const id = e.detail && e.detail.added; if (!id) return;
    if (id === "reorder") return track("add_to_cart", { source: "reorder", value: Cart.total(), currency: "USD" });
    const l = [...Cart.lines].reverse().find((x) => x.id === id);
    l && track("add_to_cart", { currency: "USD", value: l.price, items: [item({ ...l, qty: 1 })] });
  });
  const drawer = document.getElementById("cart-drawer");
  new MutationObserver(() => drawer.classList.contains("open") && track("view_cart", { currency: "USD", value: Cart.total(), items: Cart.lines.map(item) })).observe(drawer, { attributes: true, attributeFilter: ["class"] });
  document.getElementById("to-checkout").addEventListener("click", () => track("begin_checkout", { currency: "USD", value: Cart.total(), items: Cart.lines.map(item) }));
  document.addEventListener("order:placed", (e) => {
    const o = e.detail;
    track("purchase", { transaction_id: o.no, currency: "USD", value: o.total, pickup_mode: o.mode, items: o.lines.map(item),
      coupon: (o.discounts || []).map((d) => d.label).join(", ") || undefined });
  });
  // Engagement events
  document.addEventListener("click", (e) => {
    const q = e.target.closest(".quiz-a"); if (q) track("quiz_answer", { answer: q.dataset.v });
    if (e.target.closest("#quiz-add")) track("quiz_convert");
    if (e.target.closest("[data-voice]")) track("voice_start");
    if (e.target.closest("#share-order")) track("share", { content_type: "group_order" });
    if (e.target.closest("#club-form button")) track("sign_up", { method: "ember_club" });
    if (e.target.closest(".pal-btn")) track("search_open");
  });

  // Debug funnel overlay
  const debug = /[?&]debug=funnel/.test(location.search);
  let panel;
  function renderDebug() {
    if (!panel) { panel = document.createElement("aside"); panel.className = "funnel-debug"; document.body.appendChild(panel); }
    const steps = ["view_item_list", "view_item", "add_to_cart", "view_cart", "begin_checkout", "purchase"];
    const top = counts[steps[0]] || 1;
    panel.innerHTML = `<strong>Funnel (this session)</strong>` + steps.map((s, i) => {
      const n = counts[s] || 0, prev = i ? counts[steps[i - 1]] || 0 : n;
      return `<div class="fd-row"><span>${s}</span><b>${n}</b><i style="width:${Math.min(100, (n / top) * 100)}%"></i><small>${i && prev ? Math.round((n / prev) * 100) + "%" : ""}</small></div>`;
    }).join("") + `<small>${window.dataLayer.length} events in dataLayer</small>`;
  }
  if (debug) renderDebug();
})();
