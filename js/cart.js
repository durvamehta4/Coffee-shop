// Order-ahead cart: localStorage-backed, drawer UI, pickup slot picker, pay at pickup.
(function () {
  const KEY = "eb-cart";
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(cart.lines)); } catch {} };

  const cart = window.Cart = {
    lines: load(), // { key, id, name, price, qty, opts? }
    add(id, opts = {}, price) {
      const item = MENU_INDEX[id];
      const key = id + "|" + JSON.stringify(opts);
      const line = cart.lines.find((l) => l.key === key);
      if (line) line.qty++;
      else cart.lines.push({ key, id, name: item.name, price: price ?? item.price, qty: 1, opts });
      cart.changed({ added: id });
    },
    setQty(key, qty) {
      const l = cart.lines.find((x) => x.key === key);
      if (!l) return;
      l.qty = qty;
      if (l.qty <= 0) cart.lines = cart.lines.filter((x) => x !== l);
      cart.changed();
    },
    clear() { cart.lines = []; cart.changed(); },
    count: () => cart.lines.reduce((s, l) => s + l.qty, 0),
    subtotal: () => cart.lines.reduce((s, l) => s + l.qty * l.price, 0),
    rules: [], // fns (cart) => [{ label, amount }] — discounts registered by other modules
    discounts: () => cart.rules.flatMap((r) => r(cart) || []).filter((d) => d.amount > 0),
    total: () => Math.max(0, cart.subtotal() - cart.discounts().reduce((s, d) => s + d.amount, 0)),
    refresh: () => render(),
    changed(detail = {}) { save(); render(); document.dispatchEvent(new CustomEvent("cart:changed", { detail })); },
  };

  // ---- DOM ----
  const drawer = document.getElementById("cart-drawer");
  const overlay = document.getElementById("cart-overlay");
  const linesEl = document.getElementById("cart-lines");
  const totalEl = document.getElementById("cart-total");
  const badges = document.querySelectorAll("[data-cart-count]");
  const checkoutForm = document.getElementById("checkout-form");
  const slotSelect = document.getElementById("pickup-slot");

  window.openCart = function () {
    drawer.classList.add("open"); overlay.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    showStep("cart");
    buildSlots();
    drawer.querySelector(".drawer-close").focus();
  };
  window.closeCart = function () {
    drawer.classList.remove("open"); overlay.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
  };
  function showStep(step) {
    drawer.querySelectorAll("[data-step]").forEach((el) => (el.hidden = el.dataset.step !== step));
  }

  function optText(o) { return Object.values(o || {}).filter(Boolean).join(" · "); }

  function render() {
    const n = cart.count();
    badges.forEach((b) => { b.textContent = n; b.hidden = n === 0; });
    if (!cart.lines.length) {
      linesEl.innerHTML = `<div class="cart-empty"><p>Your order is empty.</p><a href="#menu" class="btn btn-small" onclick="closeCart()">Browse the menu</a></div>`;
    } else {
      linesEl.innerHTML = cart.lines.map((l) => `
        <li class="cart-line">
          <div><strong>${l.name}</strong>${optText(l.opts) ? `<small>${optText(l.opts)}</small>` : ""}<span class="muted">${fmt(l.price)}</span></div>
          <div class="qty">
            <button data-dec="${encodeURIComponent(l.key)}" aria-label="Remove one ${l.name}">−</button>
            <span>${l.qty}</span>
            <button data-inc="${encodeURIComponent(l.key)}" aria-label="Add one ${l.name}">+</button>
          </div>
        </li>`).join("");
    }
    const ds = cart.lines.length ? cart.discounts() : [];
    document.getElementById("cart-adjust").innerHTML = ds.length
      ? `<div class="cart-total-row sub"><span>Subtotal</span><span>${fmt(cart.subtotal())}</span></div>` +
        ds.map((d) => `<div class="cart-total-row deal"><span>🎉 ${d.label}</span><span>−${fmt(d.amount)}</span></div>`).join("")
      : "";
    totalEl.textContent = fmt(cart.total());
    document.dispatchEvent(new CustomEvent("cart:render"));
    document.getElementById("to-checkout").disabled = !cart.lines.length;
  }

  // Pickup slots: every 15 minutes from now+10min until closing, today only.
  function buildSlots() {
    const hours = window.SHOP_HOURS[new Date().getDay()];
    const now = new Date();
    const start = new Date(now.getTime() + 10 * 60000);
    start.setMinutes(Math.ceil(start.getMinutes() / 15) * 15, 0, 0);
    const close = new Date(now); close.setHours(hours[1], 0, 0, 0);
    const open = new Date(now); open.setHours(hours[0], 0, 0, 0);
    let t = start < open ? open : start;
    const opts = [];
    const asap = Math.round((t - now) / 60000);
    while (t <= new Date(close.getTime() - 15 * 60000)) {
      const label = t.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
      opts.push(`<option value="${t.toISOString()}">${opts.length === 0 && asap <= 25 ? `ASAP (~${asap} min) — ${label}` : label}</option>`);
      t = new Date(t.getTime() + 15 * 60000);
    }
    slotSelect.innerHTML = opts.join("") || `<option value="">We're closed for today — sorry!</option>`;
    slotSelect.disabled = !opts.length;
    checkoutForm.querySelector("button[type=submit]").disabled = !opts.length;
  }

  // ---- Events ----
  document.addEventListener("click", (e) => {
    const add = e.target.closest("[data-add]");
    if (add) {
      cart.add(add.dataset.add);
      add.classList.add("added"); add.textContent = "✓ Added";
      setTimeout(() => { add.classList.remove("added"); add.textContent = "+ Add"; }, 1200);
    }
    const inc = e.target.closest("[data-inc]");
    const dec = e.target.closest("[data-dec]");
    if (inc || dec) {
      const key = decodeURIComponent((inc || dec).dataset.inc || (inc || dec).dataset.dec);
      const l = cart.lines.find((x) => x.key === key);
      cart.setQty(key, l.qty + (inc ? 1 : -1));
    }
    if (e.target.closest("[data-open-cart]")) { e.preventDefault(); openCart(); }
  });
  overlay.addEventListener("click", closeCart);
  drawer.querySelector(".drawer-close").addEventListener("click", closeCart);
  document.addEventListener("keydown", (e) => e.key === "Escape" && drawer.classList.contains("open") && closeCart());
  document.getElementById("to-checkout").addEventListener("click", () => showStep("checkout"));
  document.getElementById("back-to-cart").addEventListener("click", () => showStep("cart"));

  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = checkoutForm.elements.cname.value.trim();
    if (!name) { checkoutForm.elements.cname.focus(); return; }
    const slot = new Date(slotSelect.value);
    const order = {
      no: "EB-" + Math.floor(1000 + Math.random() * 9000),
      name, time: slot.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
      lines: cart.lines.map((l) => ({ ...l })), total: cart.total(),
    };
    try { localStorage.setItem("eb-last-order", JSON.stringify(order)); } catch {}
    document.getElementById("confirm-no").textContent = order.no;
    document.getElementById("confirm-name").textContent = name;
    document.getElementById("confirm-time").textContent = order.time;
    document.getElementById("confirm-total").textContent = fmt(order.total);
    cart.clear();
    showStep("done");
    document.dispatchEvent(new CustomEvent("order:placed", { detail: order }));
  });

  render();
})();
