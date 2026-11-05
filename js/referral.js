// Referrals: members share ?ref=Name links; invited friends join with a bonus stamp.
(function () {
  const club = () => { try { return JSON.parse(localStorage.getItem("eb-club")); } catch { return null; } };
  const ref = new URLSearchParams(location.search).get("ref");
  const clean = (s) => (s || "").replace(/[^\p{L}\p{N} '\-]/gu, "").slice(0, 20);

  // Invited friend
  if (ref && !club()) {
    const who = clean(ref) || "A friend";
    try { sessionStorage.setItem("eb-ref", who); } catch {}
    const bar = document.createElement("div");
    bar.className = "shared-banner ref-banner";
    bar.innerHTML = `<span class="sb-icon" aria-hidden="true">🎁</span><div><strong>${who} sent you a bonus stamp!</strong><small>Join Ember Club and start your card with 2 stamps instead of 1.</small></div>
      <a class="btn btn-small" href="#rewards">Claim it</a><button class="link-btn" aria-label="Dismiss">✕</button>`;
    document.body.appendChild(bar);
    bar.querySelector("a").onclick = () => bar.remove();
    bar.querySelector("button").onclick = () => bar.remove();
  }
  // Bonus applied on join (club form adds 1 welcome stamp; we add the referral one).
  document.addEventListener("submit", (e) => {
    if (e.target.id !== "club-form") return;
    setTimeout(() => {
      let who; try { who = sessionStorage.getItem("eb-ref"); } catch {}
      const m = club(); if (!who || !m || m.refBonus) return;
      m.stamps += 1; m.refBonus = who; localStorage.setItem("eb-club", JSON.stringify(m));
      window.Club && Club.render();
    }, 0);
  }, true);

  // Member invite card
  function inviteCard() {
    const m = club(); const host = document.querySelector("#club .club-copy");
    if (!m || !host || host.querySelector(".invite")) return;
    const url = `${location.origin}${location.pathname}?ref=${encodeURIComponent(m.name)}`;
    host.insertAdjacentHTML("beforeend", `
      <div class="invite">
        <div><strong>👋 Invite a friend</strong><small>They start with a bonus stamp. Coffee is better together.</small></div>
        <button class="btn btn-small btn-ghost" id="invite-btn">Share link</button>
      </div>`);
    host.querySelector("#invite-btn").onclick = async (e) => {
      try {
        if (navigator.share) await navigator.share({ title: "Ember & Bean", text: `${m.name} invited you to Ember & Bean. Here's a bonus stamp ☕`, url });
        else { await navigator.clipboard.writeText(url); e.target.textContent = "✓ Copied"; }
        window.track && track("share", { content_type: "referral" });
      } catch {}
    };
  }
  new MutationObserver(inviteCard).observe(document.getElementById("club"), { childList: true });
  inviteCard();
})();
