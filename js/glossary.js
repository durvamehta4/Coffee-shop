// Coffee glossary: dotted-underline jargon in descriptions; hover/focus/tap shows a plain-English tooltip.
(function () {
  const G = {
    "ristretto": "A 'restricted' espresso shot: less water, so it's sweeter and more concentrated.",
    "microfoam": "Milk steamed into tiny, glossy bubbles. It's what makes latte art possible.",
    "cortado": "Espresso 'cut' with an equal amount of warm milk. Small, strong, smooth.",
    "single-origin": "Coffee from one farm or region, so you taste that place's character.",
    "pour over": "Hot water poured by hand through a filter. Clean, bright and nuanced.",
    "pour-over": "Hot water poured by hand through a filter. Clean, bright and nuanced.",
    "heirloom": "Wild, native Ethiopian coffee varieties, prized for floral and fruity flavors.",
    "washed": "Beans are cleaned of fruit before drying, giving a crisp, clean cup.",
    "swiss water process": "Chemical-free decaf: caffeine removed with just water, time and filters.",
    "ceremonial-grade": "The finest, youngest matcha leaves: smooth, sweet and vivid green.",
    "crema": "The golden foam on top of a fresh espresso shot.",
    "double shot": "Two shots of espresso (about 18 g of coffee) for a fuller flavor.",
    "steeped": "Soaked in water for a long time, like tea. Cold brew steeps for 18 hours.",
  };
  const keys = Object.keys(G).sort((a, b) => b.length - a.length);
  const re = new RegExp(`\\b(${keys.map((k) => k.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")).join("|")})\\b`, "gi");
  const tip = document.createElement("div");
  tip.className = "gloss-tip"; tip.setAttribute("role", "tooltip"); tip.id = "gloss-tip"; tip.hidden = true;
  document.body.appendChild(tip);

  function decorate(root = document) {
    root.querySelectorAll(".menu-card-body p, .builder-desc, .detail-body > p.muted, .bean-body p.muted, .winter-card p").forEach((p) => {
      if (p.dataset.gloss) return;
      p.dataset.gloss = "1";
      p.innerHTML = p.innerHTML.replace(re, (m) => `<dfn class="gloss" tabindex="0" data-term="${m.toLowerCase()}" aria-describedby="gloss-tip">${m}</dfn>`);
    });
  }
  function show(el) {
    tip.innerHTML = `<strong>${el.textContent}</strong>${G[el.dataset.term]}`;
    tip.hidden = false;
    const r = el.getBoundingClientRect(), tw = Math.min(260, innerWidth - 24);
    tip.style.width = tw + "px";
    tip.style.left = Math.max(12, Math.min(innerWidth - tw - 12, r.left + r.width / 2 - tw / 2)) + "px";
    const above = r.top > 140;
    tip.style.top = (above ? r.top - tip.offsetHeight - 10 : r.bottom + 10) + "px";
    tip.classList.toggle("below", !above);
  }
  const hide = () => (tip.hidden = true);
  document.addEventListener("mouseover", (e) => { const g = e.target.closest(".gloss"); g ? show(g) : !e.target.closest(".gloss-tip") && hide(); });
  document.addEventListener("focusin", (e) => { const g = e.target.closest(".gloss"); g ? show(g) : hide(); });
  document.addEventListener("click", (e) => { const g = e.target.closest(".gloss"); if (g) { e.stopPropagation(); show(g); } else hide(); }, true);
  addEventListener("scroll", hide, { passive: true });
  new MutationObserver(() => decorate()).observe(document.body, { childList: true, subtree: true });
  decorate();
})();
