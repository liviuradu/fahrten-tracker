// sw.js – App-Hülle offline verfügbar machen
const CACHE = "ft-v7";
const SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon.svg",
  "https://cdn.jsdelivr.net/npm/html5-qrcode@2.3.8/html5-qrcode.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.allSettled(SHELL.map(u => c.add(u)))));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  const url = e.request.url;
  // GitHub-API nie cachen – immer live:
  if (url.includes("api.github.com")) return;
  // Hülle: erst Cache, dann Netz:
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
