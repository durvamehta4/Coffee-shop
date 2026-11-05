// Freshness: today's rotating pour-over origin + live roast-date badges on bean bags.
(function () {
  const ORIGINS = [
    ["Ethiopia Sidamo", "jasmine, bergamot, ripe peach", "🇪🇹"], ["Kenya Nyeri", "blackcurrant, grapefruit, cane sugar", "🇰🇪"],
    ["Guatemala Huehuetenango", "milk chocolate, red apple, almond", "🇬🇹"], ["Colombia Huila", "panela, cherry, cocoa nib", "🇨🇴"],
    ["Peru Cajamarca", "brown sugar, plum, cocoa", "🇵🇪"], ["Rwanda Nyamasheke", "hibiscus, orange, honey", "🇷🇼"], ["Brazil Cerrado", "hazelnut, caramel, milk chocolate", "🇧🇷"],
  ];
  const day = Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 864e5);
  const [name, notes, flag] = ORIGINS[day % ORIGINS.length];
  const host = document.querySelector("#menu .menu-tools");
  host.insertAdjacentHTML("beforebegin", `
    <div class="today-pour">
      <span class="tp-flag" aria-hidden="true">${flag}</span>
      <div><small>Today on pour over</small><strong>${name}</strong><span>${notes}</span></div>
      <button class="btn btn-small" id="tp-try">Try it · ${fmt(MENU_INDEX.pourover.price)}</button>
    </div>`);
  document.getElementById("tp-try").onclick = () => openBuilder("pourover");

  // Roast dates: we roast every Tuesday; beans are sold within 7 days of roast.
  const now = new Date(), last = new Date(now);
  last.setDate(now.getDate() - ((now.getDay() - 2 + 7) % 7)); last.setHours(6, 0, 0, 0);
  if (last > now) last.setDate(last.getDate() - 7);
  const ago = Math.floor((now - last) / 864e5);
  const label = `Roasted ${last.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })} · ${ago === 0 ? "today" : ago === 1 ? "yesterday" : ago + " days ago"}`;
  document.querySelectorAll(".bean .bean-origin").forEach((o) => o.insertAdjacentHTML("afterend", `<span class="roast-date">🔥 ${label}</span>`));
})();
