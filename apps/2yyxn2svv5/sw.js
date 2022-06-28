const PRECACHE = 'precache-v1-2yyxn2svv5';
const RUNTIME = 'runtime-2yyxn2svv5';
const PRECACHE_URLS = [
  '/apps/2yyxn2svv5/index.html',
  '/apps/2yyxn2svv5/index.html?mockFrame=iphoneX',
  '/apps/2yyxn2svv5/icon.png',
  '/apps/2yyxn2svv5/splash.png',
  '/apps/2yyxn2svv5/180x180.icon.png',
  '/apps/2yyxn2svv5/192x192.icon.png',
  '/apps/2yyxn2svv5/512x512.icon.png',
  '/apps/2yyxn2svv5/manifest.json',
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