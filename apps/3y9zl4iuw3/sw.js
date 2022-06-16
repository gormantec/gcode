const PRECACHE = 'precache-v1-3y9zl4iuw3';
const RUNTIME = 'runtime-3y9zl4iuw3';
const PRECACHE_URLS = [
  '/apps/3y9zl4iuw3/index.html',
  '/apps/3y9zl4iuw3/index.html?mockFrame=iphoneX',
  '/apps/3y9zl4iuw3/icon.png',
  '/apps/3y9zl4iuw3/splash.png',
  '/apps/3y9zl4iuw3/180x180.icon.png',
  '/apps/3y9zl4iuw3/192x192.icon.png',
  '/apps/3y9zl4iuw3/512x512.icon.png',
  '/apps/3y9zl4iuw3/manifest.json',
  'https://gcode.com.au/css/pwa.css'
];
self.addEventListener('install', event => {event.waitUntil(caches.open(PRECACHE).then(cache =>{
  let r=null;
  try{
    r=cache.addAll(PRECACHE_URLS);
  }catch(e){
    console.log(e);
  }
  return r;
}).then(self.skipWaiting()));});
self.addEventListener('activate', event => {const currentCaches = [PRECACHE, RUNTIME]; event.waitUntil(caches.keys().then(cacheNames => cacheNames.filter(cacheName => !currentCaches.includes(cacheName))).then(cachesToDelete => Promise.all(cachesToDelete.map(cacheToDelete =>caches.delete(cacheToDelete)))).then(() => self.clients.claim()));});self.addEventListener('fetch', event => { if (event.request.url.startsWith(self.location.origin) || event.request.url.startsWith('https://gcode.com.au')) { event.respondWith( caches.match(event.request).then(cachedResponse => { if (false && cachedResponse) { console.log(cachedResponse);return cachedResponse;} else return caches.open(RUNTIME).then(cache =>fetch(event.request).then(response => cache.put(event.request, response.clone()).then(() =>response)));}));}});