/* =========================================================
   MeditoPedia — Sessioni extra (12-17 min e 20-30 min)
   Da caricare DOPO lo script principale di index.html:
   <script src="sessioni-extra.js"></script>  subito prima di </body>

   Formato righe:
     "testo|8"  → pausa fissa di 8 secondi dopo il testo
     "testo*3"  → pausa "elastica": riceve 3 parti del tempo libero
     "testo"    → pausa fissa di 8 secondi
     {b:"box",n:6} → esercizio di respiro guidato
   La durata totale viene calcolata in modo da rispettare i minuti indicati.
   Nelle pause lunghe vengono inseriti brevi richiami.
   ========================================================= */
(function(){
"use strict";
const RATE = 0.88;
const sp = t => t.split(/\s+/).length * .45 / RATE;
const brT = o => BR[o.b].f.reduce((a,f)=>a+f[1],0)*o.n+3;

const GEN = [
 "Se la mente si è allontanata, nota dove è andata e torna con gentilezza.",
 "Ammorbidisci le spalle, la fronte e la mascella.",
 "Non c'è niente da ottenere. Solo questo momento, così com'è.",
 "Ogni ritorno è un piccolo atto di consapevolezza.",
 "Lascia che il respiro sia naturale, senza guidarlo.",
 "Controlla la postura: dritta, stabile, rilassata.",
 "Se arriva sonnolenza, raddrizza un po' la schiena e apri l'attenzione.",
 "Si può sempre ricominciare. Ricomincia da qui, adesso.",
 "Senti il contatto del corpo con il supporto.",
 "Accogli qualsiasi cosa appaia, senza trattenerla e senza respingerla."
];
const SLEEPR = [
 "Va bene se la mente vaga. Lasciala vagare verso il sonno.",
 "Il corpo è sempre più pesante, sempre più morbido.",
 "Ogni espirazione ti porta un po' più giù, nel riposo.",
 "Non devi restare sveglio per ascoltare.",
 "Lascia che il respiro rallenti da solo.",
 "Sei al sicuro. Puoi lasciarti andare."
];
const REM = {
 impara:["Torna alla tua ancora: naso, petto o pancia.","Accorgersi della distrazione è già meditare."],
 intermedio:["Annota con leggerezza ciò che appare, poi torna.","Osserva senza giudicare, come uno scienziato curioso."],
 avanzato:["Precisione e leggerezza, insieme.","Nota l'inizio, la durata e la fine di ogni esperienza.","Ritorna senza commenti, semplicemente."],
 trascendente:["Lascia che anche lo sforzo di meditare si dissolva.","Riposa nel silenzio che c'è sotto ogni suono.","Non cercare. Sii."],
 mindfulness:["Torna ai sensi: cosa senti in questo momento?","Qui e ora. Questo respiro, questo istante."],
 metta:["Lascia che le parole arrivino al cuore, non solo alla mente.","Se non senti niente va bene: l'intenzione è sufficiente.","Ripeti le frasi con calma, come semi nella terra."],
 concentrazione:["Torna all'oggetto, con fermezza gentile.","Ogni ritorno è una ripetizione che allena l'attenzione."],
 gratitudine:["Lascia che la gratitudine si senta nel corpo, nel petto.","Anche le cose piccole contano."],
 mattino:["Senti l'energia della giornata che inizia.","Respira luce, espira pesantezza."],
 sonno:[],
 rilassamento:["Ad ogni espirazione, un po' più morbido.","Lascia che il corpo sia pesante e sostenuto."],
 ansia:["Sei al sicuro in questo momento.","Allunga un po' l'espirazione.","Senti i piedi, il terreno sotto di te."],
 guarigione:["Lascia che il respiro porti cura dove serve.","Sii paziente con il corpo: sta facendo del suo meglio."],
 lasciare:["Lascia andare, e lascia andare ancora.","Non trattenere niente: tutto passa."],
 migliorarsi:["Senti la fiducia nel corpo: schiena dritta, cuore aperto.","Il cambiamento nasce da piccoli passi ripetuti."]
};

function hash(s){let h=0;for(const c of s)h=(h*31+c.charCodeAt(0))>>>0;return h;}
function parse(c){
 if(typeof c==="object") return {o:c};
 let m=c.match(/^(.*)\*(\d+(?:\.\d+)?)$/s); if(m) return {t:m[1],w:+m[2]};
 m=c.match(/^(.*)\|(\d+(?:\.\d+)?)$/s); if(m) return {t:m[1],p:+m[2]};
 return {t:c,p:8};
}
function fixedOf(lines){ return lines.map(parse).reduce((a,it)=>a+(it.o?brT(it.o):sp(it.t)+(it.p||0)),0); }

function build(pid,sleep,[title,desc,min,core,pre]){
 const intro=sleep?INS:IN, outro=sleep?OUTS:OUT;
 const pool=(sleep?SLEEPR:[]).concat(REM[pid]||[], sleep?[]:GEN);
 const items=core.map(parse);
 const fixed=fixedOf(pre||[])+fixedOf(intro)+fixedOf(outro)+items.reduce((a,it)=>a+(it.o?brT(it.o):sp(it.t)+(it.p||0)),0);
 const W=items.reduce((a,it)=>a+(it.w||0),0)||1;
 const free=Math.max(W*20,min*60-fixed);
 const steps=[...(pre||[]),...intro]; let k=hash(title)%pool.length;
 items.forEach(it=>{
  if(it.o){ steps.push(it.o); return; }
  if(it.w==null){ steps.push(it.t+"|"+it.p); return; }
  let p=free*it.w/W; const n=Math.floor(p/120);
  if(n>0&&pool.length){
   const rems=[]; for(let j=0;j<n;j++) rems.push(pool[k++%pool.length]);
   p=Math.max(10,p-rems.reduce((a,r)=>a+sp(r),0)); const part=Math.round(p/(n+1));
   steps.push(it.t+"|"+part); rems.forEach(r=>steps.push(r+"|"+part));
  } else steps.push(it.t+"|"+Math.round(Math.max(4,p)));
 });
 steps.push(...outro);
 return {t:title,d:desc+" · "+min+" min",steps};
}

/* =========================================================
   CONTENUTI: [titolo, descrizione, minuti, righe, righe-prima-dell'intro]
   ========================================================= */
const EXTRA = {

impara:[
 ["Giorno 8 · Più tempo, meno sforzo","Allungare la pratica",12,[
  "Più tempo non significa più sforzo. Significa più spazio per osservare.|6",
  "Trova la tua ancora: naso, petto o pancia.|10",
  "Resta con il respiro. Quando ti distrai, torna.*3",
  "Ora conta dieci respiri, poi ricomincia da uno.*3",
  "Lascia andare il conteggio e semplicemente respira.*2"],
  ["Benvenuto nella seconda settimana del corso. Da oggi le sessioni diventano più lunghe.|4"]],
 ["Giorno 9 · Postura e stabilità","La montagna e il prato",14,[
  "Senti la base: il bacino, le gambe, i piedi.|10",
  "Immagina un filo che tira dolcemente la sommità della testa verso l'alto.|10",
  "La schiena è stabile come una montagna. Il viso e le spalle morbidi come un prato.|10",
  "Resta in questa postura, respirando.*3",
  "Quando noti una tensione, ammorbidiscila espirando.*2",
  "Senti la dignità e la calma di questa posizione.*2"]],
 ["Giorno 10 · Distrazioni amiche","Imparare dalle distrazioni",15,[
  "Oggi trattiamo le distrazioni come insegnanti, non come nemiche.|6",
  "Ogni volta che ti accorgi di esserti distratto, di' dentro di te: grazie, torno.|8",
  "Torna al respiro.*3",
  "Nota che tipo di distrazione arriva: un ricordo, un progetto, un giudizio.|10",
  "Dalle un nome con una parola, poi torna al respiro.*3",
  "L'istante in cui ti accorgi è l'istante della consapevolezza.*2"]],
 ["Giorno 11 · Respiro e corpo insieme","Il corpo intero che respira",17,[
  "Senti il respiro nella pancia.|15",
  "Allarga l'attenzione: senti come il respiro muove tutto il torso, davanti, ai lati e dietro.*2",
  "Ora tutto il corpo che respira, come un'unica onda.*3",
  "Se una sensazione chiama la tua attenzione, esplorala per qualche respiro, poi torna al corpo intero.*3",
  "Riposa nel corpo che respira.*2"]],
 ["Giorno 12 · Venti minuti","La prima sessione lunga",20,[
  "Oggi la tua prima sessione da venti minuti. Ti guiderò con poche parole.|5",
  "Stabilizzati sul respiro.*3",
  "Allarga l'attenzione ai suoni, vicini e lontani.*2",
  "Torna al respiro, la tua ancora.*3",
  "Negli ultimi minuti, riposa senza tecnica, semplicemente presente.*2"]],
 ["Giorno 13 · Emozioni nel corpo","Fare spazio a ciò che si sente",22,[
  "Stabilizzati per qualche minuto sul respiro.*2",
  "Ora richiama un'emozione leggera della giornata, niente di troppo intenso.|12",
  "Trovala nel corpo. Dove si trova? Che forma ha?|15",
  "Respira con essa, facendole spazio, senza cercare di cambiarla.*3",
  "Torna al respiro come a una base sicura.*2",
  "Lascia andare l'emozione e riposa nel corpo intero.*2"]],
 ["Giorno 14 · Gentilezza estesa","Metta in profondità",25,[
  "Porta una mano sul cuore e senti il suo calore.|10",
  "Ripeti dentro di te: possa io stare bene. Possa io essere sereno. Possa io accogliermi così come sono.*2",
  "Pensa a una persona cara. Possa tu stare bene. Possa tu essere sereno. Possa tu essere felice.*2",
  "Pensa a una persona neutra, incontrata da poco. Anche lei desidera essere felice. Possa tu stare bene.*2",
  "Pensa a una persona con cui c'è una difficoltà, se te la senti. Possa tu trovare pace.*2",
  "Estendi ora questi auguri a tutti gli esseri, in ogni luogo.*2",
  "Riposa nel calore di questa intenzione.*2"]],
 ["Giorno 15 · La tua pratica","Mezz'ora quasi in silenzio",30,[
  "Ultimo giorno del corso: trenta minuti con pochissime parole.|6",
  "Usa ciò che hai imparato: respiro, corpo, suoni, pensieri, gentilezza.|6",
  "Inizia dal respiro.*4",
  "Allarga l'attenzione a tutto il corpo.*3",
  "Apri ai suoni e ai pensieri, come il cielo che accoglie le nuvole.*3",
  "Concludi con un pensiero gentile per te e per gli altri.*1",
  "Hai completato il corso. Da adesso la pratica è tua.|5"]]
],

intermedio:[
 ["Annotare in profondità","Pensiero, sensazione, suono",12,[
  "Stabilizza l'attenzione sul respiro.*2",
  "Ora annota con una parola ciò che emerge: pensiero, sensazione, suono, emozione.|8",
  "Annota e torna. Annota e torna.*3",
  "Nota quale categoria appare più spesso. Senza giudicare, solo curiosità.*2",
  "Lascia andare le parole e osserva in silenzio.*2"]],
 ["Il respiro in tre punti","Narici, petto, addome",14,[
  "Porta l'attenzione alle narici: aria fresca che entra, tiepida che esce.*2",
  "Sposta l'attenzione al petto che si alza e si abbassa.*2",
  "Scendi all'addome che si gonfia e si sgonfia.*2",
  "Ora tieni insieme i tre punti, come un'unica sensazione del respiro.*3"]],
 ["Piacevole, spiacevole, neutro","Il tono delle esperienze",15,[
  "Ogni esperienza ha un tono: piacevole, spiacevole o neutro.|8",
  "Osserva le sensazioni del corpo e nota il loro tono.*3",
  "Nota come il piacevole porta a volere di più, e lo spiacevole a respingere.|10",
  "Resta con il tono senza seguire la reazione.*3",
  "Riposa nel neutro, che spesso passa inosservato.*2"]],
 ["Ascolto profondo","Meditazione sui suoni",17,[
  "Lascia il respiro sullo sfondo e apri l'ascolto.|10",
  "Ascolta i suoni più vicini.*2",
  "Ora i suoni più lontani, al limite di ciò che senti.*2",
  "Ascolta i suoni come pura vibrazione, senza dare nomi.*3",
  "Nota anche il silenzio tra un suono e l'altro.*3"]],
 ["Mente come cielo","Consapevolezza aperta lunga",20,[
  "Inizia con qualche minuto di respiro.*2",
  "Ora apri l'attenzione a tutto: suoni, sensazioni, pensieri.|10",
  "Lascia che tutto venga e vada, come nuvole nel cielo.*4",
  "Se ti perdi, un respiro per tornare, poi riapri.*3"]],
 ["Il corpo emotivo","Sentire e lasciare essere",22,[
  "Fai una scansione rapida del corpo, dai piedi alla testa.*2",
  "Ora chiediti: che emozione è presente adesso, anche lieve?|10",
  "Trova dove vive nel corpo e osservala come sensazione.*3",
  "Respira con l'emozione. Puoi dire: anche questo può stare qui.*3",
  "Nota come cambia, momento dopo momento.*2",
  "Torna al corpo intero e al respiro.*2"]],
 ["Dieci per dieci, lungo","Allenare la continuità",25,[
  "Conta dieci respiri, poi ricomincia da uno.|6",
  "Prova a mantenere il conteggio con continuità.*4",
  "Ora conta solo le espirazioni, da uno a dieci.*3",
  "Lascia andare i numeri e resta col respiro.*3"]],
 ["Sedere come una montagna","Stabilità e presenza",30,[
  "Immagina una montagna maestosa, salda nella sua base.|15",
  "Diventa la montagna: il tuo corpo è la base, la testa è la vetta.|10",
  "Sulla montagna passano le stagioni, le tempeste, il sole. Lei resta.*3",
  "I pensieri e le emozioni sono il clima. Tu sei la montagna.*4",
  "Riposa nella tua stabilità.*3"]]
],

avanzato:[
 ["Il punto di contatto","Shamatha sulle narici",12,[
  "Porta l'attenzione al piccolo punto dove l'aria tocca le narici.|10",
  "Resta lì con precisione, come se guardassi con una lente.*4",
  "Nota la sensazione anche tra un respiro e l'altro.*3"]],
 ["Sottigliezza","Quando il respiro diventa fine",14,[
  "Inizia con la sensazione del respiro alle narici.*2",
  "Mentre la mente si calma, il respiro diventa più sottile. Segui la sottigliezza.*3",
  "Se il respiro sembra sparire, resta con la sensazione più leggera che trovi.*3",
  "Riposa nella quiete.*2"]],
 ["Nascere e svanire","Vipassana sulle sensazioni",15,[
  "Osserva una sensazione del corpo da vicino.|10",
  "Nota il suo inizio, il suo cambiamento, la sua fine.*3",
  "Passa da una sensazione all'altra, sempre notando il loro sorgere e svanire.*3",
  "Osserva come nessuna cosa rimane uguale.*3"]],
 ["Il flusso dei pensieri","Osservare la mente",17,[
  "Osserva i pensieri come se fossi seduto lungo un'autostrada a guardare le auto passare.|10",
  "Non salire sulle auto. Guardale arrivare e allontanarsi.*3",
  "Nota quando un pensiero inizia.*2",
  "Nota quando un pensiero finisce.*2",
  "Riposa nello spazio tra i pensieri.*3"]],
 ["Scansione lenta del corpo","Vipassana a strati",20,[
  "Porta l'attenzione alla sommità della testa e scendi molto lentamente.|10",
  "Esplora ogni area: testa, viso, collo.*2",
  "Le spalle, le braccia, le mani.*2",
  "Il petto, la schiena, l'addome.*2",
  "Il bacino, le gambe, i piedi.*2",
  "Ora senti il corpo come un campo di vibrazioni in continuo cambiamento.*3"]],
 ["Chi conosce?","Auto-indagine lunga",22,[
  "Riposa qualche minuto nel respiro.*2",
  "Nota che c'è consapevolezza di tutto ciò che accade.|10",
  "Chiediti: chi è consapevole? Guarda, senza rispondere a parole.*3",
  "Quando appare un pensiero: a chi appare?*3",
  "Riposa come ciò che conosce.*3"]],
 ["Equanimità","Né afferrare né respingere",25,[
  "Osserva l'esperienza così come si presenta.*2",
  "Quando qualcosa è piacevole, nota la tendenza ad afferrarlo. Lascialo essere.*3",
  "Quando qualcosa è spiacevole, nota la tendenza a respingerlo. Lascialo essere.*3",
  "Riposa nell'equilibrio, come una bilancia ferma.*4"]],
 ["Ritiro di mezz'ora","Pratica silenziosa",30,[
  "Oggi trenta minuti di pratica con pochissime indicazioni.|6",
  "Scegli il tuo oggetto: respiro, sensazioni o consapevolezza stessa.|8",
  "Pratica.*6",
  "Continua, con leggerezza.*4",
  "Ultimi minuti: lascia andare ogni tecnica.*2"]]
],

trascendente:[
 ["So Ham profondo","Mantra e respiro",12,[
  "Inspirando, ascolta interiormente: So. Espirando: Ham.|10",
  "Lascia che il mantra segua il respiro, senza sforzo.*4",
  "Lascia che il mantra diventi più sottile, quasi un sussurro.*3"]],
 ["Om interiore","Il suono primordiale",14,[
  "Immagina il suono Om che risuona dolcemente dentro di te.|10",
  "Lascia che il suono vibri nel petto, nella gola, nella testa.*3",
  "Lascia che il suono si allontani, sempre più piano.*2",
  "Riposa nel silenzio che segue il suono.*3"]],
 ["Il testimone","Pura presenza",15,[
  "Nota che tutto ciò che vedi, senti e pensi accade davanti a un testimone silenzioso.|10",
  "Riposa come il testimone: presente, non coinvolto.*4",
  "Il testimone non cambia, mentre tutto il resto cambia.*3"]],
 ["Luce interiore","Riposare nella luminosità",17,[
  "Immagina una luce morbida al centro del petto.|10",
  "La luce si espande in tutto il corpo.*2",
  "Oltre il corpo, nella stanza, nel cielo.*2",
  "Lascia che non ci sia più distinzione tra te e la luce.*4"]],
 ["Mantra a lungo","Venti minuti di mantra",20,[
  "Ripeti dentro di te il mantra So Ham, lentamente.|8",
  "Se la mente si allontana, torna al mantra senza fretta.*4",
  "Quando il mantra si dissolve da solo, riposa nel silenzio.*3",
  "Se ritornano i pensieri, riprendi il mantra con delicatezza.*2"]],
 ["Senza confini","Lo spazio infinito",22,[
  "Senti i confini del corpo, poi lasciali sfumare.|12",
  "La consapevolezza si espande nella stanza, nel paesaggio, nel cielo.*2",
  "Fino alla terra intera, e allo spazio oltre la terra.*2",
  "Riposa come spazio aperto, senza centro e senza bordi.*5"]],
 ["Il silenzio prima del pensiero","Riposare alla fonte",25,[
  "Osserva come nasce un pensiero.*2",
  "Nota il silenzio da cui emerge, e in cui si dissolve.*3",
  "Riposa in quel silenzio, prima del pensiero.*5",
  "Lascia che sia il silenzio a meditare.*2"]],
 ["Essere","Mezz'ora di non fare",30,[
  "In questa pratica non c'è niente da fare e niente da raggiungere.|8",
  "Lascia che tutto sia esattamente com'è.|6",
  "Semplicemente, sii.*7",
  "Senti la pace che non dipende da nulla.*4"]]
],

mindfulness:[
 ["Body scan esteso","Ogni parte del corpo",15,[
  "Porta l'attenzione ai piedi: dita, pianta, tallone.*2",
  "Le caviglie, i polpacci, le ginocchia, le cosce.*2",
  "Il bacino, la pancia, il petto.*2",
  "La schiena, le spalle, le braccia, le mani.*2",
  "Il collo, il viso, la testa.*2",
  "Ora il corpo intero, completo.*2"]],
 ["I cinque sensi","Presenza sensoriale",12,[
  "Con gli occhi chiusi, nota le immagini dietro le palpebre: luce, colori.*1",
  "Ascolta i suoni intorno.*2",
  "Nota gli odori e i profumi dell'ambiente.*1",
  "Nota i sapori in bocca.*1",
  "Senti il tatto: vestiti, aria, temperatura.*2",
  "Ora tutti i sensi insieme, aperti.*2"]],
 ["Respiro, corpo, suoni, pensieri","La pratica completa",17,[
  "Inizia dal respiro.*2",
  "Allarga al corpo intero.*2",
  "Apri ai suoni.*2",
  "Osserva i pensieri come eventi della mente.*2",
  "Ora tutto insieme: consapevolezza senza scelta.*2"]],
 ["Mindfulness delle emozioni","Riconoscere e accogliere",14,[
  "Chiediti: come mi sento adesso?|10",
  "Dai un nome all'emozione: tristezza, gioia, irrequietezza, calma.|10",
  "Senti dove vive nel corpo.*3",
  "Resta con l'emozione con curiosità.*3",
  "Torna al respiro.*2"]],
 ["Body scan profondo","Venti minuti nel corpo",22,[
  "Porta l'attenzione all'alluce sinistro. Poi a tutte le dita del piede sinistro.*1",
  "La pianta, il tallone, la caviglia, il polpaccio, il ginocchio, la coscia sinistra.*2",
  "Le dita del piede destro, la pianta, il tallone, la caviglia, il polpaccio, il ginocchio, la coscia destra.*2",
  "Il bacino, i glutei, la zona lombare.*1",
  "La pancia, il petto, la parte alta della schiena.*2",
  "Le mani, i polsi, gli avambracci, i gomiti, le braccia, le spalle.*2",
  "Il collo, la gola, la mascella, la bocca, il naso, gli occhi, la fronte, la testa.*2",
  "Il corpo intero che respira.*2"]],
 ["Camminata lunga","Da fare in piedi",20,[
  "Alzati e trova uno spazio dove camminare avanti e indietro.|10",
  "Senti il peso del corpo sui piedi.*1",
  "Cammina molto lentamente: sollevo, muovo, appoggio.*3",
  "Aumenta un po' il ritmo, mantenendo la presenza.*3",
  "Nota anche ciò che vedi e senti mentre cammini.*2",
  "Fermati e senti il corpo in piedi.*1"],
  ["Questa pratica si fa in piedi e camminando, in casa o all'aperto.|4"]],
 ["Consapevolezza della mente","Osservare il pensare",25,[
  "Stabilizzati sul respiro.*2",
  "Ora osserva i pensieri: immagini, parole, ricordi, progetti.*3",
  "Nota quando la mente commenta, giudica o pianifica.*3",
  "Osserva lo spazio in cui i pensieri appaiono.*3",
  "Torna al respiro.*2"]],
 ["Mindfulness integrale","Mezz'ora di presenza",30,[
  "Respiro.*3",
  "Corpo.*3",
  "Suoni.*2",
  "Pensieri ed emozioni.*3",
  "Consapevolezza aperta.*4"]]
],

metta:[
 ["Metta per sé","Gentilezza verso di sé",12,[
  "Immagina te stesso da bambino. Rivolgigli auguri gentili.|10",
  "Possa tu essere al sicuro. Possa tu essere in salute. Possa tu essere felice.*3",
  "Ora rivolgi gli stessi auguri a te stesso, oggi.*3",
  "Riposa nel calore.*2"]],
 ["Metta per una persona cara","Il cuore aperto",14,[
  "Pensa a una persona che ami. Vedila sorridere.|10",
  "Possa tu essere felice. Possa tu stare bene.*3",
  "Senti il calore che nasce nel petto.*2",
  "Estendi questo calore a te stesso.*2"]],
 ["Metta per chi è difficile","Ammorbidire il cuore",15,[
  "Inizia da te stesso: possa io stare bene.*2",
  "Pensa a una persona con cui hai una difficoltà, non troppo grande.|10",
  "Anche lei desidera essere felice. Possa tu trovare pace.*3",
  "Se senti resistenza, torna a te stesso con gentilezza.*2"]],
 ["Compassione","Karuna",17,[
  "Pensa a qualcuno che sta soffrendo.|10",
  "Lascia che il cuore si apra alla sua sofferenza.*2",
  "Possa tu essere libero dalla sofferenza.*3",
  "Estendi la compassione a tutti coloro che soffrono.*3"]],
 ["I quattro cerchi","Metta lunga",22,[
  "Possa io stare bene.*2",
  "Possa stare bene chi amo.*2",
  "Possa stare bene chi conosco appena.*2",
  "Possa stare bene chi mi è difficile.*2",
  "Possano stare bene tutti gli esseri.*3"]],
 ["Gioia per gli altri","Mudita",20,[
  "Pensa a qualcuno che sta vivendo un momento felice.|10",
  "Gioisci con lui: sono felice per te.*3",
  "Pensa a qualcuno che ha avuto un successo. Sono felice per te.*3",
  "Lascia che la gioia altrui nutra la tua.*3"]],
 ["Equanimità del cuore","Upekkha",25,[
  "Pensa a una persona neutra.*2",
  "Ripeti: ognuno è responsabile della propria vita. Posso augurare bene e accettare ciò che accade.*3",
  "Pensa a una persona cara e ripeti la stessa frase.*3",
  "Lascia che il cuore sia calmo come un lago.*4"]],
 ["Metta per il mondo","Mezz'ora di benevolenza",30,[
  "Possa io stare bene.*2",
  "Possano stare bene le persone della mia casa.*2",
  "Possano stare bene le persone del mio paese.*2",
  "Possano stare bene gli esseri del mio paese e della mia nazione.*2",
  "Possano stare bene tutti gli esseri della terra.*3",
  "Riposa nel cuore aperto.*3"]]
],

concentrazione:[
 ["Contare cento respiri","Disciplina gentile",12,[
  "Conta i respiri da uno a cento.|6",
  "Se perdi il conto, ricomincia da uno.*5",
  "Lascia andare i numeri e resta col respiro.*2"]],
 ["Un solo punto","Focalizzazione",14,[
  "Scegli un punto: le narici, il petto, la pancia.|8",
  "Resta lì.*5",
  "Lascia che l'attenzione si stabilizzi da sola.*3"]],
 ["Visualizzare un oggetto","Allenare la mente",15,[
  "Immagina una mela rossa davanti a te.|10",
  "Osservane i dettagli: forma, colore, riflessi.*3",
  "Tieni l'immagine stabile. Se svanisce, ricreala.*4",
  "Lascia andare l'immagine e riposa.*2"]],
 ["Focus per il lavoro","Prima di un compito importante",17,[
  {b:"box",n:6},
  "Stabilizzati sul respiro.*3",
  "Visualizza il compito che ti aspetta.*2",
  "Immagina di affrontarlo con calma e attenzione.*3"]],
 ["Mente a laser","Concentrazione lunga",20,[
  "Porta l'attenzione al respiro alle narici.*3",
  "Riduci ancora l'area di attenzione: solo il punto più sensibile.*4",
  "Resta con fermezza gentile.*3"]],
 ["Il suono come oggetto","Attenzione all'ascolto",22,[
  "Scegli un suono costante nel sottofondo e resta con esso.|10",
  "Ogni volta che ti distrai, torna al suono.*5",
  "Ora lascia andare il suono e resta con il respiro.*3"]],
 ["Trataka lungo","La fiamma interiore",25,[
  "Immagina la fiamma di una candela, immobile.|10",
  "Osservane il colore, la forma, la luce.*3",
  "Tieni la fiamma al centro della mente.*5",
  "Lascia che la fiamma si dissolva e riposa nella luce.*2"]],
 ["Allenamento di mezz'ora","Concentrazione profonda",30,[
  "Conta dieci respiri, poi ricomincia.*3",
  "Lascia i numeri e segui il respiro.*4",
  "Resta solo con la sensazione alle narici.*4",
  "Riposa nella stabilità raggiunta.*2"]]
],

gratitudine:[
 ["Gratitudine per le persone","Chi ti ha aiutato",12,[
  "Pensa a una persona che ti ha aiutato nella vita.|10",
  "Ricorda cosa ha fatto per te. Senti la gratitudine.*3",
  "Pensa a un'altra persona.*2",
  "Ringraziale nel cuore.*2"]],
 ["Gratitudine per la natura","La terra che ci sostiene",14,[
  "Pensa all'aria che respiri.*2",
  "All'acqua che bevi.*2",
  "Al cibo che ti nutre.*2",
  "Agli alberi, ai boschi, al cielo.*2"]],
 ["Gratitudine per le sfide","Ciò che ti ha fatto crescere",15,[
  "Pensa a una difficoltà del passato che ti ha insegnato qualcosa.|10",
  "Cosa hai imparato?*3",
  "Riconosci la tua forza.*3",
  "Ringrazia anche per questo.*2"]],
 ["Il giorno ripercorso","Gratitudine serale",17,[
  "Ripercorri la giornata dall'inizio.*2",
  "Trova i piccoli momenti belli.*3",
  "Fermati su uno e rivivilo.*3",
  "Ringrazia la giornata.*2"]],
 ["Grazie a tutto","Gratitudine estesa",20,[
  "Ringrazia il corpo.*2",
  "Le persone care.*2",
  "La casa che ti protegge.*2",
  "La natura.*2",
  "La vita stessa.*2"]],
 ["La catena della gratitudine","Tutto è connesso",22,[
  "Pensa al cibo che hai mangiato oggi.|10",
  "Pensa a chi lo ha coltivato, trasportato, venduto, cucinato.*3",
  "Pensa al sole e alla pioggia che lo hanno fatto crescere.*3",
  "Senti di far parte di una grande rete di vita.*3"]],
 ["Gratitudine profonda","Gioia semplice",25,[
  "Lascia emergere ciò per cui sei grato, senza cercare.*4",
  "Accogli ciò che arriva.*4",
  "Senti la gratitudine nel corpo.*3"]],
 ["Mezz'ora di grazie","Un viaggio nella vita",30,[
  "Ripensa alla tua infanzia: per cosa sei grato?*3",
  "Alla giovinezza.*3",
  "Agli anni recenti.*3",
  "A oggi.*3",
  "Al futuro che verrà.*2"]]
],

mattino:[
 ["Sveglia dolce","Riprendere contatto",12,[
  "Senti il corpo che si risveglia.|10",
  "Fai qualche respiro profondo.*2",
  "Immagina la luce del mattino che entra nel corpo.*3",
  "Formula un'intenzione per oggi.*2"]],
 ["Energia vitale","Respiro e movimento",14,[
  {b:"energia",n:20},
  "Respira normalmente e senti l'energia.*3",
  "Senti la vitalità nelle mani, nei piedi, nel petto.*3"]],
 ["Il sole interiore","Visualizzazione",15,[
  "Immagina un sole al centro del petto.|10",
  "Ad ogni inspirazione il sole diventa più luminoso.*3",
  "La luce si irradia in tutto il corpo.*3",
  "Porta questa luce nella giornata.*2"]],
 ["Pianificare con calma","Organizzare la giornata",17,[
  "Stabilizzati sul respiro.*2",
  "Ripensa a cosa ti aspetta oggi.|10",
  "Scegli le tre cose più importanti.*3",
  "Immagina di affrontarle con calma.*3"]],
 ["Mattino lungo","Iniziare con presenza",20,[
  {b:"coer",n:12},
  "Senti il corpo vivo e sveglio.*3",
  "Formula un'intenzione chiara per la giornata.*3",
  "Riposa nella presenza.*2"]],
 ["Il saluto al giorno","Gratitudine mattutina",22,[
  "Ringrazia per il nuovo giorno.*2",
  "Ringrazia per il sonno che ti ha ristorato.*2",
  "Ringrazia per le possibilità di oggi.*2",
  "Senti la fiducia.*3"]],
 ["Energia e radicamento","Forza e stabilità",25,[
  "Senti i piedi ben piantati a terra.*3",
  "Immagina radici che scendono nella terra.*3",
  "Inspirando, l'energia della terra sale nel corpo.*3",
  "Riposa radicato e vitale.*3"]],
 ["Mattino di mezz'ora","Il rituale completo",30,[
  {b:"energia",n:20},
  "Respira normalmente.*2",
  "Body scan rapido del corpo.*3",
  "Intenzione del giorno.*3",
  "Silenzio e presenza.*4"]]
],

sonno:[
 ["Rilassamento per dormire","Il corpo si scioglie",12,[
  "Senti i piedi pesanti e caldi.*2",
  "Le gambe affondano nel materasso.*2",
  "La schiena si apre.*2",
  "Le spalle scivolano giù.*2",
  "Il viso si distende.*2"]],
 ["Respiro 4-7-8 lungo","Rallentare verso il sonno",14,[
  {b:"r478",n:6},
  "Respira naturalmente.*3",
  "Lascia che il respiro rallenti.*3"]],
 ["La foresta notturna","Visualizzazione per dormire",15,[
  "Immagina di camminare in un bosco di sera.|10",
  "L'aria è fresca, profuma di muschio e di terra.*2",
  "Ascolti il fruscio delle foglie.*2",
  "Trovi una radura e ti sdrai sull'erba morbida.*2",
  "Sopra di te le stelle tra i rami.*3"]],
 ["Conto alla rovescia","Contare verso il riposo",17,[
  "Conta all'indietro da trecento, lentamente.|10",
  "Un numero per ogni espirazione.*5",
  "Se perdi il conto, lascia andare i numeri.*3"]],
 ["Yoga Nidra lungo","Il sonno consapevole",22,[
  "Formula un desiderio breve e positivo. Ripetilo tre volte.|20",
  "Mano destra: pollice, indice, medio, anulare, mignolo, il palmo, il polso.*1",
  "Il braccio destro, la spalla, il fianco, la gamba destra fino al piede.*1",
  "Mano sinistra: pollice, indice, medio, anulare, mignolo, il palmo, il polso.*1",
  "Il braccio sinistro, la spalla, il fianco, la gamba sinistra fino al piede.*1",
  "La schiena, la pancia, il petto, la gola, il viso.*1",
  "Tutto il corpo insieme.*2",
  "Immagina un lago calmo sotto la luna.*3",
  "Ripeti il tuo desiderio una volta, poi lascialo andare.*1"]],
 ["Il viaggio sulla barca","Cullati dalle onde",20,[
  "Immagina di distenderti su una piccola barca.|10",
  "La barca dondola dolcemente sull'acqua.*3",
  "Il cielo è pieno di stelle.*3",
  "La barca scivola lentamente verso il sonno.*3"]],
 ["Lasciare la giornata","Chiudere la porta",25,[
  "Ripensa alla giornata, come se sfogliassi un album.*2",
  "Per ogni pagina, ringrazia e volta pagina.*3",
  "Chiudi l'album e posalo.*2",
  "Ora il buio morbido della notte.*4"]],
 ["Notte profonda","Mezz'ora verso il sonno",30,[
  "Respira lentamente.*3",
  "Il corpo è pesante.*3",
  "La mente è quieta.*3",
  "Lascia andare tutto.*4"]]
],

rilassamento:[
 ["Rilassamento autogeno","Pesantezza e calore",12,[
  "Ripeti dentro di te: il braccio destro è pesante.*1",
  "Il braccio sinistro è pesante.*1",
  "Le gambe sono pesanti.*1",
  "Le braccia sono calde.*1",
  "Le gambe sono calde.*1",
  "Il respiro è calmo e regolare.*2",
  "Sono completamente rilassato.*2"]],
 ["Il lago calmo","Visualizzazione",14,[
  "Immagina un lago calmo in montagna.|10",
  "L'acqua è limpida e ferma.*3",
  "Il lago riflette il cielo.*3",
  "La tua mente diventa calma come il lago.*3"]],
 ["Rilassamento muscolare completo","Contrai e rilascia",17,[
  "Stringi i pugni... e rilascia.*1",
  "Contrai le braccia... e rilascia.*1",
  "Solleva le spalle... e rilascia.*1",
  "Contrai il viso... e rilascia.*1",
  "Contrai la pancia... e rilascia.*1",
  "Contrai le gambe... e rilascia.*1",
  "Tutto il corpo rilassato.*3"]],
 ["Respiro rilassante","Espirazione lunga",15,[
  {b:"relax",n:20},
  "Respira normalmente.*3",
  "Senti il corpo rilassato.*3"]],
 ["Il giardino segreto","Visualizzazione lunga",20,[
  "Immagina un giardino nascosto.|10",
  "Fiori, profumi, il suono dell'acqua.*3",
  "Ti siedi su una panchina all'ombra.*3",
  "Riposa nel giardino.*4"]],
 ["Scioglimento profondo","Rilassamento a strati",22,[
  "Rilassa i muscoli della superficie.*2",
  "Rilassa i muscoli più profondi.*3",
  "Rilassa gli organi interni.*3",
  "Rilassa la mente.*3"]],
 ["Calore e luce","Rilassamento con visualizzazione",25,[
  "Immagina una luce calda sopra la testa.|10",
  "La luce scende lentamente nel corpo.*3",
  "Dove passa, i muscoli si sciolgono.*3",
  "Tutto il corpo avvolto nella luce.*4"]],
 ["Mezz'ora di riposo","Rilassamento profondo",30,[
  {b:"coer",n:12},
  "Scansione del corpo.*3",
  "Visualizza il tuo luogo sicuro.*4",
  "Riposa.*4"]]
],

ansia:[
 ["Radicarsi","Contatto con la terra",12,[
  "Senti i piedi a terra.|10",
  "Premi leggermente i piedi sul pavimento.*2",
  "Senti il peso del corpo sostenuto.*3",
  "Ripeti: sono qui, sono al sicuro.*2"]],
 ["Respiro anti-ansia","Espirazione lunga e calma",14,[
  {b:"relax",n:18},
  "Respira normalmente.*3",
  "Nota il corpo più calmo.*3"]],
 ["Il porto sicuro","Visualizzazione",15,[
  "Immagina un porto tranquillo.|10",
  "Le barche sono ferme, l'acqua è calma.*3",
  "Senti la protezione del porto.*3",
  "Riposa al sicuro.*3"]],
 ["Accogliere la preoccupazione","Lasciar essere",17,[
  "Nota la preoccupazione presente.|10",
  "Dalle un nome: preoccupazione.*2",
  "Senti dove vive nel corpo.*3",
  "Respira con essa, senza combatterla.*3",
  "Torna al respiro e al corpo.*2"]],
 ["Calma profonda","Rilassamento per l'ansia",20,[
  {b:"coer",n:12},
  "Scansione rapida del corpo.*3",
  "Sciogli ogni tensione con l'espirazione.*3",
  "Riposa nella calma.*3"]],
 ["RAIN profondo","La pratica completa",22,[
  "Riconosci ciò che senti.*2",
  "Accetta che sia presente.*2",
  "Indaga con gentilezza nel corpo.*3",
  "Nutri con autocompassione.*3",
  "Riposa nella consapevolezza.*3"]],
 ["Lasciare il futuro","Tornare al presente",25,[
  "Nota i pensieri sul futuro.*2",
  "Riconoscili: pensiero sul futuro.*3",
  "Torna al presente: il respiro, il corpo.*4",
  "Il futuro non è qui. Ora c'è solo questo.*3"]],
 ["Mezz'ora di sicurezza","Pratica completa contro lo stress",30,[
  {b:"sospiro",n:10},
  "Radicamento nei piedi.*3",
  "Luogo sicuro.*4",
  "Autocompassione.*3",
  "Riposo.*3"]]
],

guarigione:[
 ["Il respiro che cura","Respirare nella zona",12,[
  "Porta l'attenzione a una zona del corpo che ha bisogno di cura.|10",
  "Inspira verso quella zona.*3",
  "Espirando, lascia andare la tensione.*3",
  "Riposa.*2"]],
 ["Luce verde","Visualizzazione di guarigione",14,[
  "Immagina una luce verde, calda e morbida.|10",
  "La luce avvolge il corpo.*3",
  "Si concentra dove serve.*3",
  "Il corpo si rigenera.*3"]],
 ["Gentilezza verso il corpo","Ascoltare il corpo",15,[
  "Mano sul cuore.|8",
  "Chiedi al corpo: di cosa hai bisogno?*3",
  "Ascolta.*3",
  "Rispondi con gentilezza.*3"]],
 ["Guarire le ferite emotive","Il cuore che si ripara",17,[
  "Riconosci una ferita del passato.|10",
  "Accoglila con gentilezza.*3",
  "Immagina una luce calda che la avvolge.*3",
  "Ripeti: mi do il tempo di guarire.*3"]],
 ["Guarigione profonda","Venti minuti di cura",20,[
  "Rilassa il corpo dalla testa ai piedi.*3",
  "Immagina una luce curativa.*3",
  "La luce scorre in ogni cellula.*3",
  "Riposa nella guarigione.*3"]],
 ["Il medico interiore","Saggezza del corpo",22,[
  "Immagina un guaritore saggio dentro di te.|10",
  "Chiedigli cosa ti serve per stare meglio.*3",
  "Ascolta la risposta.*3",
  "Ringrazialo.*2",
  "Riposa nella fiducia.*3"]],
 ["Accettazione e guarigione","Fare pace con il corpo",25,[
  "Accogli il corpo così com'è.*3",
  "Anche le parti che soffrono.*3",
  "Con gentilezza e pazienza.*3",
  "Riposa nell'accettazione.*3"]],
 ["Mezz'ora di guarigione","Pratica completa",30,[
  {b:"coer",n:12},
  "Scansione del corpo.*3",
  "Luce curativa.*4",
  "Autocompassione.*3",
  "Riposo.*4"]]
],

lasciare:[
 ["Lasciar andare i pensieri","Le nuvole passano",12,[
  "Osserva i pensieri.*2",
  "Lasciali passare come nuvole.*4",
  "Torna al respiro.*2"]],
 ["Lasciar andare la tensione","Il corpo si libera",14,[
  "Nota le tensioni nel corpo.*2",
  "Espirando, lasciale andare.*4",
  "Riposa nel corpo libero.*3"]],
 ["Lasciar andare il passato","Voltare pagina",15,[
  "Pensa a qualcosa del passato che ti pesa.|10",
  "Riconosci il peso.*2",
  "Immagina di posarlo.*3",
  "Riposa più leggero.*3"]],
 ["Il palloncino","Visualizzazione",17,[
  "Immagina un palloncino colorato.|10",
  "Metti dentro una preoccupazione.*3",
  "Lascia andare il palloncino nel cielo.*3",
  "Guardalo allontanarsi.*3"]],
 ["Lasciar andare in profondità","Venti minuti di rilascio",20,[
  "Lascia andare la tensione del corpo.*3",
  "Lascia andare i pensieri.*3",
  "Lascia andare le emozioni.*3",
  "Lascia andare il controllo.*3"]],
 ["Il fiume della vita","Fluire",22,[
  "Immagina un fiume.|10",
  "Lasciati portare dalla corrente.*4",
  "Non resistere.*3",
  "Fluisci con la vita.*3"]],
 ["Perdono profondo","Liberarsi dal rancore",25,[
  "Pensa a una persona che ti ha ferito.|10",
  "Riconosci il dolore.*3",
  "Scegli di lasciar andare il peso.*3",
  "Augurale pace.*3",
  "Perdona anche te stesso.*3"]],
 ["Mezz'ora di libertà","Lasciar andare tutto",30,[
  "Lascia andare il corpo.*3",
  "Lascia andare la mente.*3",
  "Lascia andare il tempo.*3",
  "Lascia andare te stesso.*3",
  "Riposa nella libertà.*4"]]
],

migliorarsi:[
 ["I tuoi valori","Cosa conta davvero",12,[
  "Chiediti: cosa conta davvero per me?|10",
  "Lascia emergere le risposte.*3",
  "Scegli un valore.*2",
  "Immagina di vivere oggi secondo questo valore.*3"]],
 ["Autostima","Riconoscere il proprio valore",14,[
  "Pensa a tre tue qualità.|10",
  "Riconoscile.*3",
  "Ripeti: valgo così come sono.*3",
  "Senti la fiducia.*3"]],
 ["Superare la paura","Il coraggio",15,[
  "Pensa a una paura che ti blocca.|10",
  "Senti dove vive nel corpo.*3",
  "Respira con essa.*3",
  "Immagina di fare un passo nonostante la paura.*3"]],
 ["Il mentore interiore","Saggezza",17,[
  "Immagina un mentore saggio.|10",
  "Chiedigli un consiglio.*3",
  "Ascolta.*3",
  "Ringrazialo.*3"]],
 ["Visualizzazione del successo","Venti minuti di futuro",20,[
  "Immagina di aver raggiunto il tuo obiettivo.|10",
  "Vivi la scena nei dettagli.*3",
  "Senti le emozioni.*3",
  "Ripercorri i passi che ti hanno portato lì.*3"]],
 ["Trasformare le abitudini","Cambiamento",22,[
  "Pensa a un'abitudine che vuoi cambiare.|10",
  "Riconosci cosa la attiva.*3",
  "Immagina una risposta nuova.*3",
  "Vediti mentre la applichi.*3"]],
 ["Il tuo potenziale","Crescere",25,[
  "Immagina la versione migliore di te.*3",
  "Come vive? Come si sente?*3",
  "Cosa puoi fare oggi per avvicinarti?*3",
  "Riposa nella fiducia.*3"]],
 ["Mezz'ora di crescita","Pratica completa",30,[
  "Respiro e presenza.*3",
  "I tuoi valori.*3",
  "Il tuo obiettivo.*3",
  "Il primo passo.*3",
  "Fiducia e gratitudine.*4"]]
]
};

/* =========================================================
   INTEGRAZIONE NEL PROGRAMMA PRINCIPALE
   ========================================================= */
Object.entries(EXTRA).forEach(([pid,list])=>{
 const p=PROGRAMS.find(x=>x.id===pid); if(!p) return;
 list.forEach(s=>p.sessioni.push(build(pid,!!p.sleep,s)));
});

// Il corso ora dura 15 giorni: aggiorno il messaggio di fine settimana 1
const imp=PROGRAMS.find(p=>p.id==="impara");
if(imp){
 imp.desc="Un corso di quindici giorni per chi parte da zero: la prima settimana con sessioni brevi, la seconda con pratiche più lunghe.";
 imp.livello="Corso 15 giorni";
 const g7=imp.sessioni[6];
 if(g7) g7.steps=g7.steps.map(s=>typeof s==="string"&&s.startsWith("Hai completato il corso")?"Hai completato la prima settimana. Da domani la seconda settimana ti porterà verso pratiche più lunghe.|5":s);
 const _rh=renderHome;
 renderHome=function(){ _rh(); const el=document.querySelector("#view-home small.muted"); if(el) el.textContent=el.textContent.replace("/7","/"+imp.sessioni.length); };
}

// Aggiorna la vista attuale
try{ refresh(); }catch(e){}
})();
