// Drink builder: intercepts "Add" on drinks, opens a sheet with options + a live layered-cup visual.
(function () {
  // Layer recipe per drink (relative parts, bottom → top).
  const RECIPES = {
    espresso: [["espresso", 3]],
    americano: [["espresso", 2], ["water", 6]],
    cappuccino: [["espresso", 2], ["milk", 3], ["foam", 3]],
    flatwhite: [["espresso", 3], ["milk", 4], ["foam", 1]],
    latte: [["espresso", 2], ["milk", 6], ["foam", 1]],
    pourover: [["brew", 7]],
    coldbrew: [["brew", 7]],
    mocha: [["choc", 2], ["espresso", 2], ["milk", 4], ["foam", 1]],
    chai: [["chai", 3], ["milk", 4], ["foam", 1]],
    matcha: [["matcha", 3], ["milk", 4], ["foam", 1]],
    tea: [["tea", 7]],
    cocoa: [["choc", 6], ["cream", 2]],
    gingerbread: [["ginger", 1], ["espresso", 2], ["milk", 5], ["foam", 1]],
    pepmocha: [["choc", 2], ["espresso", 2], ["milk", 3], ["cream", 2]],
    maplecortado: [["maple", 1], ["espresso", 3], ["oat", 3]],
  };
  const COLORS = {
    espresso: "#3b2416", water: "#7a4f33", milk: "#e9d8c2", foam: "#fbf4ea", brew: "#4b2c1b",
    choc: "#5a3221", chai: "#c08a5a", matcha: "#8db255", tea: "#b77b3b", cream: "#fffdf8", oat: "#e6d3b3", ginger: "#a8652e", maple: "#c98a3c",
  };
  const SIZES = [{ v: "Small", d: -0.5, scale: 0.8 }, { v: "Medium", d: 0, scale: 0.9 }, { v: "Large", d: 0.75, scale: 1 }];
  const MILKS = [{ v: "Whole milk", d: 0 }, { v: "Oat", d: 0.6 }, { v: "Almond", d: 0.6 }, { v: "Skim", d: 0 }];
  const MILKY = (id) => (RECIPES[id] || []).some(([l]) => ["milk", "foam", "oat"].includes(l));
  const SHOTTY = (id) => (RECIPES[id] || []).some(([l]) => l === "espresso");

  // Estimated nutrition, medium with whole milk.
  const NUTR = {
    espresso: [130, 5], americano: [150, 10], cappuccino: [130, 130], flatwhite: [130, 170], latte: [130, 190],
    pourover: [180, 5], coldbrew: [200, 5], mocha: [130, 290], chai: [50, 240], matcha: [70, 220], tea: [40, 0],
    cocoa: [5, 320], gingerbread: [130, 280], pepmocha: [130, 360], maplecortado: [130, 120],
  };
  function nutrition() {
    const [caf, cal] = NUTR[state.id] || [100, 100];
    const sz = { Small: 0.8, Medium: 1, Large: 1.25 }[state.size];
    const milkF = { Oat: 1.1, Almond: 0.65, Skim: 0.6 }[state.milk] || 1;
    const sweet = { Light: 30, Regular: 60, Vanilla: 70 }[state.sweet] || 0;
    const isMilky = MILKY(state.id);
    return {
      caf: Math.round(caf * (["espresso", "cappuccino", "flatwhite", "latte", "mocha", "gingerbread", "pepmocha", "maplecortado"].includes(state.id) ? 1 : sz) + state.shots * 75),
      cal: Math.round((isMilky ? cal * milkF : cal) * sz + sweet + state.shots * 3),
    };
  }
  function nutrHTML() {
    const n = nutrition(), pct = Math.min(100, Math.round((n.caf / 400) * 100));
    return `<div class="nutr" aria-live="polite">
      <div class="nutr-row"><span>⚡ Caffeine</span><strong>${n.caf} mg</strong></div>
      <div class="meter"><i style="width:${pct}%" class="${pct > 60 ? "hi" : ""}"></i></div>
      <small>${pct}% of the 400 mg daily guideline${pct > 60 ? " · that's a strong one!" : ""}</small>
      <div class="nutr-row cal"><span>🔥 Calories</span><strong>~${n.cal}</strong></div>
    </div>`;
  }

  const sheet = document.getElementById("builder");
  const state = {};

  function cupSVG(id, st = state, uid = "cupclip") {
    const layers = (RECIPES[id] || [["brew", 7]]).map(([l, n]) => [l, n]);
    if (st.shots > 0) layers.splice(layers.findIndex(([l]) => l === "espresso") + 1, 0, ["espresso", st.shots * 1.5]);
    if (st.milk === "Oat" || st.milk === "Almond") layers.forEach((x) => x[0] === "milk" && (x[0] = "oat"));
    const iced = st.temp === "Iced";
    const scale = SIZES.find((s) => s.v === st.size).scale;
    const H = 150 * scale, W = 110 * scale, top = 180 - H, inset = 14 * scale;
    const total = layers.reduce((s, [, n]) => s + n, 0);
    let y = 180;
    const rects = layers.map(([l, n]) => {
      const h = (n / total) * (H - 10); y -= h;
      return `<rect x="0" y="${y}" width="200" height="${h + 0.5}" fill="${COLORS[l]}"><animate attributeName="height" from="0" to="${h + 0.5}" dur=".4s"/></rect>`;
    }).join("");
    const ice = iced ? [0, 1, 2].map((i) => `<rect x="${70 + i * 18}" y="${top + 18 + (i % 2) * 22}" width="18" height="18" rx="4" fill="rgba(255,255,255,.55)" stroke="rgba(255,255,255,.9)"/>`).join("") : "";
    const steam = !iced ? `<g class="steam" stroke="#c9b6a4" stroke-width="3" fill="none" stroke-linecap="round">
        <path d="M90 ${top - 10} q -8 -12 0 -24 q 8 -12 0 -24"/><path d="M110 ${top - 14} q -8 -12 0 -24 q 8 -12 0 -24"/></g>` : "";
    const L = 100 - W / 2, R = 100 + W / 2;
    const clip = `M${L} ${top} L${R} ${top} L${R - inset} 180 L${L + inset} 180 Z`;
    return `<svg viewBox="0 0 200 200" role="img" aria-label="Preview of your ${MENU_INDEX[id].name}">
      ${steam}
      <defs><clipPath id="${uid}"><path d="${clip}"/></clipPath></defs>
      <g clip-path="url(#${uid})">${rects}${ice}</g>
      <path d="${clip}" fill="none" class="cup-line" stroke="#4a3226" stroke-width="3" stroke-linejoin="round"/>
      ${!iced ? `<path d="M${R - 2} ${top + 20} q 26 6 ${-inset / 2} ${H / 2.4}" fill="none" class="cup-line" stroke="#4a3226" stroke-width="3"/>` : `<rect x="${100 + 8}" y="${top - 30}" width="6" height="${H}" fill="#c8834a" transform="rotate(12 110 ${top})"/>`}
      <ellipse cx="100" cy="188" rx="${W / 2}" ry="5" fill="rgba(43,29,22,.12)"/>
    </svg>`;
  }

  function price(id) {
    const base = MENU_INDEX[id].price;
    const s = SIZES.find((x) => x.v === state.size).d;
    const m = (MILKS.find((x) => x.v === state.milk) || { d: 0 }).d;
    const v = state.sweet === "Vanilla" ? 0.5 : 0;
    return Math.max(0, base + s + m + v + state.shots * 0.9);
  }

  function group(name, label, opts, extra = "") {
    return `<fieldset class="opt-group"><legend>${label}</legend><div class="chips">${opts.map((o) => `
      <label class="chip"><input type="radio" name="${name}" value="${o.v}" ${state[name] === o.v ? "checked" : ""}/>
      <span>${o.v}${o.d ? ` <em>${o.d > 0 ? "+" : "−"}${fmt(Math.abs(o.d))}</em>` : ""}</span></label>`).join("")}</div>${extra}</fieldset>`;
  }

  function render() {
    const id = state.id, item = MENU_INDEX[id];
    sheet.querySelector(".builder-cup").innerHTML = cupSVG(id);
    sheet.querySelector(".builder-title").textContent = item.name;
    sheet.querySelector(".builder-desc").textContent = item.desc;
    sheet.querySelector(".builder-price").textContent = fmt(price(id));
    sheet.querySelector(".builder-opts").innerHTML =
      group("size", "Size", SIZES) +
      group("temp", "Temperature", [{ v: "Hot" }, { v: "Iced" }]) +
      (MILKY(id) ? group("milk", "Milk", MILKS) : "") +
      (SHOTTY(id) ? `<fieldset class="opt-group"><legend>Extra espresso shots <em>+$0.90 each</em></legend>
        <div class="stepper"><button type="button" data-shot="-1" aria-label="Fewer shots">−</button><output>${state.shots}</output><button type="button" data-shot="1" aria-label="More shots">+</button></div></fieldset>` : "") +
      group("sweet", "Sweetness", [{ v: "None" }, { v: "Light" }, { v: "Regular" }, { v: "Vanilla", d: 0.5 }]);
    sheet.querySelector(".builder-nutr").innerHTML = nutrHTML();
  }

  function open(id, preset = {}) {
    const item = MENU_INDEX[id];
    Object.assign(state, { id, size: "Medium", temp: item.hot === false ? "Iced" : "Hot", milk: "Whole milk", shots: 0, sweet: "None" }, preset);
    render();
    sheet.classList.add("open"); document.getElementById("builder-overlay").classList.add("open");
    document.body.classList.add("no-scroll");
    sheet.querySelector(".builder-add").focus();
  }
  function close() {
    sheet.classList.remove("open"); document.getElementById("builder-overlay").classList.remove("open");
    document.body.classList.remove("no-scroll");
  }
  window.openBuilder = open;
  // Thumbnail cup for menu cards (default recipe, no animation).
  window.cupThumb = function (id) { return RECIPES[id]
    ? cupSVG(id, { size: id === "espresso" ? "Small" : "Large", temp: MENU_INDEX[id].hot === false ? "Iced" : "Hot", shots: 0, milk: "Whole milk", ...arguments[1] }, "clip-" + id + (arguments[2] || "")).replace(/<animate[^>]*\/>/g, "")
    : null; };
  document.dispatchEvent(new CustomEvent("builder:ready"));

  sheet.addEventListener("change", (e) => {
    if (e.target.name) { state[e.target.name] = e.target.value; render(); }
  });
  sheet.addEventListener("click", (e) => {
    const sh = e.target.closest("[data-shot]");
    if (sh) { state.shots = Math.min(3, Math.max(0, state.shots + +sh.dataset.shot)); render(); }
    if (e.target.closest(".builder-close")) close();
  });
  document.getElementById("builder-overlay").addEventListener("click", close);
  document.addEventListener("keydown", (e) => e.key === "Escape" && sheet.classList.contains("open") && close());

  sheet.querySelector(".builder-add").addEventListener("click", () => {
    const opts = { size: state.size, temp: state.temp };
    if (MILKY(state.id) && state.milk !== "Whole milk") opts.milk = state.milk;
    if (state.shots) opts.shots = `+${state.shots} shot${state.shots > 1 ? "s" : ""}`;
    if (state.sweet !== "None") opts.sweet = state.sweet === "Vanilla" ? "Vanilla" : `${state.sweet} sweet`;
    Cart.add(state.id, opts, price(state.id));
    close();
    document.dispatchEvent(new CustomEvent("builder:added", { detail: { id: state.id } }));
  });

  // Intercept drink "Add" buttons before cart.js handles them.
  document.addEventListener("click", (e) => {
    const add = e.target.closest("[data-add]");
    if (!add || add.closest(".drawer")) return;
    const item = MENU_INDEX[add.dataset.add];
    if (item && !item.food && RECIPES[item.id]) { e.stopPropagation(); open(item.id); }
  }, true);
})();
