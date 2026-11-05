// "Surprise me": slot-machine reel of cups → random drink with sensible random options → builder.
(function () {
  const drinks = MENU.flatMap((c) => c.items).filter((i) => !i.food && !i.hidden && window.cupThumb && cupThumb(i.id));
  const tools = document.querySelector("#menu .filter-chips");
  tools.insertAdjacentHTML("beforeend", `<button class="fchip surprise-btn" type="button">🎲 Surprise me</button>`);
  const modal = document.createElement("div");
  modal.className = "reel-wrap"; modal.hidden = true;
  modal.innerHTML = `<div class="reel-box" role="dialog" aria-modal="true" aria-label="Surprise drink"><p class="eyebrow">Spinning…</p><div class="reel"><div class="reel-strip"></div></div><p class="reel-name" aria-live="polite">&nbsp;</p></div>`;
  document.body.appendChild(modal);
  const strip = modal.querySelector(".reel-strip");
  function spin() {
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.classList.contains("calm");
    const pick = drinks[Math.floor(Math.random() * drinks.length)];
    const h = new Date().getHours();
    const preset = {
      temp: pick.hot === false || (h >= 12 && h < 17 && Math.random() < 0.6) ? "Iced" : "Hot",
      size: ["Small", "Medium", "Large"][Math.floor(Math.random() * 3)],
      ...(Math.random() < 0.35 ? { milk: Math.random() < 0.5 ? "Oat" : "Almond" } : {}),
      ...(h < 11 && Math.random() < 0.4 ? { shots: 1 } : {}),
      ...(Math.random() < 0.25 ? { sweet: "Vanilla" } : {}),
    };
    const seq = Array.from({ length: 14 }, () => drinks[Math.floor(Math.random() * drinks.length)]).concat(pick);
    strip.innerHTML = seq.map((d, i) => `<div class="reel-cell">${cupThumb(d.id, i === seq.length - 1 ? { temp: preset.temp } : {}, "-reel" + i)}</div>`).join("");
    modal.hidden = false; modal.querySelector(".eyebrow").textContent = "Spinning…"; modal.querySelector(".reel-name").innerHTML = "&nbsp;";
    strip.style.transition = "none"; strip.style.transform = "translateY(0)";
    requestAnimationFrame(() => requestAnimationFrame(() => {
      strip.style.transition = calm ? "none" : "transform 1.6s cubic-bezier(.15,.85,.25,1)";
      strip.style.transform = `translateY(-${(seq.length - 1) * 180}px)`;
    }));
    setTimeout(() => {
      const opts = [preset.size, preset.temp === "Iced" ? "iced" : "", preset.milk ? preset.milk.toLowerCase() : "", preset.shots ? "extra shot" : "", preset.sweet ? "vanilla" : ""].filter(Boolean).join(", ");
      modal.querySelector(".eyebrow").textContent = "Your surprise";
      modal.querySelector(".reel-name").innerHTML = `<strong>${pick.name}</strong><small>${opts}</small>`;
      setTimeout(() => { modal.hidden = true; openBuilder(pick.id, preset); }, calm ? 600 : 1100);
      window.track && track("surprise_me", { item_id: pick.id });
    }, calm ? 50 : 1700);
  }
  document.querySelector(".surprise-btn").addEventListener("click", spin);
  window.surpriseMe = spin;
})();
