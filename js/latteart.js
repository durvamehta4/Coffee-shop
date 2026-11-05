// Latte art toy: pointer "pours" foam into a canvas cup; save as PNG or book the real class.
(function () {
  const cv = document.getElementById("art"); if (!cv) return;
  const ctx = cv.getContext("2d");
  const S = 360; cv.width = cv.height = S * (devicePixelRatio > 1 ? 2 : 1); ctx.scale(cv.width / S, cv.height / S);
  const C = S / 2, R = 150;
  function base() {
    ctx.clearRect(0, 0, S, S);
    // saucer + cup rim
    ctx.fillStyle = "#efe6da"; ctx.beginPath(); ctx.arc(C, C, R + 26, 0, 7); ctx.fill();
    ctx.fillStyle = "#fffaf3"; ctx.beginPath(); ctx.arc(C, C, R + 12, 0, 7); ctx.fill();
    // crema
    const g = ctx.createRadialGradient(C - 30, C - 30, 10, C, C, R);
    g.addColorStop(0, "#c78a50"); g.addColorStop(0.6, "#9a5a2c"); g.addColorStop(1, "#5e3317");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(C, C, R, 0, 7); ctx.fill();
    // crema speckle
    for (let i = 0; i < 260; i++) {
      const a = Math.random() * 7, r = Math.random() * R;
      ctx.fillStyle = `rgba(${Math.random() > 0.5 ? "230,170,110" : "70,35,15"},.25)`;
      ctx.beginPath(); ctx.arc(C + Math.cos(a) * r, C + Math.sin(a) * r, Math.random() * 2.2, 0, 7); ctx.fill();
    }
  }
  base();
  let last = null, poured = 0;
  const inside = (x, y) => (x - C) ** 2 + (y - C) ** 2 < (R - 4) ** 2;
  function foam(x, y, r) {
    ctx.save(); ctx.beginPath(); ctx.arc(C, C, R - 2, 0, 7); ctx.clip();
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, "rgba(255,250,240,.95)"); g.addColorStop(0.7, "rgba(250,240,225,.85)"); g.addColorStop(1, "rgba(240,220,195,0)");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.restore();
  }
  function pos(e) { const r = cv.getBoundingClientRect(); return [((e.clientX - r.left) / r.width) * S, ((e.clientY - r.top) / r.height) * S]; }
  cv.addEventListener("pointerdown", (e) => { cv.setPointerCapture(e.pointerId); last = { p: pos(e), t: performance.now() }; });
  cv.addEventListener("pointermove", (e) => {
    if (!last) return;
    const [x, y] = pos(e), [lx, ly] = last.p, now = performance.now();
    const d = Math.hypot(x - lx, y - ly), v = d / Math.max(1, now - last.t);
    const r = Math.max(3, 22 - v * 14); // faster = thinner, like a real pour
    const steps = Math.ceil(d / 3);
    for (let i = 0; i <= steps; i++) { const px = lx + ((x - lx) * i) / steps, py = ly + ((y - ly) * i) / steps; if (inside(px, py)) foam(px, py, r); }
    poured += d; last = { p: [x, y], t: now };
    if (poured > 400) document.getElementById("art-actions").classList.add("ready");
  });
  const end = () => (last = null);
  cv.addEventListener("pointerup", end); cv.addEventListener("pointercancel", end);
  // Holding still keeps pouring: blob grows.
  setInterval(() => { if (last && inside(...last.p)) foam(last.p[0], last.p[1], 26); }, 60);

  document.getElementById("art-reset").onclick = () => { base(); poured = 0; document.getElementById("art-actions").classList.remove("ready"); };
  document.getElementById("art-save").onclick = () => {
    const a = document.createElement("a"); a.download = "my-latte-art.png"; a.href = cv.toDataURL("image/png"); a.click();
    window.track && track("share", { content_type: "latte_art" });
  };
})();
