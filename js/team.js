// Baristas with signature picks that open the builder pre-configured.
(function () {
  const TEAM = [
    { name: "Maya", role: "Head barista", hue: 22, fact: "Won the 2024 Brewtown latte art throwdown with a swan.", id: "latte", preset: { temp: "Iced", milk: "Oat", sweet: "Vanilla" }, label: "Iced oat vanilla latte" },
    { name: "Dev", role: "Roaster", hue: 200, fact: "Roasts every Tuesday at 6 am and names each batch after a song.", id: "pourover", preset: {}, label: "Pour over, Ethiopia Sidamo" },
    { name: "Rosa", role: "Pastry lead", hue: 330, fact: "Laminates 400 croissants a week. By hand.", id: "cappuccino", preset: { size: "Small" }, label: "Small cappuccino + croissant", combo: true },
    { name: "Theo", role: "Barista", hue: 140, fact: "Has tried every milk alternative. Settled on almond.", id: "flatwhite", preset: { milk: "Almond", shots: 1 }, label: "Almond flat white, extra shot" },
  ];
  const root = document.getElementById("team-grid");
  const avatar = (t) => `
    <svg viewBox="0 0 120 120" class="avatar-art" aria-hidden="true">
      <circle cx="60" cy="60" r="60" fill="hsl(${t.hue} 45% 82%)"/>
      <circle cx="60" cy="50" r="22" fill="hsl(${t.hue} 30% 35%)"/>
      <path d="M22 116c4-26 20-38 38-38s34 12 38 38" fill="hsl(${t.hue} 30% 35%)"/>
      <path d="M38 98h44v22H38z" fill="#c8834a" opacity=".9"/>
      <text x="60" y="56" text-anchor="middle" font-family="Playfair Display, serif" font-size="22" font-weight="700" fill="#fff">${t.name[0]}</text>
    </svg>`;
  root.innerHTML = TEAM.map((t, i) => `
    <article class="barista">
      ${avatar(t)}
      <h3>${t.name}</h3><p class="b-role">${t.role}</p>
      <p class="b-fact">“${t.fact}”</p>
      <div class="b-pick"><small>${t.name}'s pick</small><strong>${t.label}</strong></div>
      <button class="btn btn-small" data-pick="${i}">Order ${t.name}'s pick</button>
    </article>`).join("");
  root.addEventListener("click", (e) => {
    const b = e.target.closest("[data-pick]"); if (!b) return;
    const t = TEAM[+b.dataset.pick];
    openBuilder(t.id, { ...t.preset, combo: !!t.combo });
    window.track && track("select_item", { item_list_name: "barista_picks", items: [{ item_id: t.id }] });
  });
})();
