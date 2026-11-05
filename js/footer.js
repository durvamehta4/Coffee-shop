// Mobile footer: turn columns into <details> accordions under 800px (desktop keeps them open).
(function () {
  const mq = matchMedia("(max-width: 800px)");
  const cols = [...document.querySelectorAll(".footer-col")];
  cols.forEach((c) => {
    const h = c.querySelector("h4"); if (!h) return;
    const d = document.createElement("details"); d.className = "footer-acc";
    const sum = document.createElement("summary"); sum.textContent = h.textContent; h.remove();
    d.appendChild(sum); while (c.firstChild) d.appendChild(c.firstChild); c.appendChild(d);
  });
  const sync = () => document.querySelectorAll(".footer-acc").forEach((d) => (d.open = !mq.matches));
  mq.addEventListener("change", sync); sync();
})();
