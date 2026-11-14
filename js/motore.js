/* =========================================================
   MeditoPedia — Motore delle sessioni
   Ogni sessione diventa una TIMELINE deterministica (tempi in secondi):
   frasi della voce, fasi del respiro, segnali, campane, testi a schermo.
   Il tempo della sessione è l'orologio dell'AudioContext:
     posizione = ctx.currentTime − base
   - l'orologio audio è monotono e avanza anche a schermo spento;
   - in pausa il contesto audio è sospeso: l'orologio si ferma e niente deriva;
   - gli eventi sonori vengono programmati in anticipo (finestra di 75 s)
     con source.start(quando): anche se il browser rallenta i timer,
     voce, segnali e campane suonano all'istante giusto.
   L'interfaccia legge solo lo stato calcolato dalla timeline: quando
   l'app torna in primo piano tutto si riallinea da solo.
   ========================================================= */
"use strict";
const Motore = (function(){
const LOOK=75;
let S={on:false};
const ascolta={};
function on(ev,fn){ (ascolta[ev]=ascolta[ev]||[]).push(fn); }
function emit(ev,d){ (ascolta[ev]||[]).forEach(f=>{ try{ f(d); }catch(e){ console.error(e); } }); }

/* ---------- passi → elementi ---------- */
function parse(steps){
 return steps.map(s=>{
  if(typeof s==="object"){
   if(s.b){ const b=BR[s.b]; return {b:s.b,n:s.n,f:s.f||b.f,vel:s.vel||1,nome:b.nome}; }
   return Object.assign({},s);
  }
  const i=s.lastIndexOf("|"); return i>0?{t:s.slice(0,i),p:+s.slice(i+1)}:{t:s,p:3};
 });
}
const stima=t=>Math.max(1.6,t.split(/\s+/).length*.45/ST.voceSpeed);
function cueOk(lab,d){ return ST.voice&&Voce.durata(lab)>0&&Voce.durata(lab)<=d+.4; }

/* ---------- costruzione della timeline ---------- */
function costruisci(items,cfg){
 const ev=[], passi=[]; let t=cfg.ritardo!=null?cfg.ritardo:2.6;
 const cue=cfg.cue||ST.brCue||"inizio";           // voce sulle fasi: off | inizio | sempre
 const toni=cfg.toni!=null?cfg.toni:ST.brToni;
 items.forEach((it,idx)=>{
  if(it.b){
   passi.push({t,idx,testo:it.nome+" · "+it.n+" cicli",tipo:"respiro"});
   ev.push({t,k:"testo",testo:it.nome+" · "+it.n+" cicli"});
   t+=1.2; let prev=0;
   for(let c=0;c<it.n;c++) it.f.forEach(([lab,sec,sc,tipo])=>{
    const d=sec*it.vel;
    ev.push({t,k:"fase",lab,d,sc,prev,tipo,ciclo:c,cicli:it.n,blocco:idx});
    const voce=(cue==="sempre"||(cue==="inizio"&&c<2))&&cueOk(lab,d);
    if(voce) ev.push({t,k:"voce",testo:lab,d:Voce.durata(lab),cue:true});
    if(toni&&!(voce&&cue==="sempre")) ev.push({t,k:"tono",tipo,d});
    prev=sc; t+=d;
   });
   ev.push({t,k:"finefase"});
   t+=.8; return;
  }
  if(it.campana){ ev.push({t,k:"campana",soft:true}); t+=4; return; }
  if(!it.t) return;
  passi.push({t,idx,testo:it.t,tipo:it.silent?"silenzio":"voce"});
  ev.push({t,k:"testo",testo:it.t,musica:!!it.musica});
  if(it.silent){
   if(cfg.intervallo){ const iv=cfg.intervallo*60; for(let x=iv;x<it.p-5;x+=iv) ev.push({t:t+x,k:"campana",soft:true}); }
   t+=it.p; return;
  }
  const d=ST.voice?Voce.durata(it.t):0;
  if(d>0) ev.push({t,k:"voce",testo:it.t,d});
  t+=(d>0?d:stima(it.t))+(it.p||0);
 });
 if(!cfg.senzaCampanaFinale) ev.push({t:t+.4,k:"campana",soft:!!cfg.sonno});
 ev.sort((a,b)=>a.t-b.t);
 return {ev,passi,durata:t+(cfg.sonno?6:3.5)};
}

/* ---------- programmazione degli eventi audio ---------- */
function ctxDi(t){ return S.base+t; }
function pos(){ if(!S.on) return 0; return Math.max(0,Math.min(S.durata,A.now()-S.base)); }
function traccia(n){ S.nodi.add(n); n.onended=()=>S.nodi.delete(n); }
function programma(){
 if(!S.on||S.finito) return;
 const ora=pos(), fino=ora+LOOK;
 while(S.k<S.ev.length&&S.ev[S.k].t<fino){
  const e=S.ev[S.k++], gen=S.gen;
  if(e.t+(e.d||0)<ora-.05&&e.k!=="testo") continue;
  if(e.k==="voce"){
   Voce.buffer(e.testo).then(buf=>{
    if(gen!==S.gen||!S.on) return;
    const quando=ctxDi(e.t), adesso=A.now(), off=Math.max(0,adesso-quando);
    if(off>=buf.duration-.1) return;
    const s=A.ctx.createBufferSource(); s.buffer=buf; s.connect(A.busVoce);
    s.start(Math.max(adesso,quando),off); traccia(s);
    if(!e.cue) A.duckAt(Math.max(adesso,quando),quando+buf.duration);
   }).catch(()=>{});
  } else if(e.k==="tono"){ const o=A.tone(e.tipo,Math.max(A.now(),ctxDi(e.t)),e.d); if(o) traccia(o); }
  else if(e.k==="campana"){ A.bell(e.soft,Math.max(A.now()+.02,ctxDi(e.t))); }
 }
}
function annullaProgrammati(){ S.gen++; S.nodi.forEach(n=>{ try{ n.onended=null; n.stop(); }catch(e){} }); S.nodi.clear(); A.duckReset(); }

/* ---------- avvio ---------- */
async function avvia(cfg){
 if(S.on) stop(true);
 A.init(); if(!A.ctx){ toast("Audio non supportato da questo browser"); return; }
 const items=parse(cfg.passi);
 S={on:true,cfg,items,preparando:true,finito:false,paused:false,nodi:new Set(),gen:0,k:0,ev:[],passi:[],durata:1,base:A.now(),ascoltato:0,ultimoCtx:0,avviata:Date.now(),id:Date.now()};
 const mio=S;
 Sfondo.attiva({titolo:cfg.titolo,sotto:cfg.sotto});          // nel gesto dell'utente: serve per l'audio in background
 emit("preparazione",{on:true,fatti:0,totale:1});
 await A.resume();
 if(ST.voice){
  const testi=[];
  items.forEach(it=>{ if(it.t&&!it.silent) testi.push(it.t); if(it.f) it.f.forEach(f=>testi.push(f[0])); });
  try{ await Promise.race([Voce.prepara(testi,(f,n)=>emit("preparazione",{on:true,fatti:f,totale:n})), new Promise(r=>setTimeout(r,25000))]); }catch(e){}
 }
 if(mio!==S||!S.on) return;
 const tl=costruisci(items,cfg);
 Object.assign(S,tl,{preparando:false});
 if(tl.ev.filter(e=>e.k==="voce").length===0&&ST.voice&&items.some(it=>it.t&&!it.silent)) emit("avviso","Voce non disponibile offline: le istruzioni appariranno come testo.");
 const off=Math.max(0,Math.min(cfg.offset||0,S.durata-5));
 S.base=A.now()+.15-off; S.k=0; S.ultimoCtx=A.now();
 if(!off) A.bell(cfg.sonno,A.now()+.15);
 while(S.k<S.ev.length&&S.ev[S.k].t<off-.01&&S.ev[S.k].k!=="testo") S.k++;
 programma();
 emit("preparazione",{on:false});
 emit("avvio",S);
 ciclo();
}
let timer=null;
function ciclo(){
 clearInterval(timer);
 timer=setInterval(()=>{
  if(!S.on) { clearInterval(timer); return; }
  if(S.preparando) return;
  const c=A.now(); if(!S.paused) S.ascoltato+=Math.max(0,c-S.ultimoCtx); S.ultimoCtx=c;
  programma();
  if(!S.finito&&pos()>=S.durata-.05) fine();
  emit("tick",S);
 },500);
}
document.addEventListener("visibilitychange",()=>{ if(S.on&&!S.preparando){ programma(); emit("tick",S); } });

/* ---------- stato istantaneo (per l'interfaccia) ---------- */
function istante(){
 const p=pos(), r={pos:p,durata:S.durata,testo:"",fase:null,passo:-1};
 if(!S.on||S.preparando) return r;
 let lo=0,hi=S.ev.length-1,j=-1; while(lo<=hi){ const m=(lo+hi)>>1; if(S.ev[m].t<=p){ j=m; lo=m+1; } else hi=m-1; }
 let trovata=false;
 for(let i=j;i>=0;i--){ const e=S.ev[i]; if(!r.testo&&e.k==="testo"){ r.testo=e.testo; r.musica=e.musica; }
  if(!trovata&&(e.k==="fase"||e.k==="finefase")){ trovata=true; if(e.k==="fase"&&p<e.t+e.d) r.fase=Object.assign({rest:e.t+e.d-p,prog:(p-e.t)/e.d},e); }
  if(r.testo&&trovata) break; }
 for(let i=S.passi.length-1;i>=0;i--) if(S.passi[i].t<=p+.01){ r.passo=i; break; }
 return r;
}

/* ---------- controlli ---------- */
async function pausa(){ if(!S.on||S.paused||S.finito) return; S.paused=true; await A.suspend(); emit("pausa",true); }
async function riprendi(){ if(!S.on||!S.paused) return; S.paused=false; await A.resume(); S.ultimoCtx=A.now(); programma(); emit("pausa",false); }
function vaiA(t){
 if(!S.on||S.preparando) return;
 annullaProgrammati(); t=Math.max(0,Math.min(t,S.durata-.5));
 S.base=A.now()+.05-t; S.k=0;
 while(S.k<S.ev.length&&S.ev[S.k].t<t-.01) S.k++;
 if(S.finito){ S.finito=false; }
 programma(); emit("tick",S);
}
function avanti(){ const p=pos(), n=S.passi.find(x=>x.t>p+.3); vaiA(n?n.t:S.durata-.5); }
function indietro(){ const p=pos(); let i=-1; for(let k=S.passi.length-1;k>=0;k--) if(S.passi[k].t<=p){ i=k; break; }
 if(i>0&&p-S.passi[i].t<3) i--; vaiA(i>=0?S.passi[i].t:0); }
function fine(){
 if(!S.on||S.finito) return; S.finito=true;
 emit("fine",{S,completa:true});
}
function stop(silenzioso){
 if(!S.on) return;
 const info={S,completa:S.finito};
 annullaProgrammati(); clearInterval(timer);
 S.on=false; if(S.paused){ S.paused=false; A.resume(); }
 emit("stop",Object.assign(info,{silenzioso}));
}
return {avvia,pausa,riprendi,avanti,indietro,vaiA,stop,fine,istante,pos,on,parse,costruisci,get S(){return S;}};
})();
