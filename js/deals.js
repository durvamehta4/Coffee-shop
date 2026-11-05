// Time-aware happy hour (weekdays 2–4pm, 20% off iced drinks) + announcement strip with live countdown.
(function () {
  const HH = { start: 14, end: 16, off: 0.2 };
  const weekday = (d) => d.getDay() >= 1 && d.getDay() <= 5;
  const isIced = (l) => (l.opts && l.opts.temp === "Iced") || l.id === "coldbrew" && !(l.opts && l.opts.temp === "Hot");
  const hhNow = (d = new Date()) => weekday(d) && d.getHours() >= HH.start && d.getHours() < HH.end;
  window.Deals = { hhNow };

  Cart.rules.push((cart) => {
    if (!hhNow()) return [];
    const amt = cart.lines.filter((l) => !MENU_INDEX[l.id].food && isIced(l)).reduce((s, l) => s + l.qty * l.price * HH.off, 0);
    return amt ? [{ label: "Happy hour · 20% off iced", amount: +amt.toFixed(2) }] : [];
  });

  const strip = document.createElement("div");
  strip.className = "promo-strip"; strip.setAttribute("role", "status");
  document.querySelector(".site-header").prepend(strip);
  const dur = (ms) => { const m = Math.max(1, Math.round(ms / 60000)); return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`; };

  function render() {
    let dismissed; try { dismissed = sessionStorage.getItem("eb-strip") === "x"; } catch {}
    if (dismissed) { strip.remove(); document.body.classList.remove("has-strip"); return; }
    const now = new Date(), at = (h) => { const d = new Date(now); d.setHours(h, 0, 0, 0); return d; };
    let html;
    if (hhNow(now)) html = `🧊 <strong>Happy hour is on:</strong> 20% off every iced drink · ends in <b>${dur(at(HH.end) - now)}</b> <a href="#menu">Order iced →</a>`;
    else if (weekday(now) && now.getHours() < HH.start && now.getHours() >= 7) html = `☀️ <strong>Afternoon chill:</strong> 20% off iced drinks 2–4 pm · starts in <b>${dur(at(HH.start) - now)}</b>`;
    else html = `🥐 <strong>Pastry pairing:</strong> $1 off any pastry with a drink, every day <a href="#menu">Order ahead →</a>`;
    strip.innerHTML = `<div class="container promo-inner"><span>${html}</span><button class="promo-x" aria-label="Dismiss announcement">✕</button></div>`;
    strip.querySelector(".promo-x").onclick = () => { try { sessionStorage.setItem("eb-strip", "x"); } catch {} render(); };
    document.body.classList.add("has-strip");
    Cart.refresh();
  }
  render();
  setInterval(render, 30000);
})();
