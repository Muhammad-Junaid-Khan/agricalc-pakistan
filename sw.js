/* Service Worker for AgriCalc Pakistan */
const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `agri-cache-${CACHE_VERSION}`;
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/contact.html',
  '/about.html',
  '/blog.html',
  '/privacy-policy.html',
  '/faq.html',
  '/offline.html',
  '/assets/css/style.css',
  '/assets/css/calculator.css',
  '/assets/js/main.js',
  '/assets/js/storage.js',
  '/assets/js/forms.js',
  '/assets/js/notifications.js',
  '/assets/js/newsletter.js',
  '/assets/js/calculator.js',
  '/assets/images/logo/favicon.svg'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
    ))
    .then(() => self.clients.claim())
  );
});

function isNavigationRequest(request) {
  return request.mode === 'navigate' || (request.method === 'GET' && request.headers.get('accept')?.includes('text/html'));
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Only handle same-origin
  if (url.origin !== location.origin) return;

  // Navigation requests - network-first
  if (isNavigationRequest(request)) {
    event.respondWith(
      fetch(request)
        .then((resp) => {
          const copy = resp.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return resp;
        })
        .catch(() => caches.match(request).then((r) => r || caches.match('/offline.html')))
    );
    return;
  }

  // For assets (css/js/images) - cache-first
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).then((resp) => {
      // Put in cache for future
      if (resp && resp.status === 200 && resp.type === 'basic') {
        const copy = resp.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
      }
      return resp;
    }).catch(() => {
      // If image missing, return placeholder
      if (request.destination === 'image') return caches.match('/assets/images/logo/favicon.svg');
      return null;
    }))
  );
});

self.addEventListener('message', (event) => {
  if (!event.data) return;
  if (event.data.type === 'SKIP_WAITING') self.skipWaiting();
});
