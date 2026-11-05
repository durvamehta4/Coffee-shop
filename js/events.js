// Events: next real occurrences, paid workshop → cart, every event → .ics download.
(function () {
  const EVENTS = [
    { id: "latteart", title: "Latte Art 101", day: 6, start: 16, dur: 90, price: 25, emoji: "🎨",
      desc: "Steam silky milk and pour your first heart and tulip. Small group, all drinks included.", tag: "Workshop · 8 spots per class" },
    { id: "cupping", title: "Thursday Cupping", day: 4, start: 18, dur: 60, price: 0, emoji: "👃",
      desc: "Taste three origins side by side the way roasters do. No experience needed.", tag: "Free · drop in" },
    { id: "acoustic", title: "Friday Acoustic Night", day: 5, start: 18.5, dur: 120, price: 0, emoji: "🎸",
      desc: "Local musicians, warm drinks, low lights. Decaf flows freely after 7.", tag: "Free · all ages" },
  ];
  function next(day, startH) {
    const d = new Date(); d.setHours(Math.floor(startH), (startH % 1) * 60, 0, 0);
    let add = (day - d.getDay() + 7) % 7;
    if (add === 0 && d < new Date()) add = 7;
    d.setDate(d.getDate() + add);
    while (!hoursFor(d).hours) d.setDate(d.getDate() + 7); // skip holiday closures
    return d;
  }
  const ics = (e, d) => {
    const z = (x) => x.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const end = new Date(d.getTime() + e.dur * 60000);
    return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Ember & Bean//Events//EN", "BEGIN:VEVENT",
      `UID:${e.id}-${z(d)}@emberandbean.example`, `DTSTAMP:${z(new Date())}`, `DTSTART:${z(d)}`, `DTEND:${z(end)}`,
      `SUMMARY:${e.title} at Ember & Bean`, `DESCRIPTION:${e.desc}`, "LOCATION:Ember & Bean\\, 123 Roast Street\\, Brewtown CA",
      "BEGIN:VALARM", "TRIGGER:-PT1H", "ACTION:DISPLAY", "DESCRIPTION:Reminder", "END:VALARM", "END:VEVENT", "END:VCALENDAR"].join("\r\n");
  };
  const root = document.getElementById("event-list");
  const items = EVENTS.map((e) => ({ e, d: next(e.day, e.start) })).sort((a, b) => a.d - b.d);
  root.innerHTML = items.map(({ e, d }, i) => `
    <article class="event">
      <div class="ev-date"><span>${d.toLocaleDateString([], { month: "short" })}</span><b>${d.getDate()}</b><small>${d.toLocaleDateString([], { weekday: "short" })}</small></div>
      <div class="ev-body">
        <p class="ev-tag">${e.emoji} ${e.tag}</p>
        <h3>${e.title}</h3>
        <p class="muted small">${d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} · ${e.dur} min · ${e.desc}</p>
        <div class="ev-actions">
          ${e.price ? `<button class="btn btn-small" data-add="${e.id}">Book · ${fmt(e.price)}</button>` : ""}
          <button class="btn btn-small btn-ghost" data-ics="${i}">📅 Add to calendar</button>
        </div>
      </div>
    </article>`).join("");
  root.addEventListener("click", (ev) => {
    const b = ev.target.closest("[data-ics]"); if (!b) return;
    const { e, d } = items[+b.dataset.ics];
    const url = URL.createObjectURL(new Blob([ics(e, d)], { type: "text/calendar" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: `${e.id}.ics` });
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    b.textContent = "✓ Added"; window.track && track("add_to_calendar", { event_id: e.id });
  });
})();
