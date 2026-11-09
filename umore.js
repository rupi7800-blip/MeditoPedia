/* =========================================================
   MeditoPedia — Meditazioni in base all'umore + domanda all'apertura
   1. All'apertura chiede come stai (domanda sempre diversa)
   2. Fa una domanda di approfondimento sul motivo
   3. Propone la meditazione più adatta, con alternative
   Aggiunge il programma "Per il tuo umore".
   Da caricare dopo sessioni-extra.js
   ========================================================= */
(function(){
"use strict";

/* ---------- costruttore sessioni (pause calcolate sulla durata) ---------- */
const sp = t => t.split(/\s+/).length*.45/.88;
const brT = o => BR[o.b].f.reduce((a,f)=>a+f[1],0)*o.n+3;
const RICH = [
 "Se la mente si è allontanata, torna con gentilezza al respiro.",
 "Ammorbidisci le spalle, la fronte e la mascella.",
 "Va bene sentire quello che senti. Resta qui, con te.",
 "Lascia che il respiro sia naturale, senza guidarlo.",
 "Ogni espirazione è un piccolo lasciar andare."
];
function parse(c){ if(typeof c==="object") return {o:c}; let m=c.match(/^(.*)\*(\d+)$/s); if(m) return {t:m[1],w:+m[2]}; m=c.match(/^(.*)\|(\d+)$/s); if(m) return {t:m[1],p:+m[2]}; return {t:c,p:8}; }
const fixedOf = arr => arr.map(parse).reduce((a,it)=>a+(it.o?brT(it.o):sp(it.t)+(it.p||0)),0);
function S2(title,desc,min,core){
 const items=core.map(parse), W=items.reduce((a,i)=>a+(i.w||0),0)||1;
 const free=Math.max(W*15,min*60-fixedOf(IN)-fixedOf(OUT)-items.reduce((a,i)=>a+(i.o?brT(i.o):sp(i.t)+(i.p||0)),0));
 const steps=[...IN]; let k=title.length;
 items.forEach(it=>{
  if(it.o){ steps.push(it.o); return; }
  if(it.w==null){ steps.push(it.t+"|"+it.p); return; }
  let p=free*it.w/W; const n=Math.floor(p/110);
  if(n>0){ const r=[]; for(let j=0;j<n;j++) r.push(RICH[k++%RICH.length]); p=Math.max(8,p-r.reduce((a,x)=>a+sp(x),0)); const part=Math.round(p/(n+1)); steps.push(it.t+"|"+part); r.forEach(x=>steps.push(x+"|"+part)); }
  else steps.push(it.t+"|"+Math.round(Math.max(4,p)));
 });
 steps.push(...OUT);
 return {t:title,d:desc+" · "+min+" min",steps};
}

/* ---------- nuovo programma: Per il tuo umore ---------- */
const UMORE = {id:"umore", nome:"Per il tuo umore", icona:"🌈", col:"#e3a6c9", cat:"umore", livello:"Su misura",
 desc:"Meditazioni pensate per come ti senti adesso: ansia, stress, tristezza, rabbia, stanchezza, confusione, e anche gioia.",
 sessioni:[
 S2("Calmare l'ansia","Quando il cuore corre",10,[
  "Se senti ansia, va bene. Non devi farla sparire: impariamo a starci accanto.|5",
  "Prima di tutto, rallentiamo il corpo con un'espirazione lunga.|3",
  {b:"relax",n:8},
  "Senti i piedi a terra e il peso del corpo sostenuto. Sei qui, e in questo momento sei al sicuro.*2",
  "Nota dove senti l'ansia nel corpo: petto, gola, stomaco. Osservala come una sensazione, con curiosità.*2",
  "Respira intorno a quella zona, come se le facessi spazio. Ripeti dentro di te: posso stare con questo.*3",
  "Ricorda: i pensieri ansiosi sono previsioni, non fatti. Lasciali passare come nuvole.*2"]),
 S2("Fiducia nel futuro","Quando l'incertezza pesa",10,[
  "Oggi lavoriamo sulla paura di ciò che verrà.|5",
  "Nota i pensieri che corrono avanti: e se succede… e se non riesco…|8",
  "Riportali con gentilezza a questo momento: il respiro, il corpo, i suoni intorno.*2",
  "Ripensa a una volta in cui avevi paura del futuro, e poi te la sei cavata.|12",
  "Senti quella forza: è ancora dentro di te.*2",
  "Ripeti con calma: non devo sapere tutto adesso. Affronterò ogni passo quando arriverà.*3",
  "Riposa nella fiducia di questo istante.*2"]),
 S2("Sciogliere lo stress","Quando tutto preme",10,[
  "Quando lo stress sale, il corpo si contrae. Iniziamo a scioglierlo.|5",
  {b:"sospiro",n:6},
  "Porta l'attenzione alle spalle. Sollevale verso le orecchie… e lasciale cadere.|10",
  "Rilassa la mascella, la fronte, le mani.*1",
  "Ora immagina di posare, una per una, le cose da fare su un tavolo davanti a te. Restano lì, ti aspettano.*2",
  "Per questi minuti non devi fare niente. Solo respirare.*3",
  "Quando riprenderai, sceglierai una sola cosa alla volta.*2"]),
 S2("Prima di una prova importante","Esame, colloquio, gara",9,[
  "Ti aspetta un momento importante. L'agitazione che senti è energia: impariamo a usarla.|5",
  {b:"box",n:6},
  "Senti il corpo stabile e i piedi ben piantati.*1",
  "Ora immagina la prova che ti aspetta. Vediti entrare con calma, respirare, iniziare.*3",
  "Immagina di affrontare anche un imprevisto: ti fermi, respiri, e continui.*2",
  "Ripeti: mi sono preparato. Faccio del mio meglio, un passo alla volta.*2"]),
 S2("Accogliere la tristezza","Fare spazio al dolore",11,[
  "Se oggi ti senti triste, questa pratica è per te. Non c'è niente da aggiustare.|5",
  "Porta una mano sul cuore e senti il suo calore.|10",
  "Nota dove vive la tristezza nel corpo. Forse un peso nel petto, un nodo in gola.*2",
  "Respira con lei, con delicatezza, come si tiene la mano di un amico.*3",
  "La tristezza spesso parla di qualcosa che conta per te. Ascoltala senza giudicarla.*2",
  "Rivolgiti parole gentili: è un momento difficile. Mi prendo cura di me.*2",
  "Ricorda che anche questo stato, come ogni altro, cambierà.*1"]),
 S2("Sentirsi in connessione","Quando ci si sente soli",10,[
  "Sentirsi soli è una delle esperienze più umane che ci siano. In questo momento, tantissime persone provano la stessa cosa.|6",
  "Porta l'attenzione al respiro. È lo stesso respiro che condividi con ogni essere vivente.*2",
  "Pensa a una persona che ti vuole bene, anche lontana, anche del passato. Senti il suo affetto.*2",
  "Rivolgile un augurio: possa tu stare bene.*1",
  "Ora immagina tutte le persone che in questo momento si sentono sole. Augura anche a loro: possiate sentirvi meno soli.*2",
  "Senti di far parte di questa grande rete di vita.*2"]),
 S2("Raffreddare la rabbia","Quando qualcosa brucia",10,[
  "La rabbia è un'energia forte. Non la combattiamo: la lasciamo raffreddare.|5",
  "Fai un respiro lungo, e lascia uscire l'aria dalla bocca, lentamente.|6",
  {b:"relax",n:6},
  "Nota dove senti la rabbia: calore nel viso, mani strette, petto teso.*2",
  "Immagina che ogni espirazione sia aria fresca che raffredda quelle zone.*2",
  "Chiediti: di cosa avrei bisogno, davvero? Rispetto, ascolto, giustizia?*2",
  "Potrai agire dopo, con lucidità. Adesso respira.*2"]),
 S2("Perdonarsi","Quando la voce critica è forte",10,[
  "A volte siamo i giudici più severi di noi stessi. Oggi proviamo a essere più gentili.|5",
  "Pensa a qualcosa per cui ti stai rimproverando.|10",
  "Nota la voce critica. Che tono ha? Che parole usa?*1",
  "Ora immagina che un amico caro ti racconti lo stesso errore. Cosa gli diresti?*2",
  "Rivolgi a te quelle stesse parole.*2",
  "Ripeti: ho sbagliato, e posso imparare. Merito comprensione, come chiunque.*2",
  "Lascia che il cuore si ammorbidisca.*2"]),
 S2("Ricaricare l'energia","Quando la mente è stanca",8,[
  "Ti senti stanco. Facciamo una pausa che ricarica, senza sforzo.|5",
  "Siediti dritto e apri il petto.|5",
  {b:"coer",n:8},
  "Immagina una luce calda che entra ad ogni inspirazione e riempie il corpo di energia.*2",
  "Ad ogni espirazione, lascia uscire la pesantezza.*2",
  "Muovi piano le dita, le spalle, il collo. Senti il corpo che si risveglia.*1"]),
 S2("Ritrovare la motivazione","Quando manca la spinta",10,[
  "Quando la motivazione manca, non serve forzarsi. Serve ricordare perché.|5",
  "Pensa a qualcosa che ti sta a cuore, un progetto o un obiettivo.|10",
  "Chiediti: perché è importante per me? Lascia emergere la risposta più vera.*2",
  "Immagina come ti sentirai quando avrai fatto un passo avanti.*2",
  "Scegli un passo minuscolo, così piccolo da essere facile. Cinque minuti, un solo gesto.*2",
  "Vediti mentre lo fai, oggi.*2"]),
 S2("Fare chiarezza","Quando la mente è piena",10,[
  "Quando la mente è piena, tutto sembra urgente. Facciamo un po' d'ordine.|5",
  "Osserva i pensieri come se fossero oggetti su un tavolo.*1",
  "Dai a ciascuno un nome semplice: lavoro, casa, persona, preoccupazione.*2",
  "Ora lasciali sul tavolo e torna al respiro, per qualche minuto.*3",
  "Dalla calma, chiediti: qual è la cosa più importante adesso? Solo una.*2",
  "Lascia che le altre aspettino il loro turno.*1"]),
 S2("Assaporare la gioia","Quando stai bene",8,[
  "Oggi stai bene. Questa pratica ti aiuta a gustarlo fino in fondo.|5",
  "Nota come ti senti nel corpo: leggerezza, calore, apertura.*2",
  "Ripensa a ciò che ti fa stare bene oggi, e rivivilo nei dettagli.*2",
  "Lascia che la gioia si espanda nel petto, come una luce.*2",
  "Augura anche agli altri di provare ciò che provi tu.*1"])
 ]};
PROGRAMS.push(UMORE);
CATS.unshift(["umore","Per il tuo umore","Meditazioni pensate per come ti senti adesso"]);

/* ---------- domande e consigli ---------- */
const DOMANDE = ["Come stai oggi?","Come va?","Come ti senti in questo momento?","Come sta il tuo cuore oggi?","Che giornata è stata finora?","Come ti senti, adesso, davvero?","Com'è il tuo umore oggi?"];
// consiglio: [programma, titolo] oppure ["respiro", tecnica]
const M = {
 sereno:{e:"😊",l:"Sereno",msg:"Che bello sentirlo. Prendiamoci un momento per gustarlo.",q:"Cosa ti fa stare bene oggi?",r:[
  ["Una bella notizia o un successo",[["umore","Assaporare la gioia"],["metta","Gioia per gli altri"],["gratitudine","Tre cose belle"]]],
  ["Le persone intorno a me",[["gratitudine","Gratitudine per le persone"],["metta","Metta per una persona cara"],["umore","Assaporare la gioia"]]],
  ["Sto bene, senza un motivo preciso",[["umore","Assaporare la gioia"],["mindfulness","I cinque sensi"],["gratitudine","Grazie a tutto"]]],
  ["Voglio approfondire la pratica",[["intermedio","Mente come cielo"],["avanzato","Equanimità"],["trascendente","Lo spazio tra i pensieri"]]]]},
 ansioso:{e:"😰",l:"Ansioso",msg:"Grazie per averlo condiviso. Quando la mente corre, il corpo può aiutarla a rallentare.",q:"Cosa sta alimentando la tua ansia?",r:[
  ["Lavoro o studio",[["umore","Calmare l'ansia"],["ansia","SOS 5-4-3-2-1"],["respiro","sospiro"]]],
  ["Relazioni o persone",[["umore","Calmare l'ansia"],["metta","Autocompassione"],["respiro","relax"]]],
  ["La salute",[["ansia","RAIN"],["umore","Calmare l'ansia"],["guarigione","Il respiro che cura"]]],
  ["Il futuro, l'incertezza",[["umore","Fiducia nel futuro"],["ansia","Lasciare il futuro"],["respiro","coer"]]],
  ["Non lo so, è un'ansia generale",[["umore","Calmare l'ansia"],["ansia","Radicarsi"],["respiro","sospiro"]]]]},
 stressato:{e:"😤",l:"Stressato",msg:"Lo stress è il segnale che stai portando tanto. Facciamo spazio.",q:"Da dove arriva lo stress?",r:[
  ["Troppe cose da fare",[["umore","Sciogliere lo stress"],["base","Pausa di tre minuti"],["mattino","Pianificare con calma"]]],
  ["Una scadenza o una prova",[["umore","Prima di una prova importante"],["concentrazione","Focus per il lavoro"],["respiro","box"]]],
  ["Persone o conflitti",[["umore","Sciogliere lo stress"],["metta","Metta per chi è difficile"],["respiro","relax"]]],
  ["Tensione accumulata nel corpo",[["rilassamento","Rilassamento muscolare progressivo"],["umore","Sciogliere lo stress"],["rilassamento","Respiro rilassante"]]]]},
 triste:{e:"😢",l:"Triste",msg:"Mi dispiace che tu stia attraversando questo. Qui puoi sentire quello che senti.",q:"Cosa ti ha reso triste?",r:[
  ["Una perdita o una mancanza",[["umore","Accogliere la tristezza"],["guarigione","Guarire il cuore"],["metta","Autocompassione"]]],
  ["Una delusione",[["umore","Accogliere la tristezza"],["lasciare","Lasciar andare il passato"],["metta","Metta per sé"]]],
  ["Mi sento solo",[["umore","Sentirsi in connessione"],["metta","Metta classica"],["gratitudine","Gratitudine per le persone"]]],
  ["Non lo so",[["umore","Accogliere la tristezza"],["mindfulness","Mindfulness delle emozioni"],["gratitudine","Tre cose belle"]]]]},
 arrabbiato:{e:"😠",l:"Arrabbiato",msg:"La rabbia ha qualcosa da dirti. Prima però lasciamola raffreddare.",q:"Verso cosa è diretta la rabbia?",r:[
  ["Una persona",[["umore","Raffreddare la rabbia"],["lasciare","Perdonare e liberarsi"],["respiro","relax"]]],
  ["Una situazione ingiusta",[["umore","Raffreddare la rabbia"],["metta","Equanimità del cuore"],["lasciare","Lasciar andare il controllo"]]],
  ["Me stesso",[["umore","Perdonarsi"],["metta","Autocompassione"],["migliorarsi","Autostima"]]],
  ["Tutto mi irrita",[["umore","Raffreddare la rabbia"],["rilassamento","Rilassamento muscolare progressivo"],["respiro","relax"]]]]},
 stanco:{e:"😩",l:"Stanco",msg:"La stanchezza merita ascolto, non sforzo.",q:"Che tipo di stanchezza senti?",r:[
  ["Mentale, testa piena",[["umore","Ricaricare l'energia"],["umore","Fare chiarezza"],["respiro","coer"]]],
  ["Fisica, corpo pesante",[["rilassamento","Rilassamento autogeno"],["mindfulness","Body scan"],["rilassamento","Respiro che scioglie"]]],
  ["Ho dormito male",[["@sonno"],["umore","Ricaricare l'energia"],["respiro","coer"]]],
  ["Emotiva, mi sento svuotato",[["guarigione","Guarire il cuore"],["metta","Autocompassione"],["umore","Accogliere la tristezza"]]]]},
 demotivato:{e:"😶",l:"Demotivato",msg:"Capita a tutti di perdere la spinta. Ripartiamo da ciò che conta.",q:"Cosa ti frena in questo periodo?",r:[
  ["Non vedo risultati",[["umore","Ritrovare la motivazione"],["migliorarsi","Fiducia in sé"],["gratitudine","Gratitudine per le sfide"]]],
  ["Non so bene cosa voglio",[["migliorarsi","I tuoi valori"],["migliorarsi","Il mentore interiore"],["umore","Fare chiarezza"]]],
  ["Paura di sbagliare",[["migliorarsi","Superare la paura"],["umore","Prima di una prova importante"],["umore","Perdonarsi"]]],
  ["Poca energia",[["mattino","Risveglio energico"],["umore","Ricaricare l'energia"],["respiro","energia"]]]]},
 confuso:{e:"😵‍💫",l:"Confuso",msg:"Quando c'è troppa confusione, il silenzio aiuta a vedere.",q:"Cosa riempie la tua mente?",r:[
  ["Troppi pensieri insieme",[["umore","Fare chiarezza"],["lasciare","Foglie sul fiume"],["respiro","box"]]],
  ["Una decisione da prendere",[["umore","Fare chiarezza"],["migliorarsi","Il mentore interiore"],["migliorarsi","I tuoi valori"]]],
  ["Non riesco a concentrarmi",[["concentrazione","Un solo punto"],["concentrazione","Focus prima di studiare"],["respiro","box"]]]]},
 agitato:{e:"🌙",l:"Non riesco a dormire",msg:"Il sonno non si forza: si invita. Prepariamo il terreno.",q:"Cosa ti tiene sveglio?",r:[
  ["Pensieri che girano",[["sonno","Respiro 4-7-8 e conto alla rovescia"],["sonno","Lasciare la giornata"],["respiro","r478"]]],
  ["Corpo teso o irrequieto",[["sonno","Scansione per dormire"],["sonno","Yoga Nidra breve"],["rilassamento","Rilassamento muscolare progressivo"]]],
  ["Preoccupazioni",[["sonno","Lasciare la giornata"],["ansia","Accogliere la preoccupazione"],["respiro","r478"]]],
  ["Non lo so",[["sonno","Yoga Nidra breve"],["sonno","Viaggio sulla spiaggia"],["respiro","r478"]]]]},
 dolore:{e:"🤕",l:"Dolore o malessere",msg:"Mi dispiace che tu non stia bene. Possiamo accompagnare il corpo con gentilezza.",q:"Che tipo di malessere senti?",r:[
  ["Dolore in una parte del corpo",[["guarigione","Accogliere il dolore"],["guarigione","Il respiro che cura"],["respiro","relax"]]],
  ["Sono malato o in convalescenza",[["guarigione","Luce che guarisce"],["guarigione","Gentilezza verso il corpo"],["sonno","Yoga Nidra breve"]]],
  ["Tensione, mal di testa",[["rilassamento","Rilassamento muscolare progressivo"],["rilassamento","Respiro rilassante"],["respiro","relax"]]]],
  nota:"Se il dolore è forte o persistente, parlane con il tuo medico."}
};
const PAROLE = {
 sereno:["bene","felice","sereno","serena","contento","contenta","gioia","ottimo","alla grande","benissimo","tranquillo","tranquilla","rilassato"],
 ansioso:["ansia","ansioso","ansiosa","preoccup","paura","agitaz","panico","nervos","teso","tesa","inquiet"],
 stressato:["stress","sotto pressione","troppe cose","scadenz","carico","oberat","esaurit"],
 triste:["triste","giù","male","piango","piangere","depress","malinconi","vuoto","solo","sola","solitud","mancanza","lutto"],
 arrabbiato:["arrabbiat","rabbia","nervoso","irritat","furios","incazz","frustrat","odio"],
 stanco:["stanc","esaust","sfinit","stremat","affaticat","sonno arretrato","ho dormito male"],
 demotivato:["demotivat","svogliat","apatic","senza voglia","non ho voglia","pigro","pigra","annoiat","noia"],
 confuso:["confus","pensieri","distratt","non riesco a concentr","decisione","indecis","caos"],
 agitato:["dormire","insonnia","sveglio","sveglia","non dormo"],
 dolore:["dolore","male alla","mal di","malato","malata","febbre","influenza","ferit","infortun"]
};
function capisci(testo){
 const t=" "+testo.toLowerCase()+" "; let best=null,score=0;
 for(const [id,ps] of Object.entries(PAROLE)){ const s=ps.reduce((a,p)=>a+(t.includes(p)?p.length:0),0); if(s>score){score=s;best=id;} }
 if(/\bnon\b.{0,12}\b(bene|benissimo)\b/.test(t)) best = best==="sereno"?"triste":best||"triste";
 return best;
}

/* ---------- ricerca sessioni ---------- */
function trova(ref){
 if(ref[0]==="@sonno"){ const h=new Date().getHours(); return h>=20||h<6 ? trova(["sonno","Yoga Nidra breve"]) : trova(["umore","Ricaricare l'energia"]); }
 if(ref[0]==="respiro"){ const b=BR[ref[1]]; return b?{tipo:"respiro",id:ref[1],t:b.nome,sub:"Respiro · "+(ST.brDur||3)+" min",ic:b.icona}:null; }
 const p=PROGRAMS.find(x=>x.id===ref[0]); if(!p) return null;
 let i=p.sessioni.findIndex(s=>s.t===ref[1]); if(i<0) i=p.sessioni.findIndex(s=>s.t.includes(ref[1])); if(i<0) i=0;
 const s=p.sessioni[i];
 return {tipo:"sess",pid:p.id,i,t:s.t,sub:p.icona+" "+p.nome+" · "+Math.max(1,Math.round(estSession(s.steps)/60))+" min",ic:p.icona,col:p.col};
}

/* ---------- interfaccia ---------- */
const css=document.createElement("style");
css.textContent=`
#checkin{position:fixed;inset:0;z-index:60;display:none;align-items:flex-end;justify-content:center;background:#05080fcc;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}
#checkin.on{display:flex;animation:fade .3s}
#checkin .box{width:100%;max-width:560px;max-height:92vh;overflow:auto;background:linear-gradient(170deg,#1c2742,#121a2b);border:1px solid var(--line);border-radius:26px 26px 0 0;padding:22px 20px calc(24px + env(safe-area-inset-bottom))}
@media(min-width:600px){#checkin{align-items:center}#checkin .box{border-radius:26px}}
#checkin h2{margin:4px 0 6px;font-size:1.6rem;font-weight:300}
.moodgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:14px}
.moodgrid button{padding:12px 4px;border-radius:16px;background:#ffffff0d;border:1px solid var(--line);font-size:.8rem;display:flex;flex-direction:column;align-items:center;gap:4px;transition:.2s}
.moodgrid button span{font-size:1.7rem}
.moodgrid button:hover,.moodgrid button:active{border-color:var(--accent);background:#8fb8a822}
.ragioni button{display:block;width:100%;text-align:left;padding:14px 16px;margin-top:8px;border-radius:14px;background:#ffffff0d;border:1px solid var(--line);font-size:.95rem}
.ragioni button:hover{border-color:var(--accent)}
.ckin-input{display:flex;gap:8px;margin-top:14px}
.ckin-input input{flex:1;background:#ffffff0d;border:1px solid var(--line);border-radius:99px;padding:11px 16px;outline:none}
.ckin-top{display:flex;justify-content:space-between;align-items:center}
.reco{display:flex;gap:14px;align-items:center;padding:16px;margin-top:12px;cursor:pointer}
.reco.main{border-color:var(--pc);box-shadow:0 0 0 1px var(--pc) inset}
.reco .ic{font-size:1.8rem}
`;
document.head.appendChild(css);
const box=document.createElement("div"); box.id="checkin"; box.innerHTML='<div class="box" id="ckBox"></div>'; document.body.appendChild(box);
let stato={};

function apri(){ stato={}; passo1(); box.classList.add("on"); }
function chiudi(){ box.classList.remove("on"); }
function top(){ return `<div class="ckin-top"><span class="muted small">🌈 Il tuo momento</span><button class="icbtn" data-uact="chiudi" style="width:36px;height:36px;flex-basis:36px">✕</button></div>`; }
function passo1(){
 const h=new Date().getHours();
 const q=DOMANDE[Math.floor(Math.random()*DOMANDE.length)];
 const ids=Object.keys(M).filter(id=>id!=="agitato"||h>=20||h<6);
 $("#ckBox").innerHTML=`${top()}<h2>${q}</h2><p class="muted small">Scegli quello che senti più vicino, oppure scrivilo con parole tue.</p>
  <div class="moodgrid">${ids.map(id=>`<button data-uact="umore" data-id="${id}"><span>${M[id].e}</span>${M[id].l}</button>`).join("")}</div>
  <form class="ckin-input" data-uform="testo"><input id="ckText" placeholder="Es. sono preoccupato per il lavoro…" autocomplete="off"><button class="btn sm" type="submit">→</button></form>
  <p class="small muted" style="margin-top:12px;text-align:center"><a href="#" data-uact="chiudi" style="color:var(--muted)">Non ora</a></p>`;
}
function passo2(id){
 stato.umore=id; const m=M[id];
 $("#ckBox").innerHTML=`${top()}<div style="font-size:2.2rem;margin-top:6px">${m.e}</div><p class="muted" style="margin-top:4px">${m.msg}</p>
  <h2>${m.q}</h2><div class="ragioni">${m.r.map((r,i)=>`<button data-uact="motivo" data-i="${i}">${r[0]}</button>`).join("")}</div>
  <p class="small muted" style="margin-top:12px"><a href="#" data-uact="indietro" style="color:var(--muted)">← Cambia risposta</a></p>`;
}
function passo3(i){
 const m=M[stato.umore], r=m.r[i]; stato.motivo=r[0];
 ST.checkins=(ST.checkins||[]); ST.checkins.unshift({ts:Date.now(),u:stato.umore,m:r[0]}); ST.checkins=ST.checkins.slice(0,60); ST.lastCheckin=Date.now(); save();
 const recs=r[1].map(trova).filter(Boolean);
 const card=(x,main)=>`<div class="card reco ${main?"main":""}" style="--pc:${x.col||"#8fc3d8"}" data-uact="avvia" data-k="${x.tipo}" data-p="${x.pid||""}" data-i="${x.i||0}" data-b="${x.id||""}">
   <span class="ic">${x.ic}</span><div style="flex:1"><small class="muted">${main?"Ti consiglio":"Oppure"}</small><h3 style="font-family:var(--serif);font-weight:500;font-size:${main?"1.2rem":"1rem"}">${esc(x.t)}</h3><p class="muted small">${esc(x.sub)}</p></div><span style="font-size:1.3rem">▶</span></div>`;
 $("#ckBox").innerHTML=`${top()}<h2 style="font-size:1.35rem">Ecco cosa ti propongo</h2>
  <p class="muted small">${m.e} ${m.l} · ${esc(r[0])}</p>
  ${recs.map((x,k)=>card(x,k===0)).join("")}
  ${m.nota?`<p class="note">${m.nota}</p>`:""}
  <p class="small muted" style="margin-top:14px;text-align:center"><a href="#" data-uact="chiudi" style="color:var(--muted)">Più tardi</a></p>`;
}
document.addEventListener("click",e=>{
 const el=e.target.closest("[data-uact]"); if(!el) return; e.preventDefault();
 const a=el.dataset.uact;
 if(a==="chiudi"){ chiudi(); ST.lastCheckin=Date.now(); save(); }
 if(a==="apri") apri();
 if(a==="umore") passo2(el.dataset.id);
 if(a==="indietro") passo1();
 if(a==="motivo") passo3(+el.dataset.i);
 if(a==="avvia"){ chiudi(); if(el.dataset.k==="respiro") startBreath(el.dataset.b); else startSession(el.dataset.p,+el.dataset.i); }
 if(a==="autock"){ ST.checkinAuto=ST.checkinAuto===false; save(); renderTu(); }
});
document.addEventListener("submit",e=>{
 if(!e.target.matches("[data-uform]")) return; e.preventDefault();
 const t=($("#ckText").value||"").trim(); if(!t) return;
 const id=capisci(t);
 if(id) passo2(id); else { $("#ckText").value=""; $("#ckText").placeholder="Non ho capito bene: scegli uno stato qui sopra"; }
});

/* ---------- Home e impostazioni ---------- */
const _rh=renderHome;
renderHome=function(){
 _rh();
 const h1=document.querySelector("#view-home h1"); if(!h1) return;
 const last=(ST.checkins||[])[0], oggi=last&&new Date(last.ts).toDateString()===new Date().toDateString();
 const html=`<div class="card hero" style="--pc:#e3a6c9;margin-top:16px" data-uact="apri"><div class="orbmini"></div><div><small class="muted">${oggi?`Prima ti sentivi ${M[last.u].e} ${M[last.u].l.toLowerCase()}`:"Meditazione su misura"}</small><h3 style="font-family:var(--serif);font-size:1.2rem;font-weight:500">${oggi?"E adesso, come stai?":"Come ti senti adesso?"}</h3><p class="muted small">Rispondi a due domande e ti propongo la meditazione giusta</p></div></div>`;
 const p=h1.nextElementSibling; (p||h1).insertAdjacentHTML("afterend",html);
};
const _rt=renderTu;
renderTu=function(){
 _rt();
 const card=[...document.querySelectorAll("#view-tu .card")].find(c=>c.querySelector(".set")); if(!card) return;
 const first=card.querySelector(".set");
 first.insertAdjacentHTML("beforebegin",`<div class="set"><div><h3>Chiedimi come sto all'apertura</h3><p class="muted small">Una domanda breve e una meditazione su misura</p></div><button class="switch ${ST.checkinAuto!==false?"on":""}" data-uact="autock"></button></div>`);
 const ck=(ST.checkins||[]).slice(0,7);
 if(ck.length){
  const h2=[...document.querySelectorAll("#view-tu h2")].find(x=>/Storico/.test(x.textContent));
  if(h2) h2.insertAdjacentHTML("beforebegin",`<h2>Il tuo umore</h2><div class="card"><div class="row" style="gap:14px;justify-content:space-around">${ck.slice().reverse().map(c=>`<div style="text-align:center;font-size:.7rem" class="muted"><div style="font-size:1.6rem">${M[c.u]?M[c.u].e:"•"}</div>${new Date(c.ts).toLocaleDateString("it-IT",{weekday:"short"})}</div>`).join("")}</div></div>`);
 }
};

/* ---------- domanda all'apertura ---------- */
setTimeout(()=>{
 if(ST.checkinAuto===false||P.on) return;
 if(ST.lastCheckin&&Date.now()-ST.lastCheckin<3*3600*1000) return;
 apri();
},700);
try{ refresh(); }catch(e){}
})();
