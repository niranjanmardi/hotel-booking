const CACHE_NAME = 'staywise-v1';
const APP_SHELL = ['/', '/manifest.webmanifest'];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))));
self.addEventListener('fetch', event => { if (event.request.method === 'GET' && new URL(event.request.url).origin === self.location.origin) event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request))); });
