// Pastry pairing: $1 off one pastry per drink, with one-tap suggestions in the cart.
(function () {
  const PASTRIES = ["croissant", "muffin"];
  const isDrink = (l) => !MENU_INDEX[l.id].food;
  const isPastry = (l) => PASTRIES.includes(l.id);

  Cart.rules.push((cart) => {
    const drinks = cart.lines.filter(isDrink).reduce((s, l) => s + l.qty, 0);
    const pastries = cart.lines.filter(isPastry).reduce((s, l) => s + l.qty, 0);
    const n = Math.min(drinks, pastries);
    return n ? [{ label: `Pastry pairing ×${n}`, amount: n * 1 }] : [];
  });

  document.addEventListener("cart:render", () => {
    const el = document.getElementById("cart-extras");
    const drinks = Cart.lines.filter(isDrink).reduce((s, l) => s + l.qty, 0);
    const pastries = Cart.lines.filter(isPastry).reduce((s, l) => s + l.qty, 0);
    if (!drinks || pastries >= drinks) { el.innerHTML = ""; return; }
    el.innerHTML = `
      <div class="pairing">
        <p class="pairing-head"><strong>Pair it with a pastry</strong><span>$1 off with every drink</span></p>
        <div class="pairing-items">${PASTRIES.map((id) => {
          const i = MENU_INDEX[id];
          return `<button class="pairing-item" data-add="${id}">
            <span class="pi-emoji" aria-hidden="true">${id === "croissant" ? "🥐" : "🧁"}</span>
            <span class="pi-name">${i.name}</span>
            <span class="pi-price"><s>${fmt(i.price)}</s> ${fmt(i.price - 1)}</span>
          </button>`;
        }).join("")}</div>
      </div>`;
  });
  Cart.refresh();
})();
