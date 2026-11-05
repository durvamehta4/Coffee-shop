// Bake-to-sellout rules (shop-configurable): urgency before, "sold out · pre-order tomorrow" after.
(function () {
  const RULES = { croissant: { by: 11, days: [0, 6] }, muffin: { by: 13, days: [0, 1, 2, 3, 4, 5, 6] } };
  const t = (h) => (h > 12 ? h - 12 + " pm" : h === 12 ? "12 pm" : h + " am");
  const state = (id, now = new Date()) => {
    const r = RULES[id]; if (!r || !r.days.includes(now.getDay())) return null;
    const hm = now.getHours() + now.getMinutes() / 60;
    return hm >= r.by ? "out" : hm >= r.by - 3 ? "soon" : null;
  };
  window.Stock = { state };
  function decorate() {
    document.querySelectorAll(".menu-card").forEach((c) => {
      const id = c.dataset.id, st = state(id); if (!st || c.dataset.stock === st) return;
      c.dataset.stock = st;
      c.querySelector(".stock-chip")?.remove();
      const body = c.querySelector(".menu-card-body");
      if (st === "soon") body.querySelector("p").insertAdjacentHTML("beforebegin", `<span class="stock-chip soon">🔥 Usually gone by ${t(RULES[id].by)}</span>`);
      if (st === "out") {
        c.classList.add("sold-out");
        body.querySelector("p").insertAdjacentHTML("beforebegin", `<span class="stock-chip out">Sold out today</span>`);
        const add = body.querySelector(".add-btn");
        add.textContent = "Pre-order for tomorrow"; add.dataset.preorder = id; add.removeAttribute("data-add");
      }
    });
  }
  new MutationObserver(decorate).observe(document.getElementById("menu"), { childList: true, subtree: true });
  decorate();
  // Pre-order: add the item and flag that checkout should default to tomorrow.
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-preorder]"); if (!b) return;
    Cart.add(b.dataset.preorder, { note: "Pre-order" });
    window.__preorder = true;
  });
  document.getElementById("to-checkout").addEventListener("click", () => setTimeout(() => {
    const soldOut = Cart.lines.some((l) => state(l.id) === "out" && !(l.opts && l.opts.note === "Pre-order"));
    if (!(window.__preorder || soldOut)) return;
    const sel = document.getElementById("pickup-slot");
    const g = [...sel.querySelectorAll("optgroup")].find((x) => /pre-order/i.test(x.label));
    if (g && g.children[0]) { sel.value = g.children[0].value; }
    const note = document.getElementById("slot-note");
    note.hidden = false; note.textContent = "🥐 Some items sold out today, so we've set pickup for when they're fresh out of the oven.";
  }, 20));
})();
