// Order delivery: POST to SHOP_CONFIG.ORDER_ENDPOINT with a persistent outbox and automatic retry.
(function () {
  const K = "eb-outbox";
  const cfg = window.SHOP_CONFIG || {};
  const load = () => { try { return JSON.parse(localStorage.getItem(K)) || []; } catch { return []; } };
  const save = (q) => { try { localStorage.setItem(K, JSON.stringify(q)); } catch {} };
  const statusEl = () => document.getElementById("confirm-send");

  function setStatus(kind, html) {
    const el = statusEl(); if (!el) return;
    el.className = "send-status " + kind; el.innerHTML = html;
  }
  async function send(order) {
    const res = await fetch(cfg.ORDER_ENDPOINT, {
      method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ source: "website", ...order }), keepalive: true,
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
  }
  async function flush() {
    if (!cfg.ORDER_ENDPOINT || !navigator.onLine) return;
    const q = load(); if (!q.length) return;
    const left = [];
    for (const o of q) { try { await send(o); window.track && track("order_sent", { transaction_id: o.no, retried: true }); } catch { left.push(o); } }
    save(left);
    if (!left.length && document.querySelector(".send-status.queued")) setStatus("sent", "✓ Sent to the shop. You're all set.");
  }

  document.addEventListener("order:placed", async (e) => {
    const o = e.detail;
    if (!cfg.ORDER_ENDPOINT) {
      setStatus("demo", `<b>Demo mode:</b> this order wasn't sent to the shop. <span>Set <code>ORDER_ENDPOINT</code> in <code>js/config.js</code> to go live.</span>`);
      return;
    }
    setStatus("sending", "Sending to the shop…");
    try { await send(o); setStatus("sent", "✓ Sent to the shop. You're all set."); window.track && track("order_sent", { transaction_id: o.no }); }
    catch {
      save([...load(), o]);
      const mail = `mailto:${cfg.ORDER_EMAIL_FALLBACK}?subject=${encodeURIComponent("Order " + o.no)}&body=${encodeURIComponent(o.lines.map((l) => `${l.qty}× ${l.name} ${Object.values(l.opts || {}).filter(Boolean).join(", ")}`).join("\n") + `\n\nPickup: ${o.time}\nName: ${o.name}`)}`;
      setStatus("queued", `⏳ We'll send this as soon as you're back online. <a href="${mail}">Or email it now</a>`);
    }
  });
  addEventListener("online", flush);
  setInterval(flush, 30000);
  flush();
})();
