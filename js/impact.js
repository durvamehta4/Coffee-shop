// Sustainability section: commitments + the visitor's own impact (from local order history).
(function () {
  const hist = () => { try { return JSON.parse(localStorage.getItem("eb-history")) || []; } catch { return []; } };
  function stats() {
    let cups = 0, forward = 0;
    hist().forEach((o) => {
      (o.discounts || []).forEach((d) => { const m = /Own cup ×(\d+)/.exec(d.label); if (m) cups += +m[1]; });
      o.lines.forEach((l) => { if (l.id === "forward") forward += l.qty; });
    });
    return { cups, forward, saved: cups * 0.25 };
  }
  function render() {
    const s = stats();
    document.getElementById("impact-me").innerHTML = (s.cups || s.forward) ? `
      <p class="eyebrow">Your impact so far</p>
      <div class="impact-stats">
        <div><b>${s.cups}</b><span>disposable cups saved</span></div>
        <div><b>${s.forward}</b><span>coffees paid forward</span></div>
        <div><b>${fmt(s.saved)}</b><span>saved with your own cup</span></div>
      </div>` : `
      <p class="eyebrow">Your impact starts here</p>
      <p>Tick <b>"I'll bring my own cup"</b> at checkout to save a cup and $0.25, or pay a coffee forward for a neighbor. We'll keep count right here.</p>
      <a href="#menu" class="btn btn-small">Start an order</a>`;
  }
  document.addEventListener("order:placed", () => setTimeout(render, 50));
  render();
})();
