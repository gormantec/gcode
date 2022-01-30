const PRECACHE = 'precache-v1-6ignh07ctw';
const RUNTIME = 'runtime-6ignh07ctw';
const PRECACHE_URLS = [
  '/apps/6ignh07ctw/index.html',
  '/apps/6ignh07ctw/index.html?mockFrame=iphoneX',
  '/apps/6ignh07ctw/icon.png',
  '/apps/6ignh07ctw/192x192.icon.png',
  '/apps/6ignh07ctw/512x512.icon.png',
  '/apps/6ignh07ctw/manifest.json',
  'https://gcode.com.au/css/pwa.css'
];
self.addEventListener('install', event => {event.waitUntil(caches.open(PRECACHE).then(cache => cache.addAll(PRECACHE_URLS)).then(self.skipWaiting()));});
self.addEventListener('activate', event => {const currentCaches = [PRECACHE, RUNTIME]; event.waitUntil(caches.keys().then(cacheNames => cacheNames.filter(cacheName => !currentCaches.includes(cacheName))).then(cachesToDelete => Promise.all(cachesToDelete.map(cacheToDelete =>caches.delete(cacheToDelete)))).then(() => self.clients.claim()));});self.addEventListener('fetch', event => { if (event.request.url.startsWith(self.location.origin) || event.request.url.startsWith('https://gcode.com.au')) { event.respondWith( caches.match(event.request).then(cachedResponse => { if (false && cachedResponse) { console.log(cachedResponse);return cachedResponse;} else return caches.open(RUNTIME).then(cache =>fetch(event.request).then(response => cache.put(event.request, response.clone()).then(() =>response)));}));}});