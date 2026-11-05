// Add-to-cart feedback: a dot that arcs into the cart + a toast with a smart one-tap add-on.
(function () {
  let lastPoint = null;
  document.addEventListener("pointerdown", (e) => (lastPoint = { x: e.clientX, y: e.clientY }), true);

  const toast = document.createElement("div");
  toast.className = "toast"; toast.setAttribute("role", "status"); toast.hidden = true;
  document.body.appendChild(toast);
  let hideT;

  function target() {
    const cands = [document.querySelector(".order-bar.show .ob-count"), document.querySelector(".cart-btn"), document.querySelector(".cart-icon-mobile")];
    return cands.find((el) => el && el.offsetParent !== null && el.getBoundingClientRect().width);
  }
  function fly(from) {
    const t = target(); if (!t || !from || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = t.getBoundingClientRect();
    const dot = document.createElement("span"); dot.className = "fly-dot"; document.body.appendChild(dot);
    const dx = r.left + r.width / 2 - from.x, dy = r.top + r.height / 2 - from.y;
    dot.style.left = from.x + "px"; dot.style.top = from.y + "px";
    dot.animate([
      { transform: "translate(-50%,-50%) scale(1)" },
      { transform: `translate(calc(-50% + ${dx * 0.5}px), calc(-50% + ${dy * 0.5 - 120}px)) scale(1.2)`, offset: 0.5 },
      { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.4)`, opacity: 0.6 },
    ], { duration: 650, easing: "cubic-bezier(.5,0,.5,1)" }).onfinish = () => { dot.remove(); t.animate([{ transform: "scale(1.3)" }, { transform: "scale(1)" }], { duration: 250 }); };
  }

  function show(line) {
    const opt = Object.values(line.opts || {}).filter(Boolean).slice(0, 2).join(", ");
    const isDrink = !MENU_INDEX[line.id].food;
    const hasPastry = Cart.lines.some((l) => ["croissant", "muffin"].includes(l.id));
    toast.innerHTML = `
      <span class="toast-check" aria-hidden="true">✓</span>
      <span class="toast-text"><strong>${line.opts && line.opts.temp === "Iced" && line.id !== "coldbrew" ? "Iced " : ""}${line.name}</strong> added${opt ? ` <small>(${opt})</small>` : ""}</span>
      ${isDrink && !hasPastry ? `<button class="toast-up" data-add="croissant">+ 🥐 Croissant <em>$1 off</em></button>` : ""}
      <button class="toast-view" data-open-cart>View order</button>`;
    toast.hidden = false; toast.classList.remove("in"); void toast.offsetWidth; toast.classList.add("in");
    clearTimeout(hideT); hideT = setTimeout(() => toast.classList.remove("in"), 4200);
  }
  toast.addEventListener("click", (e) => { if (e.target.closest("[data-open-cart],[data-add]")) setTimeout(() => toast.classList.remove("in"), 50); });

  document.addEventListener("cart:changed", (e) => {
    const id = e.detail && e.detail.added; if (!id || id === "reorder") return;
    if (document.getElementById("cart-drawer").classList.contains("open")) return;
    const line = [...Cart.lines].reverse().find((l) => l.id === id);
    fly(lastPoint); if (line) show(line);
  });
})();
