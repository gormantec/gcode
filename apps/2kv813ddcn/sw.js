const PRECACHE = 'precache-v1-2kv813ddcn';
const RUNTIME = 'runtime-2kv813ddcn';
const PRECACHE_URLS = [
  '/apps/2kv813ddcn/index.html',
  '/apps/2kv813ddcn/index.html?mockFrame=iphoneX',
  '/apps/2kv813ddcn/icon.png',
  '/apps/2kv813ddcn/192x192.icon.png',
  '/apps/2kv813ddcn/512x512.icon.png',
  '/apps/2kv813ddcn/manifest.json',
  'https://gcode.com.au/css/pwa.css'
];
self.addEventListener('install', event => {event.waitUntil(caches.open(PRECACHE).then(cache => cache.addAll(PRECACHE_URLS)).then(self.skipWaiting()));});
self.addEventListener('activate', event => {const currentCaches = [PRECACHE, RUNTIME]; event.waitUntil(caches.keys().then(cacheNames => cacheNames.filter(cacheName => !currentCaches.includes(cacheName))).then(cachesToDelete => Promise.all(cachesToDelete.map(cacheToDelete =>caches.delete(cacheToDelete)))).then(() => self.clients.claim()));});self.addEventListener('fetch', event => { if (event.request.url.startsWith(self.location.origin) || event.request.url.startsWith('https://gcode.com.au')) { event.respondWith( caches.match(event.request).then(cachedResponse => { if (false && cachedResponse) { console.log(cachedResponse);return cachedResponse;} else return caches.open(RUNTIME).then(cache =>fetch(event.request).then(response => cache.put(event.request, response.clone()).then(() =>response)));}));}});