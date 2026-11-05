// Display preferences: text size, high contrast, calm mode (no motion), underlined links. Persisted.
(function () {
  const K = "eb-prefs";
  const get = () => { try { return JSON.parse(localStorage.getItem(K)) || {}; } catch { return {}; } };
  const apply = (p) => {
    const h = document.documentElement;
    h.dataset.size = p.size || "1";
    h.classList.toggle("hc", !!p.contrast); h.classList.toggle("calm", !!p.calm); h.classList.toggle("ulinks", !!p.links);
  };
  apply(get());
  const panel = document.createElement("div");
  panel.className = "prefs"; panel.hidden = true; panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", "Display preferences");
  document.body.appendChild(panel);
  function render() {
    const p = get();
    panel.innerHTML = `
      <div class="prefs-head"><strong>Display</strong><button class="link-btn" data-close aria-label="Close">✕</button></div>
      <div class="prefs-row"><span>Text size</span><div class="seg">${["1", "2", "3"].map((s, i) => `<button data-size="${s}" aria-pressed="${(p.size || "1") === s}" style="font-size:${0.85 + i * 0.15}rem">A</button>`).join("")}</div></div>
      ${[["contrast", "High contrast"], ["calm", "Calm mode (no animation)"], ["links", "Underline links"]].map(([k, l]) => `
        <label class="prefs-row"><span>${l}</span><input type="checkbox" class="switch" data-k="${k}" ${p[k] ? "checked" : ""}/></label>`).join("")}
      <button class="link-btn prefs-reset" data-reset>Reset to default</button>`;
  }
  const save = (p) => { try { localStorage.setItem(K, JSON.stringify(p)); } catch {} apply(p); };
  panel.addEventListener("click", (e) => {
    const s = e.target.closest("button[data-size]"); if (s) { save({ ...get(), size: s.dataset.size }); render(); }
    if (e.target.closest("[data-close]")) panel.hidden = true;
    if (e.target.closest("[data-reset]")) { save({}); render(); }
  });
  panel.addEventListener("change", (e) => { const k = e.target.dataset.k; if (k) save({ ...get(), [k]: e.target.checked }); });
  window.openPrefs = () => { render(); panel.hidden = false; panel.querySelector("button").focus(); };
  document.addEventListener("keydown", (e) => e.key === "Escape" && !panel.hidden && (panel.hidden = true));
})();
