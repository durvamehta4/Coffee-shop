// After pickup: quick star rating. 4–5★ → public review prompt; 1–3★ → private make-it-right note.
(function () {
  const REVIEW_URL = "https://www.google.com/maps/search/?api=1&query=Ember+%26+Bean+Coffee+Brewtown";
  const get = (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } };
  function maybeAsk() {
    const o = get("eb-last-order"); if (!o || !o.at) return;
    const rated = get("eb-rated") || [];
    const since = Date.now() - new Date(o.at).getTime();
    if (rated.includes(o.no) || since < 5 * 60000 || since > 3 * 864e5 || document.querySelector(".rate-card")) return;
    const first = o.lines.find((l) => !MENU_INDEX[l.id]?.food) || o.lines[0];
    const card = document.createElement("aside");
    card.className = "rate-card"; card.setAttribute("aria-label", "Rate your order");
    card.innerHTML = `
      <button class="link-btn rate-x" aria-label="Dismiss">✕</button>
      <p><b>How was your ${first.name}?</b><small>${o.no} · picked up ${new Date(o.at).toLocaleDateString([], { weekday: "short" })}</small></p>
      <div class="stars-in" role="radiogroup" aria-label="Rating">${[1, 2, 3, 4, 5].map((n) => `<button role="radio" aria-checked="false" data-star="${n}" aria-label="${n} star${n > 1 ? "s" : ""}">★</button>`).join("")}</div>
      <div class="rate-next"></div>`;
    document.body.appendChild(card);
    const done = () => { try { localStorage.setItem("eb-rated", JSON.stringify([...rated, o.no].slice(-20))); } catch {} };
    card.querySelector(".rate-x").onclick = () => { done(); card.remove(); };
    card.querySelector(".stars-in").addEventListener("mouseover", (e) => { const s = e.target.closest("[data-star]"); if (s) card.querySelectorAll("[data-star]").forEach((b) => b.classList.toggle("lit", +b.dataset.star <= +s.dataset.star)); });
    card.querySelector(".stars-in").addEventListener("click", (e) => {
      const s = e.target.closest("[data-star]"); if (!s) return;
      const n = +s.dataset.star; done();
      card.querySelectorAll("[data-star]").forEach((b) => { b.classList.toggle("lit", +b.dataset.star <= n); b.setAttribute("aria-checked", +b.dataset.star === n); b.disabled = true; });
      window.track && track("rate_order", { transaction_id: o.no, rating: n });
      const next = card.querySelector(".rate-next");
      if (n >= 4) next.innerHTML = `<p>Thank you! 🧡 Would you share that on Google? It helps a small shop more than you know.</p><a class="btn btn-small" target="_blank" rel="noopener" href="${REVIEW_URL}">Share it on Google ↗</a>`;
      else next.innerHTML = `<p>Sorry it wasn't great. Tell us what happened and we'll make it right.</p>
        <textarea rows="3" aria-label="What went wrong?" placeholder="Too cold, wrong milk, long wait…"></textarea>
        <a class="btn btn-small" href="#">Send to the shop</a>`;
      const send = next.querySelector('a[href="#"]');
      if (send) send.onclick = (ev) => { ev.preventDefault(); location.href = `mailto:hello@emberandbean.example?subject=${encodeURIComponent("Feedback on " + o.no)}&body=${encodeURIComponent(next.querySelector("textarea").value)}`; card.remove(); };
    });
  }
  setTimeout(maybeAsk, 2500);
  setInterval(maybeAsk, 60000);
})();
