/* Prayer times and Adhan reminders. Times are calculated on the phone from the location (Fajr 18°, Isha 18°, Shafi'i Asr). Works offline. Confirm with your local mosque. */
"use strict";
(function () {
  const KEY = "lmlPrayer";
  const LOC_KEY = "lmlPrayerLocation";
  const PRAYERS = [
    { id: "fajr", en: "Fajr", ha: "Asuba" },
    { id: "dhuhr", en: "Dhuhr", ha: "Azahar" },
    { id: "asr", en: "Asr", ha: "La'asar" },
    { id: "maghrib", en: "Maghrib", ha: "Magariba" },
    { id: "isha", en: "Isha", ha: "Isha'i" }
  ];
  const rad = d => d * Math.PI / 180;
  const deg = r => r * 180 / Math.PI;

  function fixHours(h) { return ((h % 24) + 24) % 24; }

  // Sun declination (degrees) and equation of time (hours) for a Julian day.
  function sunData(jd) {
    const d = jd - 2451545.0;
    const g = rad((357.529 + 0.98560028 * d) % 360);
    const q = ((280.459 + 0.98564736 * d) % 360 + 360) % 360;
    const L = rad((q + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g)) % 360);
    const e = rad(23.439 - 0.00000036 * d);
    const ra = deg(Math.atan2(Math.cos(e) * Math.sin(L), Math.cos(L))) / 15; // hours
    const decl = deg(Math.asin(Math.sin(e) * Math.sin(L)));
    let eqt = q / 15 - ra;
    if (eqt > 12) eqt -= 24;
    if (eqt < -12) eqt += 24;
    return { decl, eqt };
  }

  // Hour offset from solar noon for a sun altitude angle; null if the sun never reaches it.
  function hourAngle(lat, decl, altitude) {
    const c = (Math.sin(rad(altitude)) - Math.sin(rad(lat)) * Math.sin(rad(decl))) / (Math.cos(rad(lat)) * Math.cos(rad(decl)));
    if (c > 1 || c < -1) return null;
    return deg(Math.acos(c)) / 15;
  }

  // Returns local clock hours for each prayer on the given date.
  function calculate(date, lat, lng) {
    const utcNoon = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 12) / 86400000 + 2440587.5;
    const sun = sunData(utcNoon);
    const tz = -date.getTimezoneOffset() / 60;
    const transit = 12 + tz - lng / 15 - sun.eqt;
    // Shafi'i Asr: shadow equals object length plus the object's own length.
    const asrAlt = deg(Math.atan(1 / (1 + Math.tan(Math.abs(rad(lat - sun.decl))))));
    const hFajr = hourAngle(lat, sun.decl, -18);
    const hIsha = hourAngle(lat, sun.decl, -18);
    const hRise = hourAngle(lat, sun.decl, -0.833);
    const hAsr = hourAngle(lat, sun.decl, asrAlt);
    const sunrise = hRise === null ? null : transit - hRise;
    const maghrib = hRise === null ? null : transit + hRise;
    // In far-northern or far-southern places in summer the sun never sinks to -17 or -18 degrees.
    // Then Fajr and Isha fall back to 90 minutes before sunrise and after sunset.
    const fajr = hFajr !== null ? transit - hFajr : (sunrise === null ? null : sunrise - 1.5);
    const isha = hIsha !== null ? transit + hIsha : (maghrib === null ? null : maghrib + 1.5);
    return {
      fajr: fajr === null ? null : fixHours(fajr),
      sunrise: sunrise === null ? null : fixHours(sunrise),
      dhuhr: fixHours(transit),
      asr: hAsr === null ? null : fixHours(transit + hAsr),
      maghrib: maghrib === null ? null : fixHours(maghrib),
      isha: isha === null ? null : fixHours(isha)
    };
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
      <button class="btn alt" id="lmlPtTest" type="button">🔊 Test sound / Gwada sauti</button>
    </div>
    <p class="lml-pt-note">These times are calculated for your location. Please confirm with your local mosque. / Ka tabbatar da lokutan da masallacin unguwarku.</p>`;
  const home = document.getElementById("home");
  if (home) home.appendChild(card);

  const statusEl = document.getElementById("lmlPtStatus");
  const listEl = document.getElementById("lmlPtList");
  const locateBtn = document.getElementById("lmlPtLocate");
  const adhanBtn = document.getElementById("lmlPtAdhan");

  function currentLocation() {
    return load(LOC_KEY, {});
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
    const state = load(KEY, { on: false });
    adhanBtn.textContent = state.on ? "🔕 Turn off Adhan reminders" : "🔔 Turn on Adhan reminders";
  }

  locateBtn.addEventListener("click", () => {
    if (!navigator.geolocation) { statusEl.textContent = "Location is not available on this device."; return; }
    statusEl.textContent = "Finding your location... / Ana nemo wurin ka...";
    navigator.geolocation.getCurrentPosition(pos => {
      save(LOC_KEY, { lat: pos.coords.latitude, lng: pos.coords.longitude, at: Date.now() });
      render();
    }, () => {
      statusEl.textContent = "Location permission is needed. Allow it in your phone settings, then try again.";
    }, { enableHighAccuracy: false, timeout: 15000, maximumAge: 3600000 });
  });

  adhanBtn.addEventListener("click", async () => {
    const state = load(KEY, { on: false });
    if (state.on) {
      state.on = false;
      save(KEY, state);
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
    render();
    checkDue();
  });

  // Plays the Adhan chime while the app is open. Phones may block sound until the user has tapped the page once.
  function playChime() {
    try {
      const audio = new Audio("chime.wav");
      const played = audio.play();
      if (played && played.catch) played.catch(() => {});
    } catch (_) {}
  }

  document.getElementById("lmlPtTest").addEventListener("click", () => playChime());

  // Sends one reminder per prayer per day, while the app is open or the next time it opens.
  async function checkDue() {
    const state = load(KEY, { on: false });
    const loc = currentLocation();
    if (!state.on || typeof loc.lat !== "number" || Notification.permission !== "granted") return;
    const now = new Date();
    const times = calculate(now, loc.lat, loc.lng);
    const day = dayString(now);
    state.sent = state.sent || {};
    let changed = false;
    for (const p of PRAYERS) {
      if (times[p.id] === null) continue;
      const key = p.id;
      if (state.sent[key] === day) continue;
      if (now < atDate(now, times[p.id])) continue;
      try {
        const reg = await navigator.serviceWorker.ready;
        await reg.showNotification("Time for " + p.en + " / Lokacin " + p.ha, {
          body: "It is time for " + p.en + " prayer. Allahu Akbar.",
          tag: "lml-prayer-" + key,
          icon: "icon-192.png",
          badge: "icon-192.png",
          requireInteraction: true,
          vibrate: [600, 300, 600],
          data: { url: "./" }
        });
        playChime();
        state.sent[key] = day;
        changed = true;
      } catch (_) {}
    }
    if (changed) save(KEY, state);
  }

  render();
  checkDue();
  setInterval(() => { render(); checkDue(); }, 60 * 1000);
  window.lmlPrayerCalculate = calculate;
})();
