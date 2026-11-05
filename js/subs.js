// Bean subscriptions: created from orders, managed in My Ember (skip, pause, grind, cancel), due-soon chip.
(function () {
  const K = "eb-subs";
  const get = () => { try { return JSON.parse(localStorage.getItem(K)) || []; } catch { return []; } };
  const set = (v) => { try { localStorage.setItem(K, JSON.stringify(v)); } catch {} };
  const weeks = (plan) => (/2 weeks/.test(plan) ? 2 : 4);
  const fmtD = (d) => new Date(d).toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
  const GRINDS = ["Whole bean", "Espresso", "Pour over", "French press"];

  document.addEventListener("order:placed", (e) => {
    const subs = get();
    e.detail.lines.filter((l) => l.opts && l.opts.plan).forEach((l) => {
      const next = new Date(e.detail.at); next.setDate(next.getDate() + 7 * weeks(l.opts.plan));
      subs.push({ sid: Date.now() + Math.random().toString(36).slice(2, 6), id: l.id, name: l.name, plan: l.opts.plan, grind: l.opts.grind, price: l.price, next: next.toISOString(), paused: false });
    });
    set(subs); render();
  });

  function section() {
    const subs = get();
    if (!subs.length) return "";
    return `<section class="me-subs"><h3>Subscriptions</h3>${subs.map((s) => `
      <div class="sub ${s.paused ? "paused" : ""}" data-sid="${s.sid}">
        <div class="sub-top"><strong>${s.name}</strong><span class="sub-pill">${s.paused ? "Paused" : s.plan.replace(" subscription", "")}</span></div>
        <small>${s.paused ? "Paused. Resume any time." : `Next pickup <b>${fmtD(s.next)}</b> · ${fmt(s.price)}`}</small>
        <label class="sub-grind">Grind <select data-act="grind">${GRINDS.map((g) => `<option ${g === s.grind ? "selected" : ""}>${g}</option>`).join("")}</select></label>
        <div class="sub-acts">
          ${s.paused ? `<button class="link-btn" data-act="resume">▶ Resume</button>` : `<button class="link-btn" data-act="skip">⏭ Skip next</button><button class="link-btn" data-act="pause">⏸ Pause</button>`}
          <button class="link-btn danger" data-act="cancel">Cancel</button>
        </div>
      </div>`).join("")}</section>`;
  }
  function inject() {
    const body = document.querySelector(".me-panel .me-body");
    if (!body) return;
    body.querySelector(".me-subs")?.remove();
    const html = section(); if (!html) return;
    body.querySelector("section:nth-of-type(1)").insertAdjacentHTML("afterend", html);
  }
  function update(sid, fn) { const subs = get(); const s = subs.find((x) => x.sid === sid); if (s) fn(s, subs); set(subs.filter((x) => !x._del)); render(); }
  document.addEventListener("click", (e) => {
    const b = e.target.closest(".sub [data-act]"); if (!b || b.tagName === "SELECT") return;
    const sid = b.closest(".sub").dataset.sid, act = b.dataset.act;
    if (act === "cancel" && !confirm("Cancel this subscription?")) return;
    update(sid, (s) => {
      if (act === "skip") { const d = new Date(s.next); d.setDate(d.getDate() + 7 * weeks(s.plan)); s.next = d.toISOString(); }
      if (act === "pause") s.paused = true;
      if (act === "resume") { s.paused = false; const d = new Date(); d.setDate(d.getDate() + 7); s.next = d.toISOString(); }
      if (act === "cancel") s._del = true;
    });
  });
  document.addEventListener("change", (e) => { if (e.target.dataset.act === "grind") update(e.target.closest(".sub").dataset.sid, (s) => (s.grind = e.target.value)); });

  function dueChip() {
    const soon = get().find((s) => !s.paused && new Date(s.next) - Date.now() < 7 * 864e5);
    const card = document.querySelector(".quick-order");
    card?.querySelector(".sub-due")?.remove();
    if (soon && card) card.querySelector(".qo-status").insertAdjacentHTML("afterend", `<span class="wx sub-due">🫘 Your ${soon.name} is ready ${fmtD(soon.next)}</span>`);
  }
  function render() { inject(); dueChip(); }
  // Re-inject whenever the My Ember panel re-renders.
  const panel = document.querySelector(".me-panel");
  panel && new MutationObserver(() => { if (!panel.querySelector(".me-subs") && get().length) inject(); }).observe(panel, { childList: true });
  render();
})();
