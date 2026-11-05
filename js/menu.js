// Renders menu panels from window.MENU and wires the tabs.
(function () {
  window.renderMenu = function () {
    MENU.forEach(({ cat, items }) => {
      const panel = document.getElementById(cat);
      if (!panel) return;
      panel.innerHTML = items.map((i) => `
        <div class="menu-item" data-id="${i.id}">
          <div class="menu-item-text">
            <h3>${i.name}</h3>
            <p>${i.desc}</p>
          </div>
          <div class="menu-item-side">
            <span class="price">${fmt(i.price)}</span>
            <button class="add-btn" data-add="${i.id}" aria-label="Add ${i.name} to order">+ Add</button>
          </div>
        </div>`).join("");
    });
    document.dispatchEvent(new CustomEvent("menu:rendered"));
  };
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
