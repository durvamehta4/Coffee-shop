// Pay-it-forward: a one-tap $3 "suspended coffee" add-on in the cart.
(function () {
  document.addEventListener("cart:render", () => {
    const extras = document.getElementById("cart-extras");
    let box = document.getElementById("forward-box");
    const has = Cart.lines.find((l) => l.id === "forward");
    const others = Cart.lines.some((l) => l.id !== "forward");
    if (!others && !has) { box && box.remove(); return; }
    if (!box) { box = document.createElement("label"); box.id = "forward-box"; box.className = "forward"; extras.after(box); }
    box.innerHTML = `
      <input type="checkbox" ${has ? "checked" : ""} />
      <span class="fw-check" aria-hidden="true"></span>
      <span class="fw-text"><strong>☕ Pay a coffee forward · +$3</strong>
      <small>We pin a token to our community board for anyone who needs a warm cup, no questions asked.</small></span>`;
    box.querySelector("input").onchange = (e) => {
      const line = Cart.lines.find((l) => l.id === "forward");
      if (e.target.checked && !line) Cart.add("forward");
      else if (!e.target.checked && line) Cart.setQty(line.key, 0);
    };
  });
  Cart.refresh();
})();
