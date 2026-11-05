// Order celebration: confetti burst + pickup QR (lazy-loaded generator from cdnjs).
(function () {
  const QR_SRC = "https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js";
  let qrLoading;
  const loadQR = () => qrLoading || (qrLoading = new Promise((res, rej) => {
    if (window.qrcode) return res();
    const s = document.createElement("script"); s.src = QR_SRC; s.onload = res; s.onerror = rej; document.head.appendChild(s);
  }));

  function confetti() {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cv = document.createElement("canvas"); cv.className = "confetti";
    document.body.appendChild(cv);
    const ctx = cv.getContext("2d"), d = devicePixelRatio || 1;
    cv.width = innerWidth * d; cv.height = innerHeight * d; ctx.scale(d, d);
    const drawer = document.getElementById("cart-drawer").getBoundingClientRect();
    const ox = drawer.left + drawer.width / 2, oy = 160;
    const colors = ["#c8834a", "#f7f1e8", "#e0a43a", "#4a3226", "#8db255"];
    const parts = Array.from({ length: 140 }, () => {
      const a = Math.random() * Math.PI * 2, v = 4 + Math.random() * 9;
      return { x: ox, y: oy, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 6, r: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.4,
        w: 6 + Math.random() * 6, h: 4 + Math.random() * 4, c: colors[(Math.random() * colors.length) | 0] };
    });
    const t0 = performance.now();
    (function tick(t) {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      parts.forEach((p) => {
        p.vy += 0.28; p.vx *= 0.985; p.x += p.vx; p.y += p.vy; p.r += p.vr;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore();
      });
      if (t - t0 < 2600) requestAnimationFrame(tick); else cv.remove();
    })(t0);
  }

  document.addEventListener("order:placed", async (e) => {
    const o = e.detail;
    confetti();
    const done = document.querySelector('#cart-drawer [data-step="done"]');
    let box = done.querySelector(".pickup-qr");
    if (!box) { box = document.createElement("div"); box.className = "pickup-qr"; done.querySelector(".confirm-mode").after(box); }
    box.innerHTML = `<div class="qr-img" aria-hidden="true"></div><div><strong>${o.no}</strong><small>Show this at pickup, or just say your name.</small></div>`;
    try {
      await loadQR();
      const qr = qrcode(0, "M"); qr.addData(`EMBERBEAN:${o.no}:${o.name}`); qr.make();
      box.querySelector(".qr-img").innerHTML = qr.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
    } catch { box.querySelector(".qr-img").remove(); }
  });
})();
