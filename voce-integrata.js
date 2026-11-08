/* =========================================================
   MeditoPedia — Voce integrata (Paola e Riccardo)
   Le meditazioni sono pre-registrate con voci neurali gratuite (Piper)
   e salvate nella cartella audio/ del repository: chiunque apra l'app
   sente la stessa voce, senza installare niente.

   Da caricare DOPO voci.js:
   <script src="voce-integrata.js"></script>

   Struttura cartelle:
     audio/paola/indice.json  + un pacchetto .bin per programma (+ comune.bin)
     audio/riccardo/indice.json + idem
   Ogni frase è identificata da un hash del testo. Se una frase non ha audio
   (es. testo modificato), l'app usa automaticamente la voce del dispositivo.
   ========================================================= */
(function(){
"use strict";
const BASE = "audio/";
const VOCI = {
 paola:    {nome:"Paola",    icona:"🌸", g:"♀ Donna", desc:"Voce femminile calma e chiara"},
 riccardo: {nome:"Riccardo", icona:"🍃", g:"♂ Uomo",  desc:"Voce maschile pacata"}
};
if(ST.voceInt===undefined){ ST.voceInt="paola"; save(); }

/* hash FNV-1a: deve coincidere con lo script che ha generato gli audio */
function fnv(s){ let h=0x811c9dc5; for(let i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=Math.imul(h,0x01000193)>>>0; } return ("0000000"+h.toString(16)).slice(-8); }
/* ---------- caricamento: indice + pacchetti per programma ---------- */
const indici = {}, pacchetti = {}, cache = new Map();
function indice(voce){ if(!indici[voce]){ indici[voce]=fetch(BASE+voce+"/indice.json").then(r=>{ if(!r.ok) throw 0; return r.json(); }); indici[voce].catch(()=>delete indici[voce]); } return indici[voce]; }
function pacchetto(voce,nome){ const k=voce+"/"+nome; if(!pacchetti[k]){ pacchetti[k]=fetch(BASE+k+".bin").then(r=>{ if(!r.ok) throw 0; return r.arrayBuffer(); }); pacchetti[k].catch(()=>delete pacchetti[k]); } return pacchetti[k]; }
function decode(ab){ return new Promise((res,rej)=>{ const p=A.ctx.decodeAudioData(ab,res,rej); if(p&&p.then) p.then(res,rej); }); }
function load(t){
 const voce=ST.voceInt, h=fnv(t.trim()), key=voce+":"+h;
 if(!cache.has(key)){
  const pr=indice(voce).then(ix=>{ const e=ix[h]; if(!e) throw new Error("manca"); return pacchetto(voce,e[0]).then(ab=>decode(ab.slice(e[1],e[1]+e[2]))); });
  pr.catch(()=>cache.delete(key));
  cache.set(key,pr);
  if(cache.size>80) cache.delete(cache.keys().next().value);
 }
 return cache.get(key);
}
function prefetch(){
 if(!P.on||!P.cfg) return;
 for(let k=1;k<=2;k++){ const st=P.cfg.steps[P.i+k]; if(st&&st.t&&!st.b&&!st.silent) load(st.t).catch(()=>{}); }
}

/* ---------- uscita audio: voce + leggero riverbero, musica che si abbassa ---------- */
let out=null, cur=null, gen=0, safety=null;
function ensureOut(){
 if(out||!A.ctx) return;
 out=A.ctx.createGain(); out.gain.value=1.0; out.connect(A.master);
 const send=A.ctx.createGain(); send.gain.value=.12; out.connect(send); send.connect(A.reverb2);
}
function duck(on){
 if(!A.music||A.sleepEnd) return;
 A.music.gain.setTargetAtTime(on?ST.vol*.6:ST.vol, A.ctx.currentTime, on?.25:.8);
}
function stopCur(){
 clearTimeout(safety);
 if(cur){ cur.onended=null; try{cur.stop()}catch(e){} cur=null; duck(false); }
}

const orig = { speak:V.speak, stop:V.stop };
V.stop = function(){ gen++; stopCur(); orig.stop.call(V); };
V.speak = function(text,cb){
 if(!ST.voceInt||!ST.voice) return orig.speak.call(V,text,cb);
 A.init(); if(!A.ctx) return orig.speak.call(V,text,cb);
 ensureOut();
 const my=++gen; stopCur(); try{ speechSynthesis.cancel(); }catch(e){}
 let done=false; const fin=()=>{ if(!done&&my===gen){ done=true; duck(false); cb&&cb(); } };
 load(text).then(buf=>{
  if(my!==gen) return;
  const src=A.ctx.createBufferSource(); src.buffer=buf; src.connect(out);
  src.onended=()=>{ if(cur===src) cur=null; fin(); };
  cur=src; duck(true); src.start();
  safety=setTimeout(fin, buf.duration*1000+2500);
  prefetch();
 }).catch(()=>{ if(my===gen) orig.speak.call(V,text,cb); });
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

/* ---------- interfaccia nelle impostazioni ---------- */
function ui(){
 const c=ST.voceInt;
 return `<div id="voceIntBox" style="margin-bottom:18px">
  <h3 style="margin-bottom:4px">Voce guida</h3>
  <p class="muted small" style="margin-bottom:12px">Le voci integrate sono già dentro l'app: suonano uguali su ogni telefono, anche offline dopo il primo ascolto.</p>
  <div class="grid2" style="grid-template-columns:repeat(auto-fill,minmax(170px,1fr))">
   ${Object.entries(VOCI).map(([id,v])=>`<div class="card preset ${c===id?"on":""}" data-iact="voce" data-id="${id}"><span class="ic">${v.icona}</span><h3>${v.nome}</h3><p>${v.desc}</p><p class="small" style="margin-top:6px;color:var(--accent)">${v.g} · integrata</p></div>`).join("")}
   <div class="card preset ${!c?"on":""}" data-iact="voce" data-id=""><span class="ic">📱</span><h3>Voci del dispositivo</h3><p>Usa i maestri qui sotto con le voci del telefono</p></div>
  </div>
  ${c?`<div class="row" style="margin-top:12px"><button class="btn sm" data-iact="ascolta">▶ Ascolta ${VOCI[c].nome}</button></div>`:""}
 </div>`;
}
const _rt=renderTu;
renderTu=function(){
 _rt();
 const m=document.querySelector('#view-tu [data-vact="maestro"]');
 const host=m?m.closest(".set"):[...document.querySelectorAll("#view-tu .set")].find(s=>/Voce italiana|maestro/i.test(s.textContent));
 if(!host) return;
 host.insertAdjacentHTML("afterbegin",ui());
 if(ST.voceInt){ [...host.children].forEach(ch=>{ if(ch.id!=="voceIntBox"){ ch.style.opacity=.45; } }); }
};
document.addEventListener("click",e=>{
 const el=e.target.closest("[data-iact]"); if(!el) return;
 if(el.dataset.iact==="voce"){ ST.voceInt=el.dataset.id||""; save(); renderTu(); if(ST.voceInt) test(); }
 if(el.dataset.iact==="ascolta") test();
});
function test(){ A.init(); const old=ST.voice; ST.voice=true; V.speak("Trova una posizione comoda… chiudi gli occhi… e lascia che il respiro rallenti, da solo.",()=>{}); ST.voice=old; }

/* nome della voce anche nel player */
const _open=openPlayer;
openPlayer=function(cfg){ _open(cfg); const b=document.getElementById("plVoice"); if(b&&ST.voceInt) b.title="Voce: "+VOCI[ST.voceInt].nome; };

try{ if(document.getElementById("view-tu").classList.contains("on")) renderTu(); }catch(e){}
})();
