// Smoothly roll money values ($x.xx) to their new value with a brief flash.
(function () {
  const calm = () => matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.classList.contains("calm");
  const SEL = ["#cart-total", ".ob-total", ".tb-label", ".builder-price"];
  const parse = (t) => { const m = /\$(\d+(?:\.\d+)?)/.exec(t); return m ? +m[1] : null; };
  const busy = new WeakMap();
  function roll(el, from, to, template) {
    if (calm() || from === null || to === null || from === to) return;
    if (el.checkVisibility && !el.checkVisibility({ visibilityProperty: true, opacityProperty: true })) return;
    cancelAnimationFrame(busy.get(el));
    const t0 = performance.now(), dur = 420;
    el.classList.remove("num-flash"); void el.offsetWidth; el.classList.add("num-flash");
    const step = (t) => {
      const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el._written = k < 1 ? template.replace(/\$\d+(?:\.\d+)?/, fmt(from + (to - from) * e)) : template;
      el.textContent = el._written;
      if (k < 1) busy.set(el, requestAnimationFrame(step));
    };
    busy.set(el, requestAnimationFrame(step));
  }
  function watch(el) {
    if (el._watched) return; el._watched = true;
    let last = parse(el.textContent);
    new MutationObserver(() => {
      const txt = el.textContent;
      if (txt === el._written) return; // our own frame
      cancelAnimationFrame(busy.get(el));
      const now = parse(txt);
      if (now !== null && last !== null && now !== last) roll(el, last, now, txt);
      last = now;
    }).observe(el, { childList: true, characterData: true, subtree: true });
  }
  const scan = () => SEL.forEach((s) => document.querySelectorAll(s).forEach(watch));
  scan();
  new MutationObserver(scan).observe(document.body, { childList: true });
})();
