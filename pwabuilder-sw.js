// This is the "Offline page" service worker
// const CACHE = "pwabuilder-page";
const CACHE = "pwabuilder-offline";

if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
  console/log("It is Safari");
  
  importScripts('https://cdnjs.cloudflare.com/ajax/libs/sw-toolbox/3.6.1/sw-toolbox.js');


const CACHE_NAME = 'my-site-cache-v1';
const urlsToCache = [
  libs = ['player-0.0.11.min', 'main.bundle', 'lzwcompress'],
  '/',
  '/app-test/',
  '/app-test/index.html',
  ...libs.map(i => '/app-test/lib/' + i + '.js'),
  '/app-test/lib/icomoon.css',
  '/app-test/lib/main.bundle.css',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache opened');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});


} else {




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
    libs = ['player-0.0.11.min', 'main.bundle', 'lzwcompress'],
    c = [
      '/app-test/',
      '/app-test/index.html',
      ...libs.map(i => '/app-test/lib/' + i + '.js'),
      '/app-test/lib/icomoon.css',
      '/app-test/lib/main.bundle.css',
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
  new workbox.strategies.CacheFirst({
      cacheName: CACHE,
  })
);

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

self.addEventListener("fetch", event => {
  if (event.request.url === "https://asimut.github.io/app-test/") {
      // or whatever your app's URL is
      event.respondWith(
          fetch(event.request).catch(err =>
              self.cache.open(cache_name).then(cache => cache.match(offlineFallbackPage))
          )
      );
  } else {
      event.respondWith(
          fetch(event.request).catch(err =>
              caches.match(event.request).then(response => response)
          )
      );
  }
});

// self.addEventListener('fetch', (event) => {
//   if (event.request.mode === 'navigate') {
//     event.respondWith(
//       fetch(event.request)
//       .then(function(response){
//         console.log('PWA Builderadd page to offline cache: ' + response.url);

//         event.waitUntil(updareChache(event.request, response.clone()));

//         return response;
//       })
//       .catch(function(error){
//         console.log('PWA Builder request failed. Serving content from cache: ' + error);
//         return fromCache(event.request);
//       })
//     );
//   }
//   if (event.request.destination === 'image') {
//     event.respondWith(
//       caches.match(event.request).then((cachedResponse) => {
//         if (cachedResponse) {
//           return cachedResponse;
//         }

//         return fetch(event.request).then((response) => {
//           const clonedResponse = response.clone();
//           caches.open('images').then((cache) => {
//             cache.put(event.request, clonedResponse);
//           });
//           return response;
//         });
//       })
//     );
//   }
// });

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


}