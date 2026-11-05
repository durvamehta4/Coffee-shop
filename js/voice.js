// Voice ordering: Web Speech API → natural-language parser → customized cart lines.
(function () {
  const NUM = { a: 1, an: 1, one: 1, two: 2, to: 2, too: 2, three: 3, four: 4, five: 5, six: 6 };
  const ALIASES = {
    flatwhite: ["flat white", "flat whites"], coldbrew: ["cold brew", "cold brews"], pourover: ["pour over", "pour-over", "drip"],
    avotoast: ["avocado toast", "avo toast"], sandwich: ["breakfast sandwich", "sandwich", "sandwiches"], croissant: ["croissant", "croissants"],
    muffin: ["muffin", "muffins", "blueberry muffin"], chai: ["chai", "chai latte", "chai lattes"], matcha: ["matcha", "matcha latte"],
    tea: ["tea", "teas"], cocoa: ["hot chocolate", "cocoa"], latte: ["latte", "lattes"], cappuccino: ["cappuccino", "cappuccinos"],
    americano: ["americano", "americanos"], espresso: ["espresso", "espressos"], mocha: ["mocha", "mochas"],
    gingerbread: ["gingerbread", "gingerbread latte"], pepmocha: ["peppermint mocha"], maplecortado: ["cortado", "maple cortado"],
  };
  // Longest aliases first so "chai latte" beats "latte".
  const PATTERNS = Object.entries(ALIASES).flatMap(([id, as]) => as.map((a) => [id, a])).sort((x, y) => y[1].length - x[1].length);

  function matchItems(clause) {
    let t = " " + clause + " ";
    const found = [];
    for (const [id, alias] of PATTERNS) {
      let i;
      while ((i = t.indexOf(" " + alias + " ")) !== -1) {
        found.push({ id, at: i });
        t = t.slice(0, i + 1) + "#".repeat(alias.length) + t.slice(i + 1 + alias.length);
      }
    }
    return found.sort((a, b) => a.at - b.at).map((f) => f.id);
  }
  // Split into clauses ("…, … and …") so modifiers before or after an item apply to that item only.
  window.parseOrder = function (text) {
    const clean = text.toLowerCase().replace(/[.!?]/g, " ").replace(/\s+/g, " ");
    return clean.split(/,| and | plus | also | then /).flatMap((clause) => {
      const ids = matchItems(clause.trim());
      const words = clause.trim().split(" ");
      const qtyWord = words.find((x) => NUM[x] || /^\d+$/.test(x));
      const w = clause;
      return ids.map((id) => {
        const item = MENU_INDEX[id];
        const opts = {};
        if (!item.food) {
          opts.size = /\bsmall\b/.test(w) ? "Small" : /\blarge\b|\bbig\b/.test(w) ? "Large" : "Medium";
          opts.temp = /\biced\b|\bcold\b(?! brew)/.test(w) ? "Iced" : item.hot === false ? "Iced" : "Hot";
          const milk = /\boat\b/.test(w) ? "Oat" : /\balmond\b/.test(w) ? "Almond" : /\bskim\b/.test(w) ? "Skim" : null;
          if (milk) opts.milk = milk;
          const shots = /\btriple\b/.test(w) ? 2 : /\bdouble\b|\bextra shot\b/.test(w) ? 1 : 0;
          if (shots) opts.shots = `+${shots} shot${shots > 1 ? "s" : ""}`;
          if (/\bvanilla\b/.test(w)) opts.sweet = "Vanilla";
        }
        const delta = item.food ? 0 : ({ Small: -0.5, Large: 0.75 }[opts.size] || 0) + (opts.milk && opts.milk !== "Skim" ? 0.6 : 0) +
          (opts.shots ? parseInt(opts.shots.slice(1)) * 0.9 : 0) + (opts.sweet ? 0.5 : 0);
        return { id, qty: ids.length === 1 && qtyWord ? NUM[qtyWord] || +qtyWord : 1, opts, price: +(item.price + delta).toFixed(2) };
      });
    });
  };

  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const btns = document.querySelectorAll("[data-voice]");
  if (!SR) { btns.forEach((b) => (b.hidden = true)); return; }

  const sheet = document.createElement("div");
  sheet.className = "voice-sheet"; sheet.hidden = true; sheet.setAttribute("role", "status");
  sheet.innerHTML = `<div class="vs-orb" aria-hidden="true"><i></i><i></i><i></i></div><p class="vs-heard">Listening… try “a large iced oat latte and a croissant”</p><div class="vs-actions"></div>`;
  document.body.appendChild(sheet);
  let rec;

  function start() {
    rec = new SR(); rec.lang = "en-US"; rec.interimResults = true; rec.maxAlternatives = 1;
    sheet.hidden = false; sheet.classList.add("listening");
    const heard = sheet.querySelector(".vs-heard"), acts = sheet.querySelector(".vs-actions");
    acts.innerHTML = `<button class="link-btn" data-vs="cancel">Cancel</button>`;
    let final = "";
    rec.onresult = (e) => {
      final = [...e.results].map((r) => r[0].transcript).join(" ");
      heard.textContent = `“${final}”`;
    };
    rec.onerror = () => { heard.textContent = "Sorry, I couldn't hear that. Check mic permissions and try again."; sheet.classList.remove("listening"); };
    rec.onend = () => {
      sheet.classList.remove("listening");
      const lines = parseOrder(final);
      if (!final) return;
      if (!lines.length) { heard.textContent = `“${final}”: I didn't catch a menu item. Try again?`; acts.innerHTML = `<button class="btn btn-small" data-vs="retry">Try again</button><button class="link-btn" data-vs="cancel">Close</button>`; return; }
      heard.innerHTML = `Got it: <strong>${lines.map((l) => `${l.qty > 1 ? l.qty + "× " : ""}${Object.values(l.opts).filter((v) => v && v !== "Medium" && v !== "Hot").join(" ").toLowerCase()} ${MENU_INDEX[l.id].name}`.replace(/\s+/g, " ")).join(", ")}</strong>`;
      acts.innerHTML = `<button class="btn btn-small" data-vs="add">Add to order</button><button class="link-btn" data-vs="retry">Say it again</button>`;
      sheet._lines = lines;
    };
    rec.start();
  }
  sheet.addEventListener("click", (e) => {
    const a = e.target.closest("[data-vs]"); if (!a) return;
    if (a.dataset.vs === "cancel") { rec && rec.abort(); sheet.hidden = true; }
    if (a.dataset.vs === "retry") start();
    if (a.dataset.vs === "add") {
      sheet._lines.forEach((l) => { for (let i = 0; i < l.qty; i++) Cart.add(l.id, l.opts, l.price); });
      sheet.hidden = true; openCart();
    }
  });
  btns.forEach((b) => b.addEventListener("click", () => { document.querySelector(".palette-wrap").hidden = true; start(); }));
})();
