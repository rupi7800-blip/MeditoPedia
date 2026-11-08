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
function decode(ab){ return new Promise((res,rej)=>{ const p=A.ctx.decodeAudioData(ab,res,rej); if(p&&p.then) p.then(res,rej); }); }
function loadRaw(t){
 const voce=ST.voceInt, h=fnv(t.trim()), key=voce+":"+h;
 if(!cache.has(key)){
  const pr=indice(voce).then(ix=>{ const e=ix[h]; if(!e) throw new Error("manca"); return pacchetto(voce,e[0]).then(ab=>decode(ab.slice(e[1],e[1]+e[2]))); });
  pr.catch(()=>cache.delete(key));
  cache.set(key,pr);
  if(cache.size>80) cache.delete(cache.keys().next().value);
 }
 return cache.get(key);
}
/* velocità: time-stretch WSOLA, cambia il ritmo senza alterare il timbro */
const stretched=new Map();
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
function load(t){
 const sp=ST.voceSpeed, key=ST.voceInt+":"+fnv(t.trim())+":"+sp;
 if(!stretched.has(key)){
  const pr=loadRaw(t).then(b=>stretch(b,sp)); pr.catch(()=>stretched.delete(key));
  stretched.set(key,pr); if(stretched.size>80) stretched.delete(stretched.keys().next().value);
 }
 return stretched.get(key);
}
function prefetch(){
 if(!P.on||!P.cfg) return;
 for(let k=1;k<=2;k++){ const st=P.cfg.steps[P.i+k]; if(st&&st.t&&!st.b&&!st.silent) load(st.t).catch(()=>{}); }
}

/* ---------- uscita audio: voce + leggero riverbero, musica che si abbassa ---------- */
let out=null, cur=null, gen=0, safety=null;
function ensureOut(){
 if(out||!A.ctx) return;
 out=A.ctx.createGain(); out.gain.value=1; out.connect(A.master);
 const send=A.ctx.createGain(); send.gain.value=.1; out.connect(send); send.connect(A.reverb2||A.reverb);
}
function duck(on){
 if(!A.music||A.sleepEnd) return;
 A.music.gain.setTargetAtTime(on?ST.vol*.6:ST.vol, A.ctx.currentTime, on?.25:.8);
}
function stopCur(){ clearTimeout(safety); if(cur){ cur.onended=null; try{cur.stop()}catch(e){} cur=null; duck(false); } }
document.addEventListener("click",()=>A.init(),true);
document.addEventListener("touchend",()=>A.init(),true);

const estimate = t => Math.max(1800, t.split(/\s+/).length*430/ST.voceSpeed);
V.hasTTS = false;
V.stop = function(){ gen++; stopCur(); };
V.pick = function(){ return null; };
V.speak = function(text,cb){
 const my=++gen; stopCur();
 let done=false; const fin=()=>{ if(!done&&my===gen){ done=true; duck(false); cb&&cb(); } };
 if(!ST.voice){ setTimeout(fin,estimate(text)); return; }
 A.init(); if(!A.ctx){ setTimeout(fin,estimate(text)); return; }
 ensureOut();
 load(text).then(buf=>{
  if(my!==gen) return;
  const src=A.ctx.createBufferSource(); src.buffer=buf; src.connect(out);
  src.onended=()=>{ if(cur===src) cur=null; fin(); };
  cur=src; duck(true); src.start();
  safety=setTimeout(fin, buf.duration*1000+2500);
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
  <p class="muted small" style="margin-bottom:12px">Voci integrate nell'app: suonano uguali su ogni dispositivo. <span style="opacity:.6">(v4)</span></p>
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
openPlayer=function(cfg){ _open(cfg); const b=document.getElementById("plVoice"); if(b) b.title="Voce: "+VOCI[ST.voceInt].nome; };

try{ if(document.getElementById("view-tu").classList.contains("on")) renderTu(); }catch(e){}
})();
