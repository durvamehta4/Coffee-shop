// Gift card designer with live tilt preview; adds to the pickup cart.
(function () {
  const f = document.getElementById("gift-form");
  const card = document.getElementById("gift-card");
  const $ = (id) => document.getElementById(id);
  function amount() {
    const v = f.amt.value;
    if (v !== "custom") return +v;
    const n = Math.round(+f.custom.value);
    return n >= 5 && n <= 200 ? n : 0;
  }
  function render() {
    f.custom.hidden = f.amt.value !== "custom";
    const a = amount();
    card.className = "gift-card " + f.design.value;
    $("gc-amount").textContent = a ? "$" + a : "$—";
    $("gc-msg").textContent = f.msg.value || "Coffee's on me ☕";
    $("gc-to").textContent = f.to.value || "Someone great";
    $("gc-from").textContent = f.from.value || "You";
    $("gift-price").textContent = a ? fmt(a) : "choose $5–$200";
    f.querySelector("button[type=submit]").disabled = !a;
  }
  f.addEventListener("input", render);
  f.addEventListener("change", (e) => { render(); if (e.target.value === "custom") f.custom.focus(); });
  f.addEventListener("submit", (e) => {
    e.preventDefault();
    const a = amount(); if (!a) return;
    Cart.add("giftcard", { amount: "$" + a, design: f.design.value, to: f.to.value ? "To " + f.to.value : "", msg: f.msg.value ? `“${f.msg.value}”` : "" }, a);
    card.classList.add("sent"); setTimeout(() => card.classList.remove("sent"), 700);
  });
  // Tilt
  const stage = card.parentElement;
  stage.addEventListener("pointermove", (e) => {
    const r = stage.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `rotateY(${x * 18}deg) rotateX(${-y * 18}deg)`;
    card.style.setProperty("--gx", (x + 0.5) * 100 + "%"); card.style.setProperty("--gy", (y + 0.5) * 100 + "%");
  });
  stage.addEventListener("pointerleave", () => (card.style.transform = ""));
  render();
})();
