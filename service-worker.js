/* ATM Little Muslim Learners — offline-first service worker */
"use strict";

const CACHE_NAME = "atm-little-muslim-learners-v14";

/* Web data the app reads (Quran text, reciters, Hadith text). Saved the first time it is opened, then used offline. Audio is not saved. */
const DATA_HOSTS = ["quranenc.com", "mp3quran.net", "cdn.jsdelivr.net", "data.alhudamedia.com"];
const APP_FILES = [
  "./", "./index.html", "./style.css", "./quran-reader.css", "./dictionary.css", "./dictionary.js", "./dictionary-data.js",
  "./data.js", "./script.js", "./quran-reader.js",
  "./harakat-practice.js", "./asmaul-husna.js", "./hisnul-muslim.js",
  "./hadith.js", "./firebase.js", "./catalogue.json", "./manifest.json", "./tasbih.js", "./install-app.js", "./install-popup.js", "./ATM-LML-brand-logo.png",
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
