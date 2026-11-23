/* Install pop-up: shows a card offering to add the app to the home screen. Self-contained; does not change other features. */
"use strict";
(function () {
  const SNOOZE_KEY = "lmlInstallDismissedAt";
  const SNOOZE_DAYS = 7;
  let deferredPrompt = null;

  function isStandalone() {
    return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  }

  function isIOS() {
    return /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
  }

  function recentlyDismissed() {
    try {
      const at = Number(localStorage.getItem(SNOOZE_KEY) || 0);
      return at > 0 && Date.now() - at < SNOOZE_DAYS * 24 * 60 * 60 * 1000;
    } catch (_) {
      return false;
    }
  }

  function remember() {
    try { localStorage.setItem(SNOOZE_KEY, String(Date.now())); } catch (_) {}
  }

  const style = document.createElement("style");
  style.textContent = `
    .lml-install-pop {
      position: fixed; left: 0; right: 0; bottom: 0; z-index: 10000;
      padding: 0 max(12px, env(safe-area-inset-right, 0px)) max(12px, env(safe-area-inset-bottom, 0px)) max(12px, env(safe-area-inset-left, 0px));
      pointer-events: none;
    }
    .lml-install-card {
      pointer-events: auto; max-width: 480px; margin: 0 auto; background: #ffffff; color: #14247a;
      border-radius: 16px; box-shadow: 0 10px 30px rgba(20, 36, 122, 0.25); padding: 16px;
      display: grid; gap: 10px; font: 15px/1.4 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
      border: 1px solid #d6dcf2;
    }
    .lml-install-card h2 { margin: 0; font-size: 17px; }
    .lml-install-card p { margin: 0; color: #3b4a7a; font-size: 14px; }
    .lml-install-actions { display: flex; gap: 10px; justify-content: flex-end; flex-wrap: wrap; }
    .lml-install-btn {
      border: 0; border-radius: 10px; padding: 10px 16px; font: inherit; font-weight: 700; cursor: pointer;
      background: #263b91; color: #ffffff; min-height: 44px;
    }
    .lml-install-btn.secondary { background: #eef1fb; color: #14247a; }
    .lml-install-btn:focus-visible { outline: 3px solid #f2b705; outline-offset: 2px; }
    @media (prefers-reduced-motion: no-preference) {
      .lml-install-card { animation: lmlInstallIn .25s ease-out; }
      @keyframes lmlInstallIn { from { transform: translateY(16px); opacity: 0; } to { transform: none; opacity: 1; } }
    }
  `;
  document.head.appendChild(style);

  const wrap = document.createElement("div");
  wrap.className = "lml-install-pop";
  wrap.hidden = true;
  wrap.innerHTML = `
    <div class="lml-install-card" role="dialog" aria-labelledby="lmlInstallTitle" aria-live="polite">
      <h2 id="lmlInstallTitle">Install Little Muslim Learners</h2>
      <p id="lmlInstallText">Add the app to your phone for quick, offline learning.</p>
      <div class="lml-install-actions">
        <button type="button" class="lml-install-btn secondary" id="lmlInstallLater">Not now</button>
        <button type="button" class="lml-install-btn" id="lmlInstallYes" hidden>Install</button>
      </div>
    </div>`;
  document.body.appendChild(wrap);

  const text = document.getElementById("lmlInstallText");
  const yes = document.getElementById("lmlInstallYes");
  const later = document.getElementById("lmlInstallLater");

  function show() {
    if (isStandalone() || recentlyDismissed()) return;
    wrap.hidden = false;
  }

  function hide(remembered) {
    if (remembered) remember();
    wrap.hidden = true;
  }

  window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();
    deferredPrompt = event;
    yes.hidden = false;
    show();
  });

  yes.addEventListener("click", async () => {
    if (!deferredPrompt) { hide(false); return; }
    deferredPrompt.prompt();
    try { await deferredPrompt.userChoice; } catch (_) {}
    deferredPrompt = null;
    hide(true);
  });

  later.addEventListener("click", () => hide(true));

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    hide(false);
  });

  // iPhone and iPad Safari never fire beforeinstallprompt, so show the manual steps instead.
  if (isIOS() && !isStandalone()) {
    yes.hidden = true;
    text.textContent = "Tap the Share button, then choose “Add to Home Screen”.";
    window.addEventListener("load", () => setTimeout(show, 1500));
  }
})();
