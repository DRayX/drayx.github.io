const CACHE_NAME = 'feebas-v1';
const FILES = [
  './favicon.ico',
  './feebas.css',
  './feebas.js',
  './index.html',
  './map.png',
  './tiles.js',
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(FILES);
    await self.skipWaiting();
  })());
});

self.addEventListener('fetch', event => {
  event.respondWith((async () => {
    let response = await caches.match(event.request);
    if (response) { return response; }
    response = await fetch(event.request);
    const cache = await caches.open(CACHE_NAME);
    await cache.put(event.request, response.clone());
    return response;
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(key => {
      if (key === CACHE_NAME) { return; }
      return caches.delete(key);
    }));
    await self.clients.claim();
  })());
});
