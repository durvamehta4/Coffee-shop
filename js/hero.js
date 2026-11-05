// Hero quick-order card: live open status + ready-time estimate + one-tap popular drinks.
(function () {
  // Dayparts drive the hero copy, featured items and photo grade.
  const DAYPARTS = [
    { until: 11, key: "morning", eyebrow: "Good morning · roasted in house", h1: "Good coffee,<br />slow mornings.",
      lead: "Freshly roasted beans, handmade pastries, and a warm corner to settle into. Order ahead and it'll be waiting for you.",
      title: "Morning favorites", picks: ["latte", "flatwhite", "croissant"] },
    { until: 17, key: "afternoon", eyebrow: "Afternoon · iced & energizing", h1: "Beat the<br />3 pm slump.",
      lead: "Smooth cold brew, iced lattes and matcha to carry you through the afternoon. Ready when you are.",
      title: "Afternoon pick-me-ups", picks: ["coldbrew", "latte", "matcha"], iced: true },
    { until: 24, key: "evening", eyebrow: "Evening · cozy & calm", h1: "Wind down<br />gently.",
      lead: "Spiced chai, rich hot chocolate and decaf pour-overs for slow evenings and good conversations.",
      title: "Evening comforts", picks: ["chai", "cocoa", "tea"] },
  ];
  const ICON = { latte: "🥛", flatwhite: "☕", coldbrew: "🧊", croissant: "🥐", matcha: "🍵", chai: "🫖", cocoa: "🍫", tea: "🌿" };
  const part = DAYPARTS.find((d) => new Date().getHours() < d.until);
  document.body.dataset.daypart = part.key;
  const hero = document.querySelector(".hero-content");
  hero.querySelector(".eyebrow").textContent = part.eyebrow;
  hero.querySelector("h1").innerHTML = part.h1;
  hero.querySelector(".lead").textContent = part.lead;
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
    const [o, c] = SHOP_HOURS[now.getDay()];
    const t = now.getHours() + now.getMinutes() / 60;
    const txt = el.querySelector(".qo-status-text");
    if (t >= o && t < c) {
      const left = Math.round((c - t) * 60);
      const h = Math.floor(left / 60), m = left % 60;
      el.className = "qo-status open";
      txt.textContent = `Open · ready in ~10 min · closes in ${h ? h + "h " : ""}${m}m`;
    } else {
      const next = SHOP_HOURS[(now.getDay() + (t >= c ? 1 : 0)) % 7][0];
      el.className = "qo-status closed";
      txt.textContent = `Closed now · pre-order for ${t >= c ? "tomorrow" : "today"} ${next > 12 ? next - 12 + " pm" : next + " am"}`;
    }
  }
  status();
  setInterval(status, 60000);
})();
