/* =========================================================
   MeditoPedia — App installabile (PWA) e APK Android
   - registra il service worker (app offline)
   - pulsante "Installa app" su Android, istruzioni su iPhone
   - link all'APK Android costruito da GitHub
   - download degli audio per l'uso offline
   ========================================================= */
(function(){
"use strict";
const APK = "https://github.com/rupi7800-blip/meditopedia/releases/download/android-latest/MeditoPedia.apk";
const nativa = !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
const installata = () => nativa || matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
const ua = navigator.userAgent;
const ios = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const android = /Android/.test(ua);
let prompt = null;

/* service worker */
if ("serviceWorker" in navigator && !nativa && location.protocol === "https:") {
  navigator.serviceWorker.register("sw.js").catch(()=>{});
}
addEventListener("beforeinstallprompt", e => { e.preventDefault(); prompt = e; aggiorna(); });
addEventListener("appinstalled", () => { prompt = null; ST.appInstallata = true; save(); aggiorna(); toast("MeditoPedia installata 🌱"); });

async function installa(){
  if (prompt) { prompt.prompt(); const r = await prompt.userChoice; prompt = null; if (r.outcome === "accepted") return; aggiorna(); return; }
  istruzioni(true);
}
function istruzioni(apri){ const el = document.getElementById("pwaHelp"); if (el) el.classList.toggle("hidden", !apri && !el.classList.contains("hidden")); }

function bloccoInstalla(compatto){
  if (installata()) return "";
  const btn = prompt ? `<button class="btn sm" data-pact="installa">📲 Installa l'app</button>` : `<button class="btn sm" data-pact="aiuto">📲 Come installare</button>`;
  const apk = !ios ? `<a class="btn sm ghost" href="${APK}" style="text-decoration:none">🤖 Scarica APK Android</a>` : "";
  return `<div class="card" style="margin-top:${compatto?14:0}px;display:flex;gap:14px;align-items:center;flex-wrap:wrap">
    <img src="icone/icona-192.png" alt="" style="width:52px;height:52px;border-radius:14px">
    <div style="flex:1;min-width:170px"><h3>MeditoPedia come app</h3><p class="muted small">Icona sulla Home, schermo intero e uso offline.</p></div>
    <div class="row">${btn}${apk}</div>
    <div id="pwaHelp" class="hidden small" style="width:100%;line-height:1.6;margin-top:4px">${testoAiuto()}</div>
  </div>`;
}
function testoAiuto(){
  if (ios) return `<b>iPhone / iPad (Safari):</b> tocca il pulsante <b>Condividi</b> <span style="font-size:1.1em">⎋</span> in basso → <b>Aggiungi alla schermata Home</b> → <b>Aggiungi</b>.`;
  if (android) return `<b>Android (Chrome):</b> tocca <b>⋮</b> in alto a destra → <b>Installa app</b> (oppure <b>Aggiungi a schermata Home</b>).<br>In alternativa scarica l'<b>APK</b>: apri il file scaricato e consenti l'installazione da questa fonte quando Android lo chiede.`;
  return `<b>Computer (Chrome o Edge):</b> clicca l'icona di installazione nella barra dell'indirizzo, oppure ⋮ → <b>Installa MeditoPedia</b>.`;
}

/* audio offline */
async function scaricaAudio(){
  const reg = navigator.serviceWorker && await navigator.serviceWorker.ready.catch(()=>null);
  const lab = document.getElementById("offLab");
  if (!reg || !reg.active) { if (lab) lab.textContent = "Disponibile dopo aver riaperto l'app una volta."; return; }
  const ch = new MessageChannel();
  ch.port1.onmessage = ev => { const d = ev.data; if (!lab) return;
    if (d.errore) lab.textContent = "Download non riuscito: controlla la connessione.";
    else if (d.fine) { lab.textContent = "✓ Audio della voce scaricati: le meditazioni funzionano anche offline."; ST.offline = ST.offline || {}; ST.offline[ST.voceInt] = true; save(); }
    else lab.textContent = `Download in corso… ${d.fatti}/${d.totale}`; };
  reg.active.postMessage({tipo: "scarica", voce: ST.voceInt || "paola"}, [ch.port2]);
}
function bloccoOffline(){
  if (nativa) return `<div class="set" style="display:block"><h3>Uso offline</h3><p class="muted small" style="margin-top:4px">Nell'app Android tutti gli audio sono già inclusi.</p></div>`;
  const fatto = ST.offline && ST.offline[ST.voceInt];
  return `<div class="set" style="display:block"><h3>Uso offline</h3>
   <p class="muted small" style="margin:4px 0 10px">Scarica tutte le meditazioni della voce scelta (circa 28 MB) per usarle senza connessione.</p>
   <button class="btn sm ghost" data-pact="offline">⬇️ Scarica audio</button> <span class="small muted" id="offLab">${fatto?"✓ Già scaricati":""}</span></div>`;
}

/* inserimento nelle schermate */
const _rh = renderHome;
renderHome = function(){ _rh(); const h = document.getElementById("view-home"); if (h && !installata()) h.insertAdjacentHTML("beforeend", bloccoInstalla(true)); };
const _rt = renderTu;
renderTu = function(){
  _rt();
  const card = [...document.querySelectorAll("#view-tu .card")].find(c => c.querySelector(".set"));
  if (!card) return;
  const first = card.querySelector(".set");
  if (!installata()) first.insertAdjacentHTML("beforebegin", `<div class="set" style="display:block">${bloccoInstalla(false).replace('class="card"','')}</div>`);
  const reset = [...card.querySelectorAll(".set")].find(s => /Azzera/.test(s.textContent));
  (reset || card.lastElementChild).insertAdjacentHTML("beforebegin", bloccoOffline());
};
function aggiorna(){ try { if (curView === "home") renderHome(); if (curView === "tu") renderTu(); } catch(e){} }

document.addEventListener("click", e => {
  const b = e.target.closest("[data-pact]"); if (!b) return;
  if (b.dataset.pact === "installa") installa();
  if (b.dataset.pact === "aiuto") istruzioni(true);
  if (b.dataset.pact === "offline") scaricaAudio();
});

/* scorciatoie: #respiro, #musica, #timer, #programmi, #tu */
const v = (location.hash || "").slice(1);
if (["respiro","musica","timer","programmi","tu"].includes(v)) { try { show(v); } catch(e){} } else aggiorna();
})();
