// Seasonal LTO: feature cards, "ends in N days" urgency, gentle canvas snowfall.
(function () {
  const END = new Date(new Date().getFullYear() + (new Date().getMonth() === 0 ? 0 : 1), 0, 6); // Jan 6
  const days = Math.max(1, Math.ceil((END - new Date()) / 86400000));
  document.getElementById("winter-left").textContent = `ends in ${days} days`;
  const items = MENU.find((c) => c.cat === "winter").items;
  const render = () => {
    document.getElementById("winter-grid").innerHTML = items.map((i) => `
      <article class="winter-card">
        <div class="winter-cup">${(window.cupThumb && cupThumb(i.id, {}, "-w")) || ""}</div>
        <h3>${i.name}</h3>
        <p>${i.desc}</p>
        <div class="winter-buy"><span>${fmt(i.price)}</span><button class="btn btn-small" data-add="${i.id}">Add</button></div>
      </article>`).join("");
  };
  render(); document.addEventListener("builder:ready", render);

  // Snow
  const cv = document.getElementById("snow");
  if ((matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.classList.contains("calm")) || !cv.getContext) return;
  const ctx = cv.getContext("2d");
  let flakes = [], w, h, running = false;
  function size() {
    const r = cv.parentElement.getBoundingClientRect(), d = devicePixelRatio || 1;
    w = r.width; h = r.height; cv.width = w * d; cv.height = h * d; ctx.setTransform(d, 0, 0, d, 0, 0);
    flakes = Array.from({ length: Math.round(w / 12) }, () => ({ x: Math.random() * w, y: Math.random() * h, r: 1 + Math.random() * 2.5, s: 0.3 + Math.random() * 0.8, p: Math.random() * 6 }));
  }
  function tick(t) {
    if (!running) return;
    ctx.clearRect(0, 0, w, h); ctx.fillStyle = "rgba(255,255,255,.8)";
    flakes.forEach((f) => {
      f.y += f.s; f.x += Math.sin(t / 1500 + f.p) * 0.35;
      if (f.y > h) { f.y = -5; f.x = Math.random() * w; }
      ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, 7); ctx.fill();
    });
    requestAnimationFrame(tick);
  }
  new IntersectionObserver(([e]) => { running = e.isIntersecting; if (running) requestAnimationFrame(tick); }).observe(cv);
  addEventListener("resize", size); size();
})();
