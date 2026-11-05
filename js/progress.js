// Ember Club progress in the cart: current stamps + this order's stamps, with a "one more" nudge.
(function () {
  const GOAL = 9;
  document.addEventListener("cart:render", () => {
    const m = window.Club && Club.get();
    let el = document.getElementById("club-progress");
    const nudge = document.getElementById("club-nudge");
    if (!m || !Cart.lines.length) { el && el.remove(); return; }
    if (!el) { el = document.createElement("div"); el.id = "club-progress"; el.className = "club-progress"; (nudge || document.getElementById("cart-extras")).after(el); }
    if (nudge) nudge.hidden = true;
    const earning = Cart.lines.filter((l) => !MENU_INDEX[l.id].food).reduce((s, l) => s + l.qty, 0);
    const have = Math.min(m.stamps % (GOAL + 1), GOAL);
    const after = Math.min(GOAL, have + earning);
    const left = GOAL - after;
    const msg = m.stamps >= GOAL ? "🎉 A free drink is already coming off this order." :
      left === 0 ? "🎉 This order fills your card. Your next drink is free!" :
      left <= 2 ? `Add <b>${left} more drink${left > 1 ? "s" : ""}</b> and your next one is free.` :
      `${earning ? `+${earning} stamp${earning > 1 ? "s" : ""} with this order · ` : ""}${left} to go for a free drink`;
    el.innerHTML = `
      <div class="cp-bar" role="img" aria-label="${after} of ${GOAL} stamps after this order">
        <i class="cp-have" style="width:${(have / GOAL) * 100}%"></i><i class="cp-new" style="left:${(have / GOAL) * 100}%;width:${((after - have) / GOAL) * 100}%"></i>
      </div>
      <p>☕ ${msg}</p>`;
  });
  Cart.refresh();
})();
