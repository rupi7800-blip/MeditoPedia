/* =========================================================
   MeditoPedia — Voci guida (uomo e donna)
   Da caricare DOPO lo script principale di index.html:
   <script src="voci.js"></script>  subito prima di </body>

   - Riconosce le voci italiane del dispositivo e le divide in femminili e maschili
   - Preferisce le voci di qualità più alta (Natural, Neural, Enhanced, Premium, Google…)
   - Quattro "maestri" con ritmo, tono e pause da insegnante di meditazione
   - Il testo viene detto frase per frase, con pause naturali tra virgole e punti
   ========================================================= */
(function(){
"use strict";
if(!("speechSynthesis" in window)) return;

/* ---------- Riconoscimento del genere dal nome della voce ---------- */
const FEM = ["alice","federica","elsa","isabella","paola","fabiola","fiamma","imelda","irma","palmira","pierina","chiara","emma","silvia","bianca","carla","giulia","valentina","francesca","sara","martina","elena","google italiano","kda","itb","female","donna","woman"];
const MAS = ["luca","cosimo","diego","giuseppe","benigno","calimero","cataldo","gianni","lisandro","rinaldo","giorgio","roberto","marco","alessandro","matteo","andrea","itc","itd","male","uomo","man"];
function gender(v){
 const n=(v.name+" "+(v.voiceURI||"")).toLowerCase();
 const has=list=>list.some(w=>new RegExp("(^|[^a-z])"+w+"([^a-z]|$)").test(n));
 if(has(FEM)&&!/\bmale\b/.test(n.replace("female",""))) return "f";
 if(has(MAS)) return "m";
 if(has(FEM)) return "f";
 return "?";
}
function quality(v){
 const n=v.name.toLowerCase(); let q=0;
 if(/natural|neural|multilingual/.test(n)) q+=6;
 if(/premium/.test(n)) q+=6;
 if(/enhanced|migliorat|siri/.test(n)) q+=5;
 if(/online/.test(n)) q+=2;
 if(/google/.test(n)) q+=3;
 if(/espeak|compact/.test(n)) q-=6;
 if(!v.localService) q+=1;
 return q;
}
function itVoices(){
 return speechSynthesis.getVoices()
  .filter(v=>(v.lang||"").toLowerCase().replace("_","-").startsWith("it"))
  .map(v=>({v,g:gender(v),q:quality(v)}))
  .sort((a,b)=>b.q-a.q);
}
function nice(v){
 return v.name.replace(/^Microsoft\s+/,"").replace(/\s*-\s*Italian.*$/i,"").replace(/\s*\(Italy\)|\s*Italian(o)?/gi,"").replace(/Online \(Natural\)/,"· Naturale").trim()||v.name;
}

/* ---------- Maestri: stile di lettura ---------- */
const MAESTRI = [
 {id:"serena", nome:"Maestra Serena", icona:"🌸", g:"f", rate:.84, pitch:1.0, vol:1, pausa:1.0, desc:"Voce femminile calda e luminosa"},
 {id:"luna",   nome:"Maestra Luna",   icona:"🌙", g:"f", rate:.76, pitch:.93, vol:.9, pausa:1.5, desc:"Femminile, lenta e morbida: ideale per sonno e rilassamento"},
 {id:"saggio", nome:"Maestro Saggio", icona:"🍃", g:"m", rate:.82, pitch:.92, vol:1, pausa:1.1, desc:"Voce maschile pacata e rassicurante"},
 {id:"monte",  nome:"Maestro Monte",  icona:"🏔️", g:"m", rate:.74, pitch:.82, vol:1, pausa:1.6, desc:"Maschile profonda e lenta, come un monaco"}
];
const DEF_PROFILE = "serena";
if(!ST.maestro) ST.maestro = DEF_PROFILE;
if(ST.voiceByMaestro==null) ST.voiceByMaestro = {};
const prof = () => MAESTRI.find(m=>m.id===ST.maestro)||MAESTRI[0];

function voiceFor(p){
 const all=itVoices(); if(!all.length) return {v:null,exact:false};
 const chosen=ST.voiceByMaestro[p.id];
 if(chosen){ const f=all.find(x=>x.v.name===chosen); if(f) return {v:f.v,exact:true}; }
 const same=all.find(x=>x.g===p.g); if(same) return {v:same.v,exact:true};
 const unk=all.find(x=>x.g==="?"); if(unk) return {v:unk.v,exact:false};
 return {v:all[0].v,exact:false};
}

/* ---------- Lettura "da maestro": frase per frase, con respiro tra le frasi ---------- */
function chunks(text){
 // spezza su punti, punti e virgola, due punti, puntini e virgole lunghe
 const out=[]; let buf="";
 const parts=text.replace(/…/g,"... ").split(/(\.\.\.|[.;:!?]|,)/);
 for(let i=0;i<parts.length;i++){
  const p=parts[i]; if(!p) continue;
  buf+=p;
  if(/^(\.\.\.|[.;:!?])$/.test(p)) { out.push({t:buf.trim(),pause:p==="..."?900:700}); buf=""; }
  else if(p===","){ if(buf.split(/\s+/).length>=4){ out.push({t:buf.trim(),pause:380}); buf=""; } }
 }
 if(buf.trim()) out.push({t:buf.trim(),pause:0});
 return out.filter(c=>c.t.replace(/[.,;:…!?\s]/g,"").length);
}
// pronuncia più naturale di qualche parola
function polish(t){
 return t.replace(/\bRAIN\b/g,"Rèin").replace(/\bSTOP\b/g,"Stop").replace(/\bMetta\b/g,"Mètta").replace(/\bSo Ham\b/g,"Sò, Hàm");
}

let gen=0;
const origStop=V.stop.bind(V);
V.stop=function(){ gen++; origStop(); };
V.pick=function(){ return voiceFor(prof()).v; };
V.speak=function(text,cb){
 let done=false; const fin=()=>{ if(!done){ done=true; cb&&cb(); } };
 const p=prof(), r=p.rate*(ST.rate/0.88);
 if(!ST.voice){ setTimeout(fin,Math.max(1800,text.split(/\s+/).length*430/r)); return; }
 const my=++gen; try{ speechSynthesis.cancel(); }catch(e){}
 const list=chunks(polish(text)); const voice=voiceFor(p).v;
 let i=0;
 const next=()=>{
  if(my!==gen) return;
  if(i>=list.length){ fin(); return; }
  const c=list[i++]; let ended=false;
  const u=new SpeechSynthesisUtterance(c.t);
  u.lang="it-IT"; if(voice) u.voice=voice; u.rate=r; u.pitch=p.pitch; u.volume=p.vol;
  const go=()=>{ if(ended) return; ended=true; if(my!==gen) return; setTimeout(next,c.pause*p.pausa); };
  u.onend=go; u.onerror=go;
  setTimeout(go,c.t.split(/\s+/).length*900/r+4000); // sicurezza se onend non arriva
  speechSynthesis.speak(u);
 };
 next();
};

/* ---------- Interfaccia nelle impostazioni ---------- */
function voiceUI(){
 const all=itVoices(); const p=prof();
 const fem=all.filter(x=>x.g==="f"), mas=all.filter(x=>x.g==="m"), unk=all.filter(x=>x.g==="?");
 const opt=(arr,lab)=>arr.length?`<optgroup label="${lab}">${arr.map(x=>`<option value="${esc(x.v.name)}" ${ST.voiceByMaestro[p.id]===x.v.name?"selected":""}>${esc(nice(x.v))}${x.q>=5?" ★":""}</option>`).join("")}</optgroup>`:"";
 const vf=voiceFor(p);
 let warn="";
 if(!all.length) warn="Nessuna voce italiana trovata su questo dispositivo.";
 else if(!vf.exact) warn=`Su questo dispositivo non c'è una voce ${p.g==="m"?"maschile":"femminile"} italiana: uso la migliore disponibile.`;
 return `
 <h3 style="margin-bottom:4px">Il tuo maestro</h3>
 <p class="muted small" style="margin-bottom:12px">Ritmo lento, tono calmo e pause tra le frasi, come un insegnante di meditazione.</p>
 <div class="grid2" style="grid-template-columns:repeat(auto-fill,minmax(180px,1fr))">
  ${MAESTRI.map(m=>`<div class="card preset ${m.id===p.id?"on":""}" data-vact="maestro" data-id="${m.id}"><span class="ic">${m.icona}</span><h3>${m.nome}</h3><p>${m.desc}</p><p class="small" style="margin-top:6px;color:var(--accent)">${m.g==="f"?"♀ Donna":"♂ Uomo"}</p></div>`).join("")}
 </div>
 <div style="margin-top:14px">
  <p class="small muted" style="margin-bottom:6px">Voce usata da ${p.nome} <span class="muted">(★ = alta qualità)</span></p>
  <select class="sel" id="maestroVoice"><option value="">Automatica (la migliore ${p.g==="m"?"maschile":"femminile"})</option>${opt(fem,"♀ Voci femminili")}${opt(mas,"♂ Voci maschili")}${opt(unk,"Altre voci")}</select>
  ${warn?`<p class="note">${warn}</p>`:""}
  <div class="row" style="margin-top:12px"><button class="btn sm" data-vact="prova">▶ Ascolta ${p.nome}</button><button class="btn sm ghost" data-vact="help">Come avere voci più belle</button></div>
  <div id="voiceHelp" class="hidden" style="margin-top:12px;font-size:.88rem;line-height:1.6">
   <p><b>Le voci dipendono dal dispositivo e dal browser.</b> Le più naturali:</p>
   <p>💻 <b>PC Windows/Mac</b>: apri l'app con <b>Microsoft Edge</b>, che offre le voci «Naturali» Isabella ed Elsa (donna) e Diego e Giuseppe (uomo).</p>
   <p>📱 <b>iPhone/iPad</b>: Impostazioni → Accessibilità → Contenuto letto → Voci → Italiano → scarica le versioni <i>Migliorata</i> o <i>Premium</i> di Alice, Federica o Luca. Poi riapri l'app.</p>
   <p>🤖 <b>Android</b>: Impostazioni → Sintesi vocale → Servizi Google → Italiano → installa i dati vocali e scegli fra le voci maschili e femminili.</p>
   <p>🍎 <b>Mac</b>: Impostazioni di Sistema → Accessibilità → Contenuto letto → Voce di sistema → Gestisci voci → Italiano.</p>
  </div>
 </div>`;
}
const _rt=renderTu;
renderTu=function(){
 _rt();
 const sel=document.getElementById("voiceSel");
 const host=sel?sel.closest(".set"):[...document.querySelectorAll("#view-tu .set")].find(s=>/Voce italiana/.test(s.textContent));
 if(host){ host.style.display="block"; host.innerHTML=voiceUI(); }
};
document.addEventListener("click",e=>{
 const el=e.target.closest("[data-vact]"); if(!el) return;
 const a=el.dataset.vact;
 if(a==="maestro"){ ST.maestro=el.dataset.id; save(); renderTu(); const p=prof(); speakTest(p); }
 if(a==="prova") speakTest(prof());
 if(a==="help") document.getElementById("voiceHelp").classList.toggle("hidden");
});
document.addEventListener("change",e=>{
 if(e.target.id==="maestroVoice"){ const p=prof(); if(e.target.value) ST.voiceByMaestro[p.id]=e.target.value; else delete ST.voiceByMaestro[p.id]; save(); speakTest(p); }
});
function speakTest(p){
 const old=ST.voice; ST.voice=true;
 V.speak("Benvenuto. Sono "+p.nome+". Trova una posizione comoda… chiudi gli occhi… e lascia che il respiro rallenti, da solo.",()=>{});
 ST.voice=old;
}

/* Nome del maestro anche nel player */
const _open=openPlayer;
openPlayer=function(cfg){ _open(cfg); const v=document.getElementById("plVoice"); if(v) v.title="Voce: "+prof().nome; };

speechSynthesis.addEventListener&&speechSynthesis.addEventListener("voiceschanged",()=>{ if(document.getElementById("view-tu").classList.contains("on")) renderTu(); });
try{ if(document.getElementById("view-tu").classList.contains("on")) renderTu(); }catch(e){}
})();
