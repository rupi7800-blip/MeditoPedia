/* MeditoPedia — service worker: app offline e audio in cache */
const VERSIONE = "mp-v5";
const SHELL = "shell-" + VERSIONE;
const AUDIO = "audio-v1";          // gli audio non cambiano tra le versioni dell'app
const FILE_BASE = [
  "./", "./index.html", "./sessioni-extra.js?v=4", "./voce-integrata.js?v=4", "./pwa.js?v=1",
  "./manifest.webmanifest", "./icone/icona-192.png", "./icone/icona-512.png", "./icone/apple-touch-icon.png",
  "./audio/paola/indice.json", "./audio/riccardo/indice.json"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(SHELL).then(c => c.addAll(FILE_BASE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== SHELL && k !== AUDIO && !k.startsWith("fonts")).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
  const req = e.request; if (req.method !== "GET") return;
  const url = new URL(req.url);
  // pacchetti audio: prima la cache, poi la rete
  if (url.pathname.endsWith(".bin")) {
    e.respondWith(caches.open(AUDIO).then(async c => {
      const hit = await c.match(req, {ignoreSearch: true}); if (hit) return hit;
      const res = await fetch(req); if (res.ok) c.put(req, res.clone()); return res;
    }));
    return;
  }
  // font di Google: cache
  if (url.host.includes("fonts.g")) {
    e.respondWith(caches.open("fonts").then(async c => {
      const hit = await c.match(req); if (hit) return hit;
      try { const res = await fetch(req); c.put(req, res.clone()); return res; } catch (err) { return Response.error(); }
    }));
    return;
  }
  if (url.origin !== location.origin) return;
  // pagina, script e indici: prima la rete (aggiornamenti subito), poi la cache se offline
  e.respondWith(fetch(req).then(res => {
    if (res.ok) caches.open(SHELL).then(c => c.put(req, res.clone()));
    return res;
  }).catch(async () => (await caches.match(req, {ignoreSearch: false})) || (await caches.match(req, {ignoreSearch: true})) || caches.match("./index.html")));
});

/* scarica tutti gli audio di una voce per l'uso offline */
self.addEventListener("message", async e => {
  if (!e.data || e.data.tipo !== "scarica") return;
  const voce = e.data.voce, port = e.ports[0];
  try {
    const ix = await (await fetch(`./audio/${voce}/indice.json`)).json();
    const nomi = [...new Set(Object.values(ix).map(v => v[0]))];
    const c = await caches.open(AUDIO); let fatti = 0;
    for (const n of nomi) {
      const u = `./audio/${voce}/${n}.bin`;
      if (!(await c.match(u))) { const r = await fetch(u); if (r.ok) await c.put(u, r); }
      fatti++; port.postMessage({fatti, totale: nomi.length});
    }
    port.postMessage({fine: true});
  } catch (err) { port.postMessage({errore: String(err)}); }
});
