// Share the cart as a link (#order=…); recipients can merge it, add theirs and pass it on.
(function () {
  const enc = (o) => btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/=+$/, "");
  const dec = (s) => JSON.parse(decodeURIComponent(escape(atob(s))));

  document.addEventListener("cart:render", () => {
    let btn = document.getElementById("share-order");
    if (!btn) {
      btn = document.createElement("button");
      btn.id = "share-order"; btn.type = "button"; btn.className = "link-btn share-order";
      btn.innerHTML = "👥 Ordering for a group? <u>Share this order</u>";
      document.getElementById("to-checkout").after(btn);
      btn.addEventListener("click", share);
    }
    btn.hidden = !Cart.lines.length;
  });

  async function share() {
    let name = ""; try { name = (JSON.parse(localStorage.getItem("eb-club")) || {}).name || ""; } catch {}
    const payload = { by: name, l: Cart.lines.map((l) => [l.id, l.qty, l.price, l.opts]) };
    const url = location.href.split("#")[0] + "#order=" + enc(payload);
    const text = `${name || "I"} started an Ember & Bean order. Add yours and pass it on ☕`;
    const btn = document.getElementById("share-order");
    try {
      if (navigator.share) { await navigator.share({ title: "Group coffee order", text, url }); return; }
      await navigator.clipboard.writeText(url);
      btn.innerHTML = "✓ Link copied. Send it to your group!";
    } catch {
      prompt("Copy this link:", url);
    }
    setTimeout(() => (btn.innerHTML = "👥 Ordering for a group? <u>Share this order</u>"), 3000);
  }

  function incoming() {
    const m = location.hash.match(/^#order=([\w+/-]+)/);
    if (!m) return;
    let data; try { data = dec(m[1]); } catch { return; }
    const lines = (data.l || []).filter(([id]) => MENU_INDEX[id]);
    if (!lines.length) return;
    const n = lines.reduce((s, [, q]) => s + q, 0);
    const bar = document.createElement("div");
    bar.className = "shared-banner"; bar.setAttribute("role", "dialog"); bar.setAttribute("aria-label", "Shared order");
    bar.innerHTML = `
      <span class="sb-icon" aria-hidden="true">👥</span>
      <div><strong>${data.by ? data.by + " shared" : "Someone shared"} an order (${n} item${n > 1 ? "s" : ""})</strong>
      <small>${lines.map(([id, q]) => `${q > 1 ? q + "× " : ""}${MENU_INDEX[id].name}`).join(", ")}</small></div>
      <button class="btn btn-small" id="sb-add">Add to my order</button>
      <button class="link-btn" id="sb-x" aria-label="Dismiss">✕</button>`;
    document.body.appendChild(bar);
    const close = () => { bar.remove(); history.replaceState(null, "", location.pathname + location.search); };
    bar.querySelector("#sb-x").onclick = close;
    bar.querySelector("#sb-add").onclick = () => {
      lines.forEach(([id, qty, price, opts]) => {
        const key = id + "|" + JSON.stringify(opts || {});
        const ex = Cart.lines.find((l) => l.key === key);
        ex ? (ex.qty += qty) : Cart.lines.push({ key, id, name: MENU_INDEX[id].name, price, qty, opts: opts || {} });
      });
      Cart.changed({ added: "reorder" });
      close();
      document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
    };
  }
  incoming();
})();
