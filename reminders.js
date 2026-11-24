/* Daily reminders for Ayatul Kursi and Istighfar. Adds a card to the Settings page. Works while the app is open; in the background on installed Android Chrome apps when the phone allows it. */
"use strict";
(function () {
  const KEY = "lmlReminders";
  const STATE_CACHE = "lml-reminder-state";
  const STATE_URL = "./__reminder-state__.json";
  const SYNC_TAG = "lml-daily-reminders";
  const ITEMS = {
    ayat: {
      title: "Ayatul Kursi",
      body: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ. Allah: there is no deity except Him, the Ever-Living, the Sustainer of existence.",
      last: "lastAyat"
    },
    ist: {
      title: "Istighfar",
      body: "أَسْتَغْفِرُ اللهَ الْعَظِيمَ وَأَتُوبُ إِلَيْهِ. I seek forgiveness from Allah, the Mighty, and turn to Him in repentance.",
      last: "lastIst"
    }
  };
  const DEFAULTS = { on: false, ayat: "06:30", ist: "18:30", lastAyat: "", lastIst: "" };

  const supported = "Notification" in window && "serviceWorker" in navigator;
  const isStandalone = () => window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent);

  function today() {
    const d = new Date();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + m + "-" + day;
  }

  function minutes(hhmm) {
    const [h, m] = String(hhmm).split(":").map(Number);
    return h * 60 + m;
  }

  function loadLocal() {
    try { return Object.assign({}, DEFAULTS, JSON.parse(localStorage.getItem(KEY) || "{}")); }
    catch (_) { return Object.assign({}, DEFAULTS); }
  }

  function saveLocal(state) {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) {}
  }

  // The service worker reads the same state from Cache Storage, so it can send reminders when the app is closed.
  async function saveShared(state) {
    try {
      const cache = await caches.open(STATE_CACHE);
      await cache.put(STATE_URL, new Response(JSON.stringify(state), { headers: { "Content-Type": "application/json" } }));
    } catch (_) {}
  }

  async function loadShared() {
    try {
      const response = await caches.match(STATE_URL);
      return response ? await response.json() : null;
    } catch (_) { return null; }
  }

  async function currentState() {
    const local = loadLocal();
    const shared = await loadShared();
    if (shared) {
      // Keep the most recent "sent today" date from either place.
      local.lastAyat = [local.lastAyat, shared.lastAyat].sort().pop() || "";
      local.lastIst = [local.lastIst, shared.lastIst].sort().pop() || "";
    }
    return local;
  }

  async function save(state) {
    saveLocal(state);
    await saveShared(state);
  }

  async function registerBackground() {
    try {
      const reg = await navigator.serviceWorker.ready;
      if (!reg.periodicSync) return;
      const status = await navigator.permissions.query({ name: "periodic-background-sync" });
      if (status.state === "granted") {
        await reg.periodicSync.register(SYNC_TAG, { minInterval: 12 * 60 * 60 * 1000 });
      }
    } catch (_) {}
  }

  // Plays the chime while the app is open. Phones may block sound until the user has tapped the page once.
  function playChime() {
    try {
      const audio = new Audio("chime.wav");
      const played = audio.play();
      if (played && played.catch) played.catch(() => {});
    } catch (_) {}
  }

  async function showDue(state) {
    if (!supported || Notification.permission !== "granted" || !state.on) return;
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const day = today();
    let changed = false;
    for (const key of Object.keys(ITEMS)) {
      const item = ITEMS[key];
      if (state[item.last] === day) continue;
      if (nowMin < minutes(state[key])) continue;
      try {
        const reg = await navigator.serviceWorker.ready;
        await reg.showNotification(item.title, {
          body: item.body,
          tag: "lml-" + key,
          icon: "icon-192.png",
          badge: "icon-192.png",
          requireInteraction: true,
          vibrate: [400, 200, 400],
          data: { url: "./" }
        });
        playChime();
        state[item.last] = day;
        changed = true;
      } catch (_) {}
    }
    if (changed) await save(state);
  }

  async function tick() {
    const state = await currentState();
    await showDue(state);
  }

  /* ---------- Settings card ---------- */

  const style = document.createElement("style");
  style.textContent = `
    .lml-rem-times { display: grid; gap: 10px; margin-top: 10px; }
    .lml-rem-times label { display: grid; gap: 4px; font-weight: 600; }
    .lml-rem-times input { font: inherit; padding: 8px 10px; border-radius: 8px; border: 1px solid #c8d0e8; min-height: 44px; max-width: 220px; }
    .lml-rem-status, .lml-rem-note { font-size: 14px; margin: 8px 0 0; }
    .lml-rem-note { opacity: .85; }
  `;
  document.head.appendChild(style);

  const card = document.createElement("div");
  card.className = "card";
  card.id = "lmlRemindersCard";
  card.innerHTML = `
    <h2>🔔 Daily Reminders / Tunatarwa kullum</h2>
    <p>Get a daily reminder to read Ayatul Kursi and Istighfar.</p>
    <p class="lml-rem-status" id="lmlRemStatus" aria-live="polite"></p>
    <div class="btn-row">
      <button class="btn" id="lmlRemToggle" type="button"></button>
      <button class="btn alt" id="lmlRemTest" type="button">🔊 Test sound / Gwada sauti</button>
    </div>
    <div class="lml-rem-times">
      <label>Ayatul Kursi time <input type="time" id="lmlRemAyat"></label>
      <label>Istighfar time <input type="time" id="lmlRemIst"></label>
    </div>
    <p class="lml-rem-note" id="lmlRemNote"></p>`;

  const settings = document.getElementById("settings");
  if (settings) settings.appendChild(card);

  const statusEl = document.getElementById("lmlRemStatus");
  const toggle = document.getElementById("lmlRemToggle");
  const ayatInput = document.getElementById("lmlRemAyat");
  const istInput = document.getElementById("lmlRemIst");
  const noteEl = document.getElementById("lmlRemNote");

  async function render() {
    const state = await currentState();
    ayatInput.value = state.ayat;
    istInput.value = state.ist;
    if (!supported) {
      statusEl.textContent = "Reminders are not supported in this browser.";
      toggle.hidden = true;
    } else if (Notification.permission === "denied") {
      statusEl.textContent = "Notifications are blocked. Allow them in your browser or phone settings, then try again.";
      toggle.textContent = "🔕 Blocked";
      toggle.disabled = true;
    } else {
      toggle.disabled = false;
      toggle.textContent = state.on ? "🔕 Turn off reminders" : "🔔 Turn on reminders";
      statusEl.textContent = state.on ? "Reminders are on." : "Reminders are off.";
    }
    noteEl.textContent = isIOS() && !isStandalone()
      ? "On iPhone, reminders work after you add this app to your Home Screen (iOS 16.4 or later)."
      : "Reminders show while the app is open, and in the background on some phones.";
  }

  toggle.addEventListener("click", async () => {
    if (!supported) return;
    const state = await currentState();
    if (state.on) {
      state.on = false;
      await save(state);
    } else {
      if (Notification.permission === "default") {
        await Notification.requestPermission();
      }
      if (Notification.permission !== "granted") { await render(); return; }
      state.on = true;
      await save(state);
      await registerBackground();
      await showDue(state);
    }
    await render();
  });

  document.getElementById("lmlRemTest").addEventListener("click", () => playChime());

  async function timeChanged() {
    const state = await currentState();
    state.ayat = ayatInput.value || state.ayat;
    state.ist = istInput.value || state.ist;
    await save(state);
  }
  ayatInput.addEventListener("change", timeChanged);
  istInput.addEventListener("change", timeChanged);

  render();
  tick();
  setInterval(tick, 60 * 1000);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) tick(); });
  window.lmlReminderCheck = tick;
})();
