/* ATM Little Muslim Learners — offline-first service worker */
"use strict";

const CACHE_NAME = "atm-little-muslim-learners-v20";

/* Web data the app reads (Quran text, reciters, Hadith text). Saved the first time it is opened, then used offline. Audio is not saved. */
const DATA_HOSTS = ["quranenc.com", "mp3quran.net", "cdn.jsdelivr.net", "data.alhudamedia.com"];
const APP_FILES = [
  "./", "./index.html", "./style.css", "./quran-reader.css", "./dictionary.css", "./dictionary.js", "./dictionary-data.js",
  "./data.js", "./script.js", "./quran-reader.js",
  "./harakat-practice.js", "./asmaul-husna.js", "./hisnul-muslim.js",
  "./hadith.js", "./firebase.js", "./catalogue.json", "./manifest.json", "./tasbih.js", "./install-app.js", "./install-popup.js", "./reminders.js", "./daily-checklist.js", "./badges.js", "./share-feedback.js", "./qibla.js", "./prayer-times.js", "./ATM-LML-brand-logo.png",
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

  if (request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response && response.ok) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put("./index.html", response.clone());
        }
        return response;
      } catch (_) {
        return (await caches.match("./index.html")) || Response.error();
      }
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
const REMINDER_ITEMS = {
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

function reminderToday() {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

function reminderMinutes(hhmm) {
  const [h, m] = String(hhmm || "0:0").split(":").map(Number);
  return h * 60 + m;
}

async function showDueReminders() {
  try {
    const cached = await caches.match(REMINDER_URL);
    if (!cached) return;
    const state = await cached.json();
    if (!state || !state.on || self.Notification.permission !== "granted") return;
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const day = reminderToday();
    let changed = false;
    for (const key of Object.keys(REMINDER_ITEMS)) {
      const item = REMINDER_ITEMS[key];
      if (state[item.last] === day) continue;
      if (nowMin < reminderMinutes(state[key])) continue;
      await self.registration.showNotification(item.title, {
        body: item.body,
        tag: "lml-" + key,
        icon: "icon-192.png",
        badge: "icon-192.png",
        data: { url: "./" }
      });
      state[item.last] = day;
      changed = true;
    }
    if (changed) {
      const store = await caches.open(REMINDER_CACHE);
      await store.put(REMINDER_URL, new Response(JSON.stringify(state), { headers: { "Content-Type": "application/json" } }));
    }
  } catch (error) {
    console.warn("ATM LML: reminder check failed", error);
  }
}

self.addEventListener("periodicsync", event => {
  if (event.tag === REMINDER_SYNC_TAG) event.waitUntil(showDueReminders());
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
