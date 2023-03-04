// This is the "Offline page" service worker
// const CACHE = "pwabuilder-page";
const CACHE = "pwabuilder-offline";

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');    

// TODO: replace the following with the correct offline fallback page i.e.: const offlineFallbackPage = "offline.html";
const offlineFallbackPage = "index.html";


self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// self.addEventListener('install', async (event) => {
//   event.waitUntil(
//     caches.open(CACHE)
//       .then((cache) => cache.add(offlineFallbackPage))
           
//   );
// });
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(async (cache) => {
    let ok,
    cats = [
      'a', 'folder', 'with',
      'lots', 'of', 'files',
      'for', 'the', 'same', 'extension'
    ],
    c = [
      'index.html',
      ...cats.map(i => '/assets/' + i + '.jpg')
      ];

    console.log('ServiceWorker: Caching files:', c.length, c);
    try {
      ok = await cache.addAll(c);
    } catch (err) {
      console.error('sw: cache.addAll');
      for await (let i of c) {
        try {
          ok = await cache.add(i);
        } catch (err) {
          console.warn('sw: cache.add',i);
        }
      }
    }

    return ok;
  }));

  console.log('ServiceWorker installed');
});



if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable();
}

workbox.routing.registerRoute(
  new RegExp('/(.*)\.(?:png|gif|jpg)(.*)/'),
  new workbox.strategies.NetworkFirst({
      cacheName: CACHE,
      plugins: [
          new workbox.cacheableResponse.CacheableResponsePlugin({
              statuses: [0, 200]
          }),
          new workbox.expiration.ExpirationPlugin({
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 * 7,
              purgeOnQuotaError: true
          })
      ]
  })
);

// workbox.routing.registerRoute(
//   /(.*)\.(?:png|gif|jpg)(.*)/,
//   workbox.strategies.networkFirst({
//       cacheName: CACHE,
//       plugins: [
//           new workbox.cacheableResponse.Plugin({
//               statuses: [0, 200]
//           }),
//           new workbox.expiration.Plugin({
//               maxEntries: 100,
//               maxAgeSeconds: 60 * 60 * 24 * 7,
//               purgeOnQuotaError: true
//           })
//       ]
//   })
// );

workbox.routing.registerRoute(
  new RegExp('/*'),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: CACHE
  })
);

// self.addEventListener('fetch', (event) => {
//   if (event.request.mode === 'navigate') {
//     event.respondWith((async () => {
//       try {
//         const preloadResp = await event.preloadResponse;

//         if (preloadResp) {
//           return preloadResp;
//         }

//         const networkResp = await fetch(event.request);
//         return networkResp;
//       } catch (error) {

//         const cache = await caches.open(CACHE);
//         const cachedResp = await cache.match(offlineFallbackPage);
//         return cachedResp;
//       }
//     })());
//   }
// });


// self.addEventListener('install', async (event) => {
//   event.waitUntil(
//     caches.open(CACHE)
//       .then((cache) => cache.add(offlineFallbackPage))
//   );
// });

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
      .then(function(response){
        console.log('PWA Builderadd page to offline cache: ' + response.url);

        event.waitUntil(updareChache(event.request, response.clone()));

        return response;
      })
      .catch(function(error){
        console.log('PWA Builder request failed. Serving content from cache: ' + error);
        return fromCache(event.request);
      })
    );
  }
});

function fromCache(request){
  return caches.open(CACHE).then(function(cache){
    if(!matching || matching.status === 404){
      return Promise.reject("no-match");
    }

    return matching;
  })
}

function updareChache(request, response){
  return caches.open(CACHE).then(function(cache){
    return cache.put(request, response);
  })
}