// Dialog accessibility: focus trap, inert background, focus return for the cart drawer and drink builder.
(function () {
  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type=hidden]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const dialogs = [document.getElementById("cart-drawer"), document.getElementById("builder")];
  const bg = () => [document.querySelector("main"), document.querySelector(".site-header"), document.querySelector(".site-footer")];
  let opener = null;

  document.addEventListener("pointerdown", (e) => { opener = e.target.closest(FOCUSABLE) || opener; }, true);
  document.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") opener = document.activeElement; }, true);

  dialogs.forEach((d) => {
    d.setAttribute("role", "dialog"); d.setAttribute("aria-modal", "true");
    let returnTo = null;
    new MutationObserver(() => {
      const open = d.classList.contains("open");
      if (open && !d._open) {
        returnTo = opener; d._open = true;
        bg().forEach((el) => el && (el.inert = true));
        d.removeAttribute("aria-hidden");
        setTimeout(() => { if (!d.contains(document.activeElement)) (d.querySelector(FOCUSABLE) || d).focus(); }, 50);
      } else if (!open && d._open) {
        d._open = false;
        if (!dialogs.some((x) => x.classList.contains("open"))) bg().forEach((el) => el && (el.inert = false));
        d.setAttribute("aria-hidden", "true");
        if (returnTo && document.contains(returnTo)) returnTo.focus({ preventScroll: true });
      }
    }).observe(d, { attributes: true, attributeFilter: ["class"] });

    d.addEventListener("keydown", (e) => {
      if (e.key !== "Tab") return;
      const els = [...d.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null);
      if (!els.length) return;
      const first = els[0], last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  });
  document.getElementById("builder").setAttribute("aria-hidden", "true");
})();
