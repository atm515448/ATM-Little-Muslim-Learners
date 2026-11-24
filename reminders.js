/* Daily reminders for Ayatul Kursi and Istighfar. On by default: the app asks for notification permission once, and then sends a reminder every 2 hours from 7 am to 7 pm. Works while the app is open; in the background on some phones. */
"use strict";
(function () {
  const KEY = "lmlRemindersV2";
  const STATE_CACHE = "lml-reminder-state";
  const STATE_URL = "./__reminder-state__.json";
  const SYNC_TAG = "lml-daily-reminders";
  // Reminder times (hours, 24-hour clock). Alternates Ayatul Kursi and Istighfar.
  const SLOTS = [7, 9, 11, 13, 15, 17, 19];
  const ITEMS = [
    {
      title: "Ayatul Kursi",
      body: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ. Allah: there is no deity except Him, the Ever-Living, the Sustainer of existence.",
      audio: "ayatul-kursi.mp3"
    },
    {
      title: "Istighfar",
      body: "أَسْتَغْفِرُ اللهَ الْعَظِيمَ وَأَتُوبُ إِلَيْهِ. I seek forgiveness from Allah, the Mighty, and turn to Him in repentance.",
      audio: "istighfar.mp3"
    }
  ];
  const DEFAULTS = { on: true, lastSent: "" };

  const supported = "Notification" in window && "serviceWorker" in navigator;
  const isStandalone = () => window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent);

  function today() {
    const d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  // The latest reminder time that has come up today, or null outside 7 am to 7 pm.
  function currentSlot(now) {
    const h = now.getHours();
    if (h < SLOTS[0] || h >= SLOTS[SLOTS.length - 1] + 1) return null;
    let slot = null;
    for (const s of SLOTS) if (s <= h) slot = s;
    return slot;
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

  /* ---------- Sound: one recording at a time, with Stop ---------- */

  let currentSound = null;
  const TEST_LABEL = "🔊 Test sound / Gwada sauti";
  const STOP_LABEL = "⏹ Stop / Tsaya";

  function setTestLabel(playing) {
    const testButton = document.getElementById("lmlRemTest");
    if (testButton) testButton.textContent = playing ? STOP_LABEL : TEST_LABEL;
  }

  function stopSound() {
    if (currentSound) { currentSound.pause(); currentSound.currentTime = 0; currentSound = null; }
    setTestLabel(false);
  }

  function playFile(src, fallbackChime) {
    try {
      stopSound();
      const audio = new Audio(src);
      currentSound = audio;
      audio.onended = () => { if (currentSound === audio) { currentSound = null; setTestLabel(false); } };
      audio.onerror = () => { if (fallbackChime && currentSound === audio) playFile("chime.wav", false); };
      const played = audio.play();
      if (played && played.catch) played.catch(() => {});
      setTestLabel(true);
    } catch (_) {}
  }

  function playChime() { playFile("chime.wav", false); }

  /* ---------- Reminders ---------- */

  async function showDue(state) {
    if (!supported || Notification.permission !== "granted" || !state.on) return;
    const now = new Date();
    const slot = currentSlot(now);
    if (slot === null) return;
    const key = today() + "-" + slot;
    if (state.lastSent === key) return;
    const item = ITEMS[SLOTS.indexOf(slot) % ITEMS.length];
    try {
      const reg = await navigator.serviceWorker.ready;
      await reg.showNotification(item.title, {
        body: item.body,
        tag: "lml-reminder",
        icon: "icon-192.png",
        badge: "icon-192.png",
        requireInteraction: true,
        vibrate: [400, 200, 400],
        data: { url: "./" }
      });
      playFile(item.audio, true);
      state.lastSent = key;
      await save(state);
    } catch (_) {}
  }

  async function currentState() {
    const local = loadLocal();
    try {
      const response = await caches.match(STATE_URL);
      if (response) {
        const shared = await response.json();
        if (shared && shared.lastSent && shared.lastSent > (local.lastSent || "")) local.lastSent = shared.lastSent;
      }
    } catch (_) {}
    return local;
  }

  async function tick() {
    const state = await currentState();
    await showDue(state);
  }

  // Ask for permission once, the first time the user taps anywhere (phones often require a tap first).
  async function askPermission() {
    if (!supported || Notification.permission !== "default") return;
    try { await Notification.requestPermission(); } catch (_) {}
    await render();
    if (Notification.permission === "granted") {
      const state = await currentState();
      await save(state);
      await registerBackground();
      await tick();
    }
  }
  document.addEventListener("click", askPermission, { once: true });
  document.addEventListener("touchend", askPermission, { once: true });

  /* ---------- Settings card ---------- */

  const style = document.createElement("style");
  style.textContent = `
    .lml-rem-status, .lml-rem-note { font-size: 14px; margin: 8px 0 0; }
    .lml-rem-note { opacity: .85; }
  `;
  document.head.appendChild(style);

  const card = document.createElement("div");
  card.className = "card";
  card.id = "lmlRemindersCard";
  card.innerHTML = `
    <h2>🔔 Daily Reminders / Tunatarwa kullum</h2>
    <p>Ayatul Kursi and Istighfar, every 2 hours from 7 am to 7 pm. / Ayatul Kursi da Istighfar, kowace awa 2 daga 7 na safe zuwa 7 na yamma.</p>
    <p class="lml-rem-status" id="lmlRemStatus" aria-live="polite"></p>
    <div class="btn-row">
      <button class="btn" id="lmlRemToggle" type="button"></button>
      <button class="btn alt" id="lmlRemTest" type="button">🔊 Test sound / Gwada sauti</button>
    </div>
    <p class="lml-rem-note" id="lmlRemNote"></p>`;

  const settings = document.getElementById("settings");
  if (settings) settings.appendChild(card);

  const statusEl = document.getElementById("lmlRemStatus");
  const toggle = document.getElementById("lmlRemToggle");
  const noteEl = document.getElementById("lmlRemNote");

  async function render() {
    const state = await currentState();
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
      if (Notification.permission === "default") await Notification.requestPermission();
      if (Notification.permission !== "granted") { await render(); return; }
      state.on = true;
      await save(state);
      await registerBackground();
      await showDue(state);
    }
    await render();
  });

  const testBtnEl = document.getElementById("lmlRemTest");
  if (testBtnEl) testBtnEl.addEventListener("click", () => {
    if (currentSound) { stopSound(); return; }
    playChime();
  });

  // Let other parts of the app stop the reminder sound (for example, when another recording starts).
  window.lmlStopReminderSound = stopSound;

  render();
  tick();
  setInterval(tick, 60 * 1000);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) tick(); });
  window.lmlReminderCheck = tick;
})();
