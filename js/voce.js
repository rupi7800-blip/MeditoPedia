/* =========================================================
   MeditoPedia — Voci guida integrate
   Le frasi sono pre-registrate (voci neurali Kokoro, Apache 2.0) e salvate
   in audio/<voce>/: indice.json + un pacchetto .bin per gruppo di frasi.
   Ogni frase è identificata dall'hash FNV-1a del testo.
   - prepara(testi): scarica i pacchetti necessari e calcola la durata esatta
     di ogni frase leggendo le intestazioni MP3 (senza decodificare)
   - buffer(testo): decodifica e (se serve) rallenta la frase, con cache limitata
   Se la voce scelta non ha una frase, si usa la voce di riserva dello stesso
   genere; se nessuna voce la possiede, la frase viene solo mostrata a schermo.
   ========================================================= */
"use strict";
const Voce = (function(){
const BASE="audio/";
const VOCI={
 sara:    {nome:"Sara",     icona:"🌸", g:"Femminile", desc:"Calda e pacata · Kokoro"},
 nicola:  {nome:"Nicola",   icona:"🍃", g:"Maschile",  desc:"Profonda e tranquilla · Kokoro"},
 paola:   {nome:"Paola",    icona:"🌷", g:"Femminile", desc:"Voce precedente (Piper) · solo contenuti originali", vecchia:true, riserva:"sara"},
 riccardo:{nome:"Riccardo", icona:"🌿", g:"Maschile",  desc:"Voce precedente (Piper) · solo contenuti originali", vecchia:true, riserva:"nicola"}
};
const nativa=!!(window.Capacitor&&window.Capacitor.isNativePlatform&&window.Capacitor.isNativePlatform());
if(nativa){ delete VOCI.paola; delete VOCI.riccardo; }      // nell'APK sono incluse solo Sara e Nicola
if(!ST.voceKokoro){ ST.voceKokoro=true; ST.voceInt=ST.voceInt==="riccardo"?"nicola":"sara"; }
if(!VOCI[ST.voceInt]) ST.voceInt="sara";
if(!(ST.voceSpeed>=0.6&&ST.voceSpeed<=1.4)) ST.voceSpeed=1;

function fnv(s){ let h=0x811c9dc5; for(let i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=Math.imul(h,0x01000193)>>>0; } return ("0000000"+h.toString(16)).slice(-8); }

const indici={}, pacchetti={}, dur=new Map(), cache=new Map();
function indice(v){ if(!indici[v]){ indici[v]=fetch(BASE+v+"/indice.json").then(r=>{ if(!r.ok) throw 0; return r.json(); }); indici[v].catch(()=>delete indici[v]); } return indici[v]; }
function pacchetto(v,n){ const k=v+"/"+n; if(!pacchetti[k]){ pacchetti[k]=fetch(BASE+k+".bin").then(r=>{ if(!r.ok) throw 0; return r.arrayBuffer(); }); pacchetti[k].catch(()=>delete pacchetti[k]); } return pacchetti[k]; }

/* durata di un MP3 contando i frame (ID3 e frame Xing/Info esclusi) */
const BR1=[0,32,40,48,56,64,80,96,112,128,160,192,224,256,320], BR2=[0,8,16,24,32,40,48,56,64,80,96,112,128,144,160];
const SR={3:[44100,48000,32000],2:[22050,24000,16000],0:[11025,12000,8000]};
function durataMp3(u8){
 let i=0, L=u8.length, samples=0, sr=0, frames=0;
 if(u8[0]===0x49&&u8[1]===0x44&&u8[2]===0x33) i=10+((u8[6]&127)<<21|(u8[7]&127)<<14|(u8[8]&127)<<7|(u8[9]&127));
 while(i+4<=L){
  if(u8[i]!==0xFF||(u8[i+1]&0xE0)!==0xE0){ i++; continue; }
  const ver=(u8[i+1]>>3)&3, lay=(u8[i+1]>>1)&3, bri=(u8[i+2]>>4)&15, sri=(u8[i+2]>>2)&3, pad=(u8[i+2]>>1)&1;
  if(ver===1||lay!==1||bri===0||bri===15||sri===3){ i++; continue; }
  const v1=ver===3, br=(v1?BR1:BR2)[bri]*1000; sr=SR[ver][sri];
  const spf=v1?1152:576, len=Math.floor((v1?144:72)*br/sr)+pad;
  if(frames===0){ const off=i+4+(v1?32:17); const tag=String.fromCharCode(u8[off],u8[off+1],u8[off+2],u8[off+3]); if(tag==="Xing"||tag==="Info"){ i+=len; frames=-1; continue; } }
  frames=Math.max(1,frames+1); samples+=spf; i+=len;
 }
 return sr?Math.max(0,samples/sr-.05):0;
}
/* quale voce possiede la frase (scelta → riserva) */
async function sorgente(t){
 const h=fnv(t.trim()), scelta=ST.voceInt, ris=VOCI[scelta]&&VOCI[scelta].riserva;
 for(const v of [scelta,ris].filter(Boolean)){ try{ const ix=await indice(v); if(ix[h]) return {v,e:ix[h],h}; }catch(e){} }
 return null;
}
const chiave=t=>ST.voceInt+":"+fnv(t.trim())+":"+ST.voceSpeed;
/* scarica i pacchetti e calcola le durate; onProg(fatti,totale) */
async function prepara(testi,onProg){
 const unici=[...new Set(testi.map(t=>t.trim()))].filter(t=>!dur.has(chiave(t)));
 const src=await Promise.all(unici.map(t=>sorgente(t).catch(()=>null)));
 const nomi=[...new Set(src.filter(Boolean).map(s=>s.v+"/"+s.e[0]))]; let fatti=0;
 onProg&&onProg(0,nomi.length);
 await Promise.all(nomi.map(n=>{ const [v,p]=n.split("/"); return pacchetto(v,p).then(()=>{ fatti++; onProg&&onProg(fatti,nomi.length); }).catch(()=>{}); }));
 for(let i=0;i<unici.length;i++){ const s=src[i]; if(!s) { dur.set(chiave(unici[i]),0); continue; }
  try{ const ab=await pacchetto(s.v,s.e[0]); const d=durataMp3(new Uint8Array(ab,s.e[1],s.e[2])); dur.set(chiave(unici[i]),d/ST.voceSpeed); }catch(e){ dur.set(chiave(unici[i]),0); } }
}
/* durata nota (0 = nessun audio disponibile) */
function durata(t){ const d=dur.get(chiave(t)); return d==null?0:d; }

function decode(ab){ return new Promise((res,rej)=>{ const p=A.ctx.decodeAudioData(ab,res,rej); if(p&&p.then) p.then(res,rej); }); }
/* velocità: time-stretch WSOLA, cambia il ritmo senza alterare il timbro */
function stretch(buf,rate){
 if(Math.abs(rate-1)<.01) return buf;
 const x=buf.getChannelData(0), sr=buf.sampleRate, L=x.length;
 const N=Math.round(sr*.04)&~1, Hs=N/2, Ha=Hs*rate, tol=Math.round(sr*.012);
 const outLen=Math.ceil(L/rate)+N, y=new Float32Array(outLen), nrm=new Float32Array(outLen), w=new Float32Array(N);
 for(let i=0;i<N;i++) w[i]=.5-.5*Math.cos(2*Math.PI*i/(N-1));
 let prev=0, k=0, last=0;
 for(;;k++){
  const op=k*Hs, nom=Math.round(k*Ha);
  if(nom+N>=L||op+N>=outLen) break;
  let best=nom;
  if(k>0){ const ref=prev+Hs; let bc=-Infinity;
   for(let d=-tol;d<=tol;d+=2){ const p=nom+d; if(p<0||p+N>=L||ref+N>=L) continue; let c=0; for(let i=0;i<N;i+=3) c+=x[ref+i]*x[p+i]; if(c>bc){bc=c;best=p;} } }
  for(let i=0;i<N;i++){ y[op+i]+=x[best+i]*w[i]; nrm[op+i]+=w[i]; }
  prev=best; last=op+N;
 }
 for(let i=0;i<last;i++) if(nrm[i]>1e-3) y[i]/=nrm[i];
 const out=A.ctx.createBuffer(1,Math.max(1,last),sr); out.getChannelData(0).set(y.subarray(0,Math.max(1,last)));
 return out;
}
function buffer(t){
 const k=chiave(t);
 if(!cache.has(k)){
  const pr=sorgente(t).then(s=>{ if(!s) throw new Error("manca"); return pacchetto(s.v,s.e[0]).then(ab=>decode(ab.slice(s.e[1],s.e[1]+s.e[2]))); }).then(b=>stretch(b,ST.voceSpeed));
  pr.catch(()=>cache.delete(k)); cache.set(k,pr);
  if(cache.size>60) cache.delete(cache.keys().next().value);   // memoria contenuta
 }
 return cache.get(k);
}
/* prova d'ascolto immediata (impostazioni e anteprima voce) */
let prova=null;
async function ascolta(testo,voce){
 const old=ST.voceInt; if(voce) ST.voceInt=voce;
 try{ await A.resume(); if(prova){ try{prova.stop()}catch(e){} }
  const b=await buffer(testo); const s=A.ctx.createBufferSource(); s.buffer=b; s.connect(A.busVoce); s.start(); prova=s; }
 catch(e){ toast("Audio non disponibile: controlla la connessione"); }
 finally{ ST.voceInt=old; }
}
function stopProva(){ if(prova){ try{prova.stop()}catch(e){} prova=null; } }
return {VOCI,fnv,prepara,durata,buffer,ascolta,stopProva,indice,pacchetto,durataMp3};
})();
