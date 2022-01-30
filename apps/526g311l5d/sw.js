const PRECACHE = 'precache-v1-526g311l5d';
const RUNTIME = 'runtime-526g311l5d';
const PRECACHE_URLS = [
  '/apps/526g311l5d/index.html',
  '/apps/526g311l5d/index.html?mockFrame=iphoneX',
  '/apps/526g311l5d/icon.png',
  '/apps/526g311l5d/192x192.icon.png',
  '/apps/526g311l5d/512x512.icon.png',
  '/apps/526g311l5d/manifest.json',
  'https://gcode.com.au/css/pwa.css'
];
self.addEventListener('install', event => {event.waitUntil(caches.open(PRECACHE).then(cache => cache.addAll(PRECACHE_URLS)).then(self.skipWaiting()));});
self.addEventListener('activate', event => {const currentCaches = [PRECACHE, RUNTIME]; event.waitUntil(caches.keys().then(cacheNames => cacheNames.filter(cacheName => !currentCaches.includes(cacheName))).then(cachesToDelete => Promise.all(cachesToDelete.map(cacheToDelete =>caches.delete(cacheToDelete)))).then(() => self.clients.claim()));});self.addEventListener('fetch', event => { if (event.request.url.startsWith(self.location.origin) || event.request.url.startsWith('https://gcode.com.au')) { event.respondWith( caches.match(event.request).then(cachedResponse => { if (false && cachedResponse) { console.log(cachedResponse);return cachedResponse;} else return caches.open(RUNTIME).then(cache =>fetch(event.request).then(response => cache.put(event.request, response.clone()).then(() =>response)));}));}});