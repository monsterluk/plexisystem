// Minimal Service Worker - no caching
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      // Delete all caches
      return Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Don't cache anything - just pass through
self.addEventListener('fetch', event => {
  event.respondWith(fetch(event.request));
});
