// Light / "evening roast" dark theme toggle; defaults to the system preference.
(function () {
  const btn = document.getElementById("theme-toggle");
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const current = () => document.documentElement.dataset.theme || (mq.matches ? "dark" : "light");
  function sync() {
    const dark = current() === "dark";
    btn.textContent = dark ? "☀️" : "🌙";
    btn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
  }
  btn.addEventListener("click", () => {
    const next = current() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("eb-theme", next); } catch {}
    sync();
  });
  mq.addEventListener("change", sync);
  sync();
})();
