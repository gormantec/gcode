const PRECACHE = 'precache-v1-37790665-findmyapple';
const RUNTIME = 'runtime-37790665-findmyapple';
const PRECACHE_URLS = [
  '/apps/37790665-findmyapple/index.html',
  '/apps/37790665-findmyapple/index.html?mockFrame=iphoneX',
  '/apps/37790665-findmyapple/icon.png',
  '/apps/37790665-findmyapple/splash.icon.png',
  '/apps/37790665-findmyapple/180x180.icon.png',
  '/apps/37790665-findmyapple/192x192.icon.png',
  '/apps/37790665-findmyapple/512x512.icon.png',
  '/apps/37790665-findmyapple/manifest.json',
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