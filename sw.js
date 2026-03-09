const V      = 'burocrapp-v2';
const STATIC = ['./', './index.html', './style.css', './app.js', './data.js', './manifest.json'];

self.addEventListener('install',  e => e.waitUntil(caches.open(V).then(c => c.addAll(STATIC)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())));

self.addEventListener('fetch', e => {
  const url = e.request.url;
  // Always network-first for Firebase, fonts, remote images
  if (url.includes('firebase') || url.includes('gstatic') || url.includes('googleapis') || url.includes('wikipedia')) {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
    return;
  }
  // Cache-first for app shell
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
    const clone = res.clone();
    caches.open(V).then(c => c.put(e.request, clone));
    return res;
  })));
});
