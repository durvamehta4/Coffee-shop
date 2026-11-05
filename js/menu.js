// Renders menu panels from window.MENU and wires the tabs.
(function () {
  const FOOD_ICON = { croissant: "🥐", muffin: "🧁", avotoast: "🥑", sandwich: "🥪" };
  const thumb = (i, sfx) => (window.cupThumb && cupThumb(i.id, {}, sfx)) || `<span class="food-emoji">${FOOD_ICON[i.id] || "🍽"}</span>`;
  window.renderMenu = function () {
    MENU.forEach(({ cat, items }) => {
      const panel = document.getElementById(cat);
      if (!panel) return;
      panel.innerHTML = items.map((i) => card(i)).join("");
    });
    document.dispatchEvent(new CustomEvent("menu:rendered"));
  };
  function card(i, sfx = "") {
    return `
        <article class="menu-card" data-id="${i.id}">
          <div class="menu-thumb ${i.food ? "food" : ""}" aria-hidden="true">${thumb(i, sfx)}</div>
          <div class="menu-card-body">
            <div class="menu-card-top"><h3>${i.name}</h3><span class="price">${fmt(i.price)}</span></div>
            <p>${i.desc}</p>
            <button class="add-btn" data-add="${i.id}" aria-label="Add ${i.name} to order">+ Add</button>
          </div>
        </article>`;
  }
  window.menuCard = card;
  document.addEventListener("builder:ready", () => renderMenu());
  renderMenu();

  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((tab) => tab.addEventListener("click", () => {
    tabs.forEach((t) => { t.classList.remove("active"); t.setAttribute("aria-selected", "false"); });
    document.querySelectorAll(".menu-panel").forEach((p) => p.classList.remove("active"));
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
    document.getElementById(tab.dataset.tab).classList.add("active");
  }));
})();
