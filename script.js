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

// ---------- Menu tabs ----------
const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".menu-panel");

tabs.forEach((tab) =>
  tab.addEventListener("click", () => {
    tabs.forEach((t) => {
      t.classList.remove("active");
      t.setAttribute("aria-selected", "false");
    });
    panels.forEach((p) => p.classList.remove("active"));

    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
    document.getElementById(tab.dataset.tab).classList.add("active");
  })
);

// ---------- Open / closed status ----------
// Hours by day of week (0 = Sunday), in 24h decimal hours.
const HOURS = {
  0: [8, 15],
  1: [7, 18],
  2: [7, 18],
  3: [7, 18],
  4: [7, 18],
  5: [7, 18],
  6: [8, 17],
};

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
