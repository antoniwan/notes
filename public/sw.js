/**
 * Retired service worker.
 *
 * Notes used to register a caching worker at /sw.js. It is gone, but browsers
 * that installed it keep running it until it removes itself, and they look for
 * updates at this same URL (with the old ?v= query, which the static host
 * ignores). This file is that update: it has no fetch handler, so every request
 * goes straight to the network from the moment it installs, and on activation
 * it deletes the old `notes-` caches and unregisters.
 *
 * Keep this file in place. Deleting it would leave returning readers on the old
 * worker, because a 404 on update leaves the installed worker running.
 */

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      // Only the old worker's caches. Anything else on this origin is not ours.
      await Promise.all(
        names.filter((name) => name.startsWith('notes-')).map((name) => caches.delete(name)),
      );
      await self.registration.unregister();
    })(),
  );
});
