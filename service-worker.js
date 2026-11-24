/* ATM Little Muslim Learners — offline-first service worker */
"use strict";

const CACHE_NAME = "atm-little-muslim-learners-v27";

/* Prayer times are calculated in the service worker too, so reminders can be sent when the app is closed. */
importScripts("./prayer-calc.js");

/* Web data the app reads (Quran text, reciters, Hadith text). Saved the first time it is opened, then used offline. Audio is not saved. */
const DATA_HOSTS = ["quranenc.com", "mp3quran.net", "cdn.jsdelivr.net", "data.alhudamedia.com"];
const APP_FILES = [
  "./", "./index.html", "./style.css", "./quran-reader.css", "./dictionary.css", "./dictionary.js", "./dictionary-data.js",
  "./data.js", "./script.js", "./quran-reader.js",
  "./harakat-practice.js", "./asmaul-husna.js", "./hisnul-muslim.js",
  "./hadith.js", "./firebase.js", "./catalogue.json", "./manifest.json", "./tasbih.js", "./install-app.js", "./install-popup.js", "./reminders.js", "./daily-checklist.js", "./badges.js", "./share-feedback.js", "./qibla.js", "./prayer-times.js", "./privacy-policy.html", "./chime.wav", "./hisnul-hausa.js", "./prayer-calc.js", "./adhan-kiran-sallah.mp3", "./morning-azkar.mp3", "./evening-azkar.mp3", "./istighfar.mp3", "./one-audio.js", "./ATM-LML-brand-logo.png",
  "./logo.png", "./icon-192.png", "./icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await Promise.all(APP_FILES.map(async file => {
      try { await cache.add(file); }
      catch (error) { console.warn("ATM LML: could not cache", file, error); }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(key => {
      if (key.startsWith("atm-little-muslim-learners-") && key !== CACHE_NAME) {
        return caches.delete(key);
      }
      return Promise.resolve(false);
    }));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) {
    if (!DATA_HOSTS.includes(url.hostname)) return;
    event.respondWith((async () => {
      const cached = await caches.match(request);
      if (cached) return cached;
      try {
        const response = await fetch(request);
        if (response && response.ok && response.status === 200 && response.type === "cors") {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(request, response.clone());
        }
        return response;
      } catch (_) { return Response.error(); }
    })());
    return;
  }

  // Audio is asked for in parts (Range). Answer those from the saved full file, so seeking works offline.
  if (request.headers.has("range")) {
    event.respondWith((async () => {
      const cached = await caches.match(request.url);
      if (cached) return rangeResponse(cached, request.headers.get("range"));
      try { return await fetch(request); } catch (_) { return Response.error(); }
    })());
    return;
  }

  if (request.mode === "navigate") {
    // Open the saved copy of this page at once, and save the newest copy in the background.
    // Each page is saved under its own address, so the privacy page never replaces the home page.
    const network = fetch(request).then(async response => {
      if (response && response.ok) {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(request, response.clone());
      }
      return response;
    }).catch(() => null);
    event.respondWith((async () => {
      const cached = await caches.match(request);
      if (cached) { event.waitUntil(network); return cached; }
      return (await network) || (await caches.match("./index.html")) || Response.error();
    })());
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response && response.ok && response.type !== "opaque") {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(request, response.clone());
      }
      return response;
    } catch (_) { return Response.error(); }
  })());
});

/* ---------- DAILY REMINDERS (Ayatul Kursi and Istighfar) ---------- */
const REMINDER_CACHE = "lml-reminder-state";
const REMINDER_URL = "./__reminder-state__.json";
const REMINDER_SYNC_TAG = "lml-daily-reminders";
const PRAYER_SYNC_TAG = "lml-prayer-check";
const PRAYER_STATE_URL = "./__prayer-state__.json";
const PRAYER_NAMES = [
  { id: "fajr", en: "Fajr", ha: "Asuba" },
  { id: "dhuhr", en: "Dhuhr", ha: "Azahar" },
  { id: "asr", en: "Asr", ha: "La'asar" },
  { id: "maghrib", en: "Maghrib", ha: "Magariba" },
  { id: "isha", en: "Isha", ha: "Isha'i" }
];

function rangeResponse(cached, rangeHeader) {
  return cached.blob().then(blob => {
    const m = /bytes=(\d*)-(\d*)/.exec(rangeHeader || "");
    let start = 0, end = blob.size - 1;
    if (m && m[1]) start = parseInt(m[1], 10);
    if (m && m[2]) end = parseInt(m[2], 10);
    if (m && !m[1] && m[2]) start = Math.max(0, blob.size - parseInt(m[2], 10));
    end = Math.min(end, blob.size - 1);
    const part = blob.slice(start, end + 1);
    return new Response(part, {
      status: 206,
      statusText: "Partial Content",
      headers: {
        "Content-Type": cached.headers.get("Content-Type") || "audio/mpeg",
        "Content-Range": "bytes " + start + "-" + end + "/" + blob.size,
        "Content-Length": String(part.size),
        "Accept-Ranges": "bytes"
      }
    });
  });
}

async function showDuePrayers() {
  try {
    const cached = await caches.match(PRAYER_STATE_URL);
    if (!cached) return;
    const state = await cached.json();
    if (!state || !state.on || typeof state.lat !== "number" || self.Notification.permission !== "granted") return;
    const now = new Date();
    const day = reminderToday();
    const times = self.LMLPrayer.calculate(now, state.lat, state.lng);
    state.sent = state.sent || {};
    let changed = false;
    for (const p of PRAYER_NAMES) {
      if (times[p.id] === null || state.sent[p.id] === day) continue;
      const due = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      due.setMinutes(Math.round(times[p.id] * 60));
      if (now < due) continue;
      await self.registration.showNotification("Time for " + p.en + " / Lokacin " + p.ha, {
        body: "It is time for " + p.en + " prayer. Allahu Akbar.",
        tag: "lml-prayer-" + p.id,
        icon: "icon-192.png",
        badge: "icon-192.png",
        requireInteraction: true,
        vibrate: [600, 300, 600],
        data: { url: "./" }
      });
      state.sent[p.id] = day;
      changed = true;
    }
    if (changed) {
      const store = await caches.open("lml-reminder-state");
      await store.put(PRAYER_STATE_URL, new Response(JSON.stringify(state), { headers: { "Content-Type": "application/json" } }));
    }
  } catch (error) {
    console.warn("ATM LML: prayer check failed", error);
  }
}
const REMINDER_SLOTS = [7, 9, 11, 13, 15, 17, 19];
const REMINDER_ITEMS = [
  {
    title: "Ayatul Kursi",
    body: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ. Allah: there is no deity except Him, the Ever-Living, the Sustainer of existence."
  },
  {
    title: "Istighfar",
    body: "أَسْتَغْفِرُ اللهَ الْعَظِيمَ وَأَتُوبُ إِلَيْهِ. I seek forgiveness from Allah, the Mighty, and turn to Him in repentance."
  }
];

function reminderToday() {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

async function showDueReminders() {
  try {
    const cached = await caches.match(REMINDER_URL);
    if (!cached) return;
    const state = await cached.json();
    if (!state || !state.on || self.Notification.permission !== "granted") return;
    const h = new Date().getHours();
    if (h < REMINDER_SLOTS[0] || h >= REMINDER_SLOTS[REMINDER_SLOTS.length - 1] + 1) return;
    let slot = null;
    for (const s of REMINDER_SLOTS) if (s <= h) slot = s;
    const key = reminderToday() + "-" + slot;
    if (state.lastSent === key) return;
    const item = REMINDER_ITEMS[REMINDER_SLOTS.indexOf(slot) % REMINDER_ITEMS.length];
    await self.registration.showNotification(item.title, {
      body: item.body,
      tag: "lml-reminder",
      icon: "icon-192.png",
      badge: "icon-192.png",
      requireInteraction: true,
      vibrate: [400, 200, 400],
      data: { url: "./" }
    });
    state.lastSent = key;
    const store = await caches.open(REMINDER_CACHE);
    await store.put(REMINDER_URL, new Response(JSON.stringify(state), { headers: { "Content-Type": "application/json" } }));
  } catch (error) {
    console.warn("ATM LML: reminder check failed", error);
  }
}

self.addEventListener("periodicsync", event => {
  if (event.tag === REMINDER_SYNC_TAG) event.waitUntil(showDueReminders());
  if (event.tag === PRAYER_SYNC_TAG) event.waitUntil(showDuePrayers());
});

self.addEventListener("notificationclick", event => {
  event.notification.close();
  event.waitUntil((async () => {
    const clientList = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const client of clientList) {
      if ("focus" in client) return client.focus();
    }
    if (self.clients.openWindow) return self.clients.openWindow("./");
  })());
});
