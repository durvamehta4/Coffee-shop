// Command palette: ⌘K / Ctrl+K / "/" — fuzzy search menu items and site actions.
(function () {
  const root = document.createElement("div");
  root.className = "palette-wrap"; root.hidden = true;
  root.innerHTML = `
    <div class="palette" role="dialog" aria-modal="true" aria-label="Quick order">
      <div class="pal-input"><span aria-hidden="true">🔍</span><input id="pal-q" placeholder="Type a drink, food or action…" autocomplete="off" role="combobox" aria-expanded="true" aria-controls="pal-list" /><kbd>esc</kbd></div>
      <ul class="pal-list" id="pal-list" role="listbox"></ul>
      <p class="pal-foot"><kbd>↑</kbd><kbd>↓</kbd> to move · <kbd>↵</kbd> to add · works anywhere with <kbd>/</kbd></p>
    </div>`;
  document.body.appendChild(root);
  const q = root.querySelector("#pal-q"), list = root.querySelector("#pal-list");
  let sel = 0, results = [], prevFocus;

  const ACTIONS = [
    { label: "View my order", icon: "🛍", run: () => openCart() },
    { label: "Reorder my usual", icon: "↻", run: () => window.reorderLast && reorderLast(), when: () => { try { return !!localStorage.getItem("eb-last-order"); } catch { return false; } } },
    { label: "Toggle dark mode", icon: "🌙", run: () => document.getElementById("theme-toggle").click() },
    { label: "Find us · map & hours", icon: "📍", run: () => document.getElementById("visit").scrollIntoView({ behavior: "smooth" }) },
    { label: "Take the coffee quiz", icon: "✨", run: () => document.getElementById("find").scrollIntoView({ behavior: "smooth" }) },
    { label: "Send a gift card", icon: "🎁", run: () => document.getElementById("gifts").scrollIntoView({ behavior: "smooth" }) },
    { label: "Plan catering", icon: "📦", run: () => document.getElementById("contact").scrollIntoView({ behavior: "smooth" }) },
  ];
  // Subsequence fuzzy score: consecutive and word-start matches score higher.
  function score(text, term) {
    if (!term) return 1;
    text = text.toLowerCase(); let ti = 0, s = 0, run = 0;
    for (const ch of term) {
      const i = text.indexOf(ch, ti); if (i < 0) return 0;
      run = i === ti ? run + 1 : 0; s += 1 + run * 2 + (i === 0 || text[i - 1] === " " ? 3 : 0); ti = i + 1;
    }
    return s - text.length * 0.01;
  }
  function render() {
    const term = q.value.trim().toLowerCase();
    const items = MENU.flatMap((c) => c.items).filter((i) => !i.hidden).map((i) => ({
      label: i.name, sub: `${fmt(i.price)} · ${i.desc}`, icon: i.food ? (i.retail ? "🫘" : "🥐") : "☕",
      s: Math.max(score(i.name, term), score(i.desc, term) * 0.4), run: () => {
        if (!i.food && window.openBuilder) openBuilder(i.id);
        else Cart.add(i.id);
      } }));
    const acts = ACTIONS.filter((a) => !a.when || a.when()).map((a) => ({ ...a, sub: "Action", s: score(a.label, term) }));
    results = [...items, ...acts].filter((r) => r.s > 0).sort((a, b) => b.s - a.s).slice(0, 8);
    sel = Math.min(sel, Math.max(0, results.length - 1));
    list.innerHTML = results.length ? results.map((r, i) => `
      <li role="option" id="pal-${i}" aria-selected="${i === sel}" data-i="${i}">
        <span class="pal-icon" aria-hidden="true">${r.icon}</span>
        <span class="pal-txt"><strong>${r.label}</strong><small>${r.sub}</small></span>
        <span class="pal-go" aria-hidden="true">↵</span>
      </li>`).join("") : `<li class="pal-empty">No matches. Try "latte", "vegan" or "gift".</li>`;
    q.setAttribute("aria-activedescendant", results.length ? "pal-" + sel : "");
  }
  function open() { prevFocus = document.activeElement; root.hidden = false; q.value = ""; sel = 0; render(); requestAnimationFrame(() => q.focus()); }
  function close() { root.hidden = true; prevFocus && prevFocus.focus && prevFocus.focus({ preventScroll: true }); }
  function run(i) { const r = results[i]; if (!r) return; close(); setTimeout(r.run, 30); }
  window.openPalette = open;

  q.addEventListener("input", () => { sel = 0; render(); });
  q.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); sel = (sel + 1) % Math.max(1, results.length); render(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); sel = (sel - 1 + results.length) % Math.max(1, results.length); render(); }
    else if (e.key === "Enter") { e.preventDefault(); run(sel); }
    else if (e.key === "Escape") close();
  });
  list.addEventListener("click", (e) => { const li = e.target.closest("[data-i]"); if (li) run(+li.dataset.i); });
  root.addEventListener("click", (e) => { if (e.target === root) close(); });
  document.addEventListener("keydown", (e) => {
    const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) || document.activeElement.isContentEditable;
    if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) { e.preventDefault(); root.hidden ? open() : close(); }
  });
})();
