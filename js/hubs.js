// Tabbed hubs: groups secondary sections to shorten the page. Anchors to grouped sections open their tab.
(function () {
  const HUBS = [
    { id: "shop", eyebrow: "The shop", title: "Take Ember & Bean home", tabs: [["beans", "🫘 Beans"], ["brew-guide", "⏱ Brew guide"], ["gifts", "🎁 Gifts"]] },
    { id: "story", eyebrow: "Who we are", title: "The people, the planet, the pours", tabs: [["about", "📖 Our story"], ["team", "👋 The crew"], ["planet", "🌱 Planet"], ["gallery-sec", "📸 From the bar"]] },
  ];
  const owner = {};
  HUBS.forEach((h) => {
    const first = document.getElementById(h.tabs[0][0]); if (!first) return;
    const hub = document.createElement("section");
    hub.className = "hub"; hub.id = h.id;
    hub.innerHTML = `<div class="container hub-head"><p class="eyebrow">${h.eyebrow}</p><h2>${h.title}</h2>
      <div class="hub-tabs" role="tablist">${h.tabs.map(([id, l], i) => `<button role="tab" id="tab-${id}" aria-controls="${id}" aria-selected="${!i}" data-hub-tab="${id}">${l}</button>`).join("")}</div></div>`;
    first.before(hub);
    h.tabs.forEach(([id], i) => {
      const sec = document.getElementById(id); if (!sec) return;
      owner[id] = h; sec.setAttribute("role", "tabpanel"); sec.setAttribute("aria-labelledby", "tab-" + id);
      sec.classList.add("hub-panel"); sec.hidden = i > 0; hub.appendChild(sec);
    });
  });
  function activate(id, scroll) {
    const h = owner[id]; if (!h) return false;
    h.tabs.forEach(([tid]) => {
      const on = tid === id, sec = document.getElementById(tid);
      sec.hidden = !on; document.getElementById("tab-" + tid).setAttribute("aria-selected", on);
      if (on) sec.querySelectorAll(".reveal").forEach((e) => e.classList.add("in"));
    });
    if (scroll) document.getElementById(h.id).scrollIntoView({ behavior: "smooth" });
    return true;
  }
  window.showSection = activate;
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-hub-tab]"); if (t) return activate(t.dataset.hubTab);
    const a = e.target.closest('a[href^="#"]'); if (!a) return;
    const id = a.getAttribute("href").slice(1);
    if (owner[id]) { e.preventDefault(); activate(id, true); history.replaceState(null, "", "#" + id); }
  }, true);
  // Programmatic scrolls (palette, quiz, buttons) to hidden sections
  const orig = Element.prototype.scrollIntoView;
  Element.prototype.scrollIntoView = function (o) {
    const sec = this.closest && this.closest(".hub-panel");
    if (sec && sec.hidden) activate(sec.id);
    return orig.call(this, o);
  };
  document.querySelectorAll(".hub-tabs").forEach((tl) => tl.addEventListener("keydown", (e) => {
    if (!/Arrow(Left|Right)/.test(e.key)) return;
    const bs = [...tl.querySelectorAll("button")], i = bs.indexOf(document.activeElement);
    const n = bs[(i + (e.key === "ArrowRight" ? 1 : -1) + bs.length) % bs.length]; n.focus(); n.click();
  }));
  if (owner[location.hash.slice(1)]) activate(location.hash.slice(1));
})();
