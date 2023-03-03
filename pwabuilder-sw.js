// This is the "Offline page" service worker
const CACHE = "pwabuilder-page";

// TODO: replace the following with the correct offline fallback page i.e.: const offlineFallbackPage = "offline.html";
const offlineFallbackPage = "index.html";

self.addEventListener('install', async (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.add(offlineFallbackPage))
  );
});

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