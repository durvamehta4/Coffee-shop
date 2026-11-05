// Personal hero greeting for known visitors (club name or last order name) with loyalty progress.
(function () {
  const get = (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } };
  const club = get("eb-club"), last = get("eb-last-order");
  const name = (club && club.name) || (last && last.name);
  if (!name) return;
  const h = new Date().getHours();
  const part = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  const es = window.getLang && getLang() === "es";
  const hi = es ? (h < 12 ? "Buenos días" : h < 19 ? "Buenas tardes" : "Buenas noches") : part;
  let extra = "";
  if (club) {
    const left = Math.max(0, 9 - club.stamps);
    extra = left ? ` · ${left} stamp${left > 1 ? "s" : ""} to a free drink` : " · your next drink is free 🎉";
    if (es) extra = left ? ` · te faltan ${left} sellos para una bebida gratis` : " · tu próxima bebida es gratis 🎉";
  }
  const eb = document.querySelector(".hero-content .eyebrow");
  eb.textContent = `${hi}, ${name} ☕${extra}`;
  eb.classList.add("greet");
})();
