// Hero quick-order card: live open status + ready-time estimate + one-tap popular drinks.
(function () {
  // Dayparts drive the hero copy, featured items and photo grade.
  const ICON = { latte: "🥛", flatwhite: "☕", coldbrew: "🧊", croissant: "🥐", matcha: "🍵", chai: "🫖", cocoa: "🍫", tea: "🌿" };
  const part = window.DAYPART; // set by the inline script right after the hero markup (no late repaint)
  document.querySelector(".qo-title").textContent = part.title;
  const hh = window.Deals && Deals.hhNow && Deals.hhNow();
  const list = document.getElementById("qo-list");
  list.innerHTML = part.picks.map((id) => {
    const i = MENU_INDEX[id];
    const deal = part.iced && hh && !i.food;
    return `<li class="qo-item">
      <span class="qo-icon" aria-hidden="true">${ICON[id] || "☕"}</span>
      <span class="qo-name"><strong>${part.iced && !i.food && id !== "coldbrew" ? "Iced " : ""}${i.name}</strong><small>${i.desc}</small></span>
      <span class="qo-price">${deal ? `<s>${fmt(i.price)}</s> ${fmt(i.price * 0.8)}` : fmt(i.price)}</span>
      <button class="qo-add" data-add="${id}" ${part.iced && !i.food ? 'data-iced="1"' : ""} aria-label="Customize and add ${i.name}">+</button>
    </li>`;
  }).join("");
  // Iced picks open the builder pre-set to iced.
  list.addEventListener("click", (e) => {
    const b = e.target.closest("[data-iced]");
    if (b && window.openBuilder) { e.stopPropagation(); openBuilder(b.dataset.add, { temp: "Iced" }); }
  }, true);

  function status() {
    const el = document.getElementById("qo-status");
    const now = new Date();
    const { hours } = hoursFor(now);
    const t = now.getHours() + now.getMinutes() / 60;
    const txt = el.querySelector(".qo-status-text");
    if (isOpenAt(now)) {
      const c = hours[1];
      const left = Math.round((c - t) * 60);
      const h = Math.floor(left / 60), m = left % 60;
      el.className = "qo-status open";
      txt.textContent = `Open · ready in ~10 min · closes in ${h ? h + "h " : ""}${m}m`;
    } else {
      const n = nextOpening(now);
      el.className = "qo-status closed";
      const hh = n.getHours();
      txt.textContent = `Closed now · pre-order for ${dayInline(n, now)} ${hh > 12 ? hh - 12 + " pm" : hh + " am"}`;
    }
  }
  status();
  setInterval(status, 60000);
})();
