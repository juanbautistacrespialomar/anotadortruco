/* ───────────────────────────────────────────────────────────────
   Service Worker · Truco
   - Funciona offline (cachea la app la primera vez que se abre online).
   - "network-first" para el HTML: si hay internet, siempre trae lo último,
     así no te quedás con una versión vieja después de actualizar.
   - "cache-first" para los assets (logo, manifest, fuentes).
   - Versionado: subí el número de CACHE para forzar limpieza al actualizar.
   ─────────────────────────────────────────────────────────────── */

const CACHE = "truco-v1"; // ⬅️ subí a v2, v3... cuando quieras forzar refresco total

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./Logo.png"
];

/* Instalación: precachea el "esqueleto" de la app.
   Usamos allSettled para que si Logo.png todavía no está subido,
   no falle toda la instalación. */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      Promise.allSettled(ASSETS.map((url) => cache.add(url)))
    ).then(() => self.skipWaiting())
  );
});

/* Activación: borra caches de versiones anteriores y toma control. */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

/* Estrategia de fetch */
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Navegación (cargar la página): network-first → siempre lo último si hay red
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put("./index.html", copy));
          return res;
        })
        .catch(() => caches.match("./index.html").then((r) => r || caches.match("./")))
    );
    return;
  }

  // Fuentes de Google: cache-first (las guarda la primera vez online)
  const esFuente =
    url.origin === "https://fonts.googleapis.com" ||
    url.origin === "https://fonts.gstatic.com";

  // Assets del propio sitio + fuentes: cache-first con relleno desde la red
  if (url.origin === self.location.origin || esFuente) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        }).catch(() => cached);
      })
    );
  }
});
