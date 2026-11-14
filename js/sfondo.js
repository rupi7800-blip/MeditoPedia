/* =========================================================
   MeditoPedia — Riproduzione in background e a schermo spento
   Browser / PWA:
     - un elemento <audio> quasi silenzioso in loop fa riconoscere la pagina
       come "lettore multimediale": Chrome Android mostra la notifica con i
       controlli, gestisce il focus audio (chiamate, cuffie scollegate) e non
       congela la pagina mentre suona;
     - Media Session API: titolo e controlli su schermata di blocco e cuffie.
   App Android (Capacitor):
     - plugin nativo SfondoAudio: servizio in primo piano di tipo
       mediaPlayback, MediaSession, notifica con controlli, focus audio,
       pausa quando si scollegano le cuffie, wake lock parziale durante
       la sessione. Senza servizio Android congela l'app pochi secondi dopo
       lo spegnimento dello schermo.
   ========================================================= */
"use strict";
const Sfondo = (function(){
const nativo=()=>{ try{ return window.Capacitor&&window.Capacitor.isNativePlatform&&window.Capacitor.isNativePlatform()&&window.Capacitor.Plugins&&window.Capacitor.Plugins.SfondoAudio; }catch(e){ return null; } };
let el=null, attivo=false, mio=false, info={}, cb={azione:()=>{}};
function silenzio(){
 // 10 secondi a 8 kHz con un rumore a -84 dB: inudibile, ma non "muto"
 const sr=8000,n=sr*10,b=new ArrayBuffer(44+n*2),v=new DataView(b);
 const s=(o,t)=>{ for(let i=0;i<t.length;i++) v.setUint8(o+i,t.charCodeAt(i)); };
 s(0,"RIFF"); v.setUint32(4,36+n*2,true); s(8,"WAVE"); s(12,"fmt "); v.setUint32(16,16,true); v.setUint16(20,1,true); v.setUint16(22,1,true);
 v.setUint32(24,sr,true); v.setUint32(28,sr*2,true); v.setUint16(32,2,true); v.setUint16(34,16,true); s(36,"data"); v.setUint32(40,n*2,true);
 for(let i=0;i<n;i++) v.setInt16(44+i*2,(Math.random()*4-2)|0,true);
 return URL.createObjectURL(new Blob([b],{type:"audio/wav"}));
}
function crea(){
 if(el) return el;
 el=document.createElement("audio"); el.loop=true; el.src=silenzio(); el.setAttribute("playsinline",""); el.preload="auto";
 el.addEventListener("pause",()=>{ if(!mio&&attivo) cb.azione("interrotto"); mio=false; });
 el.addEventListener("play",()=>{ if(!mio&&attivo) cb.azione("ripreso"); mio=false; });
 return el;
}
function mediaSession(){
 if(!("mediaSession" in navigator)) return;
 const ms=navigator.mediaSession;
 try{
  ms.metadata=new MediaMetadata({title:info.titolo||"MeditoPedia",artist:info.sotto||"MeditoPedia",album:"MeditoPedia",
   artwork:[{src:"icone/icona-192.png",sizes:"192x192",type:"image/png"},{src:"icone/icona-512.png",sizes:"512x512",type:"image/png"}]});
  [["play","play"],["pause","pause"],["stop","stop"],["nexttrack","next"],["previoustrack","prev"],["seekforward","next"],["seekbackward","prev"]]
   .forEach(([a,b])=>{ try{ ms.setActionHandler(a,()=>cb.azione(b)); }catch(e){} });
 }catch(e){}
}
function attiva(i){
 info=Object.assign({},i); attivo=true;
 const n=nativo();
 if(n){ n.avvia({titolo:info.titolo||"MeditoPedia",testo:info.sotto||"",inPausa:false}).catch(()=>{});
  // Android 13+: senza permesso la notifica con i controlli resta nascosta (il servizio funziona comunque)
  if(!ST.permNotifChiesto){ ST.permNotifChiesto=true; save(); try{ const LN=window.Capacitor.Plugins.LocalNotifications; LN&&LN.requestPermissions().catch(()=>{}); }catch(e){} } }
 else { try{ crea(); mio=true; const p=el.play(); if(p&&p.catch) p.catch(()=>{ mio=false; }); }catch(e){} }
 mediaSession(); stato(false);
}
function aggiorna(i){
 if(!attivo) return; Object.assign(info,i||{});
 const n=nativo(); if(n) n.aggiorna({titolo:info.titolo||"MeditoPedia",testo:info.sotto||"",inPausa:!!info.inPausa}).catch(()=>{});
 if("mediaSession" in navigator){ try{ navigator.mediaSession.metadata&&(navigator.mediaSession.metadata.title=info.titolo||"MeditoPedia"); }catch(e){} }
}
function stato(inPausa,posizione,durata){
 if(!attivo) return; info.inPausa=inPausa;
 if(el&&!nativo()){ try{ if(inPausa&&!el.paused){ mio=true; el.pause(); } else if(!inPausa&&el.paused){ mio=true; el.play().catch(()=>{ mio=false; }); } }catch(e){} }
 const n=nativo(); if(n) n.aggiorna({titolo:info.titolo||"MeditoPedia",testo:info.sotto||"",inPausa:!!inPausa}).catch(()=>{});
 if("mediaSession" in navigator){ try{ navigator.mediaSession.playbackState=inPausa?"paused":"playing";
  if(durata>0&&navigator.mediaSession.setPositionState) navigator.mediaSession.setPositionState({duration:durata,position:Math.min(durata,Math.max(0,posizione||0)),playbackRate:1}); }catch(e){} }
}
function disattiva(){
 if(!attivo) return; attivo=false;
 if(el){ mio=true; try{ el.pause(); }catch(e){} }
 const n=nativo(); if(n) n.ferma().catch(()=>{});
 if("mediaSession" in navigator){ try{ navigator.mediaSession.playbackState="none"; navigator.mediaSession.metadata=null; }catch(e){} }
}
function suAzione(f){ cb.azione=f; }
/* eventi dal plugin nativo: pulsanti della notifica, focus audio, cuffie */
(function(){
 const n=nativo(); if(!n||!n.addListener) return;
 n.addListener("azione",d=>cb.azione(d&&d.azione));
})();
return {attiva,aggiorna,stato,disattiva,suAzione,get attivo(){return attivo;},nativo};
})();
