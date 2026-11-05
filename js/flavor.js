// Flavor wheel: pick a taste → matching bean bags highlight, others dim.
(function () {
  const F = [
    ["Chocolate", "#6b3f22", ["bean-ember", "bean-decaf"]], ["Nutty", "#a8743f", ["bean-ember"]], ["Caramel", "#c8834a", ["bean-ember", "bean-decaf"]],
    ["Fruity", "#d4654f", ["bean-sidamo", "bean-decaf"]], ["Floral", "#b981c4", ["bean-sidamo"]], ["Citrus", "#e0b13a", ["bean-sidamo"]],
    ["Spice", "#8c4a2f", ["bean-decaf"]], ["Berry", "#9b3b5a", ["bean-sidamo"]],
  ];
  const host = document.getElementById("flavor");
  const R = 120, r0 = 46, cx = 130, cy = 130, n = F.length;
  const pt = (rad, a) => [cx + rad * Math.cos(a), cy + rad * Math.sin(a)];
  const seg = (i) => {
    const a0 = (i / n) * 2 * Math.PI - Math.PI / 2, a1 = ((i + 1) / n) * 2 * Math.PI - Math.PI / 2;
    const [x0, y0] = pt(R, a0), [x1, y1] = pt(R, a1), [x2, y2] = pt(r0, a1), [x3, y3] = pt(r0, a0);
    const [tx, ty] = pt((R + r0) / 2, (a0 + a1) / 2);
    return { d: `M${x0} ${y0} A${R} ${R} 0 0 1 ${x1} ${y1} L${x2} ${y2} A${r0} ${r0} 0 0 0 ${x3} ${y3} Z`, tx, ty, deg: ((a0 + a1) / 2) * 180 / Math.PI };
  };
  host.innerHTML = `
    <svg viewBox="0 0 260 260" class="wheel" role="group" aria-label="Flavor wheel">
      ${F.map(([name, col], i) => { const s = seg(i); const flip = s.deg > 90 && s.deg < 270; return `
        <g class="slice" tabindex="0" role="button" aria-pressed="false" data-flavor="${i}" aria-label="${name}">
          <path d="${s.d}" fill="${col}"/>
          <text x="${s.tx}" y="${s.ty}" transform="rotate(${flip ? s.deg + 180 : s.deg} ${s.tx} ${s.ty})" text-anchor="middle" dominant-baseline="middle">${name}</text>
        </g>`; }).join("")}
      <circle cx="${cx}" cy="${cy}" r="${r0 - 4}" class="wheel-hub"/>
      <text x="${cx}" y="${cy - 6}" text-anchor="middle" class="hub-t">What do</text><text x="${cx}" y="${cy + 10}" text-anchor="middle" class="hub-t">you taste?</text>
    </svg>
    <div class="flavor-out" aria-live="polite"><p class="muted">Tap a flavor you love and we'll point you to the right bag.</p></div>`;
  const grid = document.getElementById("bean-grid");
  let sel = null;
  function pick(i) {
    sel = sel === i ? null : i;
    host.querySelectorAll(".slice").forEach((g, k) => { g.classList.toggle("on", k === sel); g.setAttribute("aria-pressed", k === sel); });
    host.classList.toggle("picking", sel !== null);
    const out = host.querySelector(".flavor-out");
    grid.querySelectorAll(".bean").forEach((b) => b.classList.toggle("dim", sel !== null && !F[sel][2].includes(b.dataset.bean)));
    if (sel === null) { out.innerHTML = `<p class="muted">Tap a flavor you love and we'll point you to the right bag.</p>`; return; }
    const [name, col, ids] = F[sel];
    out.innerHTML = `<p class="fo-label" style="--c:${col}">${name}</p><p>You'd love <strong>${ids.map((id) => MENU_INDEX[id].name).join("</strong> or <strong>")}</strong>.</p><button class="btn btn-small" data-go="${ids[0]}">See it →</button>`;
  }
  host.addEventListener("click", (e) => {
    const g = e.target.closest(".slice"); if (g) pick(+g.dataset.flavor);
    const go = e.target.closest("[data-go]"); if (go) document.querySelector(`[data-bean="${go.dataset.go}"]`).scrollIntoView({ behavior: "smooth", block: "center" });
  });
  host.addEventListener("keydown", (e) => { const g = e.target.closest(".slice"); if (g && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); pick(+g.dataset.flavor); } });
})();
