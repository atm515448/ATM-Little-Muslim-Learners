/* ATM Little Muslim Learners
   Offline-first service worker
   ATM Digital Solutions & Services
*/
"use strict";

const CACHE_NAME = "atm-little-muslim-learners-v4";

const APP_FILES = [
  "./",
  "./index.html",
  "./style.css",
  "./data.js",
  "./script.js",
  "./harakat-practice.js",
  "./asmaul-husna.js",
  "./hisnul-muslim.js",
  "./hadith.js",
  "./firebase.js",
  "./catalogue.json",
  "./manifest.json",
  "./logo.png",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);

    await Promise.all(APP_FILES.map(async file => {
      try {
        await cache.add(file);
      } catch (error) {
        console.warn("ATM LML: could not cache", file, error);
      }
    }));

    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();

    await Promise.all(keys.map(key => {
      const isOldAppCache =
        key.startsWith("atm-little-muslim-learners-") &&
        key !== CACHE_NAME;

      return isOldAppCache ? caches.delete(key) : Promise.resolve(false);
    }));

    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  const request = event.request;

  if (request.method !== "GET") return;

  const requestUrl = new URL(request.url);

  if (requestUrl.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);

        if (response && response.ok) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put("./index.html", response.clone());
        }

        return response;
      } catch (error) {
        const offlinePage = await caches.match("./index.html");
        return offlinePage || Response.error();
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
    } catch (error) {
      return Response.error();
    }
  })());
});
