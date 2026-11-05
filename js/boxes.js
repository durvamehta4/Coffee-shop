// Curated gift boxes with savings anchors.
(function () {
  const ids = ["box-ritual", "box-explorer", "box-cozy"];
  const box = (c) => `
    <svg viewBox="0 0 160 120" class="gbox" aria-hidden="true">
      <path d="M20 50h120v60H20z" fill="${c}"/><path d="M14 36h132v18H14z" fill="${c}" style="filter:brightness(1.15)"/>
      <path d="M72 36h16v74H72z" fill="#f7f1e8" opacity=".9"/>
      <path d="M80 36c-14-22-34-18-30-6 3 8 18 6 30 6zM80 36c14-22 34-18 30-6-3 8-18 6-30 6z" fill="none" stroke="#f7f1e8" stroke-width="5" stroke-linejoin="round"/>
    </svg>`;
  document.getElementById("gift-boxes").innerHTML = ids.map((id) => {
    const b = MENU_INDEX[id];
    return `<article class="gift-box">
      <span class="save-ribbon">Save ${fmt(b.compare - b.price).replace(".00", "")}</span>
      <div class="gbox-art" style="--c:${b.color}">${box(b.color)}</div>
      <h3>${b.name}</h3>
      <ul>${b.contents.map((x) => `<li>${x}</li>`).join("")}</ul>
      <div class="gb-buy"><span><s>${fmt(b.compare)}</s> <strong>${fmt(b.price)}</strong></span><button class="btn btn-small" data-add="${id}">Add box</button></div>
    </article>`;
  }).join("");
})();
