// Single-key shortcuts (ignored while typing) + "?" help overlay.
(function () {
  const KEYS = [
    ["O", "Open your order", () => openCart()],
    ["M", "Jump to the menu", () => document.getElementById("menu").scrollIntoView({ behavior: "smooth" })],
    ["S", "Surprise me with a drink", () => window.surpriseMe && surpriseMe()],
    ["T", "Toggle dark mode", () => document.getElementById("theme-toggle").click()],
    ["L", "English / Español", () => document.querySelector(".lang-btn")?.click()],
    ["/", "Search & quick order (also ⌘K)", () => openPalette()],
    ["?", "Show this help", () => toggle()],
  ];
  const help = document.createElement("div");
  help.className = "keys-wrap"; help.hidden = true;
  help.innerHTML = `<div class="keys" role="dialog" aria-modal="true" aria-label="Keyboard shortcuts"><div class="keys-head"><strong>Keyboard shortcuts</strong><button class="link-btn" data-keys-close aria-label="Close">✕</button></div>
    <ul>${KEYS.map(([k, d]) => `<li><kbd>${k}</kbd><span>${d}</span></li>`).join("")}<li><kbd>Esc</kbd><span>Close any panel</span></li></ul></div>`;
  document.body.appendChild(help);
  function toggle(on = help.hidden) { help.hidden = !on; if (on) help.querySelector("[data-keys-close]").focus(); }
  help.addEventListener("click", (e) => { if (e.target === help || e.target.closest("[data-keys-close]")) toggle(false); });
  document.addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const a = document.activeElement;
    if (/INPUT|TEXTAREA|SELECT/.test(a.tagName) || a.isContentEditable) return;
    if (e.key === "Escape" && !help.hidden) return toggle(false);
    if (document.body.classList.contains("no-scroll") && e.key !== "?") return; // a dialog is open
    if (e.key === "/") return; // handled by the palette
    const hit = KEYS.find(([k]) => k.toLowerCase() === e.key.toLowerCase());
    if (hit) { e.preventDefault(); hit[2](); window.track && track("shortcut", { key: hit[0] }); }
  });
  window.showShortcuts = () => toggle(true);
})();
