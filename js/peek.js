// Desktop mini-cart peek on hover/focus of the header Order button.
(function () {
  const btn = document.querySelector(".cart-btn"); if (!btn) return;
  const peek = document.createElement("div");
  peek.className = "peek"; peek.hidden = true;
  btn.parentElement.style.position = "relative";
  btn.after(peek);
  let t;
  function render() {
    if (!Cart.lines.length) {
      const picks = ["latte", "coldbrew", "croissant"].map((id) => MENU_INDEX[id]);
      peek.innerHTML = `<p class="peek-empty">Your order is empty. Start with a favorite:</p>
        <ul class="peek-list">${picks.map((i) => `<li><span>${i.name}</span><button class="add-btn" data-add="${i.id}">+ ${fmt(i.price)}</button></li>`).join("")}</ul>`;
      return;
    }
    peek.innerHTML = `
      <ul class="peek-list">${Cart.lines.slice(0, 5).map((l) => `<li><span><span><b>${l.qty}×</b> ${l.name}</span><small>${Object.values(l.opts || {}).filter(Boolean).slice(0, 3).join(" · ")}</small></span><span>${fmt(l.qty * l.price)}</span></li>`).join("")}
      ${Cart.lines.length > 5 ? `<li class="muted">+ ${Cart.lines.length - 5} more</li>` : ""}</ul>
      <div class="peek-foot"><span>Total <b>${fmt(Cart.total())}</b></span><button class="btn btn-small" data-open-cart>Checkout →</button></div>`;
  }
  const open = () => { if (!matchMedia("(hover: hover) and (min-width: 801px)").matches) return; clearTimeout(t); render(); peek.hidden = false; };
  const close = () => { t = setTimeout(() => (peek.hidden = true), 180); };
  [btn, peek].forEach((el) => { el.addEventListener("mouseenter", open); el.addEventListener("mouseleave", close); });
  btn.addEventListener("focus", open); peek.addEventListener("focusout", (e) => { if (!peek.contains(e.relatedTarget) && e.relatedTarget !== btn) close(); });
  btn.addEventListener("blur", (e) => { if (!peek.contains(e.relatedTarget)) close(); });
  document.addEventListener("cart:changed", () => !peek.hidden && render());
  peek.addEventListener("click", (e) => { if (e.target.closest("[data-open-cart]")) peek.hidden = true; });
})();
