const CACHE_NAME = 'purchase-note-app-v1';
const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    // Catatan: Tailwind CSS CDN tidak di-cache di sini karena merupakan sumber eksternal.
    // Jika Anda ingin offline penuh, Anda perlu mengunduh Tailwind dan menghostingnya secara lokal.
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                // If not in cache, fetch from network
                return fetch(event.request);
            })
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        // Delete old caches
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
