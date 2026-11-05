// Mobile bottom tab bar: Home · Menu · Search · Me · Order (badge + total). Replaces the floating bar on phones.
(function () {
  const bar = document.createElement("nav");
  bar.className = "tabbar"; bar.setAttribute("aria-label", "Quick navigation");
  bar.innerHTML = `
    <a href="#home" class="tb"><svg class="ico" aria-hidden="true"><use href="#i-home"/></svg>Home</a>
    <a href="#menu" class="tb"><svg class="ico" aria-hidden="true"><use href="#i-cup"/></svg>Menu</a>
    <button class="tb" data-call="openPalette"><svg class="ico" aria-hidden="true"><use href="#i-search"/></svg>Search</button>
    <button class="tb" data-call="openMe"><svg class="ico" aria-hidden="true"><use href="#i-user"/></svg>Me</button>
    <button class="tb tb-order" data-open-cart><span class="tb-ico" aria-hidden="true"><svg class="ico"><use href="#i-bag"/></svg><b class="tb-badge" hidden></b></span><span class="tb-label">Order</span></button>`;
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
