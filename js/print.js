// Print-only menu generated from live data, with a scan-to-order QR.
(function () {
  const sheet = document.createElement("section");
  sheet.className = "print-menu"; sheet.setAttribute("aria-hidden", "true");
  document.body.appendChild(sheet);
  const NAMES = { winter: "Winter specials", coffee: "Coffee", tea: "Tea & more", food: "Food", beans: "Beans to take home" };
  function build() {
    const url = location.href.split("#")[0].split("?")[0] + "#menu";
    sheet.innerHTML = `
      <header><h1>Ember <span>&amp;</span> Bean</h1><p>Small-batch coffee · 123 Roast Street, Brewtown · (555) 555-0123</p></header>
      <div class="pm-cols">${MENU.filter((c) => NAMES[c.cat]).map((c) => `
        <div class="pm-cat"><h2>${NAMES[c.cat]}</h2>${c.items.filter((i) => !i.hidden).map((i) => `
          <div class="pm-item"><div><strong>${i.name}</strong>${i.tags.includes("vegan") ? " <em>🌱</em>" : ""}<small>${i.desc}</small></div><span>${fmt(i.price)}</span></div>`).join("")}
        </div>`).join("")}
      </div>
      <footer>
        <div class="pm-qr"></div>
        <div><strong>Skip the line, order ahead</strong><p>Scan to order. Pay when you pick up.</p>
        <p>Mon–Fri 7am–6pm · Sat 8am–5pm · Sun 8am–3pm</p><p>Milk alternatives: oat or almond +$0.60 · Extra shot +$0.90</p></div>
      </footer>`;
    const qrHost = sheet.querySelector(".pm-qr");
    const make = () => { try { const q = qrcode(0, "M"); q.addData(url); q.make(); qrHost.innerHTML = q.createSvgTag({ cellSize: 3, margin: 0, scalable: true }); } catch {} };
    if (window.qrcode) make();
    else { const s = document.createElement("script"); s.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js"; s.onload = make; document.head.appendChild(s); }
  }
  addEventListener("beforeprint", build);
  window.printMenu = () => { build(); setTimeout(() => print(), 400); };
})();
