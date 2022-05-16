const PRECACHE = 'precache-v1-5nwb266yls';
const RUNTIME = 'runtime-5nwb266yls';
const PRECACHE_URLS = [
  '/apps/5nwb266yls/index.html',
  '/apps/5nwb266yls/index.html?mockFrame=iphoneX',
  '/apps/5nwb266yls/icon.png',
  '/apps/5nwb266yls/splash.png',
  '/apps/5nwb266yls/180x180.icon.png',
  '/apps/5nwb266yls/192x192.icon.png',
  '/apps/5nwb266yls/512x512.icon.png',
  '/apps/5nwb266yls/manifest.json',
  'https://gcode.com.au/css/pwa.css'
];
self.addEventListener('install', event => {event.waitUntil(caches.open(PRECACHE).then(cache => cache.addAll(PRECACHE_URLS)).then(self.skipWaiting()));});
self.addEventListener('activate', event => {const currentCaches = [PRECACHE, RUNTIME]; event.waitUntil(caches.keys().then(cacheNames => cacheNames.filter(cacheName => !currentCaches.includes(cacheName))).then(cachesToDelete => Promise.all(cachesToDelete.map(cacheToDelete =>caches.delete(cacheToDelete)))).then(() => self.clients.claim()));});self.addEventListener('fetch', event => { if (event.request.url.startsWith(self.location.origin) || event.request.url.startsWith('https://gcode.com.au')) { event.respondWith( caches.match(event.request).then(cachedResponse => { if (false && cachedResponse) { console.log(cachedResponse);return cachedResponse;} else return caches.open(RUNTIME).then(cache =>fetch(event.request).then(response => cache.put(event.request, response.clone()).then(() =>response)));}));}});