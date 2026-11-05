// "From the bar": generated top-down latte art tiles.
(function () {
  const foam = "#fbf3e6";
  const crema = (id) => `<defs><clipPath id="cl-${id}"><circle cx="100" cy="100" r="76"/></clipPath><radialGradient id="cr-${id}" cx="45%" cy="40%"><stop offset="0" stop-color="#c78a50"/><stop offset=".65" stop-color="#9a5a2c"/><stop offset="1" stop-color="#5e3317"/></radialGradient></defs>
    <circle cx="100" cy="100" r="96" fill="#efe6da"/><circle cx="100" cy="100" r="86" fill="#fffaf3"/><circle cx="100" cy="100" r="76" fill="url(#cr-${id})"/>`;
  const ART = {
    heart: `<path d="M100 150 C 40 110, 55 55, 100 85 C 145 55, 160 110, 100 150 Z" fill="${foam}"/><path d="M100 60 V150" stroke="#b07040" stroke-width="2" opacity=".5"/>`,
    tulip: [0, 1, 2].map((i) => `<path d="M${100 - 34 + i * 6} ${130 - i * 26} q34 -${30 - i * 4} ${68 - i * 12} 0 q-34 ${16 - i * 2} -${68 - i * 12} 0z" fill="${foam}"/>`).join("") + `<path d="M100 52 V150" stroke="${foam}" stroke-width="4"/>`,
    rosetta: Array.from({ length: 9 }, (_, i) => `<ellipse cx="100" cy="${146 - i * 10}" rx="${38 - i * 3.6}" ry="7" fill="none" stroke="${foam}" stroke-width="6"/>`).join("") + `<path d="M100 40 V156" stroke="${foam}" stroke-width="3"/>`,
    swan: `<path d="M60 140 q40 10 70 -10 q-30 0 -40 -20 q30 10 40 -10 q-35 0 -45 -20 q30 8 40 -8" fill="none" stroke="${foam}" stroke-width="9" stroke-linecap="round"/><path d="M130 130 q10 -40 -5 -70 q-8 -12 -18 -4" fill="none" stroke="${foam}" stroke-width="6" stroke-linecap="round"/><circle cx="106" cy="58" r="7" fill="${foam}"/>`,
    snow: Array.from({ length: 6 }, (_, i) => `<path d="M100 100 L${100 + 52 * Math.cos((i * Math.PI) / 3)} ${100 + 52 * Math.sin((i * Math.PI) / 3)}" stroke="${foam}" stroke-width="6" stroke-linecap="round"/>`).join("") + `<circle cx="100" cy="100" r="12" fill="${foam}"/>`,
    leaf: `<path d="M100 40 C 150 70, 150 130, 100 160 C 50 130, 50 70, 100 40 Z" fill="${foam}"/>` + Array.from({ length: 6 }, (_, i) => `<path d="M100 ${60 + i * 16} l${-24 + i * 2} 12 M100 ${60 + i * 16} l${24 - i * 2} 12" stroke="#a4683a" stroke-width="3"/>`).join(""),
  };
  const TILES = [["heart", "Classic heart · Maya", "Flat white"], ["rosetta", "9-layer rosetta · Theo", "Latte"], ["swan", "Swan · Maya's comp winner", "Oat latte"],
    ["tulip", "Stacked tulip · Rosa", "Cappuccino"], ["snow", "Winter special art", "Gingerbread latte"]];
  document.getElementById("gallery").innerHTML = TILES.map(([k, cap, drink], i) => `
    <figure class="g-tile ${i === 0 ? "big" : ""}">
      <svg viewBox="0 0 200 200" role="img" aria-label="${cap}">${crema(i)}<g clip-path="url(#cl-${i})">${ART[k]}</g></svg>
      <figcaption><strong>${cap}</strong><span>${drink}</span></figcaption>
    </figure>`).join("");
})();
