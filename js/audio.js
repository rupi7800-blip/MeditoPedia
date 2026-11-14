/* =========================================================
   MeditoPedia — Motore audio (Web Audio API)
   Catena:  livelli sonori → mixMusica → duck → busMusica ┐
            voce ─────────────────────────────→ busVoce  ├→ sonnoG → master → limitatore → uscita
            campane e segnali ────────────────→ busFx   ┘
   Tutti gli eventi (note, crepitii, campane, abbassamenti per la voce,
   dissolvenza del timer) sono programmati in anticipo sull'orologio
   dell'AudioContext: continuano con precisione anche quando il browser
   rallenta i timer JavaScript (schermo spento, app in background).
   Musiche e suoni sono generati dal codice: nessun file, nessuna licenza di terzi.
   ========================================================= */
"use strict";
const A = {
 ctx:null, layers:{}, sleepEnd:0, sleepFade:30, LOOK:25,
 init(){
  if(this.ctx){ return; }
  const C=window.AudioContext||window.webkitAudioContext; if(!C) return;
  let c; try{ c=new C({latencyHint:"playback"}); }catch(e){ c=new C(); }
  this.ctx=c;
  try{ if(navigator.audioSession) navigator.audioSession.type="playback"; }catch(e){}   // iOS: suona anche col silenzioso
  const lim=c.createDynamicsCompressor();
  lim.threshold.value=-10; lim.knee.value=8; lim.ratio.value=12; lim.attack.value=.003; lim.release.value=.25;
  lim.connect(c.destination);
  this.master=c.createGain(); this.master.gain.value=.8; this.master.connect(lim);
  this.sonnoG=c.createGain(); this.sonnoG.connect(this.master);
  this.busMusica=c.createGain(); this.busMusica.gain.value=ST.volMusica; this.busMusica.connect(this.sonnoG);
  this.duck=c.createGain(); this.duck.connect(this.busMusica);
  this.music=c.createGain(); this.music.connect(this.duck);          // somma dei livelli
  this.busVoce=c.createGain(); this.busVoce.gain.value=ST.volVoce; this.busVoce.connect(this.sonnoG);
  this.fx=c.createGain(); this.fx.gain.value=.55; this.fx.connect(this.sonnoG);
  this.reverb=c.createConvolver(); this.reverb.buffer=this.impulse(2.6);
  const revOut=c.createGain(); revOut.gain.value=1; this.reverb.connect(revOut); revOut.connect(this.duck);
  this.reverb2=this.reverb;
  this.fxRev=c.createGain(); this.fxRev.gain.value=.5; this.fxRev.connect(this.reverb);
  this.noise={white:this.noiseBuf("white"),pink:this.noiseBuf("pink"),brown:this.noiseBuf("brown")};
  c.onstatechange=()=>{ try{ window.dispatchEvent(new CustomEvent("audiostato",{detail:c.state})); }catch(e){} };
  // riempie in anticipo gli eventi dei generatori (anche con timer rallentati)
  setInterval(()=>this.fill(),1000);
 },
 now(){ return this.ctx?this.ctx.currentTime:0; },
 async resume(){ this.init(); try{ if(this.ctx&&this.ctx.state!=="running") await this.ctx.resume(); }catch(e){} this.fill(); },
 async suspend(){ try{ if(this.ctx&&this.ctx.state==="running") await this.ctx.suspend(); }catch(e){} },
 running(){ return !!this.ctx&&this.ctx.state==="running"; },
 impulse(sec){const c=this.ctx,len=Math.floor(c.sampleRate*sec),b=c.createBuffer(2,len,c.sampleRate);
  for(let ch=0;ch<2;ch++){const d=b.getChannelData(ch);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,3.2)*.6}return b},
 noiseBuf(type){
  const c=this.ctx,len=c.sampleRate*8,b=c.createBuffer(1,len,c.sampleRate),d=b.getChannelData(0);
  let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0,last=0;
  for(let i=0;i<len;i++){const w=Math.random()*2-1;
   if(type==="white") d[i]=w*.4;
   else if(type==="pink"){b0=.99886*b0+w*.0555179;b1=.99332*b1+w*.0750759;b2=.969*b2+w*.153852;b3=.8665*b3+w*.3104856;b4=.55*b4+w*.5329522;b5=-.7616*b5-w*.016898;d[i]=(b0+b1+b2+b3+b4+b5+b6+w*.5362)*.1;b6=w*.115926;}
   else {last=(last+.02*w)/1.02; d[i]=last*3.2;}
  }
  const F=4000; for(let i=0;i<F;i++){const k=i/F; d[i]*=k; d[len-1-i]*=k;}
  return b;
 },
 src(type){const s=this.ctx.createBufferSource();s.buffer=this.noise[type];s.loop=true;s.loopStart=Math.random()*2;s.start(0,Math.random()*7);return s},
 filt(type,f,q){const n=this.ctx.createBiquadFilter();n.type=type;n.frequency.value=f;if(q!=null)n.Q.value=q;return n},
 gain(v){const g=this.ctx.createGain();g.gain.value=v;return g},
 lfo(freq,depth,param){const o=this.ctx.createOscillator();o.frequency.value=freq;const g=this.gain(depth);o.connect(g);g.connect(param);o.start();return o},
 chain(...n){for(let i=0;i<n.length-1;i++)n[i].connect(n[i+1]);return n[n.length-1]},
 pan(out,v){ if(!this.ctx.createStereoPanner) return out; const p=this.ctx.createStereoPanner(); p.pan.value=v; p.connect(out); return p; },
 bowl(f,dest,amp,t0){
  const c=this.ctx; t0=t0||c.currentTime+.02;
  [[1,1],[2.76,.45],[5.4,.22],[8.93,.1]].forEach(([r,a],k)=>{
   [0,1.3+k*.4].forEach(det=>{
    const o=c.createOscillator();o.type="sine";o.frequency.value=f*r+det;
    const g=c.createGain();const dur=11/Math.sqrt(r);
    g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(amp*a*.5,t0+.015);g.gain.exponentialRampToValueAtTime(.0001,t0+dur);
    o.connect(g);g.connect(dest);o.start(t0);o.stop(t0+dur+.1);
   });
  });
 },
 /* campana (inizio, fine, intervalli). at: tempo dell'orologio audio */
 bell(soft,at){ this.init(); if(!this.ctx) return []; const g=this.gain(soft?.45:1); g.connect(this.fx); g.connect(this.fxRev); this.bowl(soft?196:220,g,.6,at); return [g]; },
 /* segnale morbido per le fasi del respiro */
 tone(tipo,at,dur){
  if(!this.ctx) return null; const c=this.ctx, o=c.createOscillator(), g=c.createGain();
  const f={in:[392,523.25],out:[523.25,392],hold:[440,440],rest:[349.23,349.23]}[tipo]||[440,440];
  const d=Math.min(1.2,Math.max(.35,(dur||2)*.35));
  o.type="sine"; o.frequency.setValueAtTime(f[0],at); o.frequency.exponentialRampToValueAtTime(f[1],at+d);
  g.gain.setValueAtTime(0,at); g.gain.linearRampToValueAtTime(tipo==="hold"||tipo==="rest"?.05:.09,at+.06); g.gain.exponentialRampToValueAtTime(.0001,at+d+.25);
  o.connect(g); g.connect(this.fx); o.start(at); o.stop(at+d+.3);
  return o;
 },
 /* ---------- livelli sonori ---------- */
 defs:{},
 set(id,vol,fade){
  this.init(); if(!this.ctx) return; const c=this.ctx,L=this.layers[id];
  if(vol<=0){ if(L){ L.g.gain.cancelScheduledValues(c.currentTime); L.g.gain.setTargetAtTime(0,c.currentTime,fade||.4); delete this.layers[id]; setTimeout(()=>{try{L.stop()}catch(e){} try{L.g.disconnect()}catch(e){}},Math.max(2500,(fade||.4)*5000));} return; }
  if(L){ L.g.gain.cancelScheduledValues(c.currentTime); L.g.gain.setTargetAtTime(vol,c.currentTime,.25); L.vol=vol; return; }
  const d=this.defs[id]; if(!d) return;
  const g=this.gain(0); g.connect(this.music);
  if(d.rev){const s=this.gain(d.rev);g.connect(s);s.connect(this.reverb);}
  const inner=this.gain(d.lv||1); inner.connect(g);
  const r=d.make(this,inner)||{}; const st=typeof r==="function"?{stop:r}:r;
  g.gain.setTargetAtTime(vol,c.currentTime,fade||1);
  this.layers[id]={g,vol,stop:st.stop||(()=>{}),fill:st.fill||null};
  this.fill();
 },
 fill(){ if(!this.ctx) return; const until=this.ctx.currentTime+this.LOOK; Object.values(this.layers).forEach(L=>{ if(L.fill) try{ L.fill(until); }catch(e){} }); },
 stopAll(fade){ Object.keys(this.layers).forEach(id=>this.set(id,0,fade)); },
 playing(){ return Object.keys(this.layers).length>0; },
 setVolMusica(v){ if(this.busMusica) this.busMusica.gain.setTargetAtTime(v,this.ctx.currentTime,.1); },
 setVolVoce(v){ if(this.busVoce) this.busVoce.gain.setTargetAtTime(v,this.ctx.currentTime,.1); },
 /* abbassa la musica mentre parla la voce (programmato in anticipo) */
 duckAt(t0,t1){ if(!this.duck) return; const g=this.duck.gain, lv=ST.duck!=null?ST.duck:.45;
  g.setTargetAtTime(lv,t0-.15,.18); g.setTargetAtTime(1,t1+.2,.6); },
 duckReset(){ if(!this.duck) return; const g=this.duck.gain,t=this.ctx.currentTime; g.cancelScheduledValues(t); g.setTargetAtTime(1,t,.3); },
 /* ---------- timer di autospegnimento (sull'orologio audio) ---------- */
 sleep(sec,fade){
  this.init(); if(!this.ctx) return;
  const c=this.ctx,g=this.sonnoG.gain,t=c.currentTime;
  g.cancelScheduledValues(t); g.setValueAtTime(g.value,t); g.linearRampToValueAtTime(1,t+.3);
  if(!sec){ this.sleepEnd=0; return; }
  fade=Math.min(fade||ST.fade||30,sec);
  this.sleepEnd=t+sec; this.sleepFade=fade;
  g.setValueAtTime(1,Math.max(t+.31,this.sleepEnd-fade)); g.linearRampToValueAtTime(0,this.sleepEnd);
 },
 sleepLeft(){ return this.sleepEnd&&this.ctx?Math.max(0,this.sleepEnd-this.ctx.currentTime):0; },
 sleepReset(){ this.sleepEnd=0; if(this.sonnoG){ const g=this.sonnoG.gain,t=this.ctx.currentTime; g.cancelScheduledValues(t); g.setValueAtTime(1,t); } }
};

/* =========================================================
   GENERATORI DI SUONI
   g: gruppo · lv: livello interno · rev: quantità di riverbero
   make(A,out) → funzione stop, oppure {stop, fill(fino_a)} per i suoni a eventi
   ========================================================= */
/* utilità per i suoni a eventi: chiama emit(t) a intervalli casuali fino a "until" */
function eventi(A,primo,intervallo,emit){
 let next=A.ctx.currentTime+primo, alive=true;
 return {stop(){alive=false}, fill(until){ if(!alive) return; let k=0; while(next<until&&k++<400){ emit(next); next+=intervallo(); } }};
}
function nota(A,out,f,t,amp,dur,parz){
 const c=A.ctx;
 (parz||[[1,1],[2,.18],[3,.06]]).forEach(([m,v])=>{ const o=c.createOscillator(); o.type="sine"; o.frequency.value=f*m;
  const g=c.createGain(); g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(amp*v,t+.02); g.gain.exponentialRampToValueAtTime(.0001,t+dur/m);
  o.connect(g); g.connect(out); o.start(t); o.stop(t+dur/m+.05); });
}
Object.assign(A.defs,{
 /* --- acqua e pioggia --- */
 pioggia:{nome:"Pioggia",icona:"🌧️",g:"Acqua e pioggia",rev:.1,make(A,out){
  const s=A.src("pink"),s2=A.src("brown");
  A.chain(s,A.filt("highpass",500),A.filt("lowpass",8000),A.gain(.9),out);
  A.chain(s2,A.filt("lowpass",350),A.gain(.35),out);
  return ()=>{s.stop();s2.stop()} }},
 pioggiaLeggera:{nome:"Pioggia sulle foglie",icona:"🍃",g:"Acqua e pioggia",rev:.2,make(A,out){
  const s=A.src("white"); A.chain(s,A.filt("highpass",2500),A.filt("lowpass",9000),A.gain(.18),out);
  const hp=A.filt("bandpass",3200,1.2); hp.connect(out);
  const e=eventi(A,.1,()=>.02+Math.random()*.09,t=>{ const c=A.ctx,o=c.createBufferSource(); o.buffer=A.noise.white; o.playbackRate.value=.5+Math.random();
   const g=c.createGain(),a=.15+Math.random()*.5; g.gain.setValueAtTime(a,t); g.gain.exponentialRampToValueAtTime(.001,t+.012+Math.random()*.03);
   o.connect(g); g.connect(hp); o.start(t,Math.random()*7); o.stop(t+.06); });
  return {stop(){s.stop();e.stop()},fill:e.fill} }},
 ruscello:{nome:"Ruscello",icona:"🏞️",g:"Acqua e pioggia",rev:.15,make(A,out){
  const s=A.src("white"),s2=A.src("white"),g1=A.gain(.22),g2=A.gain(.3);
  A.chain(s,A.filt("bandpass",2300,.6),g1,out); A.chain(s2,A.filt("bandpass",750,1),g2,out);
  const l1=A.lfo(.63,.07,g1.gain),l2=A.lfo(.41,.08,g2.gain),l3=A.lfo(1.7,.04,g1.gain);
  return ()=>{s.stop();s2.stop();l1.stop();l2.stop();l3.stop()} }},
 cascata:{nome:"Cascata",icona:"💧",g:"Acqua e pioggia",rev:.25,make(A,out){
  const s=A.src("pink"),s2=A.src("brown"); A.chain(s,A.filt("lowpass",3000),A.gain(.75),out); A.chain(s2,A.filt("lowpass",220),A.gain(.5),out);
  return ()=>{s.stop();s2.stop()} }},
 /* --- mare --- */
 onde:{nome:"Onde del mare",icona:"🌊",g:"Onde marine",rev:.15,make(A,out){
  const s=A.src("brown"),s2=A.src("pink"),wg=A.gain(.45),fg=A.gain(.06);
  A.chain(s,A.filt("lowpass",650),wg,out); A.chain(s2,A.filt("highpass",1200),A.filt("lowpass",5000),fg,out);
  const l1=A.lfo(.075,.38,wg.gain),l2=A.lfo(.075,.055,fg.gain);
  return ()=>{s.stop();s2.stop();l1.stop();l2.stop()} }},
 risacca:{nome:"Risacca lenta",icona:"🐚",g:"Onde marine",rev:.2,make(A,out){
  const s=A.src("pink"),lp=A.filt("lowpass",900),wg=A.gain(.35); A.chain(s,lp,wg,out);
  const l1=A.lfo(.045,.32,wg.gain),l2=A.lfo(.045,500,lp.frequency);
  return ()=>{s.stop();l1.stop();l2.stop()} }},
 /* --- vento e temporale --- */
 vento:{nome:"Vento",icona:"🌬️",g:"Natura",rev:.2,make(A,out){
  const s=A.src("pink"),bp=A.filt("bandpass",450,.9),g=A.gain(.7);
  A.chain(s,bp,g,out); const l1=A.lfo(.05,260,bp.frequency),l2=A.lfo(.031,.35,g.gain);
  return ()=>{s.stop();l1.stop();l2.stop()} }},
 tuono:{nome:"Tuoni lontani",icona:"⛈️",g:"Natura",rev:.5,make(A,out){
  const lp=A.filt("lowpass",180); lp.connect(out);
  const e=eventi(A,6+Math.random()*8,()=>14+Math.random()*28,t=>{ const c=A.ctx,b=c.createBufferSource(); b.buffer=A.noise.brown; b.playbackRate.value=.6+Math.random()*.3;
   const g=c.createGain(),d=4+Math.random()*5,a=.7+Math.random()*.6; g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(a,t+.25+Math.random()*.6);
   g.gain.setTargetAtTime(a*.5,t+1,.6); g.gain.exponentialRampToValueAtTime(.001,t+d); b.connect(g); g.connect(lp); b.start(t,Math.random()*3); b.stop(t+d+.1); });
  return {stop:e.stop,fill:e.fill} }},
 /* --- foresta --- */
 uccelli:{nome:"Uccelli",icona:"🐦",g:"Foresta",rev:.35,make(A,out){
  const e=eventi(A,.5,()=>.9+Math.random()*4.5,t0=>{ const c=A.ctx,dest=A.pan(out,Math.random()*1.6-.8),n=2+Math.floor(Math.random()*5),base=2000+Math.random()*2500,up=Math.random()>.5;
   for(let k=0;k<n;k++){const t=t0+.05+k*(.09+Math.random()*.08);const o=c.createOscillator();o.type="sine";
    const f=base*(1+(Math.random()*.15));o.frequency.setValueAtTime(up?f:f*1.4,t);o.frequency.exponentialRampToValueAtTime(up?f*1.45:f,t+.07);
    const g=c.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.09,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+.09);
    o.connect(g);g.connect(dest);o.start(t);o.stop(t+.12);} });
  return {stop:e.stop,fill:e.fill} }},
 fruscio:{nome:"Fruscio di foglie",icona:"🌳",g:"Foresta",rev:.2,make(A,out){
  const s=A.src("white"),bp=A.filt("bandpass",3500,.5),g=A.gain(.12); A.chain(s,A.filt("highpass",1500),bp,g,out);
  const l1=A.lfo(.09,.09,g.gain),l2=A.lfo(.13,900,bp.frequency);
  return ()=>{s.stop();l1.stop();l2.stop()} }},
 /* --- notte --- */
 grilli:{nome:"Grilli",icona:"🦗",g:"Suoni notturni",rev:.25,make(A,out){
  const voci=[A.pan(out,-.5),A.pan(out,.4),A.pan(out,.05)];
  const e=eventi(A,.2,()=>.35+Math.random()*.5,t0=>{ const c=A.ctx,dest=voci[Math.floor(Math.random()*voci.length)],f=4300+Math.random()*600;
   for(let k=0;k<3;k++){ const t=t0+k*.05,o=c.createOscillator(),g=c.createGain(); o.type="sine"; o.frequency.value=f;
    g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(.035,t+.008); g.gain.exponentialRampToValueAtTime(.0001,t+.035);
    o.connect(g); g.connect(dest); o.start(t); o.stop(t+.04); } });
  return {stop:e.stop,fill:e.fill} }},
 gufo:{nome:"Gufo lontano",icona:"🦉",g:"Suoni notturni",rev:.6,make(A,out){
  const e=eventi(A,4,()=>18+Math.random()*25,t0=>{ const c=A.ctx;
   [[0,.5],[.75,.35],[1.05,.9]].forEach(([dt,d])=>{ const t=t0+dt,o=c.createOscillator(),g=c.createGain(); o.type="sine";
    o.frequency.setValueAtTime(390,t); o.frequency.linearRampToValueAtTime(360,t+d);
    g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(.08,t+.08); g.gain.setTargetAtTime(0,t+d-.15,.08);
    o.connect(g); g.connect(out); o.start(t); o.stop(t+d+.3); }); });
  return {stop:e.stop,fill:e.fill} }},
 fuoco:{nome:"Camino",icona:"🔥",g:"Fuoco",rev:.1,make(A,out){
  const s=A.src("brown"); A.chain(s,A.filt("lowpass",260),A.gain(.6),out);
  const hp=A.filt("highpass",1800); hp.connect(out);
  const e=eventi(A,.05,()=>-Math.log(Math.random())*.2+.01,t=>{ const c=A.ctx;
   const b=c.createBufferSource();b.buffer=A.noise.white;b.playbackRate.value=.6+Math.random();
   const g=c.createGain();const a=Math.random()*.9+.1;g.gain.setValueAtTime(a,t);g.gain.exponentialRampToValueAtTime(.001,t+.01+Math.random()*.05);
   b.connect(g);g.connect(hp);b.start(t,Math.random()*7);b.stop(t+.1); });
  return {stop(){s.stop();e.stop()},fill:e.fill} }},
 /* --- rumori --- */
 bianco:{nome:"Rumore bianco",icona:"⚪",g:"Rumori",rev:0,lv:.35,make(A,out){ const s=A.src("white"); A.chain(s,A.filt("lowpass",12000),out); return ()=>s.stop(); }},
 rosa:{nome:"Rumore rosa",icona:"🌸",g:"Rumori",rev:0,lv:.9,make(A,out){ const s=A.src("pink"); s.connect(out); return ()=>s.stop(); }},
 marrone:{nome:"Rumore marrone",icona:"🟤",g:"Rumori",rev:0,lv:.8,make(A,out){ const s=A.src("brown"); A.chain(s,A.filt("lowpass",900),out); return ()=>s.stop(); }},
 /* --- musica --- */
 pad:{nome:"Drone armonico",icona:"🎼",g:"Musica meditativa",rev:.7,make(A,out){
  const fr=[110,164.81,220,261.63,329.63,493.88],os=[];const lp=A.filt("lowpass",1100);lp.connect(out);
  fr.forEach((f,i)=>{const vg=A.gain(.05);vg.connect(lp);
   ["sine","triangle"].forEach((tp,j)=>{const o=A.ctx.createOscillator();o.type=tp;o.frequency.value=f*(j?1.003:1);const g=A.gain(j?.35:.6);o.connect(g);g.connect(vg);o.start();os.push(o)});
   os.push(A.lfo(.03+i*.013,.04,vg.gain));});
  os.push(A.lfo(.02,350,lp.frequency));
  return ()=>os.forEach(o=>o.stop()) }},
 ambient:{nome:"Ambient notturno",icona:"🌌",g:"Musica ambient",rev:.8,make(A,out){
  const accordi=[[146.83,174.61,220,261.63],[130.81,164.81,196,246.94],[116.54,146.83,174.61,220],[130.81,155.56,196,233.08]];
  const lp=A.filt("lowpass",900); lp.connect(out); const os=[A.lfo(.017,300,lp.frequency)];
  const e=eventi(A,.1,()=>16,t=>{ const c=A.ctx,acc=accordi[Math.floor(t/16)%accordi.length];
   acc.forEach((f,i)=>{ ["sine","triangle"].forEach((tp,j)=>{ const o=c.createOscillator(),g=c.createGain(); o.type=tp; o.frequency.value=f*(j?1.004:1)*(i===0?.5:1);
    g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(j?.018:.03,t+5); g.gain.setValueAtTime(j?.018:.03,t+13); g.gain.linearRampToValueAtTime(0,t+19);
    o.connect(g); g.connect(lp); o.start(t); o.stop(t+19.2); }); }); });
  return {stop(){e.stop();os.forEach(o=>o.stop())},fill:e.fill} }},
 etereo:{nome:"Suoni eterei",icona:"✨",g:"Suoni eterei",rev:.95,make(A,out){
  const sc=[523.25,587.33,659.25,783.99,880,987.77,1174.66,1318.51];
  const hp=A.filt("highpass",300); hp.connect(out);
  const e=eventi(A,.3,()=>2.5+Math.random()*4,t=>{ const c=A.ctx,f=sc[Math.floor(Math.random()*sc.length)],d=6+Math.random()*4;
   [1,1.002,2].forEach((m,k)=>{ const o=c.createOscillator(),g=c.createGain(); o.type="sine"; o.frequency.value=f*m;
    g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(k===2?.006:.022,t+d*.4); g.gain.linearRampToValueAtTime(0,t+d);
    o.connect(g); g.connect(hp); o.start(t); o.stop(t+d+.1); }); });
  return {stop:e.stop,fill:e.fill} }},
 musica:{nome:"Melodia gentile",icona:"🎹",g:"Musica rilassante",rev:.8,make(A,out){
  const sc=[293.66,329.63,369.99,440,493.88,587.33,659.25,739.99,880];
  const e=eventi(A,.3,()=>1.4+Math.random()*2.8,t=>{ const i=Math.floor(Math.random()*sc.length);
   nota(A,out,sc[i],t,.16,4.5); if(Math.random()<.35) nota(A,out,sc[Math.min(sc.length-1,i+2)],t+.45,.1,4.5); if(Math.random()<.15) nota(A,out,sc[i]/2,t,.12,4.5); });
  return {stop:e.stop,fill:e.fill} }},
 piano:{nome:"Pianoforte lento",icona:"🎹",g:"Pianoforte",rev:.6,lv:.9,make(A,out){
  // progressione Do–Lam–Fa–Sol, arpeggi lenti con armonici inarmonici come un pianoforte
  const prog=[[130.81,196,261.63,329.63,392],[110,164.81,220,261.63,329.63],[87.31,130.81,174.61,220,261.63],[98,146.83,196,246.94,293.66]];
  const parz=[[1,1],[2.002,.35],[3.006,.12],[4.012,.05]];
  const lp=A.filt("lowpass",2600); lp.connect(out);
  let k=0;
  const e=eventi(A,.2,()=>8,t=>{ const acc=prog[k++%prog.length];
   nota(A,lp,acc[0],t,.13,7,parz);
   const ordine=[1,2,3,4,3,2]; ordine.forEach((j,n)=>{ if(Math.random()<.85) nota(A,lp,acc[j],t+.6+n*1.15+Math.random()*.08,.08+Math.random()*.04,5,parz); });
   if(Math.random()<.4) nota(A,lp,acc[4]*2,t+7.2,.05,4,parz); });
  return {stop:e.stop,fill:e.fill} }},
 campane:{nome:"Campane tibetane",icona:"🔔",g:"Musica meditativa",rev:.6,make(A,out){
  const fs=[164.8,196,220,246.9,293.7];
  const e=eventi(A,1.5,()=>16+Math.random()*16,t=>A.bowl(fs[Math.floor(Math.random()*fs.length)],out,.5,t));
  return {stop:e.stop,fill:e.fill} }},
 /* --- frequenze ambientali --- */
 profondo:{nome:"Drone profondo",icona:"🕉️",g:"Frequenze ambientali",rev:.5,make(A,out){
  const os=[]; const lp=A.filt("lowpass",500); lp.connect(out);
  [[68.05,.5],[136.1,.35],[204.15,.12],[272.2,.06]].forEach(([f,a],i)=>{ const o=A.ctx.createOscillator(); o.type="sine"; o.frequency.value=f; const g=A.gain(a*.25); o.connect(g); g.connect(lp); o.start(); os.push(o); os.push(A.lfo(.05+i*.02,a*.05,g.gain)); });
  return ()=>os.forEach(o=>o.stop()) }},
 alfa:{nome:"Binaurale Alfa 10 Hz",icona:"🎧",g:"Frequenze ambientali",rev:0,cuffie:true,make(A,out){return A.binaural(200,10,out)}},
 theta:{nome:"Binaurale Theta 6 Hz",icona:"🎧",g:"Frequenze ambientali",rev:0,cuffie:true,make(A,out){return A.binaural(180,6,out)}},
 delta:{nome:"Binaurale Delta 2,5 Hz",icona:"🎧",g:"Frequenze ambientali",rev:0,cuffie:true,make(A,out){return A.binaural(150,2.5,out)}}
});
A.binaural=function(f,beat,out){const c=this.ctx,m=c.createChannelMerger(2),l=c.createOscillator(),r=c.createOscillator();
 l.frequency.value=f;r.frequency.value=f+beat;const gl=this.gain(.18),gr=this.gain(.18);
 l.connect(gl);gl.connect(m,0,0);r.connect(gr);gr.connect(m,0,1);m.connect(out);l.start();r.start();
 return ()=>{l.stop();r.stop()} };

/* ---------- atmosfere (combinazioni pronte), divise per categoria ---------- */
const CAT_SUONI=[
 ["meditativa","Musica meditativa"],["ambient","Musica ambient"],["rilassante","Musica rilassante"],["piano","Pianoforte"],["eterei","Suoni eterei"],
 ["frequenze","Frequenze ambientali"],["natura","Suoni della natura"],["acqua","Acqua e pioggia"],["mare","Onde marine"],["foresta","Foresta"],
 ["fuoco","Fuoco e camino"],["notte","Suoni notturni"],["rumori","Rumori per il sonno"]
];
const PRESETS = [
 {id:"spazio",c:"meditativa",nome:"Spazio interiore",icona:"🌌",desc:"Drone, melodia e theta",mix:{pad:.6,musica:.45,theta:.25}},
 {id:"tempio",c:"meditativa",nome:"Tempio",icona:"🛕",desc:"Campane tibetane e drone",mix:{campane:.7,pad:.4}},
 {id:"notturno",c:"ambient",nome:"Ambient notturno",icona:"🌃",desc:"Accordi lenti che si dissolvono",mix:{ambient:.8,etereo:.25}},
 {id:"nebbia",c:"ambient",nome:"Nebbia sul lago",icona:"🌫️",desc:"Ambient con risacca lontana",mix:{ambient:.65,risacca:.3}},
 {id:"melodia",c:"rilassante",nome:"Melodia gentile",icona:"🎶",desc:"Note sparse e drone leggero",mix:{musica:.7,pad:.25}},
 {id:"pianoforte",c:"piano",nome:"Pianoforte lento",icona:"🎹",desc:"Arpeggi lenti e caldi",mix:{piano:.8}},
 {id:"pianopioggia",c:"piano",nome:"Piano e pioggia",icona:"☔",desc:"Pianoforte con pioggia leggera",mix:{piano:.7,pioggia:.35}},
 {id:"stelle",c:"eterei",nome:"Polvere di stelle",icona:"✨",desc:"Suoni eterei e drone",mix:{etereo:.8,pad:.3}},
 {id:"profondo",c:"frequenze",nome:"Drone profondo",icona:"🕉️",desc:"Toni bassi e stabili",mix:{profondo:.8}},
 {id:"focus",c:"frequenze",nome:"Concentrazione",icona:"🎯",desc:"Alfa (cuffie) e pioggia leggera",mix:{alfa:.35,pioggia:.35}},
 {id:"bosco",c:"natura",nome:"Bosco al mattino",icona:"🌲",desc:"Uccelli, ruscello e brezza",mix:{uccelli:.55,ruscello:.45,vento:.2}},
 {id:"pioggia",c:"acqua",nome:"Notte di pioggia",icona:"🌧️",desc:"Pioggia con un velo armonico",mix:{pioggia:.75,pad:.25}},
 {id:"pioggiasola",c:"acqua",nome:"Pioggia",icona:"🌦️",desc:"Solo pioggia",mix:{pioggia:.8}},
 {id:"foglie",c:"acqua",nome:"Pioggia sulle foglie",icona:"🍃",desc:"Gocce leggere nel bosco",mix:{pioggiaLeggera:.8,fruscio:.3}},
 {id:"cascata",c:"acqua",nome:"Cascata",icona:"💧",desc:"Acqua che scorre, piena",mix:{cascata:.8}},
 {id:"mare",c:"mare",nome:"Riva del mare",icona:"🏖️",desc:"Onde lente e note sparse",mix:{onde:.85,musica:.2}},
 {id:"onde",c:"mare",nome:"Onde",icona:"🌊",desc:"Solo onde del mare",mix:{onde:.9}},
 {id:"risacca",c:"mare",nome:"Risacca lenta",icona:"🐚",desc:"Onde lunghe e profonde",mix:{risacca:.85,vento:.15}},
 {id:"foresta",c:"foresta",nome:"Foresta",icona:"🌳",desc:"Foglie, uccelli e ruscello lontano",mix:{fruscio:.5,uccelli:.4,ruscello:.2}},
 {id:"camino",c:"fuoco",nome:"Sera d'inverno",icona:"🔥",desc:"Camino, vento e drone",mix:{fuoco:.75,vento:.25,pad:.2}},
 {id:"fuoco",c:"fuoco",nome:"Fuoco scoppiettante",icona:"🪵",desc:"Solo il camino",mix:{fuoco:.85}},
 {id:"forestanotte",c:"notte",nome:"Foresta notturna",icona:"🦉",desc:"Grilli, gufo e brezza",mix:{grilli:.55,gufo:.4,vento:.2,fruscio:.15}},
 {id:"estate",c:"notte",nome:"Notte d'estate",icona:"🌙",desc:"Grilli e risacca lontana",mix:{grilli:.6,risacca:.35}},
 {id:"temporale",c:"notte",nome:"Temporale",icona:"⛈️",desc:"Pioggia intensa e tuoni lontani",mix:{pioggia:.85,tuono:.8,vento:.3}},
 {id:"vento",c:"natura",nome:"Vento",icona:"🌬️",desc:"Raffiche lente",mix:{vento:.85}},
 {id:"sonno",c:"rumori",nome:"Sonno profondo",icona:"😴",desc:"Delta, onde e drone",mix:{delta:.35,onde:.5,pad:.2}},
 {id:"bianco",c:"rumori",nome:"Rumore bianco",icona:"⚪",desc:"Copre i rumori di fondo",mix:{bianco:.7}},
 {id:"rosa",c:"rumori",nome:"Rumore rosa",icona:"🌸",desc:"Più morbido del bianco",mix:{rosa:.7}},
 {id:"marrone",c:"rumori",nome:"Rumore marrone",icona:"🟤",desc:"Profondo e avvolgente",mix:{marrone:.75}}
];
