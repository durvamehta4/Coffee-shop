// Home brew guide: method + cups → grams/water/grind, with a guided step timer.
(function () {
  const M = {
    pourover: { name: "Pour over", ratio: 16, grind: "Medium-fine, like sea salt", temp: "94°C", bean: "bean-sidamo",
      steps: [["Bloom", "Pour twice the coffee's weight in water, let it bubble", 40], ["First pour", "Slow spirals up to 60% of the water", 45], ["Final pour", "Top up to the full amount, keep it gentle", 45], ["Drawdown", "Let it drain, then swirl and serve", 50]] },
    press: { name: "French press", ratio: 15, grind: "Coarse, like breadcrumbs", temp: "95°C", bean: "bean-ember",
      steps: [["Add water", "Pour all the water and stir gently", 20], ["Steep", "Lid on, plunger up, wait", 220], ["Break the crust", "Stir the top and skim the foam", 20], ["Press & pour", "Press slowly, pour everything out right away", 30]] },
    aeropress: { name: "AeroPress", ratio: 14, grind: "Fine, like table salt", temp: "88°C", bean: "bean-ember",
      steps: [["Add water", "Pour all the water over the grounds", 15], ["Stir", "Ten quick stirs", 15], ["Steep", "Cap on, flip onto your cup", 60], ["Press", "Steady 30-second press until it hisses", 30]] },
    coldbrew: { name: "Cold brew", ratio: 8, grind: "Extra coarse", temp: "Room temp", bean: "bean-decaf",
      steps: [["Combine", "Grounds plus cold water in a jar, stir well", 30], ["Steep", "Fridge for 16 to 18 hours (we'll skip ahead!)", 10], ["Strain", "Through a paper filter", 30], ["Serve", "Dilute 1:1 with water or milk over ice", 10]] },
  };
  const root = document.getElementById("brew");
  let method = "pourover", cups = 2, timer = null, stepIdx = 0, left = 0;

  function calc() {
    const m = M[method], water = cups * 250, coffee = Math.round(water / m.ratio);
    return { m, water, coffee };
  }
  function render() {
    const { m, water, coffee } = calc();
    root.innerHTML = `
      <div class="brew-methods" role="tablist">${Object.entries(M).map(([k, v]) => `<button role="tab" aria-selected="${k === method}" data-m="${k}">${v.name}</button>`).join("")}</div>
      <div class="brew-grid">
        <div class="brew-recipe">
          <label class="cater-label" for="cups">Cups <output>${cups}</output></label>
          <input type="range" id="cups" min="1" max="6" value="${cups}" style="--p:${((cups - 1) / 5) * 100}%" />
          <dl class="brew-stats">
            <div><dt>Coffee</dt><dd>${coffee}<small>g</small></dd></div>
            <div><dt>Water</dt><dd>${water}<small>ml</small></dd></div>
            <div><dt>Ratio</dt><dd>1:${m.ratio}</dd></div>
            <div><dt>Water temp</dt><dd>${m.temp}</dd></div>
          </dl>
          <p class="small"><strong>Grind:</strong> ${m.grind}</p>
          <button class="btn btn-small btn-ghost" data-buy="${m.bean}">Buy beans for this →</button>
        </div>
        <div class="brew-timer">
          <div class="bt-ring"><svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="52" class="ring-bg"/><circle cx="60" cy="60" r="52" class="ring-fg" id="bt-arc" stroke-dasharray="326.7" stroke-dashoffset="326.7"/></svg>
            <div class="bt-center"><span id="bt-time">${fmtT(m.steps[0][2])}</span><small id="bt-step">Ready?</small></div></div>
          <ol class="bt-steps">${m.steps.map(([t, d, s], i) => `<li data-i="${i}"><strong>${t}</strong> <span class="muted">${d}</span> <em>${fmtT(s)}</em></li>`).join("")}</ol>
          <button class="btn" id="bt-go">▶ Start brewing</button>
        </div>
      </div>`;
  }
  const fmtT = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  function tick() {
    const m = M[method], step = m.steps[stepIdx], arc = document.getElementById("bt-arc");
    document.getElementById("bt-time").textContent = fmtT(left);
    document.getElementById("bt-step").textContent = step[0];
    arc.style.strokeDashoffset = 326.7 * (left / step[2]);
    root.querySelectorAll(".bt-steps li").forEach((li, i) => { li.classList.toggle("now", i === stepIdx); li.classList.toggle("done", i < stepIdx); });
    if (left-- <= 0) {
      stepIdx++;
      if (navigator.vibrate) navigator.vibrate(120);
      if (stepIdx >= m.steps.length) { stop(); document.getElementById("bt-step").textContent = "Enjoy ☕"; document.getElementById("bt-time").textContent = "Done"; return; }
      left = m.steps[stepIdx][2];
    }
  }
  function stop() { clearInterval(timer); timer = null; const b = document.getElementById("bt-go"); if (b) b.textContent = "↺ Brew again"; }
  root.addEventListener("click", (e) => {
    const mb = e.target.closest("[data-m]"); if (mb) { stop(); method = mb.dataset.m; render(); }
    if (e.target.closest("#bt-go")) {
      if (timer) { stop(); return; }
      stepIdx = 0; left = M[method].steps[0][2]; e.target.textContent = "■ Stop"; tick(); timer = setInterval(tick, 1000);
    }
    const buy = e.target.closest("[data-buy]");
    if (buy) { const card = document.querySelector(`[data-bean="${buy.dataset.buy}"]`); card && card.scrollIntoView({ behavior: "smooth", block: "center" }); card && card.animate([{ boxShadow: "0 0 0 4px var(--caramel)" }, { boxShadow: "none" }], { duration: 1600 }); }
  });
  root.addEventListener("input", (e) => { if (e.target.id === "cups") { cups = +e.target.value; stop(); render(); document.getElementById("cups").focus(); } });
  render();
})();
