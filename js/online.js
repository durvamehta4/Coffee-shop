// Connection pill: offline reassurance (ordering is fully local) and a "back online" confirmation.
(function () {
  const pill = document.createElement("div");
  pill.className = "net-pill"; pill.setAttribute("role", "status"); pill.hidden = true;
  document.body.appendChild(pill);
  let t;
  function show(online) {
    clearTimeout(t);
    pill.className = "net-pill " + (online ? "on" : "off");
    pill.innerHTML = online ? "✓ Back online" : "📡 You're offline · you can still browse and build your order.";
    pill.hidden = false;
    if (online) t = setTimeout(() => (pill.hidden = true), 2500);
  }
  addEventListener("offline", () => show(false));
  addEventListener("online", () => show(true));
  if (!navigator.onLine) show(false);
})();
