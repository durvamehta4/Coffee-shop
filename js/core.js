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

function updateOpenStatus() {
  const el = document.getElementById("open-status");
  const now = new Date();
  const [open, close] = HOURS[now.getDay()];
  const time = now.getHours() + now.getMinutes() / 60;
  const isOpen = time >= open && time < close;

  el.textContent = isOpen ? "● We're open now — come on in!" : "● Currently closed — see you soon.";
  el.className = `open-status ${isOpen ? "open" : "closed"}`;
}
updateOpenStatus();

// ---------- Contact form ----------
const form = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let valid = true;

  form.querySelectorAll("input, textarea").forEach((field) => {
    const ok = field.checkValidity() && field.value.trim() !== "";
    field.parentElement.classList.toggle("invalid", !ok);
    if (!ok) valid = false;
  });

  if (!valid) {
    formStatus.textContent = "Please fill in all fields with a valid email.";
    formStatus.className = "form-status error";
    return;
  }

  // No backend yet — just confirm to the visitor.
  const name = form.name.value.trim();
  formStatus.textContent = `Thanks, ${name}! We'll get back to you soon.`;
  formStatus.className = "form-status success";
  form.reset();
});

// ---------- Footer year ----------
document.getElementById("year").textContent = new Date().getFullYear();

// ---------- Weekly hours list (today highlighted) ----------
(function () {
  const el = document.getElementById("week");
  if (!el) return;
  const names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const t = (h) => (h === 12 ? "12 pm" : h > 12 ? h - 12 + " pm" : h + " am");
  const today = new Date().getDay();
  el.innerHTML = [1, 2, 3, 4, 5, 6, 0].map((d) =>
    `<li class="${d === today ? "today" : ""}"><span>${names[d]}${d === today ? " <em>Today</em>" : ""}</span><span>${t(HOURS[d][0])} – ${t(HOURS[d][1])}</span></li>`).join("");
})();
