// Minimal A/B framework: sticky assignment, ?ab=key:variant override, dataLayer exposure + purchase attribution.
(function () {
  const K = "eb-ab";
  const store = (() => { try { return JSON.parse(localStorage.getItem(K)) || {}; } catch { return {}; } })();
  const forced = Object.fromEntries((new URLSearchParams(location.search).get("ab") || "").split(",").filter(Boolean).map((p) => p.split(":")));
  const exposed = new Set();
  window.Experiments = {
    variant(key, variants) {
      let v = forced[key] || store[key];
      if (!variants.includes(v)) { v = variants[Math.floor(Math.random() * variants.length)]; store[key] = v; try { localStorage.setItem(K, JSON.stringify(store)); } catch {} }
      if (!exposed.has(key)) { exposed.add(key); (window.dataLayer = window.dataLayer || []).push({ event: "experiment_exposure", experiment_id: key, variant_id: v }); }
      return v;
    },
    all: () => ({ ...store, ...forced }),
  };
  // Attribute purchases to all active variants.
  document.addEventListener("order:placed", () => (window.dataLayer = window.dataLayer || []).push({ event: "experiment_conversion", experiments: Experiments.all() }));

  // --- Experiment 1: hero CTA copy ---
  const heroCopy = { control: "Order ahead", skip: "Skip the line →", fast: "Order in 30 seconds" };
  const hv = Experiments.variant("hero_cta", Object.keys(heroCopy));
  const cta = document.querySelector(".hero-actions .btn");
  if (cta && !(window.getLang && getLang() === "es")) cta.textContent = heroCopy[hv];

  // --- Experiment 2: checkout button copy ---
  const ckCopy = { control: "Choose pickup time →", paylater: "Checkout · pay at pickup →" };
  const cv = Experiments.variant("checkout_cta", Object.keys(ckCopy));
  const ck = document.getElementById("to-checkout");
  if (ck && !(window.getLang && getLang() === "es")) ck.textContent = ckCopy[cv];
})();
