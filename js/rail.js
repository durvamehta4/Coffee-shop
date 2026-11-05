// Chapter rail: right-edge dots for long-page navigation (desktop), highlights the current section.
(function () {
  const CH = [["home", "Welcome"], ["menu", "Menu"], ["find", "Find your cup"], ["reviews", "Reviews"], ["rewards", "Ember Club"],
    ["shop", "Shop"], ["story", "Our story"], ["plan", "Visit & events"]];
  const rail = document.createElement("nav");
  rail.className = "rail"; rail.setAttribute("aria-label", "Page sections");
  rail.innerHTML = CH.map(([id, l]) => `<a href="#${id}" data-ch="${id}"><span>${l}</span></a>`).join("");
  document.body.appendChild(rail);
  const obs = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    rail.querySelectorAll("a").forEach((a) => a.classList.toggle("on", a.dataset.ch === e.target.id));
    rail.classList.toggle("dark", ["home", "find", "winter-menu"].includes(e.target.id));
  }), { rootMargin: "-50% 0px -49% 0px" });
  CH.forEach(([id]) => { const el = document.getElementById(id); el && obs.observe(el); });
  ["winter-menu"].forEach((id) => { const el = document.getElementById(id); el && obs.observe(el); });
})();
