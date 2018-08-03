const STATIC_CACHE_NAME = 'restaurant-static-v8';
const CONTENT_IMG_CACHE = 'restaurant-content-imgs';

// all the caches we care about
const allCaches = [
    STATIC_CACHE_NAME,
    CONTENT_IMG_CACHE,
];

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(STATIC_CACHE_NAME).then(function (cache) {
            return cache.addAll([
                '/',
                '/img/1.jpg',
                '/img/2.jpg',
                '/img/3.jpg',
                '/img/4.jpg',
                '/img/5.jpg',
                '/img/6.jpg',
                '/img/7.jpg',
                '/img/8.jpg',
                '/img/9.jpg',
                '/img/10.jpg',
                '/data/restaurants.json',
                '/js/main.js',
                '/js/restaurant_info.js',
                '/js/dbhelper.js',
                '/css/styles.css',
                '/css/home.css',
                '/css/details.css',
                'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css',
                'https://unpkg.com/leaflet@1.3.1/dist/leaflet.js',
                'https://unpkg.com/leaflet@1.3.1/dist/images/marker-icon.png'
            ]);
        }));
});


self.addEventListener('activate', function (event) {
    console.log('[ACTIVATING]', event);
    self.clients.claim();
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.filter(cacheName => {
                    return cacheName.startsWith('restaurant-') &&
                        !allCaches.includes(cacheName);
                }).map(cacheName => caches.delete(cacheName)));
        }));
});


self.addEventListener('fetch', function (event) {
    const requestUrl = new URL(event.request.url);

    event.respondWith(
        fetch(requestUrl, { mode: 'cors' }).catch(function(){
            return caches.match(event.request).then(function(response) {
                if (response) {
                    return response;
                }

                if (event.request.headers.get('accept').includes('text/html')) {
                    return caches.match(STATIC_CACHE_NAME);
                }
            });
        })
    );
});

// `skipWaiting` if we get the right kind of message from the UI
self.addEventListener('message', function (event) {
    console.log('[MESSAGE]', event);
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});
