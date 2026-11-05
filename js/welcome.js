// First-order welcome offer: polite slide-in (25s or exit intent), email → 15% off first order, once.
(function () {
  const K = "eb-welcome"; // { state: "dismissed" | "claimed" | "used", email }
  const get = () => { try { return JSON.parse(localStorage.getItem(K)) || {}; } catch { return {}; } };
  const set = (v) => { try { localStorage.setItem(K, JSON.stringify(v)); } catch {} };
  const returning = () => { try { return !!localStorage.getItem("eb-last-order") || !!localStorage.getItem("eb-club"); } catch { return true; } };

  Cart.rules.push((cart) => {
    if (get().state !== "claimed") return [];
    const amt = +(cart.subtotal() * 0.15).toFixed(2);
    return amt ? [{ label: "Welcome · 15% off first order", amount: Math.min(amt, 10) }] : [];
  });
  document.addEventListener("order:placed", () => { if (get().state === "claimed") set({ ...get(), state: "used" }); });

  if (get().state || returning()) return;
  const el = document.createElement("aside");
  el.className = "welcome"; el.setAttribute("aria-label", "First order offer"); el.hidden = true;
  el.innerHTML = `
    <button class="welcome-x" aria-label="No thanks">✕</button>
    <div class="welcome-art" aria-hidden="true">☕<span>15%</span></div>
    <div class="welcome-body">
      <strong>First time here?</strong>
      <p>Take <b>15% off your first order</b> (up to $10). We'll also send the occasional new-roast note.</p>
      <form class="welcome-form"><input type="email" required placeholder="you@email.com" aria-label="Email" /><button class="btn btn-small">Claim</button></form>
    </div>`;
  document.body.appendChild(el);
  let shown = false;
  function show() {
    if (shown || get().state || document.body.classList.contains("no-scroll")) return;
    shown = true; el.hidden = false; window.track && track("view_promotion", { promotion_id: "welcome15" });
  }
  setTimeout(show, 25000);
  document.addEventListener("mouseout", (e) => { if (!e.relatedTarget && e.clientY < 10) show(); });
  el.querySelector(".welcome-x").onclick = () => { set({ state: "dismissed" }); el.remove(); };
  el.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = e.target.querySelector("input").value.trim();
    set({ state: "claimed", email }); Cart.refresh();
    el.querySelector(".welcome-body").innerHTML = `<strong>You're in! 🎉</strong><p>15% comes off automatically at checkout. No code needed.</p><a href="#menu" class="btn btn-small">Start my order</a>`;
    el.querySelector(".welcome-body a").onclick = () => el.remove();
    window.track && track("select_promotion", { promotion_id: "welcome15" });
    setTimeout(() => el.remove(), 9000);
  });
  window.showWelcome = show; // for testing
})();
