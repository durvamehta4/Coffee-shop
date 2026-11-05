// Catering quote builder: headcount + occasion → auto-sized package with live estimate.
(function () {
  const f = document.getElementById("cater");
  const ppl = document.getElementById("ppl");
  const PRICES = { box: 28, pastry: 30, cold: 32, treats: 24 }; // box of joe serves 10 · dozen pastries · cold brew jug serves 10 · treat tray serves 12
  const NAMES = { box: "Box of Joe (serves 10)", pastry: "Pastry dozen", cold: "Cold brew jug (serves 10)", treats: "Cookie & brownie tray" };
  const date = document.getElementById("c-date");
  const min = new Date(Date.now() + 86400000); date.min = min.toISOString().slice(0, 10);

  function plan() {
    const n = +ppl.value, kind = f.kind.value;
    const items = { box: Math.ceil(n / 10), pastry: Math.ceil(n / 12) };
    if (kind === "allday") { items.box = Math.ceil(n / 10) * 2; items.cold = Math.ceil(n / 20); items.pastry = Math.ceil(n / 10); }
    if (kind === "party") { items.cold = Math.ceil(n / 25); items.treats = Math.ceil(n / 12); }
    return items;
  }
  function render() {
    document.getElementById("ppl-out").textContent = ppl.value;
    ppl.style.setProperty("--p", ((ppl.value - ppl.min) / (ppl.max - ppl.min)) * 100 + "%");
    const items = plan();
    let total = 0;
    document.getElementById("cater-lines").innerHTML = Object.entries(items).map(([k, q]) => {
      const sub = q * PRICES[k]; total += sub;
      return `<li><span><b>${q}×</b> ${NAMES[k]}</span><span>${fmt(sub)}</span></li>`;
    }).join("");
    const delivery = total >= 100 ? 0 : 12;
    if (delivery) document.getElementById("cater-lines").insertAdjacentHTML("beforeend", `<li class="muted"><span>Delivery (free over $100)</span><span>${fmt(delivery)}</span></li>`);
    total += delivery;
    document.getElementById("cater-total").textContent = fmt(total);
    document.getElementById("cater-pp").textContent = `≈ ${fmt(total / ppl.value)} per person`;
    return { items, total };
  }
  f.addEventListener("input", render);
  f.addEventListener("submit", (e) => {
    e.preventDefault();
    const status = document.getElementById("cater-status");
    const email = document.getElementById("c-email");
    if (!date.value || !email.checkValidity() || !email.value) {
      status.textContent = "Please add a date and a valid email so we can confirm."; status.className = "form-status error"; return;
    }
    const { items, total } = render();
    const body = `Catering request\n\nPeople: ${ppl.value}\nOccasion: ${f.kind.value}\nDate: ${date.value}\n\n` +
      Object.entries(items).map(([k, q]) => `${q} × ${NAMES[k]}`).join("\n") + `\n\nEstimate: ${fmt(total)}\nContact: ${email.value}`;
    location.href = `mailto:catering@emberandbean.example?subject=${encodeURIComponent(`Catering quote: ${ppl.value} people on ${date.value}`)}&body=${encodeURIComponent(body)}`;
    status.textContent = "Thanks! Your email app should open with the quote filled in. We reply within a few hours.";
    status.className = "form-status success";
  });
  render();
})();
