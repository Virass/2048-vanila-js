
const staticCacheName = "2048 by virass.com";

const appFiles = [
  '/',
  '/index.html',
  '/2048.js',
  '/2048.css',
  '/favicon.ico',
  '/pacifico.ttf',
  '/img/2.gif',
  '/img/4.gif',
  '/img/8.gif',
  '/img/16.gif',
  '/img/32.gif',
  '/img/64.gif',
  '/img/128.gif',
  '/img/256.gif',
  '/img/512.gif',
  '/img/1024.gif',
  '/img/2048.gif',
  '/img/icon-192x192.png',
  '/img/icon-512x512.png',
]
 
self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(staticCacheName).then(function (cache) {
      return cache.addAll(appFiles);
    })
  );
});
 
self.addEventListener("fetch", function (event) {
  console.log(event.request.url);
 
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    })
  );
});