// Scroll reveal, header state, progress line and active-section nav.
(function () {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const header = document.querySelector(".site-header");
  const bar = document.createElement("div");
  bar.className = "scroll-progress"; header.appendChild(bar);

  function onScroll() {
    const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
    header.classList.toggle("scrolled", y > 40);
    bar.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
  }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  // Active nav link
  const links = [...document.querySelectorAll('.nav-links a[href^="#"]')].filter((a) => a.getAttribute("href").length > 1);
  const secObs = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) links.forEach((a) => a.classList.toggle("current", a.getAttribute("href") === "#" + e.target.id));
  }), { rootMargin: "-45% 0px -50% 0px" });
  links.forEach((a) => { const s = document.querySelector(a.getAttribute("href")); s && secObs.observe(s); });

  if (reduce) return;
  // Reveal: tag elements, stagger siblings.
  const SEL = ".section h2, .section-sub, .about-text p, .features li, .menu-card, .quiz, .club-card, .club-copy, .visit > div, .contact-form, .reviews-head";
  const obs = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); obs.unobserve(e.target); }
  }), { rootMargin: "0px 0px -8% 0px" });
  function tag(root = document) {
    root.querySelectorAll(SEL).forEach((el) => {
      if (el.classList.contains("reveal")) return;
      el.classList.add("reveal");
      const sibs = [...el.parentElement.children].filter((c) => c.matches(SEL));
      el.style.setProperty("--d", Math.min(sibs.indexOf(el), 6) * 70 + "ms");
      obs.observe(el);
    });
  }
  tag();
  document.addEventListener("menu:rendered", () => requestAnimationFrame(() => tag()));
  // Re-tag cards rendered by filters/club without delaying them.
  new MutationObserver(() => tag()).observe(document.querySelector("main"), { childList: true, subtree: true });
})();
