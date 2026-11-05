// Split the bill: per-person share for group orders + copyable payment note.
(function () {
  let n = 0;
  document.addEventListener("cart:render", () => {
    let el = document.getElementById("split");
    if (Cart.count() < 2) { el && el.remove(); n = 0; return; }
    if (!el) {
      el = document.createElement("div"); el.id = "split"; el.className = "split";
      document.getElementById("share-order").after(el);
      el.addEventListener("click", (e) => {
        const b = e.target.closest("[data-split]");
        if (b) { n = Math.max(0, Math.min(12, (n || 1) + +b.dataset.split)); if (n === 1) n = 0; Cart.refresh(); }
        if (e.target.closest("[data-split-copy]")) {
          const each = Math.ceil((Cart.total() / n) * 100) / 100;
          const note = `☕ Ember & Bean order: ${fmt(Cart.total())} total, split ${n} ways = ${fmt(each)} each.\n` + Cart.lines.map((l) => `• ${l.qty}× ${l.name}`).join("\n");
          navigator.clipboard?.writeText(note).then(() => (e.target.textContent = "✓ Copied"), () => prompt("Copy this:", note));
        }
        if (e.target.closest("[data-split-start]")) { n = 2; Cart.refresh(); }
      });
    }
    el.innerHTML = n
      ? `<div class="split-row"><span>Split between</span><div class="stepper"><button type="button" data-split="-1" aria-label="Fewer people">−</button><output>${n}</output><button type="button" data-split="1" aria-label="More people">+</button></div></div>
         <div class="split-row each"><span>Each person pays</span><strong>${fmt(Math.ceil((Cart.total() / n) * 100) / 100)}</strong></div>
         <button type="button" class="link-btn" data-split-copy>📋 Copy payment note for the group chat</button>`
      : `<button type="button" class="link-btn" data-split-start>➗ Split the bill</button>`;
  });
  Cart.refresh();
})();
