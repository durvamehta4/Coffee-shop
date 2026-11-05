// "Ask the barista": keyword-matched answers built from live site data, with actions + FAQ accordion & JSON-LD.
(function () {
  const t = (h) => (h === 12 ? "12 pm" : h > 12 ? h - 12 + " pm" : h + " am");
  const todayHours = () => { const { hours, holiday } = hoursFor(new Date()); return hours ? `today we're open ${t(hours[0])} – ${t(hours[1])}` : `we're closed today${holiday ? " for " + holiday : ""}`; };
  const KB = [
    { q: "What are your hours?", k: ["hour", "open", "close", "time", "when"], a: () => `${todayHours()[0].toUpperCase() + todayHours().slice(1)}. Weekdays 7 am – 6 pm, Saturday 8 am – 5 pm, Sunday 8 am – 3 pm. You can pre-order any time.`, act: [["See this week", "#visit"]] },
    { q: "Are you open on Thanksgiving?", k: ["thanksgiving", "holiday", "christmas", "new year"], a: () => "We close on Thanksgiving and Christmas Day, and have short hours on Christmas Eve (8 am – 2 pm) and New Year's Eve (8 am – 3 pm). Pre-orders skip closed days automatically.", act: [["See holiday hours", "#visit"]] },
    { q: "Do you have dairy-free milk?", k: ["dairy", "oat", "almond", "vegan", "lactose", "plant"], a: () => "Yes! Oat and almond milk for +$0.60 on any drink, plus vegan food like the avocado toast. Tap 🌱 Vegan on the menu to filter.", act: [["Show vegan options", "filter:vegan"]] },
    { q: "Is there Wi-Fi and outlets?", k: ["wifi", "wi-fi", "internet", "outlet", "work", "laptop", "plug"], a: () => "Free fast Wi-Fi and outlets at every table. Laptops are welcome all day; we just ask for a refill every couple of hours 😉", act: [] },
    { q: "Where do I park?", k: ["park", "parking", "car", "curbside", "bike"], a: () => "Free 20-minute spots out front, bike racks by the door, and curbside pickup. Choose 🚗 Curbside at checkout and we'll bring it out.", act: [["Get directions", "https://www.google.com/maps/search/?api=1&query=123+Roast+Street+Brewtown+CA"]] },
    { q: "What's the strongest drink?", k: ["strong", "caffeine", "energy", "strongest", "tired", "wake"], a: () => "Cold brew packs about 200 mg of caffeine. For more, try a Large Americano with an extra shot (about 260 mg). The builder shows live caffeine for every drink.", act: [["Add a cold brew", "add:coldbrew"]] },
    { q: "Something without caffeine?", k: ["decaf", "no caffeine", "caffeine-free", "pregnant", "evening", "kids"], a: () => "Hot chocolate, herbal teas (chamomile or peppermint), or any espresso drink made with our Midnight Decaf. Ask at pickup or add a note.", act: [["Add hot chocolate", "add:cocoa"]] },
    { q: "Do you cater?", k: ["cater", "office", "meeting", "event", "party", "group", "box"], a: () => "We do! Boxes of coffee, pastries and cold brew for 5 to 150 people with 24 hours' notice. Our builder sizes it for you.", act: [["Plan catering", "#contact"]] },
    { q: "How does ordering ahead work?", k: ["order", "ahead", "pickup", "pay", "card", "how"], a: () => "Add items, choose a pickup time (as soon as ~15 minutes), and pay when you pick up. No card needed online. We'll have it on the shelf with your name.", act: [["Start an order", "#menu"]] },
    { q: "What should I try?", k: ["recommend", "try", "best", "popular", "favorite", "should", "suggest"], a: () => "Our bestsellers are the Latte and Cold Brew; baristas love the Flat White. Not sure? The 20-second quiz will match you.", act: [["Take the quiz", "#find"], ["Add a flat white", "add:flatwhite"]] },
  ];
  const score = (text, item) => item.k.reduce((s, k) => s + (text.includes(k) ? k.length : 0), 0);
  const root = document.getElementById("ask");
  const input = root.querySelector("input"), out = root.querySelector(".ask-answer");

  function answer(item) {
    if (!item) {
      out.innerHTML = `<p>Hmm, I'm not sure about that one. Give us a call at <a href="tel:+15555550123">(555) 555-0123</a> and a real barista will help.</p>`;
      return;
    }
    out.innerHTML = `<p class="ask-q">${item.q}</p><p>${item.a()}</p>${item.act.length ? `<div class="ask-acts">${item.act.map(([l, a]) => `<button class="btn btn-small" data-act="${a}">${l}</button>`).join("")}</div>` : ""}`;
    out.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 250 });
  }
  root.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = input.value.toLowerCase().trim(); if (!q) return;
    const best = KB.map((i) => [i, score(q, i)]).sort((a, b) => b[1] - a[1])[0];
    answer(best[1] ? best[0] : null);
    window.track && track("faq_ask", { matched: best[1] ? best[0].q : "none" });
  });
  root.addEventListener("click", (e) => {
    const c = e.target.closest("[data-q]"); if (c) { input.value = c.dataset.q; root.requestSubmit(); }
    const a = e.target.closest("[data-act]"); if (!a) return;
    const v = a.dataset.act;
    if (v.startsWith("add:")) { const id = v.slice(4); MENU_INDEX[id].food ? Cart.add(id) : openBuilder(id); }
    else if (v.startsWith("filter:")) { document.getElementById("menu").scrollIntoView({ behavior: "smooth" }); document.querySelector(`[data-f="${v.slice(7)}"][aria-pressed="false"]`)?.click(); }
    else if (v.startsWith("#")) document.querySelector(v).scrollIntoView({ behavior: "smooth" });
    else window.open(v, "_blank", "noopener");
  });
  root.querySelector(".ask-chips").innerHTML = KB.slice(0, 6).map((i) => `<button type="button" class="fchip" data-q="${i.q}">${i.q}</button>`).join("");

  // FAQ accordion + JSON-LD
  const acc = document.getElementById("faq-list");
  acc.innerHTML = KB.map((i) => `<details><summary>${i.q}</summary><p>${i.a()}</p></details>`).join("");
  const ld = document.createElement("script"); ld.type = "application/ld+json";
  ld.textContent = JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: KB.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a() } })) });
  document.head.appendChild(ld);
})();
