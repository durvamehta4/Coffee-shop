// "Your usual?" — one-tap reorder of the last order (exact options) in the hero card and empty cart.
(function () {
  const last = () => { try { return JSON.parse(localStorage.getItem("eb-last-order")); } catch { return null; } };
  const summary = (o) => o.lines.map((l) => `${l.qty > 1 ? l.qty + "× " : ""}${l.name}`).join(", ");
  const subtotal = (o) => o.lines.reduce((s, l) => s + l.qty * l.price, 0);

  function reorder() {
    const o = last(); if (!o) return;
    o.lines.forEach((l) => {
      const ex = Cart.lines.find((x) => x.key === l.key);
      ex ? (ex.qty += l.qty) : Cart.lines.push({ ...l });
    });
    Cart.changed({ added: "reorder" });
    openCart();
  }
  window.reorderLast = reorder;

  function render() {
    const o = last();
    const card = document.querySelector(".quick-order");
    let box = document.getElementById("usual");
    if (!o) { box && box.remove(); return; }
    if (!box) { box = document.createElement("div"); box.id = "usual"; box.className = "usual"; card.querySelector(".qo-title").before(box); }
    box.innerHTML = `
      <div class="usual-text"><small>Welcome back${o.name ? ", " + o.name : ""} · your usual?</small><strong>${summary(o)}</strong></div>
      <button class="btn btn-small" onclick="reorderLast()">Reorder · ${fmt(subtotal(o))}</button>`;
  }

  document.addEventListener("cart:render", () => {
    const o = last();
    const empty = document.querySelector(".cart-empty");
    if (o && empty && !empty.querySelector(".usual-mini")) {
      empty.insertAdjacentHTML("beforeend", `<div class="usual-mini"><p>Or reorder your last one:</p><button class="link-btn" onclick="reorderLast()">↻ ${summary(o)}</button></div>`);
    }
  });
  document.addEventListener("order:placed", render);
  render(); Cart.refresh();
})();
