// Register the service worker and offer "Add to home screen" right after an order (peak intent).
(function () {
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
  }
  let deferred = null;
  addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); deferred = e; });
  const dismissed = () => { try { return localStorage.getItem("eb-install-dismissed"); } catch { return null; } };

  document.addEventListener("order:placed", () => {
    if (!deferred || dismissed()) return;
    const done = document.querySelector('#cart-drawer [data-step="done"]');
    if (done.querySelector(".install-card")) return;
    done.querySelector(".btn").insertAdjacentHTML("beforebegin", `
      <div class="install-card">
        <img src="assets/favicon.svg" alt="" width="44" height="44" />
        <div><strong>Order in two taps next time</strong><span>Add Ember &amp; Bean to your home screen.</span></div>
        <button class="btn btn-small" id="install-btn">Add</button>
        <button class="link-btn" id="install-no" aria-label="No thanks">✕</button>
      </div>`);
    done.querySelector("#install-btn").onclick = async () => {
      deferred.prompt(); await deferred.userChoice; deferred = null; done.querySelector(".install-card").remove();
    };
    done.querySelector("#install-no").onclick = () => {
      try { localStorage.setItem("eb-install-dismissed", "1"); } catch {}
      done.querySelector(".install-card").remove();
    };
  });
})();
