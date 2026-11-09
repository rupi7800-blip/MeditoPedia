/* =========================================================
   MeditoPedia — Aggiornamenti
   - controlla version.json su GitHub Pages (all'apertura, ogni 30 min,
     e quando torni nell'app)
   - mostra il banner "Nuova versione · Aggiorna" con le novità
   - invia una notifica (se attivata) quando c'è un aggiornamento
   Ad ogni rilascio: aumentare APP_BUILD qui e "build" in version.json.
   ========================================================= */
(function(){
"use strict";
const APP_BUILD = 4;
const APP_VERSIONE = "1.4";
const SITO = "https://rupi7800-blip.github.io/meditopedia/";
const APK = "https://github.com/rupi7800-blip/meditopedia/releases/download/android-latest/MeditoPedia.apk";
const nativa = !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
const LN = () => nativa && window.Capacitor.Plugins && window.Capacitor.Plugins.LocalNotifications;
let remota = null;

/* ---------- controllo ---------- */
async function controlla(manuale){
 try{
  const base = nativa ? SITO : "./";
  const r = await fetch(base+"version.json?t="+Date.now(), {cache:"no-store"});
  if(!r.ok) throw 0;
  const v = await r.json();
  remota = v;
  if(v.build > APP_BUILD){
   mostraBanner(v);
   notifica(v);
  } else if(manuale) toast("✓ Hai già l'ultima versione ("+APP_VERSIONE+")");
  if(curView==="tu") try{ renderTu(); }catch(e){}
 }catch(e){ if(manuale) toast("Controllo non riuscito: verifica la connessione"); }
}

/* ---------- banner ---------- */
const css=document.createElement("style");
css.textContent=`
#aggBanner{position:fixed;left:10px;right:10px;top:calc(10px + env(safe-area-inset-top));z-index:70;max-width:560px;margin:0 auto;display:none;
 background:linear-gradient(150deg,#2a3d5e,#1b2640);border:1px solid #8fb8a888;border-radius:18px;padding:14px 16px;box-shadow:0 14px 40px #000a;animation:aggIn .4s ease}
#aggBanner.on{display:block}
@keyframes aggIn{from{transform:translateY(-30px);opacity:0}to{transform:none;opacity:1}}
#aggBanner ul{margin:8px 0 0 18px;font-size:.84rem;color:var(--muted)}
#aggBanner .row{margin-top:12px}
`;
document.head.appendChild(css);
const ban=document.createElement("div"); ban.id="aggBanner"; document.body.appendChild(ban);
function mostraBanner(v){
 if(ST.aggRimandato===v.build && Date.now()-(ST.aggRimandatoTs||0)<6*3600*1000) return;
 ban.innerHTML=`<div style="display:flex;gap:12px;align-items:flex-start">
  <span style="font-size:1.6rem">✨</span>
  <div style="flex:1"><b>Nuova versione ${v.versione} disponibile</b>
   ${v.novita&&v.novita.length?`<ul>${v.novita.slice(0,4).map(n=>`<li>${esc(n)}</li>`).join("")}</ul>`:""}
   <div class="row"><button class="btn sm" data-gact="aggiorna">${nativa?"⬇️ Scarica aggiornamento":"🔄 Aggiorna ora"}</button><button class="btn sm ghost" data-gact="dopo">Più tardi</button></div>
  </div></div>`;
 ban.classList.add("on");
}
async function aggiorna(){
 if(nativa){ toast("Apri il file scaricato e tocca Installa"); setTimeout(()=>{ location.href=APK; },600); return; }
 ban.innerHTML=`<b>🔄 Aggiornamento in corso…</b>`;
 try{
  if("serviceWorker" in navigator){
   const reg=await navigator.serviceWorker.getRegistration();
   if(reg){ await reg.update().catch(()=>{}); }
  }
  if(window.caches){ const keys=await caches.keys(); await Promise.all(keys.filter(k=>k.startsWith("shell-")).map(k=>caches.delete(k))); }
 }catch(e){}
 location.replace(location.pathname+"?v="+(remota?remota.build:Date.now()));
}

/* ---------- notifiche ---------- */
async function permesso(){
 if(nativa){ const ln=LN(); if(!ln) return false; const p=await ln.requestPermissions().catch(()=>({display:"denied"})); return p.display==="granted"; }
 if(!("Notification" in window)) return false;
 if(Notification.permission==="granted") return true;
 if(Notification.permission==="denied") return false;
 return (await Notification.requestPermission())==="granted";
}
async function notifica(v){
 if(!ST.notifAgg || ST.aggNotificato===v.build) return;
 const titolo="MeditoPedia "+v.versione+" è disponibile";
 const testo=(v.novita&&v.novita[0])?v.novita.slice(0,2).join(" · "):"Tocca per aggiornare l'app";
 try{
  if(nativa){
   const ln=LN(); if(!ln) return;
   await ln.schedule({notifications:[{id:1000+v.build,title:titolo,body:testo,schedule:{at:new Date(Date.now()+1000)}}]});
  } else {
   if(!("Notification" in window)||Notification.permission!=="granted") return;
   const reg=navigator.serviceWorker&&await navigator.serviceWorker.getRegistration();
   const opt={body:testo,icon:"icone/icona-192.png",badge:"icone/icona-192.png",tag:"aggiornamento",data:{url:location.pathname}};
   if(reg) await reg.showNotification(titolo,opt); else new Notification(titolo,opt);
  }
  ST.aggNotificato=v.build; save();
 }catch(e){}
}
// registra il controllo periodico in background (Chrome Android, app installata)
async function periodico(){
 try{
  const reg=await navigator.serviceWorker.ready;
  if("periodicSync" in reg){
   const st=await navigator.permissions.query({name:"periodic-background-sync"}).catch(()=>({state:"denied"}));
   if(st.state==="granted") await reg.periodicSync.register("controlla-aggiornamenti",{minInterval:12*3600*1000});
  }
  // comunica al service worker la versione installata e se le notifiche sono attive
  if(reg.active) reg.active.postMessage({tipo:"versione",build:APP_BUILD,notifiche:!!ST.notifAgg});
 }catch(e){}
}

/* ---------- impostazioni ---------- */
const _rt=renderTu;
renderTu=function(){
 _rt();
 const card=[...document.querySelectorAll("#view-tu .card")].find(c=>c.querySelector(".set")); if(!card) return;
 const reset=[...card.querySelectorAll(".set")].find(s=>/Azzera/.test(s.textContent));
 const nuova=remota&&remota.build>APP_BUILD;
 (reset||card.lastElementChild).insertAdjacentHTML("beforebegin",`
  <div class="set" style="display:block"><div class="row sp"><div><h3>Aggiornamenti</h3><p class="muted small">Versione installata: ${APP_VERSIONE}${nuova?` · <b style="color:var(--accent)">disponibile ${remota.versione}</b>`:""}</p></div>
   <button class="btn sm ${nuova?"":"ghost"}" data-gact="${nuova?"aggiorna":"controlla"}">${nuova?"🔄 Aggiorna":"Controlla"}</button></div></div>
  <div class="set"><div><h3>Notifiche aggiornamenti</h3><p class="muted small">Ti avviso quando esce una nuova versione</p></div><button class="switch ${ST.notifAgg?"on":""}" data-gact="notif"></button></div>`);
};

document.addEventListener("click",async e=>{
 const b=e.target.closest("[data-gact]"); if(!b) return;
 const a=b.dataset.gact;
 if(a==="aggiorna") aggiorna();
 if(a==="dopo"){ ban.classList.remove("on"); if(remota){ ST.aggRimandato=remota.build; ST.aggRimandatoTs=Date.now(); save(); } }
 if(a==="controlla") controlla(true);
 if(a==="notif"){
  if(ST.notifAgg){ ST.notifAgg=false; save(); renderTu(); periodico(); return; }
  const ok=await permesso();
  ST.notifAgg=ok; save(); renderTu(); periodico();
  toast(ok?"🔔 Ti avviserò quando esce un aggiornamento":"Notifiche non consentite: abilitale nelle impostazioni del telefono");
 }
});

/* ---------- quando controllare ---------- */
setTimeout(()=>controlla(false),2500);
setInterval(()=>controlla(false),30*60*1000);
document.addEventListener("visibilitychange",()=>{ if(!document.hidden) controlla(false); });
if(nativa){ try{ window.Capacitor.Plugins.App&&window.Capacitor.Plugins.App.addListener("resume",()=>controlla(false)); }catch(e){} }
if("serviceWorker" in navigator && !nativa) periodico();
})();
