const CACHE_NAME = "radioport-v1-cache";
const FILES_TO_CACHE = [
  "index.html",
  "style.css",
  "manifest.json",
  "icon-192.png",
  "icon-256.png",
  "icon-512.png",
  "favicon.ico"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => {
    return cache.addAll(FILES_TO_CACHE);
  }));
});

self.addEventListener("fetch", (event) => {
  event.respondWith(caches.match(event.request).then((response) => {
    return response || fetch(event.request);
  }));
});
