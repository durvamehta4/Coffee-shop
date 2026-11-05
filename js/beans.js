// Retail beans: illustrated bags, grind + subscription options, added to the pickup cart.
(function () {
  const beans = MENU.find((c) => c.cat === "beans").items;
  const GRINDS = ["Whole bean", "Espresso", "Pour over", "French press"];
  const PLANS = [{ v: "once", t: "One-time" }, { v: "2w", t: "Every 2 weeks", save: 0.15 }, { v: "4w", t: "Every 4 weeks", save: 0.15 }];
  const root = document.getElementById("bean-grid");

  const bag = (b) => `
    <svg viewBox="0 0 160 200" class="bag" aria-hidden="true">
      <path d="M30 30 L130 30 L140 190 Q80 198 20 190 Z" fill="#2f2119"/>
      <path d="M30 30 L130 30 L128 16 L32 16 Z" fill="#3c2b21"/>
      <path d="M32 16 l8 -6 l8 6 l8 -6 l8 6 l8 -6 l8 6 l8 -6 l8 6 l8 -6 l8 6 l8 -6 l8 6" fill="none" stroke="#3c2b21" stroke-width="3"/>
      <rect x="40" y="70" width="80" height="90" rx="6" fill="${b.color}"/>
      <text x="80" y="98" text-anchor="middle" font-family="Playfair Display, serif" font-size="13" font-weight="700" fill="#fff">EMBER</text>
      <text x="80" y="112" text-anchor="middle" font-family="Playfair Display, serif" font-size="9" fill="#fff" opacity=".85">&amp; BEAN</text>
      <line x1="55" y1="122" x2="105" y2="122" stroke="#fff" stroke-opacity=".5"/>
      <text x="80" y="140" text-anchor="middle" font-family="Inter, sans-serif" font-size="8" fill="#fff">${b.name.split(" ").slice(0, 2).join(" ").toUpperCase()}</text>
      <circle cx="80" cy="50" r="4" fill="#5a4334"/>
    </svg>`;

  root.innerHTML = beans.map((b) => `
    <article class="bean" data-bean="${b.id}">
      <div class="bean-visual">${bag(b)}</div>
      <div class="bean-body">
        <p class="bean-origin">${b.origin}</p>
        <h3>${b.name}</h3>
        <p class="muted small">${b.desc}</p>
        <div class="roast" aria-label="Roast level ${b.roast} of 5"><span>Light</span><i>${[1, 2, 3, 4, 5].map((n) => `<b class="${n <= b.roast ? "on" : ""}"></b>`).join("")}</i><span>Dark</span></div>
        <label class="bean-field">Grind
          <select data-grind>${GRINDS.map((g) => `<option>${g}</option>`).join("")}</select>
        </label>
        <div class="plans" role="radiogroup" aria-label="Purchase plan">${PLANS.map((p, i) => `
          <label class="plan"><input type="radio" name="plan-${b.id}" value="${p.v}" ${i ? "" : "checked"}/><span>${p.t}${p.save ? ` <em>save 15%</em>` : ""}</span></label>`).join("")}
        </div>
        <div class="bean-buy">
          <span class="bean-price">${fmt(b.price)} <small>/ 340g</small></span>
          <button class="btn btn-small" data-bean-add>Add bag</button>
        </div>
      </div>
    </article>`).join("");

  function priceFor(card) {
    const b = MENU_INDEX[card.dataset.bean];
    const plan = PLANS.find((p) => p.v === card.querySelector("input[type=radio]:checked").value);
    return { b, plan, price: +(b.price * (1 - (plan.save || 0))).toFixed(2) };
  }
  root.addEventListener("change", (e) => {
    const card = e.target.closest(".bean"); if (!card) return;
    const { b, price } = priceFor(card);
    card.querySelector(".bean-price").innerHTML = price < b.price
      ? `<s>${fmt(b.price)}</s> ${fmt(price)} <small>/ bag</small>` : `${fmt(b.price)} <small>/ 340g</small>`;
  });
  root.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-bean-add]"); if (!btn) return;
    const card = btn.closest(".bean");
    const { b, plan, price } = priceFor(card);
    const opts = { grind: card.querySelector("[data-grind]").value };
    if (plan.v !== "once") opts.plan = plan.t + " subscription";
    Cart.add(b.id, opts, price);
    btn.textContent = "✓ Added"; setTimeout(() => (btn.textContent = "Add bag"), 1200);
  });
})();
