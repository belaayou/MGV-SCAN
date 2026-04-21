const CACHE_NAME = 'stellantis-mgv-v6'; // بدلت الـ version باش المتصفح يحس بالفرق

const ASSETS = [
  '/SCAN-MGV/',            // هادي مهمة لـ GitHub Pages
  '/SCAN-MGV/index.html',
  '/SCAN-MGV/manifest.json',
  '/SCAN-MGV/tailwind.js',
  '/SCAN-MGV/html5-qrcode.min.js',
  '/SCAN-MGV/IMG_20260413_130653.png'
];

// Installation
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching assets...');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activation
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  return self.clients.claim();
});

// Fetch
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('script.google.com')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // إيلا كاين في الكاش عطيه ليه، وإيلا مكاينش جيبو من الريزو
      return cachedResponse || fetch(event.request);
    }).catch(() => {
      // إيلا مقطوعة الأنترنيت كاع، صيفطو لـ index.html
      return caches.match('/SCAN-MGV/index.html');
    })
  );
});
