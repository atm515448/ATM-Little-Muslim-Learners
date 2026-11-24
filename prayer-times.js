/* Prayer times card and Adhan reminders. Times come from prayer-calc.js (calculated on the phone, works offline). Confirm with your local mosque. */
"use strict";
(function () {
  const KEY = "lmlPrayer";
  const LOC_KEY = "lmlPrayerLocation";
  const SHARED_CACHE = "lml-reminder-state";
  const SHARED_URL = "./__prayer-state__.json";
  const SYNC_TAG = "lml-prayer-check";
  const ADHAN_SRC = "adhan-kiran-sallah.mp3";
  const PRAYERS = [
    { id: "fajr", en: "Fajr", ha: "Asuba" },
    { id: "dhuhr", en: "Dhuhr", ha: "Azahar" },
    { id: "asr", en: "Asr", ha: "La'asar" },
    { id: "maghrib", en: "Maghrib", ha: "Magariba" },
    { id: "isha", en: "Isha", ha: "Isha'i" }
  ];

  function calculate(date, lat, lng) {
    return window.LMLPrayer.calculate(date, lat, lng);
  }

  function clock(hours) {
    if (hours === null) return "--:--";
    const total = Math.round(hours * 60);
    const h = Math.floor(total / 60) % 24, m = total % 60;
    return String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0");
  }

  function atDate(date, hours) {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    d.setMinutes(Math.round(hours * 60));
    return d;
  }

  function dayString(d) {
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  function load(key, fallback) {
    try { return Object.assign({}, fallback, JSON.parse(localStorage.getItem(key) || "{}")); }
    catch (_) { return Object.assign({}, fallback); }
  }

  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) {}
  }

  // The service worker reads the same settings from Cache Storage, so it can send prayer reminders when the app is closed.
  async function saveShared(state) {
    try {
      const cache = await caches.open(SHARED_CACHE);
      await cache.put(SHARED_URL, new Response(JSON.stringify(state), { headers: { "Content-Type": "application/json" } }));
    } catch (_) {}
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

  const style = document.createElement("style");
  style.textContent = `
    .lml-pt-list { display: grid; gap: 6px; list-style: none; padding: 0; margin: 0; }
    .lml-pt-list li { display: flex; justify-content: space-between; padding: 8px 12px; border-radius: 10px; border: 1px solid currentColor; }
    .lml-pt-list li.next { background: rgba(38, 163, 96, 0.18); font-weight: 700; }
    .lml-pt-list time { font-variant-numeric: tabular-nums; }
    .lml-pt-note { font-size: 13px; opacity: .85; margin: 0; }
  `;
  document.head.appendChild(style);

  const card = document.createElement("div");
  card.className = "card";
  card.id = "lmlPrayerTimes";
  card.innerHTML = `
    <h2>🕌 Prayer Times / Lokacin Sallah</h2>
    <p id="lmlPtStatus" aria-live="polite"></p>
    <ul class="lml-pt-list" id="lmlPtList"></ul>
    <div class="btn-row">
      <button class="btn" id="lmlPtLocate" type="button">📍 Use my location / Yi amfani da wurina</button>
      <button class="btn alt" id="lmlPtAdhan" type="button"></button>
      <button class="btn alt" id="lmlPtTest" type="button">🔊 Test Adhan / Gwada Kiran Sallah</button>
    </div>
    <p class="lml-pt-note">These times are calculated for your location. Please confirm with your local mosque. / Ka tabbatar da lokutan da masallacin unguwarku.</p>`;
  const home = document.getElementById("home");
  if (home) home.appendChild(card);

  const statusEl = document.getElementById("lmlPtStatus");
  const listEl = document.getElementById("lmlPtList");
  const locateBtn = document.getElementById("lmlPtLocate");
  const adhanBtn = document.getElementById("lmlPtAdhan");
  const testBtn = document.getElementById("lmlPtTest");

  function currentLocation() {
    return load(LOC_KEY, {});
  }

  function sharedState() {
    const loc = currentLocation();
    const state = load(KEY, { on: false, sent: {} });
    return { on: !!state.on, lat: loc.lat, lng: loc.lng, sent: state.sent || {} };
  }

  function render() {
    const loc = currentLocation();
    const toggle = load(KEY, { on: false });
    adhanBtn.textContent = toggle.on ? "🔕 Turn off Adhan reminders" : "🔔 Turn on Adhan reminders";
    if (typeof loc.lat !== "number") {
      statusEl.textContent = "Tap the button to find prayer times for where you are.";
      listEl.innerHTML = "";
      return;
    }
    const now = new Date();
    const times = calculate(now, loc.lat, loc.lng);
    const nowHours = now.getHours() + now.getMinutes() / 60;
    let nextId = null;
    for (const p of PRAYERS) {
      if (times[p.id] !== null && times[p.id] > nowHours) { nextId = p.id; break; }
    }
    listEl.innerHTML = PRAYERS.map(p => `
      <li class="${p.id === nextId ? "next" : ""}">
        <span>${p.en} / ${p.ha}</span><time>${clock(times[p.id])}</time>
      </li>`).join("");
    statusEl.textContent = nextId
      ? "Next prayer: " + PRAYERS.find(p => p.id === nextId).en + " / Sallah ta gaba"
      : "All prayers for today have passed. / Dukkan Sallolin yau sun wuce.";
  }

  // Plays the Adhan recording while the app is open. Phones may block sound until the user has tapped the page once.
  function playAdhan() {
    try {
      const audio = new Audio(ADHAN_SRC);
      const played = audio.play();
      if (played && played.catch) played.catch(() => {});
    } catch (_) {}
  }

  locateBtn.addEventListener("click", () => {
    if (!navigator.geolocation) { statusEl.textContent = "Location is not available on this device."; return; }
    statusEl.textContent = "Finding your location... / Ana nemo wurin ka...";
    navigator.geolocation.getCurrentPosition(pos => {
      save(LOC_KEY, { lat: pos.coords.latitude, lng: pos.coords.longitude, at: Date.now() });
      const state = load(KEY, { on: false, sent: {} });
      saveShared(sharedState());
      render();
    }, () => {
      statusEl.textContent = "Location permission is needed. Allow it in your phone settings, then try again.";
    }, { enableHighAccuracy: false, timeout: 15000, maximumAge: 3600000 });
  });

  testBtn.addEventListener("click", () => playAdhan());

  adhanBtn.addEventListener("click", async () => {
    const state = load(KEY, { on: false, sent: {} });
    if (state.on) {
      state.on = false;
      save(KEY, state);
      await saveShared(sharedState());
      render();
      return;
    }
    if (!("Notification" in window)) { statusEl.textContent = "Notifications are not supported in this browser."; return; }
    if (Notification.permission === "default") await Notification.requestPermission();
    if (Notification.permission !== "granted") {
      statusEl.textContent = "Notifications are blocked. Allow them in your browser or phone settings.";
      return;
    }
    state.on = true;
    save(KEY, state);
    await saveShared(sharedState());
    await registerBackground();
    render();
    checkDue();
  });

  // Sends one reminder per prayer per day, while the app is open. The service worker also checks when the phone allows it.
  async function checkDue() {
    const state = load(KEY, { on: false, sent: {} });
    const loc = currentLocation();
    if (!state.on || typeof loc.lat !== "number" || !("Notification" in window) || Notification.permission !== "granted") return;
    const now = new Date();
    const times = calculate(now, loc.lat, loc.lng);
    const day = dayString(now);
    state.sent = state.sent || {};
    // Use the service worker's record too, so a prayer sent in the background is not sent twice.
    try {
      const cache = await caches.open(SHARED_CACHE);
      const response = await cache.match(SHARED_URL);
      const shared = response ? await response.json() : null;
      if (shared && shared.sent) {
        for (const k of Object.keys(shared.sent)) {
          if (shared.sent[k] === day) state.sent[k] = day;
        }
      }
    } catch (_) {}
    let changed = false;
    for (const p of PRAYERS) {
      if (times[p.id] === null) continue;
      if (state.sent[p.id] === day) continue;
      if (now < atDate(now, times[p.id])) continue;
      try {
        const reg = await navigator.serviceWorker.ready;
        await reg.showNotification("Time for " + p.en + " / Lokacin " + p.ha, {
          body: "It is time for " + p.en + " prayer. Allahu Akbar.",
          tag: "lml-prayer-" + p.id,
          icon: "icon-192.png",
          badge: "icon-192.png",
          requireInteraction: true,
          vibrate: [600, 300, 600],
          data: { url: "./" }
        });
        playAdhan();
        state.sent[p.id] = day;
        changed = true;
      } catch (_) {}
    }
    if (changed) {
      save(KEY, state);
      await saveShared(sharedState());
    }
  }

  render();
  checkDue();
  setInterval(() => { render(); checkDue(); }, 60 * 1000);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) { render(); checkDue(); } });
  window.lmlPrayerCalculate = calculate;
})();
