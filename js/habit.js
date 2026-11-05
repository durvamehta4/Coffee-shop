// "Make it a habit": recurring weekday calendar reminder that deep-links to a one-tap reorder (?usual=1).
(function () {
  if (/[?&]usual=1/.test(location.search)) {
    addEventListener("load", () => setTimeout(() => { window.reorderLast && reorderLast(); history.replaceState(null, "", location.pathname + "#menu"); window.track && track("habit_reorder"); }, 300));
  }
  document.addEventListener("order:placed", (e) => {
    const o = e.detail;
    const done = document.querySelector('#cart-drawer [data-step="done"]');
    done.querySelector(".habit")?.remove();
    const at = new Date(o.at); const remind = new Date(at.getTime() - 15 * 60000);
    const hhmm = remind.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    done.querySelector(".btn").insertAdjacentHTML("beforebegin", `<button class="link-btn habit">📅 Make it a habit: remind me every weekday at ${hhmm}</button>`);
    done.querySelector(".habit").onclick = (ev) => {
      const pad = (n) => String(n).padStart(2, "0");
      const d = new Date(); d.setDate(d.getDate() + 1); while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1);
      const local = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(remind.getHours())}${pad(remind.getMinutes())}00`;
      const url = location.origin + location.pathname + "?usual=1";
      const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Ember & Bean//Habit//EN", "BEGIN:VEVENT", `UID:habit-${Date.now()}@emberandbean.example`,
        `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`, `DTSTART:${local}`, "DURATION:PT10M", "RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR",
        "SUMMARY:☕ Order your usual from Ember & Bean", `DESCRIPTION:One tap to reorder: ${url}`, `URL:${url}`, "BEGIN:VALARM", "TRIGGER:PT0M", "ACTION:DISPLAY", "DESCRIPTION:Coffee time", "END:VALARM", "END:VEVENT", "END:VCALENDAR"].join("\r\n");
      const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(new Blob([ics], { type: "text/calendar" })), download: "ember-and-bean-habit.ics" });
      a.click(); ev.target.textContent = "✓ Added. See you tomorrow!";
      window.track && track("habit_reminder", { time: hhmm });
    };
  });
})();
