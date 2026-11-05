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

  // Pickup slots: 15-minute slots for the rest of today, plus the next open day for pre-orders.
  function daySlots(base, from) {
    const { hours } = hoursFor(base);
    if (!hours) return [];
    const [o, c] = hours;
    const open = new Date(base); open.setHours(o, 0, 0, 0);
    const last = new Date(base); last.setHours(c, 0, 0, 0); last.setTime(last - 15 * 60000);
    let t = from && from > open ? from : open;
    const out = [];
    while (t <= last) { out.push(new Date(t)); t = new Date(t.getTime() + 15 * 60000); }
    return out;
  }
  const label = (d) => d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  function buildSlots() {
    const now = new Date();
    const start = new Date(now.getTime() + 10 * 60000);
    start.setMinutes(Math.ceil(start.getMinutes() / 15) * 15, 0, 0);
    const today = daySlots(now, start);
    const nextDay = nextOpening(new Date(new Date(now).setHours(23, 59, 0, 0)));
    const tomorrow = daySlots(nextDay);
    const nextLbl = dayLabel(nextDay, now);
    let html = "";
    if (today.length) {
      const asap = Math.round((today[0] - now) / 60000);
      html += `<optgroup label="Today">${today.map((d, i) =>
        `<option value="${d.toISOString()}">${i === 0 && asap <= 25 ? `ASAP (~${asap} min) · ${label(d)}` : label(d)}</option>`).join("")}</optgroup>`;
    }
    html += `<optgroup label="${nextLbl} (pre-order)">${tomorrow.map((d) =>
      `<option value="${d.toISOString()}">${nextLbl} · ${label(d)}</option>`).join("")}</optgroup>`;
    slotSelect.innerHTML = html;
    const note = document.getElementById("slot-note");
    note.hidden = !!today.length;
    const hol = hoursFor(now).holiday;
    note.textContent = `We're closed for ${hol ? hol : "the rest of today"}, but you can pre-order. It'll be ready the moment you arrive ${dayInline(nextDay, now)}.`;
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
      name, at: slot.toISOString(), placedAt: new Date().toISOString(), time: slot.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) + (slot.toDateString() === new Date().toDateString() ? "" : (dayLabel(slot) === "Tomorrow" ? " tomorrow" : " on " + dayLabel(slot))),
      lines: cart.lines.map((l) => ({ ...l })), discounts: cart.discounts(), total: cart.total(),
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
