const PRECACHE = 'precache-v1-37790665-boatcrew03';
const RUNTIME = 'runtime-37790665-boatcrew03';
const PRECACHE_URLS = [
  '/apps/37790665-boatcrew03/index.html',
  '/apps/37790665-boatcrew03/index.html?mockFrame=iphoneX',
  '/apps/37790665-boatcrew03/icon.png',
  '/apps/37790665-boatcrew03/192x192.icon.png',
  '/apps/37790665-boatcrew03/512x512.icon.png',
  '/apps/37790665-boatcrew03/manifest.json',
  'https://gcode.com.au/css/pwa.css'
];
self.addEventListener('install', event => {event.waitUntil(caches.open(PRECACHE).then(cache => cache.addAll(PRECACHE_URLS)).then(self.skipWaiting()));});
self.addEventListener('activate', event => {const currentCaches = [PRECACHE, RUNTIME]; event.waitUntil(caches.keys().then(cacheNames => cacheNames.filter(cacheName => !currentCaches.includes(cacheName))).then(cachesToDelete => Promise.all(cachesToDelete.map(cacheToDelete =>caches.delete(cacheToDelete)))).then(() => self.clients.claim()));});self.addEventListener('fetch', event => { if (event.request.url.startsWith(self.location.origin) || event.request.url.startsWith('https://gcode.com.au')) { event.respondWith( caches.match(event.request).then(cachedResponse => { if (cachedResponse) return cachedResponse; else return caches.open(RUNTIME).then(cache =>fetch(event.request).then(response => cache.put(event.request, response.clone()).then(() =>response)));}));}});