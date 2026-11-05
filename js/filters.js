// Menu search + dietary/price filter chips. Active filters show a cross-category results grid.
(function () {
  const q = document.getElementById("menu-q");
  const chips = document.querySelectorAll(".fchip");
  const results = document.getElementById("menu-results");
  const grid = document.getElementById("results-grid");
  const tabsEl = document.querySelector(".menu-tabs");
  const panels = ["coffee", "tea", "food"].map((id) => document.getElementById(id));
  const active = new Set();
  const TESTS = {
    vegan: (i) => i.tags.includes("vegan"),
    under5: (i) => i.price < 5,
    iced: (i) => !i.food && i.id !== "espresso",
    nocaf: (i) => !!i.nocaf,
  };

  function apply() {
    const term = q.value.trim().toLowerCase();
    const on = term || active.size;
    results.hidden = !on;
    tabsEl.hidden = !!on;
    panels.forEach((p) => (p.style.display = on ? "none" : ""));
    if (!on) return;
    const all = MENU.flatMap((c) => c.items).filter((i) => !i.hidden);
    const hits = all.filter((i) =>
      [...active].every((f) => TESTS[f](i)) &&
      (!term || (i.name + " " + i.desc + " " + i.tags.join(" ")).toLowerCase().includes(term)));
    document.getElementById("results-count").textContent = `${hits.length} item${hits.length === 1 ? "" : "s"} match`;
    grid.innerHTML = hits.length
      ? hits.map((i) => menuCard(i, "-r")).join("")
      : `<div class="no-results"><p>☕ Nothing matches that yet.</p><p class="muted">Try fewer filters, or ask the barista. We love a custom order.</p></div>`;
  }

  chips.forEach((c) => c.addEventListener("click", () => {
    const f = c.dataset.f;
    active.has(f) ? active.delete(f) : active.add(f);
    c.setAttribute("aria-pressed", String(active.has(f)));
    apply();
  }));
  q.addEventListener("input", apply);
  document.getElementById("clear-filters").addEventListener("click", () => {
    q.value = ""; active.clear(); chips.forEach((c) => c.setAttribute("aria-pressed", "false")); apply();
  });
})();
