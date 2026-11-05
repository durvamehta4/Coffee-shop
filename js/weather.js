// Weather at the shop (Open-Meteo, no key) → a hero chip and iced picks when it's hot. Fails silently.
(function () {
  const SHOP = { lat: 34.05, lon: -118.25, city: "Brewtown" };
  const KEY = "eb-wx";
  const icon = (code) => code === 0 ? "☀️" : code <= 3 ? "⛅" : code <= 48 ? "🌫" : code <= 67 ? "🌧" : code <= 77 ? "❄️" : code <= 82 ? "🌦" : "⛈";
  function line(t, code) {
    if (code >= 51 && code <= 82) return "perfect chai weather";
    if (t >= 26) return "iced coffee weather";
    if (t >= 18) return "patio weather, grab a cold brew";
    if (t <= 8) return "hot chocolate weather";
    return "latte weather";
  }
  function apply({ t, code }) {
    const card = document.querySelector(".quick-order");
    if (!card || card.querySelector(".wx")) return;
    const chip = document.createElement("span");
    chip.className = "wx";
    chip.textContent = `${icon(code)} ${Math.round(t)}°C in ${SHOP.city} · ${line(t, code)}`;
    card.querySelector(".qo-status").after(chip);
    if (t >= 26) {
      card.querySelectorAll(".qo-add").forEach((b) => {
        const item = MENU_INDEX[b.dataset.add];
        if (!item || item.food || b.dataset.iced) return;
        b.dataset.iced = "1";
        const name = b.closest(".qo-item").querySelector(".qo-name strong");
        if (!/^Iced /.test(name.textContent) && b.dataset.add !== "coldbrew") name.textContent = "Iced " + name.textContent;
      });
    }
  }
  // 30-minute cache so we don't refetch on every page view.
  try {
    const c = JSON.parse(sessionStorage.getItem(KEY));
    if (c && Date.now() - c.at < 30 * 60000) return apply(c);
  } catch {}
  const ctl = new AbortController(); setTimeout(() => ctl.abort(), 4000);
  fetch(`https://api.open-meteo.com/v1/forecast?latitude=${SHOP.lat}&longitude=${SHOP.lon}&current=temperature_2m,weather_code`, { signal: ctl.signal })
    .then((r) => r.json())
    .then((d) => {
      const wx = { t: d.current.temperature_2m, code: d.current.weather_code, at: Date.now() };
      try { sessionStorage.setItem(KEY, JSON.stringify(wx)); } catch {}
      apply(wx);
    })
    .catch(() => {});
})();
