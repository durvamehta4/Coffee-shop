// Remember checkout preferences (name, pickup mode, car, own cup, phone) and pre-fill them next time.
(function () {
  const K = "eb-checkout-prefs";
  const get = (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } };
  const f = document.getElementById("checkout-form");
  function fill() {
    const p = get(K) || {}, club = get("eb-club"), last = get("eb-last-order");
    const name = p.name || (club && club.name) || (last && last.name);
    let filled = false;
    if (name && !f.elements.cname.value) { f.elements.cname.value = name; filled = true; }
    if (p.mode) { const r = f.querySelector(`input[name=mode][value="${p.mode}"]`); if (r) { r.checked = true; document.getElementById("car-field").hidden = p.mode !== "curbside"; } }
    if (p.car && !f.elements.car.value) f.elements.car.value = p.car;
    if (p.phone && !f.elements.phone.value) f.elements.phone.value = p.phone;
    if (p.byo) { document.getElementById("byo").checked = true; Cart.refresh(); }
    let note = f.querySelector(".prefill-note");
    if (filled && !note) { f.insertAdjacentHTML("afterbegin", `<p class="prefill-note">👋 Welcome back! We filled in your usual details.</p>`); }
  }
  document.getElementById("to-checkout").addEventListener("click", () => setTimeout(fill, 0));
  document.addEventListener("order:placed", (e) => {
    const o = e.detail;
    try { localStorage.setItem(K, JSON.stringify({ name: o.name, mode: o.mode, car: o.car, phone: o.phone, byo: (o.discounts || []).some((d) => /Own cup/.test(d.label)) })); } catch {}
  });
})();
