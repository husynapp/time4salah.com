const cacheName = 'time4salahv6';
self.addEventListener("install", e=>{
    e.waitUntil(
        caches.open(cacheName).then(cache =>{
            return cache.addAll(
              [ "./index.html",
              "./images/husyn.ico",
              "./scripts/script.js",
              "./scripts/style.css",
              "./scripts/jquery-3.6.0.min.js",
              "./scripts/moment.js",
              "./scripts/bootstrap.bundle.min.js",
              "./scripts/bootstrap.min.css",
              "./scripts/d3.v6.min.js",
              "./data/202203.csv",
              "./data/202204.csv",
              "./data/202205.csv",
              "./data/202206.csv",
              "./data/202207.csv",
              "./data/202208.csv",
              "./data/202209.csv",
              "./data/202210.csv",
              "./data/202211.csv",
              "./data/202212.csv",
              "./android-chrome-192x192.png",
              "./manifest.json",
              "./scripts/text-style.css",
              "./images/bg_islamic.jpg",
              "./scripts/jquery.hijri.date.js",
              "./scripts/jquery.hijri.date.min.js"
              ]);
        })
    )
});

self.addEventListener('fetch', (e) => {
    e.respondWith((async () => {
      const r = await caches.match(e.request);
      if (r) { return r; }
      const response = await fetch(e.request);
      const cache = await caches.open(cacheName);
      cache.put(e.request, response.clone());
      return response;
    })());
  });