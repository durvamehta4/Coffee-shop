// Re-engagement: tab title + favicon badge when leaving with items; ready notification for active orders.
(function () {
  const title = document.title;
  const icon = document.querySelector('link[rel="icon"]');
  const iconHref = icon && icon.href;
  let badged = null;
  function badgeIcon(n) {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas"); c.width = c.height = 64;
      const x = c.getContext("2d"); x.drawImage(img, 0, 0, 64, 64);
      x.fillStyle = "#c8834a"; x.beginPath(); x.arc(46, 18, 17, 0, 7); x.fill();
      x.fillStyle = "#fff"; x.font = "bold 24px Inter, sans-serif"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(n > 9 ? "9+" : n, 46, 19);
      badged = c.toDataURL("image/png"); if (document.hidden) icon.href = badged;
    };
    img.src = iconHref;
  }
  document.addEventListener("visibilitychange", () => {
    const n = window.Cart ? Cart.count() : 0;
    if (document.hidden && n) {
      document.title = `(${n}) ☕ Your order is waiting… | Ember & Bean`;
      badgeIcon(n);
    } else {
      document.title = title;
      if (icon) icon.href = iconHref;
    }
  });

  // Ready notification for the active order (while the page is open).
  let timer;
  function schedule(o) {
    clearTimeout(timer);
    const ms = new Date(o.at) - Date.now();
    if (ms < 0 || ms > 6 * 3600e3) return;
    timer = setTimeout(() => {
      try { new Notification("Your order is ready! ☕", { body: `${o.no} for ${o.name} is waiting at Ember & Bean.`, icon: iconHref, tag: o.no }); } catch {}
    }, ms);
  }
  function addButton() {
    const tr = document.querySelector(".tracker:not([hidden]) .tracker-info");
    if (!tr || tr.querySelector(".notify-btn") || !("Notification" in window)) return;
    if (Notification.permission === "granted") return;
    const b = document.createElement("button");
    b.className = "link-btn notify-btn"; b.textContent = "🔔 Notify me when it's ready";
    b.onclick = async () => {
      const p = await Notification.requestPermission();
      if (p === "granted") { try { schedule(JSON.parse(localStorage.getItem("eb-active-order"))); } catch {} b.textContent = "✓ We'll ping you"; }
      else b.remove();
    };
    tr.appendChild(b);
  }
  new MutationObserver(addButton).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["hidden"] });
  try { const o = JSON.parse(localStorage.getItem("eb-active-order")); if (o && "Notification" in window && Notification.permission === "granted") schedule(o); } catch {}
  document.addEventListener("order:placed", (e) => { if ("Notification" in window && Notification.permission === "granted") schedule(e.detail); });
})();
