// Tap a menu card: drinks open the builder, food opens a detail sheet with allergens and drink pairings.
(function () {
  const EMOJI = { croissant: "🥐", muffin: "🧁", avotoast: "🥑", sandwich: "🥪" };
  const sheet = document.createElement("div");
  sheet.className = "detail-wrap"; sheet.hidden = true;
  document.body.appendChild(sheet);
  let qty = 1, cur;

  function open(id) {
    cur = MENU_INDEX[id]; qty = 1;
    const info = cur.info || { ing: "", all: [], pair: [] };
    sheet.innerHTML = `
      <div class="detail" role="dialog" aria-modal="true" aria-label="${cur.name}">
        <button class="drawer-close detail-x" aria-label="Close">✕</button>
        <div class="detail-art" aria-hidden="true">${EMOJI[id] || "🍽"}</div>
        <div class="detail-body">
          <h2>${cur.name}</h2>
          <p class="muted">${cur.desc}</p>
          ${info.ing ? `<p class="small"><strong>Ingredients:</strong> ${info.ing}</p>` : ""}
          <div class="allergens">${info.all.map((a) => `<span>⚠︎ ${a}</span>`).join("")}${cur.tags.includes("vegan") ? `<span class="ok">🌱 Vegan</span>` : ""}${info.cal ? `<span class="neutral">🔥 ~${info.cal} cal</span>` : ""}</div>
          ${info.pair.length ? `<h3>Pairs well with</h3><div class="pairs">${info.pair.map((pid) => `
            <button class="pair" data-pair="${pid}"><span class="pair-cup">${(window.cupThumb && cupThumb(pid, {}, "-d")) || "☕"}</span><span><strong>${MENU_INDEX[pid].name}</strong><small>${fmt(MENU_INDEX[pid].price)}</small></span><b>+</b></button>`).join("")}</div>` : ""}
          <div class="detail-buy">
            <div class="stepper"><button type="button" data-q="-1" aria-label="Fewer">−</button><output>${qty}</output><button type="button" data-q="1" aria-label="More">+</button></div>
            <button class="btn" data-detail-add>Add ${qty} · ${fmt(cur.price * qty)}</button>
          </div>
        </div>
      </div>`;
    sheet.hidden = false; document.body.classList.add("no-scroll");
    sheet.querySelector("[data-detail-add]").focus();
    window.track && track("view_item", { items: [{ item_id: id, item_name: cur.name, price: cur.price }] });
  }
  function close() { sheet.hidden = true; document.body.classList.remove("no-scroll"); }
  sheet.addEventListener("click", (e) => {
    if (e.target === sheet || e.target.closest(".detail-x")) return close();
    const q = e.target.closest("[data-q]");
    if (q) { qty = Math.max(1, Math.min(12, qty + +q.dataset.q)); sheet.querySelector("output").textContent = qty; sheet.querySelector("[data-detail-add]").textContent = `Add ${qty} · ${fmt(cur.price * qty)}`; }
    if (e.target.closest("[data-detail-add]")) { for (let i = 0; i < qty; i++) Cart.add(cur.id); close(); }
    const p = e.target.closest("[data-pair]");
    if (p) { close(); openBuilder(p.dataset.pair); }
  });
  document.addEventListener("keydown", (e) => e.key === "Escape" && !sheet.hidden && close());

  // Whole-card tap target (but not on buttons inside it).
  document.addEventListener("click", (e) => {
    const card = e.target.closest(".menu-card");
    if (!card || e.target.closest("button, a")) return;
    const item = MENU_INDEX[card.dataset.id];
    if (item.food) open(item.id); else openBuilder(item.id);
  });
  window.openDetail = open;
})();
