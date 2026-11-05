// ---------- Mobile navigation ----------
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  })
);

// ---------- Open / closed status ----------
// Hours by day of week (0 = Sunday), in 24h decimal hours.
const HOURS = (window.SHOP_HOURS = {
  0: [8, 15],
  1: [7, 18],
  2: [7, 18],
  3: [7, 18],
  4: [7, 18],
  5: [7, 18],
  6: [8, 17],
});

// Holiday exceptions. hours: null = closed all day.
function holidayFor(d) {
  const md = String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  const fixed = {
    "12-24": { label: "Christmas Eve", hours: [8, 14] },
    "12-25": { label: "Christmas Day", hours: null },
    "12-31": { label: "New Year's Eve", hours: [8, 15] },
    "01-01": { label: "New Year's Day", hours: null },
    "07-04": { label: "Independence Day", hours: [9, 14] },
  };
  if (fixed[md]) return fixed[md];
  // Thanksgiving: 4th Thursday of November
  if (d.getMonth() === 10 && d.getDay() === 4 && Math.ceil(d.getDate() / 7) === 4) return { label: "Thanksgiving", hours: null };
  return null;
}
window.hoursFor = function (d) {
  const h = holidayFor(d);
  return h ? { hours: h.hours, holiday: h.label } : { hours: HOURS[d.getDay()], holiday: null };
};
window.isOpenAt = function (d) {
  const { hours } = hoursFor(d);
  const t = d.getHours() + d.getMinutes() / 60;
  return !!hours && t >= hours[0] && t < hours[1];
};
// Next opening moment strictly after `from` (when currently closed).
window.nextOpening = function (from = new Date()) {
  for (let i = 0; i < 14; i++) {
    const d = new Date(from); d.setDate(from.getDate() + i);
    const { hours } = hoursFor(d);
    if (!hours) continue;
    d.setHours(hours[0], 0, 0, 0);
    if (d > from) return d;
  }
  return null;
};
// Inline form: "today", "tomorrow", "Friday"
window.dayInline = (d, now) => { const l = dayLabel(d, now); return l === "Today" || l === "Tomorrow" ? l.toLowerCase() : l; };
window.dayLabel = function (d, now = new Date()) {
  const a = new Date(now); a.setHours(0, 0, 0, 0);
  const b = new Date(d); b.setHours(0, 0, 0, 0);
  const diff = Math.round((b - a) / 86400000);
  return diff === 0 ? "Today" : diff === 1 ? "Tomorrow" : d.toLocaleDateString([], { weekday: "long" });
};

function updateOpenStatus() {
  const el = document.getElementById("open-status");
  const now = new Date();
  const isOpen = isOpenAt(now);

  el.textContent = isOpen ? "● We're open now — come on in!" : "● Currently closed — see you soon.";
  el.className = `open-status ${isOpen ? "open" : "closed"}`;
}
updateOpenStatus();

// ---------- Footer year ----------
document.getElementById("year").textContent = new Date().getFullYear();

// ---------- Next 7 days of hours (holiday-aware) ----------
(function () {
  const el = document.getElementById("week");
  if (!el) return;
  const t = (h) => (h === 12 ? "12 pm" : h > 12 ? h - 12 + " pm" : h + " am");
  const now = new Date();
  const rows = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(now); d.setDate(now.getDate() + i);
    const { hours, holiday } = hoursFor(d);
    rows.push(`<li class="${i === 0 ? "today" : ""} ${holiday ? "holiday" : ""}">
      <span>${dayLabel(d, now)}${i === 0 ? " <em>Today</em>" : ""}${holiday ? ` <em class="hol">${holiday}</em>` : ""}</span>
      <span>${hours ? `${t(hours[0])} – ${t(hours[1])}` : "Closed"}</span></li>`);
  }
  el.innerHTML = rows.join("").replace(/Today <em>Today<\/em>/, "Today");
  // Upcoming holiday notice (next 21 days)
  for (let i = 0; i < 21; i++) {
    const d = new Date(now); d.setDate(now.getDate() + i);
    const h = holidayFor(d);
    if (h) {
      const note = document.createElement("p");
      note.className = "holiday-note";
      note.innerHTML = `🗓 <strong>${h.label}, ${d.toLocaleDateString([], { month: "short", day: "numeric" })}:</strong> ${h.hours ? `short hours, ${t(h.hours[0])} – ${t(h.hours[1])}` : "we're closed so the team can be with family"}. Pre-orders open for the day after.`;
      el.after(note);
      break;
    }
  }
})();

// ---------- Footer: today's hours ----------
(function () {
  const el = document.getElementById("footer-today");
  if (!el) return;
  const { hours, holiday } = hoursFor(new Date());
  const t = (h) => (h > 12 ? h - 12 + " pm" : h + " am");
  el.textContent = hours ? `Today: ${t(hours[0])} – ${t(hours[1])}` : `Today: closed${holiday ? " (" + holiday + ")" : ""}`;
})();
