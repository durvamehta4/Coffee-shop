// Mark the menu tabs as "stuck" when pinned, and scroll the menu top into view on tab change.
(function () {
  const tabs = document.querySelector(".menu-tabs"); if (!tabs) return;
  const sentinel = document.createElement("div"); sentinel.style.height = "1px"; tabs.before(sentinel);
  new IntersectionObserver(([e]) => tabs.classList.toggle("stuck", !e.isIntersecting && e.boundingClientRect.top < 200), { rootMargin: "-120px 0px 0px 0px" }).observe(sentinel);
  tabs.addEventListener("click", (e) => {
    if (!e.target.closest(".tab") || !tabs.classList.contains("stuck")) return;
    const y = sentinel.getBoundingClientRect().top + scrollY - 130;
    scrollTo({ top: y, behavior: "smooth" });
  });
})();
