/* =========================================================
   MeditoPedia — Voce integrata (Paola e Riccardo)
   Le meditazioni sono pre-registrate con voci neurali gratuite (Piper)
   e salvate nella cartella audio/ del repository: chiunque apra l'app
   sente la stessa voce, senza installare niente.
   Le voci di sistema del dispositivo non vengono usate.

   Da caricare DOPO lo script principale:
   <script src="voce-integrata.js"></script>

   Struttura cartelle:
     audio/paola/indice.json  + un pacchetto .bin per programma (+ comune.bin)
     audio/riccardo/indice.json + idem
   Ogni frase è identificata da un hash del testo. Se una frase non ha audio
   (es. testo modificato), viene solo mostrata a schermo.
   ========================================================= */
(function(){
"use strict";
const BASE = "audio/";
const VOCI = {
 paola:    {nome:"Paola",    icona:"🌸", g:"♀ Donna", desc:"Voce femminile calma e chiara"},
 riccardo: {nome:"Riccardo", icona:"🍃", g:"♂ Uomo",  desc:"Voce maschile pacata"}
};
if(!VOCI[ST.voceInt]) ST.voceInt="paola";
if(!(ST.voceSpeed>=0.6&&ST.voceSpeed<=1.4)) ST.voceSpeed=1;
ST.rate=0.88*ST.voceSpeed;   // le durate stimate seguono la velocità scelta
save();

/* hash FNV-1a: deve coincidere con lo script che ha generato gli audio */
function fnv(s){ let h=0x811c9dc5; for(let i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=Math.imul(h,0x01000193)>>>0; } return ("0000000"+h.toString(16)).slice(-8); }

/* ---------- caricamento: indice + pacchetti per programma ---------- */
const indici = {}, pacchetti = {}, cache = new Map();
function indice(voce){ if(!indici[voce]){ indici[voce]=fetch(BASE+voce+"/indice.json").then(r=>{ if(!r.ok) throw 0; return r.json(); }); indici[voce].catch(()=>delete indici[voce]); } return indici[voce]; }
function pacchetto(voce,nome){ const k=voce+"/"+nome; if(!pacchetti[k]){ pacchetti[k]=fetch(BASE+k+".bin").then(r=>{ if(!r.ok) throw 0; return r.arrayBuffer(); }); pacchetti[k].catch(()=>delete pacchetti[k]); } return pacchetti[k]; }
function load(t){
 const voce=ST.voceInt, h=fnv(t.trim()), key=voce+":"+h;
 if(!cache.has(key)){
  const pr=indice(voce).then(ix=>{ const e=ix[h]; if(!e) throw new Error("manca");
   return pacchetto(voce,e[0]).then(ab=>URL.createObjectURL(new Blob([ab.slice(e[1],e[1]+e[2])],{type:"audio/mpeg"}))); });
  pr.catch(()=>cache.delete(key));
  cache.set(key,pr);
  if(cache.size>80){ const k=cache.keys().next().value; cache.get(k).then(u=>URL.revokeObjectURL(u),()=>{}); cache.delete(k); }
 }
 return cache.get(key);
}
function prefetch(){
 if(!P.on||!P.cfg) return;
 for(let k=1;k<=2;k++){ const st=P.cfg.steps[P.i+k]; if(st&&st.t&&!st.b&&!st.silent) load(st.t).catch(()=>{}); }
}

/* ---------- lettore: elemento audio con velocità che conserva il timbro ---------- */
const el=new Audio(); el.preload="auto"; el.preservesPitch=true; el.mozPreservesPitch=true; el.webkitPreservesPitch=true;
let routed=false, gen=0, safety=null, pending=null;
function route(){
 if(routed||!A.ctx) return; routed=true;
 try{
  const src=A.ctx.createMediaElementSource(el);
  const out=A.ctx.createGain(); out.gain.value=1; src.connect(out); out.connect(A.master);
  const send=A.ctx.createGain(); send.gain.value=.1; out.connect(send); send.connect(A.reverb2||A.reverb);
 }catch(e){}
}
function duck(on){
 if(!A.music||A.sleepEnd) return;
 A.music.gain.setTargetAtTime(on?ST.vol*.6:ST.vol, A.ctx.currentTime, on?.25:.8);
}
function stopCur(){ clearTimeout(safety); el.onended=null; el.onerror=null; try{ el.pause(); }catch(e){} duck(false); }
// sblocca la riproduzione al primo tocco (necessario sui telefoni)
const SILENZIO=(()=>{ const n=800,b=new ArrayBuffer(44+n*2),d=new DataView(b),w=(o,t)=>{for(let i=0;i<t.length;i++)d.setUint8(o+i,t.charCodeAt(i));};
 w(0,"RIFF");d.setUint32(4,36+n*2,true);w(8,"WAVEfmt ");d.setUint32(16,16,true);d.setUint16(20,1,true);d.setUint16(22,1,true);d.setUint32(24,8000,true);d.setUint32(28,16000,true);d.setUint16(32,2,true);d.setUint16(34,16,true);w(36,"data");d.setUint32(40,n*2,true);
 return URL.createObjectURL(new Blob([b],{type:"audio/wav"})); })();
let unlocked=false;
function unlock(){ if(unlocked) return; unlocked=true; A.init(); route(); try{ el.src=SILENZIO; const p=el.play(); if(p&&p.catch) p.catch(()=>{ unlocked=false; }); }catch(e){ unlocked=false; } }
document.addEventListener("click",unlock,true);
document.addEventListener("touchend",unlock,true);

const estimate = t => Math.max(1800, t.split(/\s+/).length*430/ST.voceSpeed);
V.hasTTS = false;
V.stop = function(){ gen++; pending=null; stopCur(); };
V.pick = function(){ return null; };
V.speak = function(text,cb){
 const my=++gen; stopCur();
 let done=false; const fin=()=>{ if(!done&&my===gen){ done=true; duck(false); cb&&cb(); } };
 if(!ST.voice){ setTimeout(fin,estimate(text)); return; }
 A.init(); route();
 load(text).then(url=>{
  if(my!==gen) return;
  el.onended=fin; el.onerror=()=>setTimeout(fin,estimate(text));
  el.src=url; el.playbackRate=ST.voceSpeed; el.defaultPlaybackRate=ST.voceSpeed;
  const p=el.play(); duck(true);
  if(p&&p.catch) p.catch(()=>setTimeout(fin,estimate(text)));
  el.onloadedmetadata=()=>{ clearTimeout(safety); safety=setTimeout(fin,(el.duration/ST.voceSpeed)*1000+3000); };
  safety=setTimeout(fin,estimate(text)*2+4000);
  prefetch();
 }).catch(()=>{ if(my===gen) setTimeout(fin,estimate(text)); });
};

/* ---------- indicazioni del respiro con la voce integrata ---------- */
runBreath = function(st,tok){
 const f=BR[st.b].f, o=document.getElementById("orb"); o.classList.remove("idle");
 setText(BR[st.b].nome+" · "+st.n+" cicli");
 let cyc=0,ph=0,cnt;
 const next=()=>{
  if(tok!==P.token||!P.on||P.paused) return;
  if(ph>=f.length){ ph=0; cyc++; }
  if(cyc>=st.n){ clearInterval(cnt); P.i++; setOrbIdle(); P.timer=setTimeout(runStep,800); return; }
  const [lab,sec,sc]=f[ph];
  o.style.transitionDuration=sec+"s"; o.style.transform="scale("+(.55+sc*.45)+")";
  document.getElementById("orbLabel").textContent=lab; let left=Math.ceil(sec); document.getElementById("orbCount").textContent=left;
  clearInterval(cnt); cnt=setInterval(()=>{ left--; if(left>0&&tok===P.token) document.getElementById("orbCount").textContent=left; },1000);
  if(ST.voice&&cyc<2) V.speak(lab,()=>{});
  ph++; P.timer=setTimeout(next,sec*1000);
 };
 P.timer=setTimeout(next,1200);
};

/* ---------- impostazioni: scelta voce e velocità ---------- */
const SPEEDS=[[0.8,"Molto lenta"],[0.9,"Lenta"],[1,"Normale"],[1.1,"Veloce"],[1.2,"Più veloce"]];
function ui(){
 const c=ST.voceInt;
 return `<h3 style="margin-bottom:4px">Voce</h3>
  <p class="muted small" style="margin-bottom:12px">Voci integrate nell'app: suonano uguali su ogni dispositivo.</p>
  <div class="grid2" style="grid-template-columns:repeat(auto-fill,minmax(170px,1fr))">
   ${Object.entries(VOCI).map(([id,v])=>`<div class="card preset ${c===id?"on":""}" data-iact="voce" data-id="${id}"><span class="ic">${v.icona}</span><h3>${v.nome}</h3><p>${v.desc}</p><p class="small" style="margin-top:6px;color:var(--accent)">${v.g}</p></div>`).join("")}
  </div>
  <h3 style="margin:18px 0 6px">Velocità della voce <span class="muted small" id="spdLab">· ${Math.round(ST.voceSpeed*100)}%</span></h3>
  <input type="range" id="voceSpeed" min="0.7" max="1.3" step="0.05" value="${ST.voceSpeed}" style="width:100%">
  <div class="row" style="justify-content:space-between;margin-top:4px"><span class="muted small">🐢 più lenta</span><span class="muted small">più veloce 🐇</span></div>
  <div class="tgrid" style="grid-template-columns:repeat(5,1fr);margin-top:10px">${SPEEDS.map(([v,l])=>`<button class="tbtn ${Math.abs(ST.voceSpeed-v)<.01?"on":""}" style="font-size:.72rem;padding:10px 2px" data-iact="spd" data-v="${v}">${l}</button>`).join("")}</div>
  <div class="row" style="margin-top:14px"><button class="btn sm" data-iact="ascolta">▶ Ascolta ${VOCI[c].nome}</button></div>`;
}
const _rt=renderTu;
renderTu=function(){
 _rt();
 const sets=[...document.querySelectorAll("#view-tu .set")];
 const host=sets.find(s=>s.querySelector("#voiceSel")||/Voce italiana/.test(s.textContent));
 if(host){ host.style.display="block"; host.innerHTML=ui(); }
 const rate=document.getElementById("rateSel"); if(rate){ const s=rate.closest(".set"); if(s) s.remove(); }
};
function setSpeed(v){
 ST.voceSpeed=Math.round(v*100)/100; ST.rate=0.88*ST.voceSpeed; save();
 el.playbackRate=ST.voceSpeed;
}
document.addEventListener("click",e=>{
 const b=e.target.closest("[data-iact]"); if(!b) return;
 if(b.dataset.iact==="voce"){ ST.voceInt=b.dataset.id; save(); renderTu(); test(); }
 if(b.dataset.iact==="spd"){ setSpeed(+b.dataset.v); renderTu(); test(); }
 if(b.dataset.iact==="ascolta") test();
});
document.addEventListener("input",e=>{
 if(e.target.id==="voceSpeed"){ setSpeed(+e.target.value); const l=document.getElementById("spdLab"); if(l) l.textContent="· "+Math.round(ST.voceSpeed*100)+"%";
  document.querySelectorAll('[data-iact="spd"]').forEach(x=>x.classList.toggle("on",Math.abs(+x.dataset.v-ST.voceSpeed)<.01)); }
});
document.addEventListener("change",e=>{ if(e.target.id==="voceSpeed") test(); });
function test(){ const old=ST.voice; ST.voice=true; V.speak("Trova una posizione comoda… chiudi gli occhi… e lascia che il respiro rallenti, da solo.",()=>{}); ST.voice=old; }

/* nome della voce anche nel player */
const _open=openPlayer;
openPlayer=function(cfg){ unlock(); _open(cfg); const b=document.getElementById("plVoice"); if(b) b.title="Voce: "+VOCI[ST.voceInt].nome; };

try{ if(document.getElementById("view-tu").classList.contains("on")) renderTu(); }catch(e){}
})();
