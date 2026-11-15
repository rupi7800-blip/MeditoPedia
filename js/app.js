/* =========================================================
   MeditoPedia — Applicazione (interfaccia)
   Viste con indirizzo (#home, #esplora, #sezione/…, #respiro, #suoni, #tu…):
   il tasto Indietro del telefono funziona in modo naturale.
   ========================================================= */
"use strict";

/* ---------- icone (linee semplici, colore del testo) ---------- */
const ICONE={
 home:'<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/>',
 compass:'<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
 wind:'<path d="M3 8h11a3 3 0 1 0-3-3"/><path d="M3 12h15a3 3 0 1 1-3 3"/><path d="M3 16h7"/>',
 music:'<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
 user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
 lotus:'<path d="M12 20c-4 0-8-2-9-6 3 0 6 1 9 4 3-3 6-4 9-4-1 4-5 6-9 6z"/><path d="M12 18c-2-2-3-5-2-9 1 1 2 2 2 3 0-1 1-2 2-3 1 4 0 7-2 9z"/>',
 leaf:'<path d="M5 19c0-9 6-14 15-14 0 9-5 15-14 15"/><path d="M5 19l8-8"/>',
 moon:'<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
 target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
 heart:'<path d="M12 20s-7-4.5-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.5-9 9-9 9z"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 play:'<path d="M7 4l13 8-13 8z" fill="currentColor"/>',
 pause:'<rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor"/><rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor"/>',
 stop:'<rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor"/>',
 next:'<path d="M5 5l10 7-10 7z" fill="currentColor"/><path d="M19 5v14"/>',
 prev:'<path d="M19 5L9 12l10 7z" fill="currentColor"/><path d="M5 5v14"/>',
 close:'<path d="M6 6l12 12M18 6L6 18"/>',
 settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
 bell:'<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21h4"/>',
 timer:'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M9 2h6"/>',
 star:'<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
 starf:'<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" fill="currentColor"/>',
 plus:'<path d="M12 5v14M5 12h14"/>', trash:'<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
 up:'<path d="M6 15l6-6 6 6"/>', down:'<path d="M6 9l6 6 6-6"/>', back:'<path d="M15 5l-7 7 7 7"/>', chev:'<path d="M9 5l7 7-7 7"/>',
 eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
 vol:'<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/>',
 voice:'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
 shuffle:'<path d="M16 3h5v5M4 20l17-17M21 16v5h-5M15 15l6 6M4 4l5 5"/>',
 repeat:'<path d="M17 2l4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/>',
 check:'<path d="M5 12l5 5 9-10"/>', sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/>',
 download:'<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/>', edit:'<path d="M4 20h4L19 9l-4-4L4 16z"/>', list:'<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>'
};
const ic=(n,c="")=>`<svg class="i ${c}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONE[n]||""}</svg>`;

/* ---------- riferimenti alle attività ----------
   {k:"cat",id,min} contenuto del catalogo · {k:"prog",p,i} sessione di un programma
   {k:"br",id,min,cfg?} respiro · {k:"rt",id} routine · {k:"timer",min,int,bg} */
const CAT_BY_ID=Object.fromEntries(CATALOGO.map(x=>[x.id,x]));
const SEZ_BY_ID=Object.fromEntries(SEZIONI.map(x=>[x.id,x]));
const chiaveRef=r=>r.k==="prog"?`prog:${r.p}:${r.i}`:r.k==="preset"?`preset:${r.id}`:r.k==="timer"?"timer":`${r.k}:${r.id}`;
function durataPassi(steps){ return Motore.parse(steps).reduce((a,s)=>a+(s.b?s.f.reduce((x,f)=>x+f[1],0)*s.vel*s.n+2:s.silent?s.p:s.campana?4:s.t.split(/\s+/).length*.45/ST.voceSpeed+(s.p||0)),0); }
function estSession(steps){ return durataPassi(steps); }        // compatibilità con i moduli esistenti
function tutteRoutine(){ return ROUTINE_BASE.concat(ST.routine); }
function brCfgCustom(c){
 const f=[["Inspira",c.in,1,"in"]]; if(c.h1>0) f.push(["Trattieni",c.h1,1,"hold"]); f.push(["Espira",c.out,0,"out"]); if(c.h2>0) f.push(["Pausa",c.h2,0,"rest"]);
 return f;
}
function infoRef(r){
 if(!r) return null;
 if(r.k==="cat"){ const it=CAT_BY_ID[r.id]; if(!it) return null; const s=SEZ_BY_ID[it.sez]; return {titolo:it.t,sotto:s.nome+" · "+it.d,min:r.min||it.durate[0],col:s.col,icona:s.icona,sonno:!!it.sonno}; }
 if(r.k==="prog"){ const p=PROGRAMS.find(x=>x.id===r.p); const s=p&&p.sessioni[r.i]; if(!s) return null; return {titolo:s.t,sotto:p.nome,min:Math.max(1,Math.round(durataPassi(s.steps)/60)),col:p.col,emoji:p.icona,sonno:!!p.sleep}; }
 if(r.k==="br"){ const b=BR[r.id]; if(!b&&r.id!=="custom") return null; if(r.id==="custom"){ const c=r.cfg||ST.brCustom; return {titolo:r.nome||"Respiro personalizzato",sotto:"Respiro · "+[c.in,c.h1,c.out,c.h2].join("-"),min:c.min,col:"#9ec3d6",icona:"wind"}; }
  return {titolo:b.nome,sotto:"Respirazione · "+(r.min||b.durata||5)+" min",min:r.min||b.durata||5,col:"#9ec3d6",emoji:b.icona,sonno:(b.tag||[]).includes("sonno")}; }
 if(r.k==="rt"){ const t=tutteRoutine().find(x=>x.id===r.id); if(!t) return null; return {titolo:t.nome,sotto:"Routine · "+minRoutine(t)+" min",min:minRoutine(t),col:"#c9b48f",emoji:t.icona||"🧩",sonno:!!t.sonno}; }
 if(r.k==="timer"){ return {titolo:"Meditazione silenziosa",sotto:"Timer · "+r.min+" min",min:r.min,col:"#b8a9d6",icona:"timer"}; }
 if(r.k==="preset"){ const p=PRESETS.find(x=>x.id===r.id); if(!p) return null; return {titolo:p.nome,sotto:"Suoni · "+p.desc,col:"#a9c7d8",emoji:p.icona}; }
 return null;
}
function minRoutine(t){ return t.blocchi.reduce((a,b)=>a+(+b.min||0),0); }
function passiRef(r){
 if(r.k==="cat"){ const it=CAT_BY_ID[r.id]; return copione(it,r.min||it.durate[0]); }
 if(r.k==="prog"){ return PROGRAMS.find(x=>x.id===r.p).sessioni[r.i].steps; }
 if(r.k==="br"){
  if(r.id==="custom"){ const c=r.cfg||ST.brCustom, f=brCfgCustom(c), cyc=f.reduce((a,x)=>a+x[1],0)*c.vel;
   const n=c.modo==="cicli"&&c.cicli>0?c.cicli:Math.max(1,Math.round(c.min*60/cyc));
   return [BR_INTRO+"|2",{b:"custom",n,f,vel:c.vel},BR_FINE+"|6"]; }
  return copioneRespiro(r.id,r.min||BR[r.id].durata||5,{vel:ST.brVel||1});
 }
 if(r.k==="rt"){
  const t=tutteRoutine().find(x=>x.id===r.id), out=[];
  t.blocchi.forEach((b,i)=>{
   if(i>0) out.push({campana:true});
   if(b.k==="respiro") out.push(...copioneRespiro(b.id,b.min,{istruzioni:i===0}));
   else if(b.k==="med"){ const it=CAT_BY_ID[b.id]; if(it) out.push(...copione(it,b.min)); }
   else if(b.k==="musica") out.push({t:"Musica · lasciati andare all'ascolto",p:b.min*60,silent:true,musica:true});
   else out.push({t:"Silenzio",p:b.min*60,silent:true});
  });
  return out;
 }
 if(r.k==="timer") return [{t:"Pratica silenziosa",p:r.min*60,silent:true}];
 return [];
}
/* tecnica "segnaposto" per il respiro personalizzato (fasi impostate all'avvio) */
BR.custom={id:"custom",nome:"Respiro personalizzato",icona:"✳️",f:[["Inspira",4,1,"in"],["Espira",6,0,"out"]]};

/* ---------- avvio di un'attività ---------- */
function avvia(r,offset){
 const info=infoRef(r); if(!info){ toast("Contenuto non trovato"); return; }
 if(r.k==="preset"){ suonaPreset(r.id); return; }
 if(r.k==="prog"){ const p=PROGRAMS.find(x=>x.id===r.p);
  if(p.seq&&r.i>0&&!ST.done[r.p+":"+(r.i-1)]&&!ST.done[r.p+":"+r.i]){ toast("Completa prima il giorno precedente 🌱"); return; } }
 let passi=passiRef(r);
 if(r.k==="br"&&r.id==="custom"){ BR.custom.f=brCfgCustom(r.cfg||ST.brCustom); BR.custom.nome=r.nome||"Respiro personalizzato"; }
 let bg=r.bg;
 if(bg==null){ if(r.k==="rt"){ const t=tutteRoutine().find(x=>x.id===r.id); bg=t.bg; }
  else if(r.k==="timer") bg=r.bg||ST.tmBg; else if(r.k==="br") bg=r.id==="custom"?(r.cfg||ST.brCustom).bg:ST.brBg||"none";
  else bg=info.sonno?"sonno":ST.bg; }
 if(mixActive()&&bg!=="none") bg="current";
 const cfg={titolo:info.titolo,sotto:info.sotto,col:info.col,passi,sonno:info.sonno,ref:r,offset:offset||0,bg,
  intervallo:r.k==="timer"?r.int:0, cue:r.k==="br"&&r.id==="custom"?(r.cfg||ST.brCustom).cue:undefined, toni:r.k==="br"&&r.id==="custom"?(r.cfg||ST.brCustom).toni:undefined};
 apriPlayer(cfg);
 applyBg(bg);
 Motore.avvia(cfg);
}
/* compatibilità con umore.js e i vecchi collegamenti */
function startSession(pid,idx){ avvia({k:"prog",p:pid,i:idx}); }
function startBreath(id){ avvia({k:"br",id,min:BR[id]&&BR[id].durata||ST.brDur}); }
const P={get on(){ return Motore.S.on; }};
function refresh(){ Router.render(); }
function renderHome(){ if(Router.vista==="home") Router.render(); }
function renderTu(){ if(Router.vista==="tu"||Router.vista==="impostazioni") Router.render(); }

/* ---------- musica di sottofondo ---------- */
function mixActive(){ return Object.values(ST.mix).some(v=>v>0); }
function applyMix(mix){ A.init(); Object.keys(A.defs).forEach(id=>{ const v=mix[id]||0; if((ST.mix[id]||0)!==v||v>0){ ST.mix[id]=v; A.set(id,v); } }); save(); musicaCambiata(); }
function applyPreset(id){ const p=PRESETS.find(x=>x.id===id); if(p){ ST.lastPreset=id; applyMix(p.mix); } }
function stopMusic(fade){ A.stopAll(fade); Object.keys(ST.mix).forEach(k=>ST.mix[k]=0); ST.lastPreset=null; Playlist.ferma(); save(); musicaCambiata(); }
function applyBg(v){ if(!v||v==="current") return; if(v==="none"){ stopMusic(); return; } applyPreset(v); }
function suonaPreset(id){
 A.resume(); applyPreset(id);
 if(!Motore.S.on){ const p=PRESETS.find(x=>x.id===id); Sfondo.attiva({titolo:p.nome,sotto:"MeditoPedia · Suoni"}); }
 ST.last={ref:{k:"preset",id},ts:Date.now()}; save();
}
function musicaCambiata(){
 if(!Motore.S.on){ if(mixActive()){ const p=PRESETS.find(x=>x.id===ST.lastPreset); if(!Sfondo.attivo) Sfondo.attiva({titolo:p?p.nome:"Mixer personale",sotto:"MeditoPedia · Suoni"}); else Sfondo.aggiorna({titolo:p?p.nome:"Mixer personale"}); }
  else Sfondo.disattiva(); }
 aggiornaMini(); if(Router.vista==="suoni") Suoni.aggiornaStato();
}

/* ---------- playlist (sequenze di atmosfere) ---------- */
const Playlist=(function(){
 let cur=null;
 function avvia(pl){
  const ordine=pl.voci.map((_,i)=>i); if(pl.casuale) ordine.sort(()=>Math.random()-.5);
  cur={pl,ordine,k:0,fine:0}; passa(0); toast("▶ "+pl.nome);
 }
 function passa(k){ if(!cur) return; cur.k=k; const v=cur.pl.voci[cur.ordine[k]]; applyPreset(v.id); cur.fine=A.now()+v.min*60;
  const p=PRESETS.find(x=>x.id===v.id); if(!Motore.S.on) { Sfondo.attiva({titolo:p.nome,sotto:"Playlist · "+cur.pl.nome}); } }
 function tick(){ if(!cur||!A.running()) return; if(A.now()>=cur.fine){ let k=cur.k+1; if(k>=cur.ordine.length){ if(!cur.pl.ripeti){ cur=null; stopMusic(4); return; } k=0; } passa(k); } }
 setInterval(tick,1000);
 return {avvia,ferma(){cur=null},get attiva(){return cur},avanti(){ if(cur) passa((cur.k+1)%cur.ordine.length); }};
})();

/* ---------- timer di autospegnimento ---------- */
const Spegni={
 imposta(min){ A.init(); ST.sleepMin=min; save(); if(!min){ A.sleep(0); toast("Timer di spegnimento annullato"); } else { A.sleep(min*60,ST.fade); toast(`🌙 Spegnimento tra ${min} min`); } aggiornaSpegni(); },
 controlla(){
  if(!A.sleepEnd||!A.ctx) return;
  if(A.now()>=A.sleepEnd-.05){
   A.sleepEnd=0; ST.sleepMin=0; save();
   if(Motore.S.on){ const S=Motore.S; Motore.stop(true); chiudiPlayer(); }
   A.stopAll(.05); Object.keys(ST.mix).forEach(k=>ST.mix[k]=0); Playlist.ferma(); save();
   Sfondo.disattiva();
   setTimeout(()=>{ A.sleepReset(); A.suspend(); },1500);
   aggiornaMini(); aggiornaSpegni(); if(Router.vista==="suoni") Suoni.aggiornaStato();
  }
 }
};
setInterval(()=>Spegni.controlla(),1000);
document.addEventListener("visibilitychange",()=>Spegni.controlla());
function aggiornaSpegni(){
 const l=A.sleepLeft(); const txt=l?`Spegnimento tra ${fmt(l)}`:"";
 $$("[data-sleeplbl]").forEach(e=>e.textContent=l?fmt(l):"");
 $$("[data-sleepinfo]").forEach(e=>e.textContent=txt);
 $$("[data-sleep]").forEach(b=>b.classList.toggle("on",!!l&&+b.dataset.sleep===ST.sleepMin));
}
setInterval(aggiornaSpegni,1000);
function sceltaSpegni(){
 const opz=[5,10,15,20,30,45,60,90];
 return `<div class="chips">${opz.map(m=>`<button class="chip" data-act="sleep" data-sleep="${m}">${m} min</button>`).join("")}
  <button class="chip" data-act="sleepcustom">Personalizzato…</button><button class="chip ghost" data-act="sleep" data-m="0">Annulla</button></div>
  <p class="muted small" data-sleepinfo></p>
  <label class="lbl">Dissolvenza finale <span class="muted" id="fadeLbl">${ST.fade} s</span></label>
  <input type="range" min="5" max="120" step="5" value="${ST.fade}" data-in="fade" aria-label="Durata della dissolvenza">`;
}

/* =========================================================
   PLAYER
   ========================================================= */
let PL={cfg:null,raf:0,ultimoTesto:"",inBackground:false};
function apriPlayer(cfg){
 PL.cfg=cfg; PL.ultimoTesto="";
 const pl=$("#player"); pl.style.setProperty("--pc",cfg.col||"#9cb8a0");
 $("#plProg").textContent=cfg.sotto||""; $("#plTitle").textContent=cfg.titolo;
 $("#plDone").classList.remove("on"); $("#plText").textContent=""; $("#orbLabel").textContent=""; $("#orbCount").textContent=""; $("#plStats").innerHTML="";
 $("#plBg").innerHTML=bgOptions(true); $("#plBg").value=cfg.bg&&[...$("#plBg").options].some(o=>o.value===cfg.bg)?cfg.bg:(mixActive()?"current":"none");
 pl.classList.add("on"); pl.classList.remove("is-paused","minimale","pannello"); if(ST.minimale) pl.classList.add("minimale");
 document.body.classList.add("noscroll");
 $("#plVoice").classList.toggle("off",!ST.voice);
 keepAwake(true); animaPlayer();
}
/* riduce il lettore nella finestra in basso: la sessione continua */
function riduciPlayer(){
 if(!Motore.S.on||Motore.S.finito){ Motore.stop(true); chiudiPlayer(); return; }
 PL.ridotto=true; $("#player").classList.remove("on","pannello"); document.body.classList.remove("noscroll");
 Router.render(); aggiornaMini();
}
function mostraPlayer(){
 if(!Motore.S.on) return; PL.ridotto=false;
 $("#player").classList.add("on"); document.body.classList.add("noscroll"); aggiornaMini(); disegnaPlayer();
}
/* stop: termina la sessione e ferma anche la musica di sottofondo */
function terminaTutto(){ Motore.stop(); stopMusic(); chiudiPlayer(); }
/* ricomincia dall'inizio */
function ricomincia(){
 const S=Motore.S; if(!S.on||S.preparando) return;
 $("#plDone").classList.remove("on"); S.registrata=false;
 Motore.vaiA(0); if(S.paused) Motore.riprendi(); A.bell(!!S.cfg.sonno,A.now()+.05);
 PL.ultimoTesto=""; toast("↺ Sessione ricominciata");
}
function chiudiPlayer(){
 PL.ridotto=false;
 $("#player").classList.remove("on","is-paused","pannello"); document.body.classList.remove("noscroll");
 cancelAnimationFrame(PL.raf); PL.raf=0; keepAwake(false); PL.cfg=null;
 if(!mixActive()) Sfondo.disattiva(); else musicaCambiata();
 Router.render();
}
function bgOptions(withCurrent){
 return (withCurrent&&mixActive()?'<option value="current">🎚️ Suoni attuali</option>':'')+'<option value="none">🔇 Silenzio</option>'+
  CAT_SUONI.map(([c,n])=>`<optgroup label="${esc(n)}">${PRESETS.filter(p=>p.c===c).map(p=>`<option value="${p.id}">${p.icona} ${esc(p.nome)}</option>`).join("")}</optgroup>`).join("");
}
let wakeLock=null;
async function keepAwake(on){ try{ if(on&&"wakeLock" in navigator&&!document.hidden){ wakeLock=await navigator.wakeLock.request("screen"); } else if(!on&&wakeLock){ wakeLock.release(); wakeLock=null; } }catch(e){} }
const easeIO=x=>x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2;
function disegnaPlayer(){
 const S=Motore.S; if(!S.on||!PL.cfg) return;
 const r=Motore.istante(), o=$("#orb");
 if(S.preparando) return;
 const el=r.pos, tot=r.durata;
 $("#plBar").style.width=Math.min(100,el/tot*100)+"%";
 $("#plEl").textContent=fmt(el); $("#plRem").textContent="-"+fmt(Math.max(0,tot-el));
 if(r.testo!==PL.ultimoTesto){ PL.ultimoTesto=r.testo; const t=$("#plText"); t.style.opacity=0; setTimeout(()=>{ t.textContent=r.testo; t.style.opacity=1; },220); }
 if(r.fase){
  const f=r.fase, sc=f.prev+(f.sc-f.prev)*easeIO(Math.min(1,f.prog));
  o.classList.remove("idle"); o.style.transform=`scale(${(.55+sc*.45).toFixed(4)})`;
  $("#orbLabel").textContent=f.lab; $("#orbCount").textContent=Math.max(1,Math.ceil(f.rest-.02));
  $("#plStats").innerHTML=`<span><b>${esc(f.lab)}</b> · ${Math.ceil(f.rest-.02)} s</span><span>Ciclo <b>${Math.min(f.ciclo+1,f.cicli)}</b> di ${f.cicli}</span><span>Completati <b>${f.ciclo}</b></span>`;
 } else {
  if(!o.classList.contains("idle")){ o.style.transform=""; o.classList.add("idle"); $("#orbLabel").textContent=""; $("#orbCount").textContent=""; }
  $("#plStats").innerHTML=r.musica?`<span>${ic("music")} Ascolto libero</span>`:"";
 }
 const sl=A.sleepLeft(); $("#plSleep").classList.toggle("on",!!sl); $("#plSleepLbl").textContent=sl?fmt(sl):"";
}
function animaPlayer(){
 cancelAnimationFrame(PL.raf);
 const loop=()=>{ if(!PL.cfg) return; if(!document.hidden&&!PL.inBackground) disegnaPlayer(); PL.raf=requestAnimationFrame(loop); };
 PL.raf=requestAnimationFrame(loop);
}
Motore.on("preparazione",d=>{ const el=$("#plPrep"); el.classList.toggle("on",!!d.on); if(d.on) $("#plPrepTxt").textContent=d.totale>1?`Preparo la voce… ${d.fatti}/${d.totale}`:"Preparo la sessione…"; });
Motore.on("avviso",t=>toast(t));
Motore.on("avvio",S=>{ setPausedUI(false); Sfondo.aggiorna({titolo:S.cfg.titolo,sotto:S.cfg.sotto}); Sfondo.stato(false,Motore.pos(),S.durata);
 ST.last={ref:S.cfg.ref,ts:Date.now(),pos:0,durata:S.durata}; save(); });
Motore.on("tick",S=>{ if(PL.ridotto) aggiornaMini(); if(ST.last&&S.cfg&&ST.last.ref===S.cfg.ref){ ST.last.pos=Motore.pos(); ST.last.durata=S.durata; } if(Math.random()<.1) save(); Sfondo.stato(S.paused,Motore.pos(),S.durata); });
Motore.on("pausa",p=>{ setPausedUI(p); aggiornaMini(); Sfondo.stato(p,Motore.pos(),Motore.S.durata); });
function setPausedUI(on){ $("#plPlay").innerHTML=on?ic("play"):ic("pause"); $("#plPlay").setAttribute("aria-label",on?"Riprendi":"Pausa"); $("#player").classList.toggle("is-paused",on); }
function registra(S,completa){
 const sec=S.ascoltato||0, min=Math.round(sec/60*10)/10;
 if(min<1&&!completa) return;
 ST.minutes=Math.round((ST.minutes+min)*10)/10; ST.sessions++;
 const r=S.cfg.ref;
 if(completa&&r&&r.k==="prog") ST.done[r.p+":"+r.i]=true;
 if(completa&&r&&r.k==="cat") ST.done["cat:"+r.id]=true;
 ST.hist.unshift({d:dayKey(),ts:Date.now(),t:S.cfg.titolo,p:S.cfg.sotto||"",m:min,mood:0,full:!!completa,ref:r});
 ST.hist=ST.hist.slice(0,400);
 if(ST.last&&ST.last.ref===r){ ST.last.pos=completa?0:Motore.pos(); ST.last.finita=!!completa; ST.last.ts=Date.now(); }
 save();
}
Motore.on("fine",({S})=>{
 registra(S,true); S.registrata=true;
 if(S.cfg.sonno){
  $("#plText").textContent="Buon riposo 🌙";
  if(A.playing()&&!A.sleepEnd) Spegni.imposta(ST.sleepMin||30);
  setTimeout(()=>{ if(Motore.S===S&&S.on){ Motore.stop(true); chiudiPlayer(); } },6000);
  return;
 }
 if(PL.ridotto&&!S.cfg.sonno) mostraPlayer();
 $("#doneInfo").textContent=`${S.cfg.titolo} · ${minuti(S.ascoltato)}`;
 $$("#moods button").forEach(b=>b.classList.remove("on"));
 setTimeout(()=>$("#plDone").classList.add("on"),900);
 Sfondo.stato(true,S.durata,S.durata);
});
Motore.on("stop",({S,completa,silenzioso})=>{ if(!S.registrata) registra(S,completa); if(!silenzioso&&!completa) toast("Sessione interrotta"); });
/* comandi da notifica, cuffie, schermata di blocco, interruzioni */
Sfondo.suAzione(a=>{
 const S=Motore.S;
 if(S.on){
  if(a==="stop"){ terminaTutto(); return; }
  if(a==="pause"||a==="interrotto") Motore.pausa();
  else if(a==="play"||a==="ripreso") Motore.riprendi();
  else if(a==="next") Motore.avanti(); else if(a==="prev") Motore.indietro();
  else if(a==="stop"){ Motore.stop(); chiudiPlayer(); }
  return;
 }
 if(a==="pause"||a==="interrotto"){ A.suspend(); Sfondo.stato(true); aggiornaMini(); }
 else if(a==="play"||a==="ripreso"){ A.resume(); Sfondo.stato(false); aggiornaMini(); }
 else if(a==="stop"){ stopMusic(); }
 else if(a==="next"&&Playlist.attiva) Playlist.avanti();
});
window.addEventListener("audiostato",()=>{ aggiornaMini(); if(Router.vista==="suoni") Suoni.aggiornaStato(); });

/* ---------- mini lettore ---------- */
function aggiornaMini(){
 const m=$("#mini"), S=Motore.S;
 if(S.on&&PL.ridotto){
  m.classList.add("on","sessione"); const r=S.preparando?null:Motore.istante();
  $("#miniTxt").innerHTML=`<b>${esc(S.cfg?S.cfg.titolo:"Sessione")}</b><small>${S.paused?"In pausa · ":""}${r?fmt(r.pos)+" / "+fmt(r.durata):"Preparazione…"} · tocca per aprire</small>`;
  m.classList.toggle("paused",!!S.paused); $("#miniPlay").innerHTML=S.paused?ic("play"):ic("pause");
  $("#miniPlay").setAttribute("aria-label",S.paused?"Riprendi la sessione":"Metti in pausa la sessione");
  return;
 }
 m.classList.remove("sessione");
 const on=mixActive()&&!S.on;
 m.classList.toggle("on",on&&Router.vista!=="suoni");
 if(!on) return;
 const p=PRESETS.find(x=>x.id===ST.lastPreset);
 $("#miniTxt").textContent=(p?p.icona+" "+p.nome:"🎚️ Mixer personale")+(Playlist.attiva?" · playlist":"");
 const inPausa=!A.running(); m.classList.toggle("paused",inPausa);
 $("#miniPlay").innerHTML=inPausa?ic("play"):ic("pause");
}

/* =========================================================
   PREFERITI, CRONOLOGIA, ULTIMA ATTIVITÀ
   ========================================================= */
const isFav=r=>ST.fav.some(f=>chiaveRef(f)===chiaveRef(r));
function toggleFav(r){ const k=chiaveRef(r); const i=ST.fav.findIndex(f=>chiaveRef(f)===k); if(i>=0){ ST.fav.splice(i,1); toast("Rimosso dai preferiti"); } else { ST.fav.unshift(r); toast("★ Aggiunto ai preferiti"); } save(); }
const favBtn=r=>`<button class="icbtn fav ${isFav(r)?"on":""}" data-act="fav" data-ref='${esc(JSON.stringify(r))}' aria-label="Preferito" title="Preferito">${ic(isFav(r)?"starf":"star")}</button>`;
const refAttr=r=>`data-ref='${esc(JSON.stringify(r))}'`;

/* consigliata del giorno: dipende dall'ora e ruota ogni giorno */
function consigliata(){
 const h=new Date().getHours(), d=Math.floor(Date.now()/864e5);
 const pool = h<5||h>=22?["m-verso-sonno","s-stelle","s-conto"]: h<10?["m-mattino","m-primi-passi","m-respiro"]: h<13?["m-attenzione","c-lavoro","m-qui-e-ora"]:
  h<15?["c-pausa","m-stress","r-tensioni"]: h<19?["m-recupero","r-lago","m-emozioni","m-gratitudine"]: ["m-sera","r-giornata","m-profondo","r-spiaggia"];
 const id=pool[d%pool.length], it=CAT_BY_ID[id];
 return {k:"cat",id,min:ST.durScelta[id]||it.durate[Math.min(1,it.durate.length-1)]};
}

/* =========================================================
   VISTE
   ========================================================= */
const V={};
const testa=(titolo,sotto,indietro)=>`${indietro?`<button class="back" data-act="back">${ic("back")} ${esc(indietro)}</button>`:""}<h1>${titolo}</h1>${sotto?`<p class="muted lead">${sotto}</p>`:""}`;
function cardRef(r,extra){
 const i=infoRef(r); if(!i) return "";
 const done=r.k==="cat"&&ST.done["cat:"+r.id];
 return `<div class="card riga" style="--pc:${i.col}" data-act="apri" ${refAttr(r)}>
  <span class="badge-ic">${i.emoji?`<span class="emo">${i.emoji}</span>`:ic(i.icona||"lotus")}</span>
  <div class="t"><h3>${esc(i.titolo)}</h3><p>${esc(extra||i.sotto)}</p></div>
  ${done?`<span class="ok" title="Completata">${ic("check")}</span>`:""}<span class="dur">${i.min?i.min+" min":""}</span></div>`;
}
function tile(id,nome,icona,col,act,attr){ return `<button class="tile" style="--pc:${col}" data-act="${act}" ${attr}><span class="tile-ic">${ic(icona)}</span><span>${nome}</span></button>`; }

/* ---------- OGGI (dashboard) ---------- */
V.home=()=>{
 const h=new Date().getHours();
 const saluto=h<5?"Buonanotte":h<12?"Buongiorno":h<18?"Buon pomeriggio":"Buonasera";
 const oggi=ST.hist.filter(x=>x.d===dayKey()).reduce((a,x)=>a+x.m,0);
 const c=consigliata(), ci=infoRef(c), it=CAT_BY_ID[c.id];
 const L=ST.last, li=L&&infoRef(L.ref);
 const riprendi=li&&L.ref.k!=="preset"&&!L.finita&&L.pos>20&&L.durata&&L.pos<L.durata-20;
 const doy=Math.floor((Date.now()-new Date(new Date().getFullYear(),0,0))/864e5);
 const imp=PROGRAMS.find(p=>p.id==="impara"), nextI=imp.sessioni.findIndex((_,i)=>!ST.done["impara:"+i]);
 return `
 <p class="eyebrow">${new Date().toLocaleDateString("it-IT",{weekday:"long",day:"numeric",month:"long"})}</p>
 <h1>${saluto}.</h1><p class="muted lead">Prenditi un momento per te.${oggi?` Oggi hai praticato ${Math.round(oggi)} min.`:""}</p>
 <div id="slotUmore"></div>
 <section class="hero card" style="--pc:${ci.col}">
  <div class="hero-orb"></div>
  <div class="hero-t"><span class="eyebrow">Consigliata oggi · ${esc(SEZ_BY_ID[it.sez].nome)}</span>
   <h2>${esc(it.t)}</h2><p class="muted">${esc(it.d)} · ${c.min} min</p>
   <div class="row"><button class="btn" data-act="avvia" ${refAttr(c)}>${ic("play")} Inizia</button><button class="btn ghost" data-act="apri" ${refAttr({k:"cat",id:c.id})}>Dettagli</button>${favBtn({k:"cat",id:c.id})}</div></div>
 </section>
 ${li&&L.ref.k!=="preset"?`<div class="card riga resume" style="--pc:${li.col}">
  <span class="badge-ic">${ic(riprendi?"play":"repeat")}</span>
  <div class="t"><small class="muted">${riprendi?"Riprendi da dove eri rimasto":"Ultima attività"}</small><h3>${esc(li.titolo)}</h3>
   ${riprendi?`<div class="pbar"><i style="width:${L.pos/L.durata*100}%"></i></div>`:`<p>${esc(li.sotto)}</p>`}</div>
  ${riprendi?`<button class="btn sm" data-act="riprendi">${fmt(L.pos)} ›</button>`:`<button class="btn sm ghost" data-act="avvia" ${refAttr(L.ref)}>Ripeti</button>`}</div>`:""}
 ${li&&L.ref.k==="preset"?`<div class="card riga resume"><span class="badge-ic"><span class="emo">${li.emoji}</span></span><div class="t"><small class="muted">Ultimi suoni ascoltati</small><h3>${esc(li.titolo)}</h3></div><button class="btn sm ghost" data-act="preset" data-id="${L.ref.id}">${ic("play")}</button></div>`:""}
 <h2>Esplora</h2>
 <div class="tiles">
  ${tile("meditazione","Meditazione","lotus","#9cb8a0","vai",'data-v="sezione/meditazione"')}
  ${tile("respiro","Respirazione","wind","#9ec3d6","vai",'data-v="respiro"')}
  ${tile("rilassamento","Rilassamento","leaf","#c9b48f","vai",'data-v="sezione/rilassamento"')}
  ${tile("suoni","Musica e suoni","music","#a9c7d8","vai",'data-v="suoni"')}
  ${tile("sonno","Sonno","moon","#8e9fd0","vai",'data-v="sezione/sonno"')}
  ${tile("concentrazione","Concentrazione","target","#d6b98a","vai",'data-v="sezione/concentrazione"')}
  ${tile("preferiti","Preferiti","star","#d9a5a0","vai",'data-v="preferiti"')}
  ${tile("cronologia","Cronologia","clock","#b8a9d6","vai",'data-v="cronologia"')}
 </div>
 ${nextI>=0?`<h2>Il tuo corso</h2>${cardRef({k:"prog",p:"impara",i:nextI},`Impara a meditare · giorno ${nextI+1} di ${imp.sessioni.length}`)}`:""}
 <div class="row sp"><h2>Routine</h2><button class="link" data-act="vai" data-v="routine">Tutte ›</button></div>
 <div class="scroller">${tutteRoutine().slice(0,6).map(t=>`<button class="mini-card" style="--pc:#c9b48f" data-act="avvia" ${refAttr({k:"rt",id:t.id})}><span class="emo">${t.icona||"🧩"}</span><b>${esc(t.nome)}</b><small>${minRoutine(t)} min</small></button>`).join("")}
  <button class="mini-card add" data-act="vai" data-v="routine/nuova"><span>${ic("plus")}</span><b>Crea routine</b><small>combina più pratiche</small></button></div>
 <h2>Pratiche veloci</h2>
 <div class="grid2">
  ${cardRef({k:"br",id:"sospiro",min:2})}
  ${cardRef({k:"cat",id:"m-cinque-minuti",min:5})}
  ${cardRef({k:"cat",id:"r-grounding",min:5})}
  <div class="card riga" data-act="vai" data-v="timer"><span class="badge-ic">${ic("timer")}</span><div class="t"><h3>Timer silenzioso</h3><p>Silenzio con campane</p></div></div>
 </div>
 <h2>Pensiero del giorno</h2>
 <div class="card quote">«${esc(THOUGHTS[doy%THOUGHTS.length])}»</div>
 <div id="slotInstalla"></div>`;
};
V.home.dopo=()=>{
 if(window.Umore&&Umore.cardHome) $("#slotUmore").innerHTML=Umore.cardHome();
 if(window.PWA&&PWA.bloccoInstalla) $("#slotInstalla").innerHTML=PWA.bloccoInstalla(true);
};

/* ---------- ESPLORA ---------- */
V.esplora=()=>`${testa("Esplora","Tutte le pratiche, organizzate per obiettivo e durata.")}
 <div class="grid2">${SEZIONI.map(s=>`<button class="card sez" style="--pc:${s.col}" data-act="vai" data-v="${s.id==="respiro"?"respiro":"sezione/"+s.id}">
  <span class="tile-ic">${ic(s.icona)}</span><div><h3>${esc(s.nome)}</h3><p>${esc(s.desc)}</p></div></button>`).join("")}
  <button class="card sez" style="--pc:#a9c7d8" data-act="vai" data-v="suoni"><span class="tile-ic">${ic("music")}</span><div><h3>Musica e suoni</h3><p>Musica meditativa, natura, pioggia, mare, rumori per il sonno.</p></div></button>
  <button class="card sez" style="--pc:#b8a9d6" data-act="vai" data-v="timer"><span class="tile-ic">${ic("timer")}</span><div><h3>Timer silenzioso</h3><p>Medita in silenzio con campane di inizio, fine e intervalli.</p></div></button>
 </div>
 <h2>Programmi e percorsi</h2><p class="muted small">Corsi in più giorni e raccolte tematiche, con progressi salvati.</p>
 ${CATS.map(([c,t,d])=>`<h3 class="sub">${esc(t)}</h3><div class="grid">${PROGRAMS.filter(p=>p.cat===c).map(progCard).join("")}</div>`).join("")}`;
function progCard(p){
 const n=p.sessioni.length, d=p.sessioni.filter((_,i)=>ST.done[p.id+":"+i]).length;
 return `<button class="card prog" style="--pc:${p.col}" data-act="vai" data-v="programma/${p.id}">
  <span class="emo">${p.icona}</span><span class="lv">${esc(p.livello)}</span>
  <h3>${esc(p.nome)}</h3><p>${n} sessioni${d?` · ${d} completate`:""}</p>
  <div class="pbar"><i style="width:${n?d/n*100:0}%"></i></div></button>`;
}
/* sezione: meditazione, rilassamento, sonno, concentrazione */
V.sezione=(id)=>{
 const s=SEZ_BY_ID[id]; if(!s) return V.esplora();
 const filtro=Router.param.durata||0;
 const items=CATALOGO.filter(x=>x.sez===id);
 const dur=[...new Set(items.flatMap(x=>x.durate))].sort((a,b)=>a-b);
 const progs={meditazione:["impara","base","intermedio","avanzato","trascendente","mindfulness","metta","gratitudine","umore"],rilassamento:["rilassamento","ansia","guarigione","lasciare"],sonno:["sonno"],concentrazione:["concentrazione","mattino","migliorarsi"]}[id]||[];
 const extra=id==="sonno"?`<h2>Respiri per il sonno</h2><div class="grid2">${BR_ORDINE.filter(b=>(BR[b].tag||[]).includes("sonno")).map(b=>cardRef({k:"br",id:b,min:BR[b].durata})).join("")}</div>
  <h2>Suoni per dormire</h2><div class="grid">${PRESETS.filter(p=>["rumori","notte","acqua","mare"].includes(p.c)).map(presetCard).join("")}</div>
  <p class="note">Imposta il <b>timer di autospegnimento</b> dal lettore o dalla sezione Suoni: la musica si dissolve dolcemente anche a schermo spento.</p>`
 :id==="concentrazione"?`<h2>Respiri per la concentrazione</h2><div class="grid2">${BR_ORDINE.filter(b=>(BR[b].tag||[]).includes("concentrazione")).map(b=>cardRef({k:"br",id:b,min:BR[b].durata})).join("")}</div>
  <h2>Suoni per concentrarsi</h2><div class="grid">${["focus","pioggiasola","rosa","bianco","pianoforte","notturno"].map(i=>presetCard(PRESETS.find(p=>p.id===i))).join("")}</div>`:"";
 const sub=(SOTTO[id]||[]).map(([k,n])=>{ const lst=items.filter(x=>x.sub===k&&(!filtro||x.durate.includes(filtro))); if(!lst.length) return "";
  return `<h3 class="sub">${esc(n)}</h3><div class="grid2">${lst.map(x=>cardCat(x,filtro)).join("")}</div>`; }).join("");
 return `${testa(esc(s.nome),esc(s.desc),"Esplora")}
  <div class="chips" role="group" aria-label="Durata"><button class="chip ${!filtro?"on":""}" data-act="filtro" data-d="0">Tutte</button>${dur.map(d=>`<button class="chip ${filtro===d?"on":""}" data-act="filtro" data-d="${d}">${d} min</button>`).join("")}</div>
  ${sub||'<p class="muted">Nessun contenuto con questa durata.</p>'}
  ${extra}
  ${progs.length?`<h2>Programmi correlati</h2><div class="grid">${progs.map(p=>PROGRAMS.find(x=>x.id===p)).filter(Boolean).map(progCard).join("")}</div>`:""}`;
};
function cardCat(x,min){
 const s=SEZ_BY_ID[x.sez]; const m=min&&x.durate.includes(min)?min:(ST.durScelta[x.id]||x.durate[0]);
 return `<div class="card riga" style="--pc:${s.col}" data-act="apri" ${refAttr({k:"cat",id:x.id})}>
  <span class="badge-ic">${ic(s.icona)}</span><div class="t"><h3>${esc(x.t)}</h3><p>${esc(x.d)}</p><p class="durs">${x.durate.map(d=>`<span>${d}′</span>`).join("")} · ${esc(x.livello)}</p></div>
  ${ST.done["cat:"+x.id]?`<span class="ok">${ic("check")}</span>`:""}</div>`;
}
/* dettaglio contenuto del catalogo */
V.contenuto=(id)=>{
 const x=CAT_BY_ID[id]; if(!x) return V.esplora(); const s=SEZ_BY_ID[x.sez];
 const m=ST.durScelta[id]&&x.durate.includes(ST.durScelta[id])?ST.durScelta[id]:x.durate[0];
 const passi=copione(x,m).map(p=>typeof p==="string"?p.slice(0,p.lastIndexOf("|")):p.b?"🌬️ "+BR[p.b].nome:p.t).filter(Boolean);
 const r={k:"cat",id,min:m};
 return `<button class="back" data-act="back">${ic("back")} ${esc(s.nome)}</button>
 <div class="card phead" style="--pc:${s.col}"><span class="tile-ic">${ic(s.icona)}</span>
  <h1>${esc(x.t)}</h1><p class="muted lead">${esc(x.d)}</p>
  <p class="meta">${esc(x.livello)} · ${esc((SOTTO[x.sez]||[]).find(z=>z[0]===x.sub)?.[1]||"")}${x.sonno?" · si conclude senza risveglio":""}</p>
  ${x.nota?`<div class="note">${esc(x.nota)}</div>`:""}
  <h3 class="sub">Durata</h3>
  <div class="chips">${x.durate.map(d=>`<button class="chip ${d===m?"on":""}" data-act="durata" data-id="${id}" data-d="${d}">${d} min</button>`).join("")}</div>
  <div class="row" style="margin-top:18px"><button class="btn lg" data-act="avvia" ${refAttr(r)}>${ic("play")} Inizia · ${m} min</button>${favBtn({k:"cat",id})}</div>
 </div>
 <h2>Cosa farai</h2>
 <ol class="anteprima">${passi.slice(0,40).map(t=>`<li>${esc(t)}</li>`).join("")}</ol>`;
};
/* programma esistente */
V.programma=(pid)=>{
 const p=PROGRAMS.find(x=>x.id===pid); if(!p) return V.esplora();
 const n=p.sessioni.length, d=p.sessioni.filter((_,i)=>ST.done[p.id+":"+i]).length;
 return `<button class="back" data-act="back">${ic("back")} Indietro</button>
 <div class="card phead" style="--pc:${p.col}"><span class="emo big">${p.icona}</span><h1>${esc(p.nome)}</h1>
  <p class="muted lead">${esc(p.desc)}</p><p class="meta">${esc(p.livello)} · ${d}/${n} completate</p>${p.note?`<div class="note">${esc(p.note)}</div>`:""}</div>
 <h2>Sessioni</h2>
 ${p.sessioni.map((s,i)=>{ const done=ST.done[p.id+":"+i], lock=p.seq&&i>0&&!ST.done[p.id+":"+(i-1)]&&!done; const r={k:"prog",p:p.id,i};
  return `<div class="card riga sess ${done?"done":""} ${lock?"lock":""}" style="--pc:${p.col}" data-act="avvia" ${refAttr(r)}>
   <span class="n">${done?ic("check"):lock?"🔒":i+1}</span><div class="t"><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p></div>
   <span class="dur">${Math.max(1,Math.round(durataPassi(s.steps)/60))} min</span>${favBtn(r)}</div>`; }).join("")}`;
};

/* ---------- RESPIRO ---------- */
V.respiro=()=>{
 const c=ST.brCustom;
 return `${testa("Respirazione","Esercizi guidati dal cerchio, con schede complete. Oppure crea il tuo ritmo.")}
 <section class="card editor" id="brEditor">
  <div class="row sp"><h2 style="margin:0">Crea il tuo respiro</h2><span class="tile-ic">${ic("wind")}</span></div>
  <div class="fasi">
   ${[["in","Inspirazione",1,12],["h1","Pausa a polmoni pieni",0,10],["out","Espirazione",1,16],["h2","Pausa a polmoni vuoti",0,10]].map(([k,l,mn,mx])=>`
   <div class="fase"><label>${l}</label><div class="stepper"><button data-act="brstep" data-k="${k}" data-d="-0.5" aria-label="Meno">−</button><output id="br_${k}">${c[k]} s</output><button data-act="brstep" data-k="${k}" data-d="0.5" aria-label="Più">+</button></div></div>`).join("")}
  </div>
  <div class="seg" role="group"><button class="${c.modo!=="cicli"?"on":""}" data-act="brmodo" data-m="durata">Per durata</button><button class="${c.modo==="cicli"?"on":""}" data-act="brmodo" data-m="cicli">Per numero di cicli</button></div>
  <div class="fase ${c.modo==="cicli"?"hidden":""}"><label>Durata totale</label><div class="stepper"><button data-act="brstep" data-k="min" data-d="-1">−</button><output id="br_min">${c.min} min</output><button data-act="brstep" data-k="min" data-d="1">+</button></div></div>
  <div class="fase ${c.modo!=="cicli"?"hidden":""}"><label>Numero di cicli</label><div class="stepper"><button data-act="brstep" data-k="cicli" data-d="-1">−</button><output id="br_cicli">${c.cicli||10}</output><button data-act="brstep" data-k="cicli" data-d="1">+</button></div></div>
  <label class="lbl">Velocità <span class="muted" id="brVelLbl">${Math.round(c.vel*100)}% del tempo</span></label>
  <input type="range" min="0.6" max="1.6" step="0.05" value="${c.vel}" data-in="brvel" aria-label="Velocità dell'esercizio">
  <div class="row small muted" style="justify-content:space-between"><span>più veloce</span><span>più lento</span></div>
  <p class="calc" id="brCalc"></p>
  <div class="opz">
   <div class="set"><div><h3>Indicazioni vocali</h3><p class="muted small">Inspira, Espira…</p></div><select class="sel sm" data-in="brcue"><option value="off">Nessuna</option><option value="inizio">Primi 2 cicli</option><option value="sempre">Ogni fase</option></select></div>
   <div class="set"><div><h3>Segnali sonori</h3><p class="muted small">Un tono morbido a ogni fase</p></div><button class="switch ${c.toni?"on":""}" data-act="brtoni" aria-label="Segnali sonori"></button></div>
   <div class="set"><div><h3>Musica</h3></div><select class="sel sm" data-in="brbg">${bgOptions(false)}</select></div>
  </div>
  ${(c.h1>0||c.h2>0)&&(c.h1>=5||c.h2>=5)?`<p class="note">Le pause trattenute lunghe non sono adatte a tutti: interrompi se senti fame d'aria o capogiri. Sconsigliate senza parere medico in gravidanza e con patologie cardiache o respiratorie.</p>`:""}
  <div class="row" style="margin-top:14px"><button class="btn lg" data-act="brcustom">${ic("play")} Inizia</button><button class="btn ghost" data-act="brsalva">Salva come preset</button></div>
  ${ST.brPreset.length?`<h3 class="sub">I tuoi preset</h3><div class="chips">${ST.brPreset.map((p,i)=>`<span class="chip preset-chip"><button data-act="brcarica" data-i="${i}">${esc(p.nome)} · ${[p.in,p.h1,p.out,p.h2].join("-")}</button><button data-act="brelimina" data-i="${i}" aria-label="Elimina">${ic("close")}</button></span>`).join("")}</div>`:""}
 </section>
 <h2>Tecniche guidate</h2>
 <div class="grid2">${BR_ORDINE.map(id=>{ const b=BR[id]; return `<div class="card riga" style="--pc:#9ec3d6" data-act="vai" data-v="tecnica/${id}">
  <span class="badge-ic"><span class="emo">${b.icona}</span></span><div class="t"><h3>${esc(b.nome)}</h3><p>${esc(b.desc)}</p>
  <p class="durs"><span>${b.f.map(f=>f[1]).join("-")} s</span> · ${esc(b.livello||"")}${b.pause?" · con pause":""}</p></div></div>`; }).join("")}</div>
 <p class="note">Gli esercizi di respirazione sono pratiche di benessere, non terapie mediche. Se senti capogiri, formicolii o fastidio, torna a respirare normalmente.</p>`;
};
V.respiro.dopo=()=>{ const c=ST.brCustom; const s=$('[data-in="brcue"]'); if(s) s.value=c.cue; const b=$('[data-in="brbg"]'); if(b) b.value=c.bg||"none"; calcBr(); };
function calcBr(){
 const c=ST.brCustom, f=brCfgCustom(c), cyc=f.reduce((a,x)=>a+x[1],0)*c.vel;
 const n=c.modo==="cicli"?(c.cicli||10):Math.max(1,Math.round(c.min*60/cyc));
 const tot=n*cyc, rpm=60/cyc;
 const el=$("#brCalc"); if(el) el.innerHTML=`Ciclo di <b>${cyc.toFixed(1)} s</b> · <b>${rpm.toFixed(1)}</b> respiri al minuto · <b>${n}</b> cicli · durata <b>${fmt(tot)}</b>`;
 ["in","h1","out","h2"].forEach(k=>{ const o=$("#br_"+k); if(o) o.textContent=c[k]+" s"; });
 const m=$("#br_min"); if(m) m.textContent=c.min+" min"; const cc=$("#br_cicli"); if(cc) cc.textContent=c.cicli||10;
}
V.tecnica=(id)=>{
 const b=BR[id]; if(!b) return V.respiro();
 const m=ST.durScelta["br:"+id]||b.durata||5, opz=[1,2,3,4,5,6,8,10,15,20].filter(x=>!b.max||x<=b.max);
 return `<button class="back" data-act="back">${ic("back")} Respirazione</button>
 <div class="card phead" style="--pc:#9ec3d6"><span class="emo big">${b.icona}</span><h1>${esc(b.nome)}</h1><p class="muted lead">${esc(b.desc)}</p>
  <p class="meta">${esc(b.livello||"")} · durata consigliata ${b.durata||5} min · ritmo ${b.f.map(f=>f[1]).join("-")} s</p>
  <h3 class="sub">Durata</h3><div class="chips">${opz.map(d=>`<button class="chip ${d===m?"on":""}" data-act="brdur" data-id="${id}" data-d="${d}">${d} min</button>`).join("")}</div>
  <div class="row" style="margin-top:18px"><button class="btn lg" data-act="avvia" ${refAttr({k:"br",id,min:m})}>${ic("play")} Inizia · ${m} min</button>${favBtn({k:"br",id})}
   <button class="btn ghost" data-act="personalizza" data-id="${id}">${ic("edit")} Personalizza</button></div></div>
 <div class="grid2" style="margin-top:14px">
  <div class="card"><h3>Obiettivo</h3><p class="muted">${esc(b.obiettivo||"")}</p></div>
  <div class="card"><h3>Fasi</h3><ul class="fasi-l">${b.f.map(f=>`<li><b>${esc(f[0])}</b><span>${f[1]} s</span></li>`).join("")}</ul></div>
 </div>
 <div class="card" style="margin-top:12px"><h3>Come si esegue</h3><ol class="anteprima">${(b.istruzioni||[]).map(t=>`<li>${esc(t)}</li>`).join("")}</ol></div>
 <div class="note">${b.pause?"<b>Attenzione:</b> ":""}${esc(b.precauzioni||"Se senti capogiri o fastidio, torna al respiro naturale.")}</div>`;
};

/* ---------- TIMER ---------- */
V.timer=()=>`${testa("Timer silenzioso","Meditazione libera con campana di inizio, di fine e a intervalli.","Indietro")}
 <h2>Durata</h2><div class="chips">${[3,5,10,15,20,30,45,60,90].map(m=>`<button class="chip ${ST.tmDur===m?"on":""}" data-act="tmdur" data-m="${m}">${m} min</button>`).join("")}</div>
 <h2>Campana a intervalli</h2><div class="chips">${[[0,"Nessuna"],[1,"Ogni minuto"],[5,"Ogni 5 min"],[10,"Ogni 10 min"],[15,"Ogni 15 min"]].map(([m,l])=>`<button class="chip ${ST.tmInt===m?"on":""}" data-act="tmint" data-m="${m}">${l}</button>`).join("")}</div>
 <h2>Sottofondo</h2><select class="sel" data-in="tmbg">${bgOptions(false)}</select>
 <div class="row" style="margin-top:22px"><button class="btn lg" data-act="avvia" ${refAttr({k:"timer",min:ST.tmDur,int:ST.tmInt,bg:ST.tmBg})}>${ic("play")} Inizia · ${ST.tmDur} min</button>${favBtn({k:"timer",min:ST.tmDur,int:ST.tmInt,bg:ST.tmBg})}</div>`;
V.timer.dopo=()=>{ const s=$('[data-in="tmbg"]'); if(s) s.value=ST.tmBg||"none"; };

/* ---------- SUONI ---------- */
function presetCard(p){ if(!p) return ""; const on=ST.lastPreset===p.id&&mixActive();
 return `<div class="card preset ${on?"on":""}" style="--pc:#a9c7d8"><button class="preset-main" data-act="preset" data-id="${p.id}"><span class="emo">${p.icona}</span><h3>${esc(p.nome)}</h3><p>${esc(p.desc)}</p></button>${favBtn({k:"preset",id:p.id})}</div>`; }
const Suoni={
 aggiornaStato(){
  const on=mixActive(), run=A.running(); const p=PRESETS.find(x=>x.id===ST.lastPreset);
  const b=$("#suNow"); if(!b) return;
  b.classList.toggle("on",on);
  $("#suNowT").textContent=on?(p?p.icona+" "+p.nome:"🎚️ Mixer personale")+(Playlist.attiva?" · "+Playlist.attiva.pl.nome:""):"Niente in riproduzione";
  $("#suPlay").innerHTML=on&&run?ic("pause"):ic("play"); $("#suPlay").setAttribute("aria-label",on&&run?"Pausa":"Riproduci");
  $$(".preset").forEach(el=>{ const id=el.querySelector("[data-id]").dataset.id; el.classList.toggle("on",on&&id===ST.lastPreset); });
  $$("[data-layer]").forEach(r=>{ const v=ST.mix[r.dataset.layer]||0; if(+r.value!==v) r.value=v; r.closest(".mix").classList.toggle("on",v>0); });
 }
};
V.suoni=()=>{
 const cat=Router.param.cat||"tutte";
 const lista=cat==="tutte"?PRESETS:cat==="preferiti"?PRESETS.filter(p=>isFav({k:"preset",id:p.id})):PRESETS.filter(p=>p.c===cat);
 let g="";
 return `${testa("Musica e suoni","Musiche e ambienti generati dal vivo: senza fine, senza pubblicità, anche offline.")}
 <section class="card now" id="suNow">
  <div class="row sp"><div><small class="muted">In riproduzione</small><h3 id="suNowT"></h3></div>
   <div class="row"><button class="big sm" id="suPlay" data-act="mustoggle" aria-label="Riproduci">${ic("play")}</button><button class="icbtn" data-act="musstop" aria-label="Ferma">${ic("stop")}</button></div></div>
  <label class="lbl">${ic("vol")} Volume musica e suoni</label><input type="range" min="0" max="1" step="0.01" value="${ST.volMusica}" data-in="volmusica" aria-label="Volume musica">
  <details class="timer-d"><summary>${ic("moon")} Timer di autospegnimento <span class="muted" data-sleeplbl></span></summary>${sceltaSpegni()}</details>
 </section>
 <div class="chips scroll-x" role="tablist">${[["tutte","Tutte"],["preferiti","★ Preferiti"],...CAT_SUONI].map(([c,n])=>`<button class="chip ${cat===c?"on":""}" data-act="sucat" data-c="${c}">${esc(n)}</button>`).join("")}</div>
 <div class="grid">${lista.map(presetCard).join("")||'<p class="muted">Nessun preferito: tocca ☆ su un\'atmosfera.</p>'}</div>
 <div class="row sp"><h2>Playlist</h2><button class="link" data-act="plnuova">${ic("plus")} Nuova</button></div>
 <div id="plEditor"></div>
 ${ST.playlist.length?ST.playlist.map((pl,i)=>`<div class="card riga"><span class="badge-ic">${ic("list")}</span><div class="t"><h3>${esc(pl.nome)}</h3><p>${pl.voci.map(v=>(PRESETS.find(p=>p.id===v.id)||{}).nome+" "+v.min+"′").join(" · ")}</p>
  <p class="durs">${pl.casuale?"<span>casuale</span>":""}${pl.ripeti?"<span>ripeti</span>":""}</p></div>
  <button class="icbtn" data-act="listaplay" data-i="${i}" aria-label="Riproduci playlist">${ic("play")}</button><button class="icbtn" data-act="pledit" data-i="${i}" aria-label="Modifica">${ic("edit")}</button></div>`).join(""):'<p class="muted small">Crea una sequenza di atmosfere: per esempio 20 minuti di pioggia, poi 30 di rumore rosa.</p>'}
 <h2>Mixer</h2><p class="muted small">Combina liberamente i livelli. ${ic("music")} I binaurali richiedono le cuffie.</p>
 <div class="mixer">${Object.entries(A.defs).sort((a,b)=>a[1].g.localeCompare(b[1].g)).map(([id,d])=>{ const head=d.g!==g?`<p class="mix-g">${esc(g=d.g)}</p>`:""; const v=ST.mix[id]||0;
  return head+`<div class="mix ${v>0?"on":""}"><span class="emo">${d.icona}</span><span class="nm">${esc(d.nome)}</span><input type="range" min="0" max="1" step="0.01" value="${v}" data-layer="${id}" aria-label="${esc(d.nome)}"></div>`; }).join("")}</div>
 <p class="note">Tutti i suoni sono sintetizzati dall'app in tempo reale: liberi da diritti, leggeri e disponibili anche offline.</p>`;
};
V.suoni.dopo=()=>{ Suoni.aggiornaStato(); aggiornaSpegni(); };
let PLED=null;
function editorPlaylist(){
 const el=$("#plEditor"); if(!el) return; if(!PLED){ el.innerHTML=""; return; }
 el.innerHTML=`<div class="card editor"><label class="lbl">Nome</label><input class="sel" id="plNome" value="${esc(PLED.nome)}" maxlength="40">
  ${PLED.voci.map((v,i)=>`<div class="blocco"><select class="sel sm" data-pl="id" data-i="${i}">${PRESETS.map(p=>`<option value="${p.id}" ${p.id===v.id?"selected":""}>${p.icona} ${esc(p.nome)}</option>`).join("")}</select>
   <div class="stepper sm"><button data-act="listamin" data-i="${i}" data-d="-5">−</button><output>${v.min} min</output><button data-act="listamin" data-i="${i}" data-d="5">+</button></div>
   <button class="icbtn" data-act="plrm" data-i="${i}" aria-label="Rimuovi">${ic("trash")}</button></div>`).join("")}
  <button class="btn sm ghost" data-act="pladd">${ic("plus")} Aggiungi atmosfera</button>
  <div class="set"><div><h3>${ic("shuffle")} Riproduzione casuale</h3></div><button class="switch ${PLED.casuale?"on":""}" data-act="plcas"></button></div>
  <div class="set"><div><h3>${ic("repeat")} Ripetizione continua</h3></div><button class="switch ${PLED.ripeti?"on":""}" data-act="plrip"></button></div>
  <div class="row"><button class="btn sm" data-act="plsalva">Salva</button><button class="btn sm ghost" data-act="planulla">Annulla</button>${PLED.i!=null?`<button class="btn sm ghost danger" data-act="plelimina">Elimina</button>`:""}</div></div>`;
}

/* ---------- PREFERITI e CRONOLOGIA ---------- */
V.preferiti=()=>`${testa("Preferiti","Le pratiche e i suoni che ami, a portata di tocco.","Indietro")}
 ${ST.fav.length?`<div class="grid2">${ST.fav.map(r=>r.k==="preset"?presetCard(PRESETS.find(p=>p.id===r.id)):cardRef(r)).join("")}</div>`:`<div class="vuoto">${ic("star")}<p>Nessun preferito ancora.<br>Tocca ☆ su una meditazione, un respiro o un suono.</p></div>`}`;
V.cronologia=()=>{
 const days=[]; for(let i=6;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);const k=dayKey(d);days.push({l:d.toLocaleDateString("it-IT",{weekday:"short"}).slice(0,3),m:ST.hist.filter(h=>h.d===k).reduce((a,h)=>a+h.m,0)})}
 const mx=Math.max(10,...days.map(d=>d.m));
 const gruppi={}; ST.hist.slice(0,150).forEach(h=>{ (gruppi[h.d]=gruppi[h.d]||[]).push(h); });
 return `${testa("Cronologia","Le tue sessioni, con la durata effettivamente praticata.","Indietro")}
 <div class="stats">${stat(streak(),"giorni di fila")}${stat(Math.round(ST.minutes),"minuti totali")}${stat(ST.sessions,"sessioni")}${stat(ST.hist.filter(h=>h.full).length,"completate")}</div>
 <h2>Ultimi 7 giorni</h2><div class="card"><div class="week">${days.map(d=>`<div><span>${d.m?Math.round(d.m):""}</span><i style="height:${d.m/mx*80}%"></i><span>${d.l}</span></div>`).join("")}</div></div>
 ${Object.keys(gruppi).length?Object.entries(gruppi).map(([d,l])=>`<h3 class="sub">${new Date(d+"T12:00").toLocaleDateString("it-IT",{weekday:"long",day:"numeric",month:"long"})}</h3>
  <div class="card">${l.map(h=>`<div class="hist"><div><b>${esc(h.t)}</b><br><small class="muted">${esc(h.p)} · ${new Date(h.ts).toLocaleTimeString("it-IT",{hour:"2-digit",minute:"2-digit"})}</small></div>
  <div class="r"><span>${Math.max(1,Math.round(h.m))} min ${h.full?"":'<small class="muted">· interrotta</small>'} ${h.mood?["","😣","😕","😐","🙂","😌"][h.mood]:""}</span>${h.ref&&infoRef(h.ref)?`<button class="icbtn sm" data-act="avvia" ${refAttr(h.ref)} aria-label="Ripeti">${ic("repeat")}</button>`:""}</div></div>`).join("")}</div>`).join("")
 :`<div class="vuoto">${ic("clock")}<p>Nessuna sessione ancora.</p></div>`}`;
};
const stat=(v,l)=>`<div class="card stat"><b>${v}</b><span>${l}</span></div>`;
function streak(){ const days=new Set(ST.hist.map(h=>h.d)); let s=0; const d=new Date(); if(!days.has(dayKey(d))) d.setDate(d.getDate()-1); while(days.has(dayKey(d))){ s++; d.setDate(d.getDate()-1); } return s; }
function bestStreak(){ const days=[...new Set(ST.hist.map(h=>h.d))].sort(); let best=0,cur=0,prev=null; days.forEach(k=>{ const t=new Date(k+"T12:00:00"); if(prev&&(t-prev)/864e5<1.5) cur++; else cur=1; best=Math.max(best,cur); prev=t; }); return best; }

/* ---------- ROUTINE ---------- */
let RTED=null;
V.routine=(sub)=>{
 if(sub==="nuova"||sub==="modifica"){ if(!RTED) RTED={id:"u"+Date.now(),nome:"La mia routine",icona:"🧩",blocchi:[{k:"respiro",id:"diaframmatica",min:3},{k:"med",id:"m-respiro",min:5}],bg:"none"}; return editorRoutine(); }
 return `${testa("Routine","Programmi che combinano più attività in una sola sessione.","Indietro")}
 <div class="row"><button class="btn" data-act="vai" data-v="routine/nuova">${ic("plus")} Crea una routine</button></div>
 <h2>Le tue routine</h2>${ST.routine.length?ST.routine.map(rtCard).join(""):'<p class="muted small">Non hai ancora creato routine.</p>'}
 <h2>Routine pronte</h2>${ROUTINE_BASE.map(rtCard).join("")}`;
};
function rtCard(t){ const mia=ST.routine.includes(t); const r={k:"rt",id:t.id};
 return `<div class="card riga" style="--pc:#c9b48f"><span class="badge-ic"><span class="emo">${t.icona||"🧩"}</span></span>
  <div class="t" data-act="avvia" ${refAttr(r)}><h3>${esc(t.nome)}</h3><p>${t.blocchi.map(descBlocco).join(" → ")}</p></div><span class="dur">${minRoutine(t)} min</span>
  ${favBtn(r)}<button class="icbtn" data-act="${mia?"rtedit":"rtcopia"}" data-id="${t.id}" aria-label="${mia?"Modifica":"Duplica e modifica"}" title="${mia?"Modifica":"Duplica e modifica"}">${ic("edit")}</button></div>`; }
function descBlocco(b){ if(b.k==="respiro") return (BR[b.id]||{nome:"Respiro"}).nome+" "+b.min+"′"; if(b.k==="med") return (CAT_BY_ID[b.id]||{t:"Meditazione"}).t+" "+b.min+"′"; return (b.k==="musica"?"Musica":"Silenzio")+" "+b.min+"′"; }
function editorRoutine(){
 const R=RTED;
 const optMed=it=>SEZIONI.filter(s=>s.id!=="respiro").map(s=>`<optgroup label="${esc(s.nome)}">${CATALOGO.filter(x=>x.sez===s.id&&!x.focus).map(x=>`<option value="${x.id}" ${x.id===it?"selected":""}>${esc(x.t)}</option>`).join("")}</optgroup>`).join("");
 return `<button class="back" data-act="back">${ic("back")} Routine</button><h1>${ST.routine.some(x=>x.id===R.id)?"Modifica routine":"Nuova routine"}</h1>
 <div class="card editor">
  <label class="lbl">Nome</label><input class="sel" id="rtNome" value="${esc(R.nome)}" maxlength="40">
  <h3 class="sub">Attività (${minRoutine(R)} min in totale)</h3>
  ${R.blocchi.map((b,i)=>`<div class="blocco">
   <select class="sel sm" data-rt="k" data-i="${i}"><option value="respiro" ${b.k==="respiro"?"selected":""}>Respirazione</option><option value="med" ${b.k==="med"?"selected":""}>Meditazione / rilassamento</option><option value="musica" ${b.k==="musica"?"selected":""}>Musica</option><option value="silenzio" ${b.k==="silenzio"?"selected":""}>Silenzio</option></select>
   ${b.k==="respiro"?`<select class="sel sm" data-rt="id" data-i="${i}">${BR_ORDINE.map(id=>`<option value="${id}" ${id===b.id?"selected":""}>${esc(BR[id].nome)}</option>`).join("")}</select>`:b.k==="med"?`<select class="sel sm" data-rt="id" data-i="${i}">${optMed(b.id)}</select>`:""}
   <div class="stepper sm"><button data-act="rtmin" data-i="${i}" data-d="-1">−</button><output>${b.min} min</output><button data-act="rtmin" data-i="${i}" data-d="1">+</button></div>
   <div class="row"><button class="icbtn sm" data-act="rtsu" data-i="${i}" aria-label="Sposta su">${ic("up")}</button><button class="icbtn sm" data-act="rtgiu" data-i="${i}" aria-label="Sposta giù">${ic("down")}</button><button class="icbtn sm" data-act="rtrm" data-i="${i}" aria-label="Rimuovi">${ic("trash")}</button></div>
  </div>`).join("")}
  <button class="btn sm ghost" data-act="rtadd">${ic("plus")} Aggiungi attività</button>
  <label class="lbl">Musica di sottofondo</label><select class="sel" id="rtBg">${bgOptions(false)}</select>
  <div class="row" style="margin-top:16px"><button class="btn" data-act="rtsalva">Salva</button><button class="btn ghost" data-act="rtprova">${ic("play")} Prova</button>${ST.routine.some(x=>x.id===R.id)?`<button class="btn ghost danger" data-act="rtelimina">Elimina</button>`:""}</div>
 </div>`;
}
V.routine.dopo=()=>{ const b=$("#rtBg"); if(b&&RTED) b.value=RTED.bg||"none"; };

/* ---------- PROMEMORIA ---------- */
const TIPI_PROM={quotidiana:["Sessione quotidiana","È il momento della tua pratica quotidiana 🌱"],respiro:["Pausa respiratoria","Fermati un momento: tre minuti di respiro 🌬️"],serale:["Meditazione serale","La giornata finisce: chiudila con calma 🌙"],programma:["Il tuo programma","Continua la tua routine 🧩"]};
const GIORNI=[[1,"Lun"],[2,"Mar"],[3,"Mer"],[4,"Gio"],[5,"Ven"],[6,"Sab"],[0,"Dom"]];
V.promemoria=()=>{
 const nat=!!Promemoria.nativo();
 return `${testa("Promemoria","Notifiche facoltative per ricordarti di praticare. Puoi disattivarle quando vuoi.","Indietro")}
 <div class="card"><div class="set"><div><h3>Promemoria attivi</h3><p class="muted small">Interruttore generale</p></div><button class="switch ${ST.promemoriaOn?"on":""}" data-act="promall"></button></div></div>
 ${nat?"":`<p class="note">Nel browser i promemoria non possono essere programmati in modo affidabile ad app chiusa. Usa l'<b>app Android</b> (notifiche programmate dal sistema) oppure <b>aggiungili al calendario</b> del telefono con il pulsante qui sotto: funziona su ogni dispositivo.</p>`}
 ${ST.promemoria.map((p,i)=>`<div class="card editor prom ${p.on?"":"spento"}">
  <div class="row sp"><select class="sel sm" data-pr="tipo" data-i="${i}">${Object.entries(TIPI_PROM).map(([k,v])=>`<option value="${k}" ${k===p.tipo?"selected":""}>${v[0]}</option>`).join("")}</select><button class="switch ${p.on?"on":""}" data-act="prton" data-i="${i}" aria-label="Attivo"></button></div>
  ${p.tipo==="programma"?`<select class="sel sm" data-pr="rt" data-i="${i}">${tutteRoutine().map(t=>`<option value="${t.id}" ${t.id===p.rt?"selected":""}>${esc(t.nome)}</option>`).join("")}</select>`:""}
  <div class="row"><label class="lbl" style="margin:0">Ora</label><input type="time" class="sel sm" value="${p.ora}" data-pr="ora" data-i="${i}" style="width:auto"></div>
  <div class="giorni">${GIORNI.map(([g,l])=>`<button class="${p.giorni.includes(g)?"on":""}" data-act="prg" data-i="${i}" data-g="${g}">${l}</button>`).join("")}</div>
  <div class="row small"><button class="link" data-act="prfreq" data-i="${i}" data-f="tutti">Ogni giorno</button><button class="link" data-act="prfreq" data-i="${i}" data-f="feriali">Giorni feriali</button><button class="link" data-act="prfreq" data-i="${i}" data-f="weekend">Weekend</button></div>
  <div class="row"><button class="btn sm ghost" data-act="prics" data-i="${i}">${ic("download")} Aggiungi al calendario</button><button class="icbtn" data-act="prrm" data-i="${i}" aria-label="Elimina">${ic("trash")}</button></div>
 </div>`).join("")}
 <button class="btn" data-act="pradd">${ic("plus")} Nuovo promemoria</button>`;
};

/* ---------- TU (profilo) ---------- */
const BADGES=[
 ["🌱","Primo respiro",()=>ST.sessions>=1],["🔥","3 giorni di fila",()=>bestStreak()>=3],["🌙","7 giorni di fila",()=>bestStreak()>=7],
 ["🏔️","30 giorni di fila",()=>bestStreak()>=30],["⏳","60 minuti",()=>ST.minutes>=60],["🌊","300 minuti",()=>ST.minutes>=300],
 ["🎓","Corso completato",()=>PROGRAMS[0].sessioni.every((_,i)=>ST.done["impara:"+i])],["✨","Trascendente",()=>Object.keys(ST.done).some(k=>k.startsWith("trascendente"))],
 ["🧭","Esploratore",()=>new Set(Object.keys(ST.done).map(k=>k.split(":")[0]==="cat"?k:k.split(":")[0])).size>=8]
];
V.tu=()=>{
 const moods=ST.hist.filter(h=>h.mood), avg=moods.length?moods.reduce((a,h)=>a+h.mood,0)/moods.length:0;
 return `${testa("Il tuo spazio","Progressi, preferenze e impostazioni.")}
 <div class="stats">${stat(streak(),"serie attuale")}${stat(bestStreak(),"serie migliore")}${stat(Math.round(ST.minutes),"minuti")}${stat(avg?["","😣","😕","😐","🙂","😌"][Math.round(avg)]:"—","umore dopo")}</div>
 <div class="lista card">
  ${[["preferiti","star","Preferiti",ST.fav.length+" elementi"],["cronologia","clock","Cronologia",ST.sessions+" sessioni"],["routine","list","Routine",tutteRoutine().length+" programmi"],["promemoria","bell","Promemoria",ST.promemoria.filter(p=>p.on).length+" attivi"],["impostazioni","settings","Impostazioni","voce, audio, tema, dati"]]
   .map(([v,i,n,d])=>`<button class="voce" data-act="vai" data-v="${v}">${ic(i)}<span><b>${n}</b><small class="muted">${d}</small></span>${ic("chev")}</button>`).join("")}
 </div>
 <div id="slotUmoreTu"></div>
 <h2>Traguardi</h2>
 <div class="badges">${BADGES.map(([i,n,t])=>`<div class="card badge ${t()?"":"off"}"><span class="emo">${i}</span>${n}</div>`).join("")}</div>
 <p class="muted small" style="margin-top:18px">I dati restano solo su questo dispositivo. MeditoPedia non sostituisce il parere di medici o psicoterapeuti.</p>`;
};
V.tu.dopo=()=>{ if(window.Umore&&Umore.storico) $("#slotUmoreTu").innerHTML=Umore.storico(); };

/* ---------- IMPOSTAZIONI ---------- */
V.impostazioni=()=>{
 const vs=Voce.VOCI;
 return `${testa("Impostazioni","","Il tuo spazio")}
 <h2>Aspetto</h2>
 <div class="card"><div class="seg" role="group">${[["auto","Automatico"],["notte","Notte"],["giorno","Giorno"]].map(([k,l])=>`<button class="${ST.tema===k?"on":""}" data-act="tema" data-t="${k}">${l}</button>`).join("")}</div></div>
 <h2>Voce guida</h2>
 <div class="card">
  <div class="set"><div><h3>Voce guida attiva</h3><p class="muted small">Se disattivata, le istruzioni appaiono solo come testo</p></div><button class="switch ${ST.voice?"on":""}" data-act="togglevoice"></button></div>
  <div class="voci">${Object.entries(vs).map(([id,v])=>`<div class="card preset voce-c ${ST.voceInt===id?"on":""}">
   <button class="preset-main" data-act="voce" data-id="${id}"><span class="emo">${v.icona}</span><h3>${v.nome}</h3><p>${esc(v.desc)}</p><p class="small accent">${v.g} · Italiano</p></button>
   <button class="icbtn" data-act="anteprima" data-id="${id}" aria-label="Ascolta ${v.nome}">${ic("play")}</button></div>`).join("")}</div>
  <label class="lbl">Velocità della voce <span class="muted" id="spdLab">${Math.round(ST.voceSpeed*100)}%</span></label>
  <input type="range" min="0.7" max="1.3" step="0.05" value="${ST.voceSpeed}" data-in="vocespeed" aria-label="Velocità della voce">
  <div class="row small muted" style="justify-content:space-between"><span>più lenta</span><span>più veloce</span></div>
  <p class="muted small" style="margin-top:10px">Le voci sono registrazioni pre-generate e identiche su ogni dispositivo. Non sono disponibili altre lingue né una voce neutra: vedi la sezione Crediti per i dettagli.</p>
 </div>
 <h2>Audio</h2>
 <div class="card">
  <label class="lbl">${ic("voice")} Volume voce</label><input type="range" min="0" max="1.5" step="0.05" value="${ST.volVoce}" data-in="volvoce">
  <label class="lbl">${ic("music")} Volume musica</label><input type="range" min="0" max="1" step="0.01" value="${ST.volMusica}" data-in="volmusica">
  <label class="lbl">Abbassa la musica mentre parla la voce <span class="muted" id="duckLbl">${Math.round((1-ST.duck)*100)}%</span></label><input type="range" min="0.1" max="1" step="0.05" value="${ST.duck}" data-in="duck">
  <label class="lbl">Sottofondo predefinito per le meditazioni</label><select class="sel" data-in="defbg">${bgOptions(false)}</select>
 </div>
 <h2>Respirazione</h2>
 <div class="card">
  <div class="set"><div><h3>Indicazioni vocali sulle fasi</h3></div><select class="sel sm" data-in="brcueg"><option value="off">Nessuna</option><option value="inizio">Primi 2 cicli</option><option value="sempre">Ogni fase</option></select></div>
  <div class="set"><div><h3>Segnali sonori sulle fasi</h3></div><button class="switch ${ST.brToni?"on":""}" data-act="brtonig"></button></div>
  <div class="set"><div><h3>Lettore minimale</h3><p class="muted small">Schermo scuro e luminosità ridotta durante le sessioni</p></div><button class="switch ${ST.minimale?"on":""}" data-act="minimaleg"></button></div>
 </div>
 <h2>App e dati</h2>
 <div class="card" id="slotApp"></div>
 <div class="card" style="margin-top:12px">
  <div class="set"><div><h3>Esporta i tuoi dati</h3><p class="muted small">Progressi, preferiti, routine e impostazioni in un file</p></div><button class="btn sm ghost" data-act="export">${ic("download")} Esporta</button></div>
  <div class="set"><div><h3>Importa dati</h3><p class="muted small">Ripristina da un file esportato</p></div><label class="btn sm ghost">Importa<input type="file" accept="application/json" id="impFile" hidden></label></div>
  <div class="set"><div><h3>Azzera i progressi</h3><p class="muted small">Cancella storico e sessioni completate</p></div><button class="btn sm ghost danger" data-act="reset">Azzera</button></div>
 </div>
 <h2>Crediti e licenze</h2><div class="card" id="slotCrediti"></div>`;
};
V.impostazioni.dopo=()=>{
 const sel=(q,v)=>{ const e=$(q); if(e) e.value=v; };
 sel('[data-in="defbg"]',ST.bg); sel('[data-in="brcueg"]',ST.brCue);
 const app=$("#slotApp"); if(app) app.innerHTML=[window.PWA&&PWA.bloccoImpostazioni&&PWA.bloccoImpostazioni(),window.Aggiorna&&Aggiorna.blocco&&Aggiorna.blocco(),window.Umore&&Umore.impostazione&&Umore.impostazione()].filter(Boolean).join("");
 const cr=$("#slotCrediti"); if(cr&&window.CREDITI) cr.innerHTML=CREDITI.map(c=>`<div class="hist" style="display:block"><b>${esc(c.t)}</b> <span class="small accent">· ${esc(c.l)}</span>
  <p class="muted small">${esc(c.d)}${c.u?` <a href="${c.u}" target="_blank" rel="noopener">↗</a>`:""}</p></div>`).join("")+`<p class="muted small" style="margin-top:10px">Le pratiche non sostituiscono il parere di medici o psicoterapeuti.</p>`;
};

/* =========================================================
   ROUTER (indirizzi con #)
   ========================================================= */
const Router={
 vista:"home", arg:"", param:{},
 render(){
  const h=(location.hash||"#home").slice(1).split("?")[0], [v,...rest]=h.split("/"), arg=rest.join("/");
  const vista=V[v]?v:(v==="musica"?"suoni":v==="programmi"?"esplora":"home");
  if(vista!==this.vista) this.param={};
  this.vista=vista; this.arg=arg;
  const el=$("#vista"); el.innerHTML=V[vista](arg); el.classList.remove("entra"); void el.offsetWidth; el.classList.add("entra");
  if(V[vista].dopo) V[vista].dopo(arg);
  const tab={home:"home",esplora:"esplora",sezione:"esplora",contenuto:"esplora",programma:"esplora",timer:"esplora",respiro:"respiro",tecnica:"respiro",suoni:"suoni"}[vista]||"tu";
  $$("nav.bottom button").forEach(b=>b.classList.toggle("on",b.dataset.v===tab));
  aggiornaMini(); if(vista==="respiro") calcBr(); if(vista==="suoni") editorPlaylist();
  document.title=({home:"MeditoPedia",suoni:"Suoni · MeditoPedia",respiro:"Respiro · MeditoPedia"})[vista]||"MeditoPedia";
 },
 vai(v){ if(location.hash==="#"+v) { this.render(); return; } location.hash=v; },
 indietro(){ if(history.length>1) history.back(); else this.vai("home"); }
};
window.addEventListener("hashchange",()=>{ Router.render(); window.scrollTo({top:0,behavior:"instant"}); });

/* =========================================================
   PROMEMORIA
   App Android: notifiche locali programmate dal sistema (@capacitor/local-notifications),
   funzionano ad app chiusa. Browser: esportazione nel calendario (.ics con ripetizione
   settimanale e avviso) e notifiche solo mentre l'app è aperta.
   ========================================================= */
const Promemoria={
 nativo(){ try{ return window.Capacitor&&window.Capacitor.isNativePlatform&&window.Capacitor.isNativePlatform()&&window.Capacitor.Plugins.LocalNotifications; }catch(e){ return null; } },
 async programma(){
  const ln=this.nativo(); if(!ln) return;
  try{
   const pend=await ln.getPending(); const vecchi=(pend.notifications||[]).filter(n=>n.id>=5000&&n.id<6000).map(n=>({id:n.id}));
   if(vecchi.length) await ln.cancel({notifications:vecchi});
   if(!ST.promemoriaOn) return;
   const lst=[];
   ST.promemoria.forEach((p,i)=>{ if(!p.on) return; const [hh,mm]=p.ora.split(":").map(Number); const t=TIPI_PROM[p.tipo];
    p.giorni.forEach(g=>lst.push({id:5000+i*10+g,title:t[0],body:p.tipo==="programma"?("Routine: "+((tutteRoutine().find(r=>r.id===p.rt)||{}).nome||"")):t[1],
     schedule:{on:{weekday:g+1,hour:hh,minute:mm},allowWhileIdle:true},extra:{tipo:p.tipo,rt:p.rt||""}})); });
   if(lst.length){ const perm=await ln.checkPermissions(); if(perm.display!=="granted"){ const r=await ln.requestPermissions(); if(r.display!=="granted"){ toast("Notifiche non consentite: abilitale nelle impostazioni del telefono"); return; } } await ln.schedule({notifications:lst}); }
  }catch(e){ console.warn(e); }
 },
 ics(p){
  const [hh,mm]=p.ora.split(":"); const by=p.giorni.map(g=>["SU","MO","TU","WE","TH","FR","SA"][g]).join(",");
  const d=new Date(); const pad=n=>String(n).padStart(2,"0"); const start=`${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}T${hh}${mm}00`;
  const t=TIPI_PROM[p.tipo];
  const txt=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//MeditoPedia//Promemoria//IT","BEGIN:VEVENT","UID:"+Date.now()+"@meditopedia","DTSTAMP:"+new Date().toISOString().replace(/[-:]/g,"").slice(0,15)+"Z",
   "DTSTART:"+start,"DURATION:PT10M","RRULE:FREQ=WEEKLY;BYDAY="+by,"SUMMARY:MeditoPedia · "+t[0],"DESCRIPTION:"+t[1],
   "BEGIN:VALARM","ACTION:DISPLAY","DESCRIPTION:"+t[0],"TRIGGER:PT0M","END:VALARM","END:VEVENT","END:VCALENDAR"].join("\r\n");
  scarica("meditopedia-promemoria.ics",txt,"text/calendar");
 },
 /* nel browser: avviso solo se l'app è aperta (dichiarato nell'interfaccia) */
 controllaWeb(){
  if(this.nativo()||!ST.promemoriaOn) return; const d=new Date(), ora=String(d.getHours()).padStart(2,"0")+":"+String(d.getMinutes()).padStart(2,"0");
  ST.promemoria.forEach((p,i)=>{ if(!p.on||p.ora!==ora||!p.giorni.includes(d.getDay())) return; const k=dayKey()+ora+i; if(this.ultimo===k) return; this.ultimo=k;
   const t=TIPI_PROM[p.tipo]; toast("🔔 "+t[1]); try{ if("Notification" in window&&Notification.permission==="granted") new Notification("MeditoPedia · "+t[0],{body:t[1],icon:"icone/icona-192.png"}); }catch(e){} });
 }
};
setInterval(()=>Promemoria.controllaWeb(),20000);
function scarica(nome,testo,tipo){ const a=document.createElement("a"); a.href=URL.createObjectURL(new Blob([testo],{type:tipo})); a.download=nome; document.body.appendChild(a); a.click(); setTimeout(()=>{ URL.revokeObjectURL(a.href); a.remove(); },1000); }
function salvaProm(){ save(); Promemoria.programma(); }

/* =========================================================
   TEMA
   ========================================================= */
function applicaTema(){
 const t=ST.tema==="auto"?(matchMedia("(prefers-color-scheme: light)").matches?"giorno":"notte"):ST.tema;
 document.documentElement.dataset.theme=t==="giorno"?"light":"dark";
 const m=$('meta[name="theme-color"]'); if(m) m.content=t==="giorno"?"#f5f0e7":"#0f1724";
}
matchMedia("(prefers-color-scheme: light)").addEventListener?.("change",applicaTema);

/* =========================================================
   EVENTI
   ========================================================= */
const leggiRef=el=>{ try{ return JSON.parse(el.dataset.ref); }catch(e){ return null; } };
document.addEventListener("click",e=>{
 const m=e.target.closest("#moods button");
 if(m){ $$("#moods button").forEach(b=>b.classList.remove("on")); m.classList.add("on"); if(ST.hist[0]){ ST.hist[0].mood=+m.dataset.m; save(); } return; }
 const el=e.target.closest("[data-act]"); if(!el) return;
 const a=el.dataset.act, d=el.dataset;
 if(a!=="fav"&&el.closest("[data-act]")!==el) return;
 switch(a){
  case "vai": Router.vai(d.v); break;
  case "back": Router.indietro(); break;
  case "apri": { const r=leggiRef(el); if(!r) break; if(r.k==="cat") Router.vai("contenuto/"+r.id); else if(r.k==="br") Router.vai("tecnica/"+r.id); else avvia(r); break; }
  case "avvia": { const r=leggiRef(el); if(r) avvia(r); break; }
  case "riprendi": if(ST.last) avvia(ST.last.ref,ST.last.pos); break;
  case "fav": { e.stopPropagation(); const r=leggiRef(el); if(!r) break; toggleFav(r); el.classList.toggle("on",isFav(r)); el.innerHTML=ic(isFav(r)?"starf":"star"); if(Router.vista==="preferiti") Router.render(); break; }
  case "filtro": Router.param.durata=+d.d; Router.render(); break;
  case "durata": ST.durScelta[d.id]=+d.d; save(); Router.render(); break;
  case "brdur": ST.durScelta["br:"+d.id]=+d.d; save(); Router.render(); break;
  /* respiro personalizzato */
  case "brstep": { const c=ST.brCustom, k=d.k, lim={in:[1,15],h1:[0,12],out:[1,20],h2:[0,12],min:[1,60],cicli:[1,200]}[k];
   const base=k==="cicli"?(c.cicli||10):c[k]; c[k]=Math.round(Math.min(lim[1],Math.max(lim[0],base+ +d.d))*2)/2; save(); calcBr();
   if(k==="h1"||k==="h2") Router.render(); break; }
  case "brmodo": ST.brCustom.modo=d.m; if(d.m==="cicli"&&!ST.brCustom.cicli) ST.brCustom.cicli=10; save(); Router.render(); break;
  case "brtoni": ST.brCustom.toni=!ST.brCustom.toni; save(); el.classList.toggle("on",ST.brCustom.toni); break;
  case "brcustom": avvia({k:"br",id:"custom",cfg:Object.assign({},ST.brCustom),min:ST.brCustom.min}); break;
  case "brsalva": { const n=prompt("Nome del preset","Il mio respiro"); if(n){ ST.brPreset.push(Object.assign({nome:n.slice(0,30)},ST.brCustom)); save(); Router.render(); toast("Preset salvato"); } break; }
  case "brcarica": { const p=ST.brPreset[+d.i]; if(p){ ST.brCustom=Object.assign({},DEF.brCustom,p); delete ST.brCustom.nome; save(); Router.render(); toast("Preset «"+p.nome+"» caricato"); } break; }
  case "brelimina": ST.brPreset.splice(+d.i,1); save(); Router.render(); break;
  case "personalizza": { const b=BR[d.id], f=b.f, g=t=>f.filter(x=>x[3]===t);
   ST.brCustom=Object.assign({},ST.brCustom,{in:(g("in")[0]||[0,4])[1],h1:(g("hold")[0]||[0,0])[1],out:(g("out")[0]||[0,6])[1],h2:(g("rest")[0]||[0,0])[1],min:b.durata||5});
   save(); Router.vai("respiro"); setTimeout(()=>$("#brEditor")&&$("#brEditor").scrollIntoView({behavior:"smooth"}),50); toast("Ritmo copiato nell'editor: modificalo come vuoi"); break; }
  /* timer */
  case "tmdur": ST.tmDur=+d.m; save(); Router.render(); break;
  case "tmint": ST.tmInt=+d.m; save(); Router.render(); break;
  /* suoni */
  case "preset": suonaPreset(d.id); break;
  case "sucat": Router.param.cat=d.c; Router.render(); break;
  case "mustoggle": if(mixActive()){ if(A.running()){ A.suspend().then(()=>{ Sfondo.stato(true); musicaCambiata(); }); } else { A.resume().then(()=>{ Sfondo.stato(false); musicaCambiata(); }); } } else suonaPreset(ST.lastPreset||"spazio"); break;
  case "musstop": if(Motore.S.on){ terminaTutto(); break; } stopMusic(); break;
  case "miniapri": if(Motore.S.on) mostraPlayer(); else Router.vai("suoni"); break;
  case "minplay": if(Motore.S.on){ if(Motore.S.paused) Motore.riprendi(); else Motore.pausa(); setTimeout(aggiornaMini,150); break; }
   if(A.running()) A.suspend().then(()=>{ Sfondo.stato(true); aggiornaMini(); }); else A.resume().then(()=>{ Sfondo.stato(false); aggiornaMini(); }); break;
  case "sleep": Spegni.imposta(+(d.sleep||0)); break;
  case "sleepcustom": { const v=prompt("Minuti prima dello spegnimento (1-240)","25"); const n=Math.round(+v); if(n>=1&&n<=240) Spegni.imposta(n); else if(v) toast("Inserisci un numero tra 1 e 240"); break; }
  case "plnuova": PLED={nome:"La mia playlist",voci:[{id:"pioggia",min:20},{id:"rosa",min:30}],casuale:false,ripeti:false}; editorPlaylist(); break;
  case "pledit": PLED=Object.assign(JSON.parse(JSON.stringify(ST.playlist[+d.i])),{i:+d.i}); editorPlaylist(); break;
  case "pladd": PLED.voci.push({id:"onde",min:15}); editorPlaylist(); break;
  case "plrm": PLED.voci.splice(+d.i,1); editorPlaylist(); break;
  case "listamin": { const v=PLED.voci[+d.i]; v.min=Math.max(5,Math.min(240,v.min+ +d.d)); editorPlaylist(); break; }
  case "plcas": PLED.casuale=!PLED.casuale; editorPlaylist(); break;
  case "plrip": PLED.ripeti=!PLED.ripeti; editorPlaylist(); break;
  case "plsalva": { PLED.nome=($("#plNome").value||"Playlist").slice(0,40); if(!PLED.voci.length){ toast("Aggiungi almeno un'atmosfera"); break; } const i=PLED.i; delete PLED.i; if(i!=null) ST.playlist[i]=PLED; else ST.playlist.push(PLED); PLED=null; save(); Router.render(); break; }
  case "planulla": PLED=null; editorPlaylist(); break;
  case "plelimina": if(confirm("Eliminare la playlist?")){ ST.playlist.splice(PLED.i,1); PLED=null; save(); Router.render(); } break;
  case "listaplay": A.resume(); Playlist.avvia(ST.playlist[+d.i]); break;
  /* routine */
  case "rtedit": RTED=JSON.parse(JSON.stringify(ST.routine.find(x=>x.id===d.id))); Router.vai("routine/modifica"); break;
  case "rtcopia": { const o=ROUTINE_BASE.find(x=>x.id===d.id); RTED=Object.assign(JSON.parse(JSON.stringify(o)),{id:"u"+Date.now(),nome:o.nome+" (mia)"}); Router.vai("routine/nuova"); break; }
  case "rtadd": RTED.blocchi.push({k:"musica",min:5}); Router.render(); break;
  case "rtrm": RTED.blocchi.splice(+d.i,1); Router.render(); break;
  case "rtmin": { const b=RTED.blocchi[+d.i]; b.min=Math.max(1,Math.min(120,b.min+ +d.d)); Router.render(); break; }
  case "rtsu": case "rtgiu": { const i=+d.i, j=a==="rtsu"?i-1:i+1; if(j<0||j>=RTED.blocchi.length) break; [RTED.blocchi[i],RTED.blocchi[j]]=[RTED.blocchi[j],RTED.blocchi[i]]; Router.render(); break; }
  case "rtsalva": case "rtprova": { RTED.nome=($("#rtNome").value||"Routine").slice(0,40); RTED.bg=$("#rtBg").value; if(!RTED.blocchi.length){ toast("Aggiungi almeno un'attività"); break; }
   const i=ST.routine.findIndex(x=>x.id===RTED.id); if(i>=0) ST.routine[i]=RTED; else ST.routine.push(RTED); save();
   if(a==="rtprova") avvia({k:"rt",id:RTED.id}); else { toast("Routine salvata"); RTED=null; Router.vai("routine"); } break; }
  case "rtelimina": if(confirm("Eliminare questa routine?")){ ST.routine=ST.routine.filter(x=>x.id!==RTED.id); ST.fav=ST.fav.filter(f=>!(f.k==="rt"&&f.id===RTED.id)); RTED=null; save(); Router.vai("routine"); } break;
  /* promemoria */
  case "promall": ST.promemoriaOn=!ST.promemoriaOn; salvaProm(); Router.render(); break;
  case "pradd": ST.promemoria.push({tipo:"quotidiana",ora:"08:00",giorni:[1,2,3,4,5,6,0],on:true,rt:"rt-mattino"}); salvaProm(); Router.render();
   if(!Promemoria.nativo()&&"Notification" in window&&Notification.permission==="default") Notification.requestPermission().catch(()=>{}); break;
  case "prton": { const p=ST.promemoria[+d.i]; p.on=!p.on; salvaProm(); Router.render(); break; }
  case "prrm": ST.promemoria.splice(+d.i,1); salvaProm(); Router.render(); break;
  case "prg": { const p=ST.promemoria[+d.i], g=+d.g; p.giorni=p.giorni.includes(g)?p.giorni.filter(x=>x!==g):p.giorni.concat(g); salvaProm(); Router.render(); break; }
  case "prfreq": { const p=ST.promemoria[+d.i]; p.giorni={tutti:[0,1,2,3,4,5,6],feriali:[1,2,3,4,5],weekend:[6,0]}[d.f]; salvaProm(); Router.render(); break; }
  case "prics": Promemoria.ics(ST.promemoria[+d.i]); break;
  /* impostazioni */
  case "tema": ST.tema=d.t; save(); applicaTema(); Router.render(); break;
  case "togglevoice": ST.voice=!ST.voice; save(); Router.render(); break;
  case "voce": ST.voceInt=d.id; save(); Router.render(); Voce.ascolta("Trova una posizione comoda… chiudi gli occhi… e lascia che il respiro rallenti, da solo."); break;
  case "anteprima": Voce.ascolta("Trova una posizione comoda… chiudi gli occhi… e lascia che il respiro rallenti, da solo.",d.id); break;
  case "brtonig": ST.brToni=!ST.brToni; save(); el.classList.toggle("on",ST.brToni); break;
  case "minimaleg": ST.minimale=!ST.minimale; save(); el.classList.toggle("on",ST.minimale); break;
  case "export": scarica("meditopedia-dati-"+dayKey()+".json",JSON.stringify(ST,null,1),"application/json"); break;
  case "reset": if(confirm("Vuoi davvero azzerare tutti i progressi?")){ ST.done={}; ST.hist=[]; ST.minutes=0; ST.sessions=0; ST.last=null; save(); Router.render(); } break;
  /* player */
  case "plclose": riduciPlayer(); break;
  case "plstop": terminaTutto(); break;
  case "plapri": mostraPlayer(); break;
  case "plrestart": ricomincia(); break;
  case "pldone": Motore.stop(true); chiudiPlayer(); break;
  case "plplay": if(Motore.S.paused) Motore.riprendi(); else Motore.pausa(); break;
  case "plskip": Motore.avanti(); break;
  case "plprev": Motore.indietro(); break;
  case "plvoice": ST.voice=!ST.voice; save(); el.classList.toggle("off",!ST.voice); A.setVolVoce(ST.voice?ST.volVoce:0); toast(ST.voice?"Voce attiva":"Voce disattivata · solo testo"); break;
  case "plpanel": $("#player").classList.toggle("pannello"); $("#plPanel").innerHTML=pannelloPlayer(); break;
  case "plmin": $("#player").classList.toggle("minimale"); break;
  case "plseek": { const r=el.getBoundingClientRect(), x=(e.clientX-r.left)/r.width; Motore.vaiA(x*Motore.S.durata); break; }
 }
});
function pannelloPlayer(){
 return `<div class="row sp"><h3>Audio e timer</h3><button class="icbtn" data-act="plpanel" aria-label="Chiudi">${ic("close")}</button></div>
  <label class="lbl">${ic("voice")} Volume voce</label><input type="range" min="0" max="1.5" step="0.05" value="${ST.volVoce}" data-in="volvoce">
  <label class="lbl">${ic("music")} Volume musica</label><input type="range" min="0" max="1" step="0.01" value="${ST.volMusica}" data-in="volmusica">
  <h3 class="sub">${ic("moon")} Timer di autospegnimento</h3>${sceltaSpegni()}`;
}
document.addEventListener("input",e=>{
 const t=e.target, k=t.dataset.in;
 if(t.dataset.layer){ const v=+t.value; ST.mix[t.dataset.layer]=v; A.resume(); A.set(t.dataset.layer,v); t.closest(".mix").classList.toggle("on",v>0); ST.lastPreset=null; Playlist.ferma(); save(); musicaCambiata(); return; }
 if(!k) return;
 if(k==="volmusica"){ ST.volMusica=+t.value; A.setVolMusica(ST.volMusica); save(); $$('[data-in="volmusica"]').forEach(x=>{ if(x!==t) x.value=t.value; }); }
 if(k==="volvoce"){ ST.volVoce=+t.value; if(ST.voice) A.setVolVoce(ST.volVoce); save(); }
 if(k==="duck"){ ST.duck=+t.value; save(); const l=$("#duckLbl"); if(l) l.textContent=Math.round((1-ST.duck)*100)+"%"; }
 if(k==="fade"){ ST.fade=+t.value; save(); $$("#fadeLbl").forEach(l=>l.textContent=ST.fade+" s"); if(A.sleepEnd){ A.sleep(A.sleepLeft(),ST.fade); } }
 if(k==="brvel"){ ST.brCustom.vel=+t.value; save(); const l=$("#brVelLbl"); if(l) l.textContent=Math.round(ST.brCustom.vel*100)+"% del tempo"; calcBr(); }
 if(k==="vocespeed"){ ST.voceSpeed=Math.round(+t.value*100)/100; ST.rate=.88*ST.voceSpeed; save(); const l=$("#spdLab"); if(l) l.textContent=Math.round(ST.voceSpeed*100)+"%"; }
});
document.addEventListener("change",e=>{
 const t=e.target, k=t.dataset.in;
 if(t.id==="plBg"){ applyBg(t.value); return; }
 if(t.id==="impFile"&&t.files[0]){ const fr=new FileReader(); fr.onload=()=>{ try{ const o=JSON.parse(fr.result); if(!o||typeof o!=="object"||!("hist" in o)) throw 0; ST=Object.assign({},DEF,o); save(); toast("Dati importati"); setTimeout(()=>location.reload(),600); }catch(err){ toast("File non valido"); } }; fr.readAsText(t.files[0]); return; }
 if(t.dataset.pl){ const v=PLED.voci[+t.dataset.i]; v.id=t.value; return; }
 if(t.dataset.rt){ const b=RTED.blocchi[+t.dataset.i]; if(t.dataset.rt==="k"){ b.k=t.value; b.id=t.value==="respiro"?"diaframmatica":t.value==="med"?"m-respiro":undefined; } else b.id=t.value; Router.render(); return; }
 if(t.dataset.pr){ const p=ST.promemoria[+t.dataset.i]; p[t.dataset.pr]=t.value; salvaProm(); if(t.dataset.pr==="tipo") Router.render(); return; }
 if(k==="vocespeed") Voce.ascolta("Lascia che il respiro rallenti, da solo.");
 if(k==="brcue"){ ST.brCustom.cue=t.value; save(); }
 if(k==="brbg"){ ST.brCustom.bg=t.value; save(); }
 if(k==="brcueg"){ ST.brCue=t.value; save(); }
 if(k==="tmbg"){ ST.tmBg=t.value; save(); Router.render(); }
 if(k==="defbg"){ ST.bg=t.value; save(); }
});
document.addEventListener("keydown",e=>{ if(!Motore.S.on||!$("#player").classList.contains("on")) return; if(e.code==="Space"&&e.target===document.body){ e.preventDefault(); if(Motore.S.paused) Motore.riprendi(); else Motore.pausa(); } if(e.key==="Escape"&&$("#player").classList.contains("on")) riduciPlayer(); if(e.key==="ArrowRight") Motore.avanti(); if(e.key==="ArrowLeft") Motore.indietro(); });
document.addEventListener("visibilitychange",()=>{ if(!document.hidden&&Motore.S.on){ keepAwake(true); disegnaPlayer(); } });
/* app Android: in background ferma le animazioni (risparmio batteria) */
(function(){ try{ const App=window.Capacitor&&window.Capacitor.Plugins&&window.Capacitor.Plugins.App; if(!App) return;
 App.addListener("pause",()=>{ PL.inBackground=true; }); App.addListener("resume",()=>{ PL.inBackground=false; Spegni.controlla(); if(Motore.S.on) disegnaPlayer(); });
 App.addListener("backButton",({canGoBack})=>{ if($("#player").classList.contains("on")){ if($("#player").classList.contains("pannello")) $("#player").classList.remove("pannello"); else riduciPlayer(); return; }
  if(location.hash&&location.hash!=="#home") history.back(); else App.minimizeApp?App.minimizeApp():App.exitApp(); });
 const LN=window.Capacitor.Plugins.LocalNotifications; if(LN) LN.addListener("localNotificationActionPerformed",ev=>{ const x=ev.notification&&ev.notification.extra; if(x&&x.tipo==="programma"&&x.rt) setTimeout(()=>avvia({k:"rt",id:x.rt}),600); else if(x&&x.tipo==="respiro") Router.vai("respiro"); });
}catch(e){} })();

/* ---------- avvio ---------- */
A.init&&0;
Object.keys(ST.mix).forEach(k=>ST.mix[k]=0);   // la musica non riparte da sola al caricamento
applicaTema();
Router.render();
Promemoria.programma();
