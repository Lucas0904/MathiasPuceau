// Mode hors ligne : tout est mis en cache à la première visite
const CACHE = "calcul-mental-v1";
const FILES = ["./", "index.html", "manifest.webmanifest", "icon.svg", "christine.jpg"];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => Promise.all(FILES.map((f) => c.add(f).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  // Réseau d'abord (pour recevoir les mises à jour), cache en secours
  e.respondWith(fetch(e.request).then((r) => {
    const copy = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {}); return r;
  }).catch(() => caches.match(e.request).then((m) => m || caches.match("index.html"))));
});
