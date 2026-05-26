const CACHE_NAME = 'meals-cache-v1';

// Static assets to cache immediately upon installation
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/pavicon.svg'
];

// Install Event: cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate Event: clear old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event: Stale-While-Revalidate caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Cache strategy: Stale-while-revalidate for local assets and API data
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          const fetchPromise = fetch(request).then((networkResponse) => {
            // Only cache successful GET requests
            if (request.method === 'GET' && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          }).catch((error) => {
            console.error('[Service Worker] Fetch failed:', error);
            // Return cached response if offline fetch fails, otherwise propagate error
            if (cachedResponse) return cachedResponse;
            throw error;
          });

          // Return cached response instantly if available, otherwise fetch from network
          return cachedResponse || fetchPromise;
        });
      })
    );
  }
});
