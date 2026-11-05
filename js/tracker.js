// Live order tracker: Received → Brewing → Ready, driven by the pickup time. Persists across reloads.
(function () {
  const KEY = "eb-active-order";
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; } };
  const save = (o) => { try { o ? localStorage.setItem(KEY, JSON.stringify(o)) : localStorage.removeItem(KEY); } catch {} };
  const el = document.createElement("aside");
  el.className = "tracker"; el.setAttribute("aria-live", "polite"); el.hidden = true;
  document.body.appendChild(el);
  let timer;

  function stage(o, now = Date.now()) {
    const at = new Date(o.at).getTime(), placed = new Date(o.placedAt).getTime();
    const brewAt = Math.max(placed + 60000, at - 5 * 60000);
    if (now >= at) return { i: 2, label: "Ready for pickup!", sub: "Grab it at the counter. Say your name." };
    if (now >= brewAt) return { i: 1, label: "Brewing now", sub: `Ready at ${o.time}` };
    return { i: 0, label: "Order received", sub: `We'll start brewing a few minutes before ${o.time}` };
  }

  function render() {
    const o = load();
    if (!o || Date.now() > new Date(o.at).getTime() + 30 * 60000) { el.hidden = true; save(null); clearInterval(timer); return; }
    const st = stage(o);
    const total = new Date(o.at) - new Date(o.placedAt), left = Math.max(0, new Date(o.at) - Date.now());
    const pct = total > 0 ? 1 - left / total : 1;
    const mins = Math.ceil(left / 60000);
    const C = 2 * Math.PI * 22;
    el.hidden = false;
    el.className = `tracker stage-${st.i}`;
    el.innerHTML = `
      <button class="tracker-x" aria-label="Hide order tracker">✕</button>
      <div class="tracker-ring">
        <svg viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="22" class="ring-bg"/><circle cx="26" cy="26" r="22" class="ring-fg" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - pct)}"/></svg>
        <span>${st.i === 2 ? "✓" : mins > 90 ? Math.round(mins / 60) + "<small>hrs</small>" : mins + "<small>min</small>"}</span>
      </div>
      <div class="tracker-info">
        <small>${o.no} · ${o.name}</small>
        <strong>${st.label}</strong>
        <span>${st.sub}</span>
        <ol class="tracker-steps">${["Received", "Brewing", "Ready"].map((s, i) => `<li class="${i <= st.i ? "done" : ""}">${s}</li>`).join("")}</ol>
      </div>`;
    el.querySelector(".tracker-x").onclick = () => { save(null); el.hidden = true; };
  }

  document.addEventListener("order:placed", (e) => { save(e.detail); render(); clearInterval(timer); timer = setInterval(render, 15000); });
  render();
  if (load()) timer = setInterval(render, 15000);
  window.Tracker = { render };
})();
