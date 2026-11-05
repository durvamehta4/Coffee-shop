// "I'm on my way": geolocate once → distance & travel times → auto-pick the slot matching arrival.
(function () {
  const SHOP = { lat: 34.05, lon: -118.25 };
  const box = document.createElement("div");
  box.className = "arrival";
  box.innerHTML = `<button type="button" class="link-btn arrival-btn">📍 I'm on my way: time it to my arrival</button><p class="arrival-out" aria-live="polite"></p>`;
  const slot = document.getElementById("pickup-slot");
  slot.closest(".field").after(box);
  const out = box.querySelector(".arrival-out");
  const hav = (a, b) => {
    const R = 3958.8, toR = (d) => (d * Math.PI) / 180;
    const dLa = toR(b.lat - a.lat), dLo = toR(b.lon - a.lon);
    const h = Math.sin(dLa / 2) ** 2 + Math.cos(toR(a.lat)) * Math.cos(toR(b.lat)) * Math.sin(dLo / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  };
  function pick(mins) {
    const arrive = Date.now() + mins * 60000;
    let best = null, bestDiff = Infinity;
    [...slot.options].forEach((o) => { if (!o.value) return; const d = Math.abs(new Date(o.value) - arrive); if (new Date(o.value) >= Date.now() && d < bestDiff) { best = o; bestDiff = d; } });
    if (best) { slot.value = best.value; slot.dispatchEvent(new Event("change", { bubbles: true })); slot.animate([{ boxShadow: "0 0 0 4px rgba(200,131,74,.5)" }, { boxShadow: "none" }], { duration: 1200 }); }
    return best;
  }
  box.querySelector(".arrival-btn").addEventListener("click", () => {
    if (!navigator.geolocation) { out.textContent = "Location isn't available in this browser."; return; }
    out.textContent = "Finding you…";
    navigator.geolocation.getCurrentPosition((pos) => {
      const mi = hav({ lat: pos.coords.latitude, lon: pos.coords.longitude }, SHOP);
      const walk = Math.round(mi * 20), bike = Math.round(mi * 6), drive = Math.round(mi * 2.5 + 3);
      if (mi > 30) { out.innerHTML = `You're about ${Math.round(mi)} miles away, so pick any time that suits you.`; return; }
      const mode = mi < 0.7 ? ["walk", walk] : mi < 3 ? ["bike", bike] : ["drive", drive];
      const best = pick(mode[1]);
      out.innerHTML = `You're <b>${mi.toFixed(1)} mi</b> away · 🚶 ${walk} min · 🚲 ${bike} min · 🚗 ${drive} min.<br/>${best ? `We set pickup for <b>${best.textContent.replace(/^ASAP \(~\d+ min\) · /, "")}</b>, about when you'll arrive by ${mode[0]}.` : ""}`;
      window.track && track("arrival_timing", { miles: +mi.toFixed(1), mode: mode[0] });
    }, () => { out.textContent = "No worries. Just pick a time from the list."; }, { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 });
  });
})();
