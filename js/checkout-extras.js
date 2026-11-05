// Checkout extras: curbside car field toggle + bring-your-own-cup discount.
(function () {
  const form = document.getElementById("checkout-form");
  const byo = document.getElementById("byo");
  form.addEventListener("change", (e) => {
    if (e.target.name === "mode") document.getElementById("car-field").hidden = e.target.value !== "curbside";
    if (e.target === byo) Cart.refresh();
  });
  Cart.rules.push((cart) => {
    if (!byo.checked) return [];
    const drinks = cart.lines.filter((l) => !MENU_INDEX[l.id].food).reduce((s, l) => s + l.qty, 0);
    return drinks ? [{ label: `Own cup ×${drinks}`, amount: drinks * 0.25 }] : [];
  });
  // Show running total on the checkout step too.
  const btn = form.querySelector("button[type=submit]");
  document.addEventListener("cart:render", () => { btn.textContent = `Place order · ${fmt(Cart.total())}`; });
  document.addEventListener("order:placed", () => { byo.checked = false; });
  Cart.refresh();
})();
