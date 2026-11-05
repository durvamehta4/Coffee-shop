// Ember Club: 9 stamps → free drink. Stored locally; earns on order placement.
(function () {
  const KEY = "eb-club", GOAL = 9, CAP = 6; // free drink up to $6
  const get = () => { try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; } };
  const set = (v) => { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch {} };
  const drinksIn = (lines) => lines.filter((l) => !MENU_INDEX[l.id].food);
  const root = document.getElementById("club");

  window.Club = { get, set };

  function stamps(n, preview) {
    return Array.from({ length: GOAL }, (_, i) =>
      `<span class="stamp ${i < n ? "on" : ""}" style="--i:${i}">${i < n ? "☕" : i + 1}</span>`).join("") +
      `<span class="stamp free ${n >= GOAL ? "on" : ""}">FREE</span>`;
  }

  function render() {
    const m = get();
    if (!m) {
      root.innerHTML = `
        <div class="club-card preview" aria-hidden="true">
          <div class="club-card-head"><span class="club-logo">Ember Club</span><span>Your card</span></div>
          <div class="stamps">${stamps(3)}</div>
        </div>
        <div class="club-copy">
          <p class="eyebrow">Free to join</p>
          <h2>Every 10th drink is on us.</h2>
          <p class="muted">Collect a stamp with every drink you order ahead. Join now and we'll start you off with a free stamp.</p>
          <form class="club-form" id="club-form">
            <input type="text" name="name" placeholder="First name" aria-label="First name" required />
            <input type="email" name="email" placeholder="Email address" aria-label="Email address" required />
            <button class="btn" type="submit">Join Ember Club</button>
          </form>
          <p class="small muted">No spam. Just your stamps and the occasional new-roast alert.</p>
        </div>`;
      root.querySelector("#club-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const f = e.target;
        if (!f.checkValidity()) { f.reportValidity(); return; }
        set({ name: f.name.value.trim(), email: f.email.value.trim(), stamps: 1 });
        render(); Cart.refresh();
        root.querySelector(".club-card").classList.add("celebrate");
      });
    } else {
      const left = Math.max(0, GOAL - m.stamps);
      root.innerHTML = `
        <div class="club-card">
          <div class="club-card-head"><span class="club-logo">Ember Club</span><span>${m.name}</span></div>
          <div class="stamps">${stamps(Math.min(m.stamps, GOAL))}</div>
        </div>
        <div class="club-copy">
          <p class="eyebrow">Welcome back, ${m.name}</p>
          <h2>${left ? `${left} more stamp${left > 1 ? "s" : ""} to a free drink.` : "Your next drink is free! 🎉"}</h2>
          <p class="muted">${left ? "Every drink you order ahead earns a stamp automatically." : "It'll come off your next order automatically, up to $6."}</p>
          <a href="#menu" class="btn">${left ? "Earn stamps now" : "Claim your free drink"}</a>
        </div>`;
    }
  }

  // Free drink when the card is full: most expensive drink up to the cap.
  Cart.rules.push((cart) => {
    const m = get();
    if (!m || m.stamps < GOAL) return [];
    const ds = drinksIn(cart.lines);
    if (!ds.length) return [];
    const top = Math.max(...ds.map((l) => l.price));
    return [{ label: "Ember Club free drink", amount: Math.min(top, CAP), club: true }];
  });

  // Cart nudge.
  document.addEventListener("cart:render", () => {
    const n = drinksIn(Cart.lines).reduce((s, l) => s + l.qty, 0);
    let el = document.getElementById("club-nudge");
    if (!el) { el = document.createElement("p"); el.id = "club-nudge"; el.className = "club-nudge"; document.getElementById("cart-extras").after(el); }
    if (!n) { el.hidden = true; return; }
    el.hidden = false;
    el.innerHTML = get()
      ? `☕ You'll earn <strong>${n} stamp${n > 1 ? "s" : ""}</strong> with this order.`
      : `☕ Earn <strong>${n} stamp${n > 1 ? "s" : ""}</strong> toward a free drink. <a href="#rewards" onclick="closeCart()">Join Ember Club</a>`;
  });

  document.addEventListener("order:placed", (e) => {
    const m = get(); if (!m) return;
    const used = (e.detail.discounts || []).some((d) => d.club);
    const earned = drinksIn(e.detail.lines).reduce((s, l) => s + l.qty, 0);
    m.stamps = (used ? m.stamps - GOAL : m.stamps) + earned;
    set(m); render();
  });

  render();
  Cart.refresh();
})();
