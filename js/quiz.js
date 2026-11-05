// "Find your cup" quiz: 3 taps → a recommendation that opens the builder pre-configured.
(function () {
  const root = document.getElementById("quiz");
  const Q = [
    { key: "taste", q: "How do you like your cup?", a: [
      { v: "strong", e: "⚡", t: "Strong & bold" }, { v: "creamy", e: "☁️", t: "Smooth & creamy" },
      { v: "sweet", e: "🍫", t: "A sweet treat" }, { v: "nocoffee", e: "🍵", t: "Skip the coffee" } ] },
    { key: "temp", q: "Hot or iced?", a: [ { v: "Hot", e: "🔥", t: "Hot, always" }, { v: "Iced", e: "🧊", t: "Iced, please" } ] },
    { key: "mood", q: "What's the moment?", a: [
      { v: "morning", e: "🌅", t: "Morning kick-start" }, { v: "afternoon", e: "☀️", t: "Afternoon pick-me-up" }, { v: "slow", e: "📖", t: "Slow & cozy" } ] },
  ];
  const PICKS = {
    strong: { morning: "americano", afternoon: "espresso", slow: "pourover" },
    creamy: { morning: "latte", afternoon: "flatwhite", slow: "cappuccino" },
    sweet: { morning: "mocha", afternoon: "mocha", slow: "cocoa" },
    nocoffee: { morning: "chai", afternoon: "matcha", slow: "tea" },
  };
  const WHY = {
    americano: "Bold and clean, with enough volume to sip through your inbox.",
    espresso: "Two intense, syrupy ounces. Gone in a minute, felt for hours.",
    pourover: "Hand-brewed single origin: bright, nuanced, made for lingering.",
    latte: "Silky steamed milk with a gentle espresso backbone.",
    flatwhite: "Stronger than a latte, smoother than a cappuccino. The sweet spot.",
    cappuccino: "Airy foam and rich espresso, the classic café companion.",
    mocha: "Dark chocolate meets espresso. Dessert you can drink at 9am.",
    cocoa: "Rich dark chocolate under a cloud of cream. Pure comfort.",
    chai: "Warm house spices and steamed milk to start the day gently.",
    matcha: "Smooth, grassy and steady energy without the jitters.",
    tea: "A pot of loose-leaf tea, ready whenever you are.",
  };
  const ans = {};
  let step = 0;

  function render() {
    if (step < Q.length) {
      const { key, q, a } = Q[step];
      root.innerHTML = `
        <div class="quiz-progress" aria-hidden="true">${Q.map((_, i) => `<span class="${i <= step ? "on" : ""}"></span>`).join("")}</div>
        <p class="quiz-step">Question ${step + 1} of ${Q.length}</p>
        <h3 class="quiz-q">${q}</h3>
        <div class="quiz-answers">${a.map((o) => `
          <button class="quiz-a" data-k="${key}" data-v="${o.v}"><span class="qa-e" aria-hidden="true">${o.e}</span>${o.t}</button>`).join("")}
        </div>
        ${step ? `<button class="link-btn quiz-back">← Back</button>` : ""}`;
    } else {
      const id = PICKS[ans.taste][ans.mood];
      const item = MENU_INDEX[id];
      const temp = ans.temp;
      root.innerHTML = `
        <div class="quiz-result">
          <div class="quiz-cup">${cupThumb(id, { temp, size: "Large" }, "-quiz") || ""}</div>
          <div>
            <p class="quiz-step">Your match</p>
            <h3 class="quiz-q">${temp === "Iced" && id !== "coldbrew" ? "Iced " : ""}${item.name}</h3>
            <p class="muted">${WHY[id]}</p>
            <div class="quiz-cta">
              <button class="btn" id="quiz-add">Customize & add · ${fmt(item.price)}</button>
              <button class="link-btn quiz-restart">Retake quiz</button>
            </div>
          </div>
        </div>`;
      root.querySelector("#quiz-add").onclick = () => openBuilder(id, { temp });
    }
  }

  root.addEventListener("click", (e) => {
    const a = e.target.closest(".quiz-a");
    if (a) { ans[a.dataset.k] = a.dataset.v; step++; render(); }
    if (e.target.closest(".quiz-back")) { step--; render(); }
    if (e.target.closest(".quiz-restart")) { step = 0; render(); }
  });
  render();
})();
