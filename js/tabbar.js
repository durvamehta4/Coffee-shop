// Mobile bottom tab bar: Home · Menu · Search · Me · Order (badge + total). Replaces the floating bar on phones.
(function () {
  const bar = document.createElement("nav");
  bar.className = "tabbar"; bar.setAttribute("aria-label", "Quick navigation");
  bar.innerHTML = `
    <a href="#home" class="tb"><span aria-hidden="true">🏠</span>Home</a>
    <a href="#menu" class="tb"><span aria-hidden="true">☕</span>Menu</a>
    <button class="tb" onclick="openPalette()"><span aria-hidden="true">🔍</span>Search</button>
    <button class="tb" onclick="openMe()"><span aria-hidden="true">👤</span>Me</button>
    <button class="tb tb-order" data-open-cart><span class="tb-ico" aria-hidden="true">🛍<b class="tb-badge" hidden></b></span><span class="tb-label">Order</span></button>`;
  document.body.appendChild(bar);
  function update(e) {
    const n = Cart.count(), b = bar.querySelector(".tb-badge"), lbl = bar.querySelector(".tb-label");
    b.hidden = !n; b.textContent = n;
    lbl.textContent = n ? fmt(Cart.total()) : "Order";
    bar.querySelector(".tb-order").classList.toggle("has", n > 0);
    if (e && e.detail && e.detail.added) bar.querySelector(".tb-order").animate([{ transform: "scale(1.15)" }, { transform: "scale(1)" }], { duration: 300 });
  }
  document.addEventListener("cart:changed", update);
  update();
})();
