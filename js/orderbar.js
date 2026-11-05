// Floating order bar: visible whenever the cart has items; bumps on add.
(function () {
  const bar = document.createElement("button");
  bar.className = "order-bar";
  bar.setAttribute("data-open-cart", "");
  bar.innerHTML = `<span class="ob-count"></span><span class="ob-label">View order</span><span class="ob-total"></span>`;
  document.body.appendChild(bar);

  function update(e) {
    const n = Cart.count();
    bar.classList.toggle("show", n > 0 && !document.getElementById("cart-drawer").classList.contains("open"));
    bar.querySelector(".ob-count").textContent = n;
    bar.querySelector(".ob-label").textContent = n === 1 ? "1 item · Checkout →" : `${n} items · Checkout →`;
    bar.querySelector(".ob-total").textContent = fmt(Cart.total());
    if (e && e.detail && e.detail.added) {
      bar.classList.remove("bump"); void bar.offsetWidth; bar.classList.add("bump");
    }
  }
  document.addEventListener("cart:changed", update);
  // Hide while the drawer is open.
  new MutationObserver(() => update()).observe(document.getElementById("cart-drawer"), { attributes: true, attributeFilter: ["class"] });
  update();
})();
