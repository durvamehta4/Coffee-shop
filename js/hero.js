// Hero quick-order card: live open status + ready-time estimate + one-tap popular drinks.
(function () {
  const POPULAR = ["latte", "flatwhite", "coldbrew"];
  const ICON = { latte: "🥛", flatwhite: "☕", coldbrew: "🧊" };
  const list = document.getElementById("qo-list");
  list.innerHTML = POPULAR.map((id) => {
    const i = MENU_INDEX[id];
    return `<li class="qo-item">
      <span class="qo-icon" aria-hidden="true">${ICON[id] || "☕"}</span>
      <span class="qo-name"><strong>${i.name}</strong><small>${i.desc}</small></span>
      <span class="qo-price">${fmt(i.price)}</span>
      <button class="qo-add" data-add="${id}" aria-label="Customize and add ${i.name}">+</button>
    </li>`;
  }).join("");

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
