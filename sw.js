const CACHE_NAME = 'OmnarPRO-offline-v1';

const ASSETS = [
    './',
    './index.html',
    './css/fontawesome.min.css',
    './css/plus-jakarta.css',
    './js/tailwind.min.js',
    './js/jspdf.umd.min.js',
    './js/jspdf-autotable.min.js',
    './webfonts/fa-solid-900.woff2',
    './webfonts/fa-solid-900.ttf',
    './webfonts/fa-regular-400.woff2',
    './webfonts/fa-regular-400.ttf',
    './webfonts/fa-brands-400.woff2',
    './webfonts/fa-brands-400.ttf',
    './fonts/PlusJakartaSans-Light.woff2',
    './fonts/PlusJakartaSans-Regular.woff2',
    './fonts/PlusJakartaSans-Medium.woff2',
    './fonts/PlusJakartaSans-SemiBold.woff2',
    './fonts/PlusJakartaSans-Bold.woff2',
    './fonts/PlusJakartaSans-ExtraBold.woff2',
    './fonts/PlusJakartaSans-Black.woff2'
];

// Install — cache semua aset lokal
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

// Activate — hapus cache lama
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
            )
        ).then(() => self.clients.claim())
    );
});

// Fetch — cache-first (semua file lokal)
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request).then(cached => {
            if (cached) return cached;
            return fetch(event.request).then(response => {
                if (response && response.status === 200) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                }
                return response;
            });
        }).catch(() => {
            if (event.request.mode === 'navigate') {
                return caches.match('./index.html');
            }
        })
    );
});
