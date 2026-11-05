// Favorites (♥ on cards) + "My Ember" panel: stamps, favorites, order history with reorder.
(function () {
  const get = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
  const set = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
  let favs = new Set(get("eb-favs", []));

  // Hearts on menu cards (cards re-render, so decorate on every render).
  function decorate() {
    document.querySelectorAll(".menu-card").forEach((c) => {
      if (c.querySelector(".fav")) return;
      const id = c.dataset.id, on = favs.has(id);
      c.insertAdjacentHTML("beforeend", `<button class="fav ${on ? "on" : ""}" data-fav="${id}" aria-pressed="${on}" aria-label="Save ${MENU_INDEX[id].name} to favorites">${on ? "♥" : "♡"}</button>`);
    });
  }
  new MutationObserver(decorate).observe(document.getElementById("menu"), { childList: true, subtree: true });
  decorate();
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-fav]"); if (!b) return;
    const id = b.dataset.fav;
    favs.has(id) ? favs.delete(id) : favs.add(id);
    set("eb-favs", [...favs]);
    document.querySelectorAll(`[data-fav="${id}"]`).forEach((x) => {
      const on = favs.has(id); x.classList.toggle("on", on); x.textContent = on ? "♥" : "♡"; x.setAttribute("aria-pressed", on);
      if (on) x.animate([{ transform: "scale(1.5)" }, { transform: "scale(1)" }], { duration: 300 });
    });
    renderPanel();
  });

  // Order history
  document.addEventListener("order:placed", (e) => {
    const h = get("eb-history", []); h.unshift(e.detail); set("eb-history", h.slice(0, 10)); renderPanel();
  });

  // Panel
  const panel = document.createElement("aside");
  panel.className = "me-panel"; panel.hidden = true; panel.setAttribute("aria-label", "My Ember");
  document.body.appendChild(panel);
  function renderPanel() {
    const club = get("eb-club", null), hist = get("eb-history", []);
    const favItems = [...favs].map((id) => MENU_INDEX[id]).filter(Boolean);
    panel.innerHTML = `
      <div class="me-head"><h2>${club ? `Hi, ${club.name}` : "My Ember"}</h2><button class="drawer-close" data-me-close aria-label="Close">✕</button></div>
      <div class="me-body">
        <section><h3>Ember Club</h3>${club
          ? `<div class="me-stamps">${Array.from({ length: 9 }, (_, i) => `<i class="${i < club.stamps ? "on" : ""}"></i>`).join("")}</div><p class="muted small">${Math.max(0, 9 - club.stamps)} stamps to a free drink</p>`
          : `<p class="muted small">Join free and get a stamp on us. <a href="#rewards" data-me-close>Join Ember Club →</a></p>`}</section>
        <section><h3>Favorites</h3>${favItems.length ? `<ul class="me-list">${favItems.map((i) => `<li><span>♥ ${i.name}</span><button class="btn btn-small" data-add="${i.id}">Add · ${fmt(i.price)}</button></li>`).join("")}</ul>`
          : `<p class="muted small">Tap ♡ on any menu item to save it here.</p>`}</section>
        <section><h3>Past orders</h3>${hist.length ? `<ul class="me-list">${hist.map((o, i) => `<li><span><strong>${o.no}</strong><small>${o.lines.map((l) => (l.qty > 1 ? l.qty + "× " : "") + l.name).join(", ")}</small></span><button class="btn btn-small btn-ghost" data-reorder="${i}">↻ ${fmt(o.total)}</button></li>`).join("")}</ul>`
          : `<p class="muted small">Your orders will show up here for one-tap reordering.</p>`}</section>
      </div>`;
  }
  panel.addEventListener("click", (e) => {
    if (e.target.closest("[data-me-close]")) toggle(false);
    const r = e.target.closest("[data-reorder]");
    if (r) {
      const o = get("eb-history", [])[+r.dataset.reorder];
      o.lines.forEach((l) => { const ex = Cart.lines.find((x) => x.key === l.key); ex ? (ex.qty += l.qty) : Cart.lines.push({ ...l }); });
      Cart.changed({ added: "reorder" }); toggle(false); openCart();
    }
  });
  function toggle(on) {
    panel.hidden = !on;
    if (on) { renderPanel(); panel.querySelector("[data-me-close]").focus(); }
  }
  window.openMe = () => toggle(true);
  document.addEventListener("keydown", (e) => e.key === "Escape" && !panel.hidden && toggle(false));
  renderPanel();
})();
