/* =========================================================
   MeditoPedia — Catalogo esteso (v2)
   Categorie → sottocategorie → contenuti con più livelli di durata.

   Formato delle righe di un copione:
     "testo|8"     pausa fissa di 8 secondi dopo la frase
     "testo*2"     pausa elastica: riceve 2 parti del tempo libero
     "10>testo*2"  riga inclusa solo se la durata scelta è ≥ 10 minuti
     {b:"relax",s:120}  esercizio di respiro per circa 120 secondi
   La stessa sessione si adatta a 5, 10, 20… minuti allungando le pause
   e inserendo brevi richiami: le frasi (e quindi gli audio) restano le stesse.
   ========================================================= */
"use strict";

/* ---------- tecniche di respirazione: schede complete ----------
   f: fasi [etichetta, secondi, scala del cerchio 0..1, tipo]
   tipo: in | hold | out | rest  (serve all'editor personalizzato e ai suoni)
   Le chiavi esistenti (box, r478, coer, relax, sospiro, tri, energia)
   restano invariate perché usate dai programmi già presenti. */
const BR_INFO = {
 diaframmatica:{nome:"Respirazione diaframmatica", icona:"🫁", desc:"Il respiro scende verso la pancia · la base di tutte le tecniche",
  f:[["Inspira",4,1,"in"],["Espira",6,0,"out"]], livello:"Principiante", durata:5, tag:["rilassamento","base"],
  obiettivo:"Imparare a usare il diaframma, il muscolo principale della respirazione, per un respiro più ampio e calmo.",
  istruzioni:["Siediti o sdraiati comodamente.","Appoggia una mano sul petto e una sulla pancia.","Inspirando dal naso lascia che si sollevi soprattutto la mano sulla pancia.","Espirando senti la pancia che rientra dolcemente.","Il petto resta quasi fermo, le spalle morbide."],
  precauzioni:"Nessuna particolare. Se ti gira la testa, rallenta e torna al respiro naturale.",
  voce:["Appoggia una mano sul petto e una sulla pancia.|3","Inspirando, lascia che si sollevi la mano sulla pancia. Espirando, senti la pancia che rientra.|3"]},
 addominale:{nome:"Respirazione addominale", icona:"🌊", desc:"Respiro morbido nella pancia, ritmo pari",
  f:[["Inspira",4,1,"in"],["Espira",4,0,"out"]], livello:"Principiante", durata:5, tag:["rilassamento","base"],
  obiettivo:"Rilassare l'addome e rendere il respiro regolare, utile quando ci si sente contratti.",
  istruzioni:["Sdraiati o siediti con la schiena sostenuta.","Lascia la pancia libera: niente cinture strette.","Inspira dal naso gonfiando la pancia come un palloncino.","Espira dal naso o dalla bocca lasciandola sgonfiare, senza spingere."],
  precauzioni:"Nessuna particolare. Respira senza forzare la profondità.",
  voce:["Immagina che nella pancia ci sia un palloncino.|2","Inspirando si gonfia. Espirando si sgonfia, da solo.|3"]},
 lenta:{nome:"Respirazione lenta e controllata", icona:"🐢", desc:"5 secondi dentro, 7 fuori · rallentare con gentilezza",
  f:[["Inspira",5,1,"in"],["Espira",7,0,"out"]], livello:"Principiante", durata:5, tag:["rilassamento","stress"],
  obiettivo:"Ridurre la frequenza del respiro a circa cinque respiri al minuto, favorendo calma e stabilità.",
  istruzioni:["Siediti con la schiena dritta ma non rigida.","Inspira dal naso contando lentamente fino a cinque.","Espira dal naso o dalle labbra socchiuse contando fino a sette.","Mantieni un flusso continuo, senza scatti."],
  precauzioni:"Se il ritmo ti sembra troppo lento, riducilo dall'editor personalizzato.",
  voce:["Segui il cerchio senza fretta. Il respiro è lento, continuo, senza scatti.|3"]},
 box:{nome:"Respiro quadrato (Box Breathing)", icona:"⬜", desc:"4-4-4-4 · calma e lucidità, usato anche sotto pressione",
  livello:"Intermedio", durata:5, tag:["concentrazione","stress"], pause:true,
  obiettivo:"Stabilizzare attenzione ed emozioni con un ritmo regolare in quattro tempi uguali.",
  istruzioni:["Inspira dal naso per quattro secondi.","Trattieni dolcemente l'aria per quattro secondi, senza chiudere la gola con forza.","Espira per quattro secondi.","Resta a polmoni vuoti per quattro secondi, poi ricomincia."],
  precauzioni:"Contiene brevi pause a polmoni pieni e vuoti: non forzarle. In gravidanza, con problemi cardiaci o respiratori, pressione alta o se senti fame d'aria, accorcia o elimina le pause."},
 r46:{nome:"Respirazione 4-6", icona:"🍃", desc:"4 secondi dentro, 6 fuori · semplice e calmante",
  f:[["Inspira",4,1,"in"],["Espira",6,0,"out"]], livello:"Principiante", durata:5, tag:["rilassamento","stress","base"],
  obiettivo:"Allungare un po' l'espirazione rispetto all'inspirazione, un modo semplice per favorire il rilassamento.",
  istruzioni:["Inspira dal naso per quattro secondi.","Espira lentamente per sei secondi.","Non trattenere il respiro tra le fasi."],
  precauzioni:"Nessuna particolare.",
  voce:["L'espirazione è un po' più lunga dell'inspirazione. Lasciala scorrere lenta.|3"]},
 r478:{nome:"Respirazione 4-7-8", icona:"🌙", desc:"Espirazione lunga che prepara al sonno",
  livello:"Intermedio", durata:4, tag:["sonno","rilassamento"], pause:true,
  obiettivo:"Rallentare il respiro con una pausa e una lunga espirazione, utile la sera per preparare il riposo.",
  istruzioni:["Inspira silenziosamente dal naso per quattro secondi.","Trattieni il respiro per sette secondi, senza sforzo.","Espira dalla bocca per otto secondi, con un leggero soffio.","Ripeti per pochi cicli: all'inizio bastano 3 o 4 minuti."],
  precauzioni:"La pausa di 7 secondi può essere impegnativa: se senti fame d'aria o capogiro, accorciala dall'editor. Sconsigliata senza parere medico in gravidanza e con patologie cardiache o respiratorie."},
 nadi:{nome:"Respirazione a narici alternate (Nadi Shodhana)", icona:"☯️", desc:"Respiro alternato tra le narici · equilibrio e quiete",
  f:[["Inspira dalla narice sinistra",4,1,"in"],["Espira dalla destra",6,0,"out"],["Inspira dalla destra",4,1,"in"],["Espira dalla sinistra",6,0,"out"]],
  livello:"Intermedio", durata:5, tag:["concentrazione","rilassamento"],
  obiettivo:"Tecnica tradizionale dello yoga che invita a un respiro lento, regolare e attento.",
  istruzioni:["Siediti con la schiena dritta.","Con il pollice destro chiudi la narice destra e inspira dalla sinistra.","Chiudi la sinistra con l'anulare, libera la destra ed espira.","Inspira dalla destra, poi chiudila ed espira dalla sinistra: questo è un ciclo.","Senza pause trattenute: il respiro scorre continuo."],
  precauzioni:"Evitala con naso chiuso o raffreddore. Non trattenere il respiro: questa versione è senza apnee.",
  voce:["Con il pollice destro chiudi la narice destra. Con l'anulare chiuderai la sinistra.|4","Il respiro scorre continuo, senza trattenere.|3"]},
 relax:{nome:"Espirazione prolungata", icona:"🍂", desc:"4-8 · l'espirazione lunga attiva la risposta di rilassamento",
  livello:"Principiante", durata:5, tag:["rilassamento","sonno","stress"],
  obiettivo:"Raddoppiare la durata dell'espirazione per favorire una sensazione di calma.",
  istruzioni:["Inspira dal naso per quattro secondi.","Espira lentamente per otto secondi, dal naso o dalle labbra socchiuse.","Se otto secondi sono troppi, inizia con sei."],
  precauzioni:"Nessuna particolare. Non svuotare i polmoni con forza."},
 coer:{nome:"Respirazione coerente", icona:"💗", desc:"Circa 6 respiri al minuto · equilibrio e stabilità",
  livello:"Principiante", durata:5, tag:["stress","base"],
  obiettivo:"Respirare in modo regolare a circa sei respiri al minuto, un ritmo associato a calma e stabilità.",
  istruzioni:["Inspira per cinque secondi.","Espira per cinque secondi.","Mantieni il respiro morbido e silenzioso, preferibilmente dal naso.","Ideale per 5 minuti, anche più volte al giorno."],
  precauzioni:"Nessuna particolare."},
 rilassante:{nome:"Respirazione per il rilassamento", icona:"🌿", desc:"4-1-6-2 · espirazione lunga e brevi soste morbide",
  f:[["Inspira",4,1,"in"],["Sosta",1,1,"hold"],["Espira",6,0,"out"],["Pausa",2,0,"rest"]], livello:"Principiante", durata:5, tag:["rilassamento"],
  obiettivo:"Rallentare gradualmente il respiro con soste brevissime che danno una sensazione di quiete.",
  istruzioni:["Inspira dal naso per quattro secondi.","Sosta un istante, senza bloccare la gola.","Espira per sei secondi.","Riposa due secondi a polmoni vuoti, come una piccola onda che si ritira."],
  precauzioni:"Le soste sono brevissime e morbide: non devono mai diventare uno sforzo.",
  voce:["Le soste sono solo un attimo di quiete. Niente sforzo.|3"]},
 focus:{nome:"Respirazione per la concentrazione", icona:"🎯", desc:"4-2-4-2 · ritmo regolare per una mente presente",
  f:[["Inspira",4,1,"in"],["Sosta",2,1,"hold"],["Espira",4,0,"out"],["Pausa",2,0,"rest"]], livello:"Principiante", durata:4, tag:["concentrazione"], pause:true,
  obiettivo:"Raccogliere l'attenzione contando i tempi del respiro prima di un compito impegnativo.",
  istruzioni:["Inspira contando fino a quattro.","Sosta per due tempi.","Espira contando fino a quattro.","Pausa di due tempi, poi ricomincia.","Tieni lo sguardo morbido su un punto davanti a te."],
  precauzioni:"Pause brevi: se diventano faticose, eliminale dall'editor personalizzato.",
  voce:["Conta mentalmente ogni fase. Il conteggio tiene la mente qui.|3"]},
 sonno:{nome:"Respirazione prima del sonno", icona:"😴", desc:"4-8-2 · lenta, lunga, morbida",
  f:[["Inspira",4,1,"in"],["Espira",8,0,"out"],["Pausa",2,0,"rest"]], livello:"Principiante", durata:6, tag:["sonno"],
  obiettivo:"Rallentare il respiro a letto, con un'espirazione lunga e una piccola pausa che invita al riposo.",
  istruzioni:["Sdraiati nella posizione in cui ti addormenti.","Inspira dal naso per quattro secondi.","Espira lentamente per otto secondi.","Riposa due secondi prima del respiro successivo.","Puoi attivare il timer di autospegnimento."],
  precauzioni:"Nessuna particolare.",
  voce:["Sdraiati nella posizione in cui ti addormenti. Lascia che il letto ti sostenga.|4"]},
 consapevole:{nome:"Respirazione consapevole", icona:"👁️", desc:"Ritmo naturale · osservare senza cambiare",
  f:[["Inspira",4,1,"in"],["Espira",5,0,"out"]], livello:"Principiante", durata:5, tag:["base","concentrazione"],
  obiettivo:"Osservare il respiro così com'è, senza controllarlo: la base della mindfulness.",
  istruzioni:["Siediti comodo e chiudi gli occhi.","Il cerchio indica un ritmo lento ma è solo un suggerimento.","Nota dove senti il respiro: narici, petto o pancia.","Quando la mente si distrae, torna al respiro con gentilezza."],
  precauzioni:"Nessuna. Se preferisci il tuo ritmo, segui il tuo respiro invece del cerchio.",
  voce:["Il cerchio è solo un suggerimento. Se il tuo respiro vuole un altro ritmo, seguilo.|3","Nota dove senti il respiro: le narici, il petto, la pancia.|3"]},
 guidata:{nome:"Respirazione con pause guidate", icona:"⏸️", desc:"4-2-6-2 · imparare le pause, con dolcezza",
  f:[["Inspira",4,1,"in"],["Trattieni",2,1,"hold"],["Espira",6,0,"out"],["Pausa",2,0,"rest"]], livello:"Intermedio", durata:5, tag:["concentrazione","rilassamento"], pause:true,
  obiettivo:"Prendere confidenza con brevi pause tra le fasi del respiro, mantenendo il corpo rilassato.",
  istruzioni:["Inspira per quattro secondi.","Trattieni con delicatezza per due secondi: spalle e gola morbide.","Espira per sei secondi.","Riposa due secondi a polmoni vuoti."],
  precauzioni:"Contiene pause trattenute brevi. Sconsigliata senza parere medico in gravidanza e con patologie cardiache o respiratorie. Se senti fame d'aria, interrompi.",
  voce:["Durante la pausa, gola e spalle restano morbide.|3"]},
 sospiro:{nome:"Sospiro fisiologico", icona:"😮‍💨", desc:"Doppia inspirazione e lunga espirazione · scarica la tensione in fretta",
  livello:"Principiante", durata:2, tag:["stress"],
  obiettivo:"Una doppia inspirazione seguita da un'espirazione lunga: un modo rapido per allentare la tensione.",
  istruzioni:["Inspira dal naso.","Aggiungi subito un secondo, piccolo sorso d'aria.","Espira lentamente dalla bocca, a lungo.","Bastano pochi cicli, uno o due minuti."],
  precauzioni:"Usala per pochi cicli. Se ti gira la testa, torna al respiro normale."},
 tri:{nome:"Respiro triangolare", icona:"🔺", desc:"4-4-4 · semplice e stabilizzante",
  livello:"Intermedio", durata:4, tag:["concentrazione"], pause:true,
  obiettivo:"Tre fasi uguali per allenare un ritmo stabile.",
  istruzioni:["Inspira per quattro secondi.","Trattieni per quattro secondi, senza sforzo.","Espira per quattro secondi."],
  precauzioni:"Contiene una pausa trattenuta: non forzarla. Con patologie cardiache o respiratorie, o in gravidanza, eliminala."},
 energia:{nome:"Respiro energizzante", icona:"☀️", desc:"Ritmo vivace e breve · per svegliare corpo e mente",
  livello:"Intermedio", durata:2, tag:["mattino"], max:3,
  obiettivo:"Un ritmo un po' più vivace, per pochi minuti, per sentirsi più svegli. Non è iperventilazione: il respiro resta dal naso e non forzato.",
  istruzioni:["Siediti dritto.","Inspira dal naso per due secondi.","Espira dal naso per due secondi.","Al massimo 2 o 3 minuti, poi torna al respiro naturale."],
  precauzioni:"Non superare pochi minuti e non forzare la profondità. Interrompi subito in caso di capogiri o formicolii. Evitala in gravidanza, con ansia acuta, epilessia, problemi cardiaci o pressione alta."}
};
// unisce le schede alle tecniche già esistenti (stesse chiavi, stesse fasi)
(function(){
 const tipo=(lab,i,f)=>{ const l=lab.toLowerCase(); if(l.startsWith("inspira")||l.startsWith("ancora")) return "in"; if(l.startsWith("espira")) return "out";
  if(l.startsWith("tratt")||l.startsWith("sosta")) return "hold"; return "rest"; };
 Object.entries(BR_INFO).forEach(([id,info])=>{
  const base=BR[id]||{};
  const f=(info.f||base.f).map((x,i,a)=>[x[0],x[1],x[2],x[3]||tipo(x[0],i,a)]);
  BR[id]=Object.assign({},base,info,{f});
 });
 Object.entries(BR).forEach(([id,b])=>{ b.id=id; b.f=b.f.map((x,i,a)=>[x[0],x[1],x[2],x[3]||tipo(x[0],i,a)]); });
})();
const BR_ORDINE=["diaframmatica","addominale","lenta","r46","coer","relax","rilassante","consapevole","box","r478","nadi","focus","guidata","sonno","sospiro","tri","energia"];

/* frasi brevi pronunciate durante le fasi del respiro */
const BR_PAROLE=["Inspira","Espira","Trattieni","Pausa","Sosta","Inspira dal naso","Espira dalla bocca","Espira lentamente","Ancora un sorso d'aria",
 "Inspira dalla narice sinistra","Espira dalla destra","Inspira dalla destra","Espira dalla sinistra"];

const BR_INTRO="Siediti comodo e segui il cerchio: si espande quando inspiri, si contrae quando espiri.";
const BR_FINE="Ottimo lavoro. Torna al respiro naturale.";
const BR_FINE_SONNO="Lascia andare il conteggio. Il respiro continua da solo, lento e tranquillo.";

/* ---------- intro e chiusure brevi (frasi già registrate) ---------- */
const IN_BREVE=[IN[0]+"", IN[2], IN[3], IN[4]];
const OUT_BREVE=[OUT[1], OUT[3], OUT[4]];
const INS_BREVE=[INS[0], INS[2], INS[3]];
const IN_CAMMINO=[
 "Mettiti in piedi, in un luogo dove puoi fare dieci o quindici passi avanti e indietro.|5",
 "Lascia le braccia rilassate lungo i fianchi, oppure le mani unite davanti alla pancia.|4",
 "Tieni gli occhi aperti, lo sguardo morbido rivolto qualche metro davanti a te.|4",
 "Senti il peso del corpo sui piedi, e la terra che ti sostiene.|6"];
const OUT_CAMMINO=[
 "Ora fermati. Resta in piedi, immobile, per qualche respiro.|10",
 "Senti il corpo dopo il cammino: i piedi, le gambe, il respiro.|8",
 "Porta con te questa qualità di presenza nel resto della giornata.|4"];
const IN_SEDUTA_AL_LAVORO=[
 "Resta seduto dove sei. Appoggia i piedi a terra e allontana le mani dalla tastiera.|5",
 "Chiudi gli occhi, oppure abbassa lo sguardo.|4",
 "Fai un respiro profondo, inspirando dal naso…|4",
 "…ed espirando lentamente, lasciando andare l'aria.|5"];
const OUT_LAVORO=[
 "Apri gli occhi e guarda per un momento intorno a te.|4",
 "Torna alla tua attività con calma, una cosa alla volta.|4"];

/* richiami generici per le pause lunghe */
const RICH_GEN=[
 "Se la mente si è allontanata, nota dove è andata e torna con gentilezza.",
 "Ammorbidisci le spalle, la fronte e la mascella.",
 "Lascia che il respiro sia naturale, senza guidarlo.",
 "Ogni ritorno è un piccolo atto di consapevolezza.",
 "Accogli qualsiasi cosa appaia, senza trattenerla e senza respingerla."];
const RICH_SONNO=[
 "Va bene se la mente vaga. Lasciala vagare verso il sonno.",
 "Il corpo è sempre più pesante, sempre più morbido.",
 "Ogni espirazione ti porta un po' più giù, nel riposo.",
 "Lascia che il respiro rallenti da solo.",
 "Sei al sicuro. Puoi lasciarti andare."];

/* =========================================================
   CONTENUTI NUOVI
   ========================================================= */
const SEZIONI = [
 {id:"meditazione", nome:"Meditazione", icona:"lotus", col:"#9cb8a0", desc:"Pratiche guidate per ogni momento: dalla prima volta alla pratica profonda."},
 {id:"respiro", nome:"Respirazione", icona:"wind", col:"#9ec3d6", desc:"Esercizi guidati dal cerchio, con schede, precauzioni ed editor personalizzato."},
 {id:"rilassamento", nome:"Rilassamento", icona:"leaf", col:"#c9b48f", desc:"Distendere mente e corpo: tensioni, collo e spalle, visualizzazioni, grounding."},
 {id:"sonno", nome:"Sonno", icona:"moon", col:"#8e9fd0", desc:"Meditazioni per addormentarsi, respiri lenti, suoni della notte e rumori."},
 {id:"concentrazione", nome:"Concentrazione", icona:"target", col:"#d6b98a", desc:"Sessioni di focus, pause consapevoli e preparazione allo studio e al lavoro."}
];

const SOTTO = {
 meditazione:[["principianti","Per iniziare"],["consapevolezza","Mindfulness e respiro"],["corpo","Corpo"],["momenti","Momenti della giornata"],["emozioni","Emozioni e stress"],["profondo","Profondità e recupero"]],
 rilassamento:[["mente","Mente"],["corpo","Corpo e tensioni"],["visualizzazione","Visualizzazioni"],["grounding","Grounding"]],
 sonno:[["meditazioni","Meditazioni per addormentarsi"]],
 concentrazione:[["focus","Sessioni di concentrazione"],["pause","Pause consapevoli"],["preparazione","Prima di studio e lavoro"]]
};

/* x(): definizione compatta di un contenuto
   id, titolo, sottotitolo, sezione, sottosezione, livello, durate, opzioni, copione */
const X=(id,t,d,sez,sub,livello,durate,o,core,extra)=>Object.assign({id,t,d,sez,sub,livello,durate,core},o,extra);

const CATALOGO = [
/* ------------------------- MEDITAZIONE ------------------------- */
X("m-primi-passi","Primi passi","Meditazione guidata per principianti","meditazione","principianti","Principiante",[5,10,15],{intro:"std",pool:RICH_GEN},[
 "Benvenuto. Questa è una meditazione per chi inizia: non c'è niente da sapere e niente da sbagliare.|4",
 "Meditare significa allenare l'attenzione, un po' come si allena un muscolo: con pazienza, un poco alla volta.|4",
 "Porta l'attenzione al respiro, nel punto in cui lo senti meglio.|6",
 "Osserva l'aria che entra… e l'aria che esce. Non devi cambiare niente.*2",
 "Presto la mente comincerà a pensare ad altro. È normale: le menti fanno questo.|3",
 "Quando te ne accorgi, nota semplicemente: sto pensando. E torna al respiro.*3",
 "10>Prova a contare i respiri: uno inspirando, due espirando, fino a dieci. Poi ricomincia da uno.*3",
 "Ogni volta che torni, stai meditando. Non serve una mente vuota: serve solo tornare.*2"]),
X("m-qui-e-ora","Qui e ora","Mindfulness dei sensi e del momento presente","meditazione","consapevolezza","Principiante",[10,15,20],{intro:"std",pool:RICH_GEN},[
 "Mindfulness significa portare attenzione al momento presente, con apertura e curiosità.|4",
 "Inizia dal corpo: senti il peso, i punti di appoggio, la temperatura dell'aria sulla pelle.*2",
 "Ora ascolta. I suoni vicini, quelli lontani, e il silenzio tra un suono e l'altro.*2",
 "Nota il respiro, senza guidarlo. Il corpo respira da solo.*2",
 "Allarga l'attenzione: corpo, suoni e respiro, tutto insieme, come un unico paesaggio.*3",
 "Se arrivano pensieri, lasciali far parte del paesaggio. Vengono e vanno.*2",
 "15>Chiediti, con gentilezza: cosa c'è adesso? Non prima, non dopo. Adesso.*2"]),
X("m-respiro","Consapevolezza del respiro","Il respiro come ancora","meditazione","consapevolezza","Principiante",[5,10,20],{intro:"std",pool:RICH_GEN},[
 "In questa pratica il respiro sarà la tua ancora.|3",
 "Senti l'aria fresca che entra dalle narici, e l'aria tiepida che esce.*1",
 "Senti il petto che si allarga, e la pancia che si muove come un'onda.*1",
 "Scegli il punto in cui il respiro è più chiaro, e resta lì.*3",
 "Nota l'inizio dell'inspirazione, il suo percorso, e la sua fine.*2",
 "Nota la piccola pausa naturale prima che arrivi il respiro successivo.*2",
 "10>Quando la mente vaga, riportala qui, ogni volta, con la stessa gentilezza.*2"]),
X("m-body-scan","Body scan","Scansione corporea dalla testa ai piedi","meditazione","corpo","Principiante",[10,20,30],{intro:"std",pool:RICH_GEN},[
 "In questa pratica attraversiamo il corpo con l'attenzione, una parte alla volta, senza cambiare nulla.|4",
 "Inizia dalla sommità della testa. Nota qualsiasi sensazione: calore, formicolio, pressione, o nessuna sensazione.*1",
 "Scendi alla fronte, agli occhi, alle guance. Lascia che il viso si ammorbidisca.*1",
 "La mascella, la bocca, la lingua. Lascia che i denti si separino appena.*1",
 "Il collo e la gola. Le spalle: lasciale scendere, lontano dalle orecchie.*1",
 "Le braccia, i gomiti, gli avambracci, fino alle mani e alla punta delle dita.*2",
 "Il petto, che si muove con il respiro. Il cuore che batte, anche se non lo senti.*1",
 "La parte alta della schiena, poi la parte centrale, poi la zona lombare.*2",
 "La pancia, morbida e libera. Il bacino, i fianchi.*1",
 "Le cosce, le ginocchia, i polpacci.*2",
 "Le caviglie, i talloni, la pianta dei piedi, le dita.*1",
 "Ora senti il corpo intero, dalla testa ai piedi, come un unico campo di sensazioni.*2"]),
X("m-muscolare","Rilassamento muscolare progressivo","Contrarre e rilasciare, gruppo per gruppo","meditazione","corpo","Principiante",[10,15],{intro:"breve",pool:["Nota la differenza tra tensione e rilassamento.","Lascia che il rilassamento si diffonda da solo."]},[
 "In questa tecnica contrai un gruppo di muscoli per qualche secondo, poi lo rilasci. Contrai senza mai provare dolore.|5",
 "Inizia dalle mani: stringi i pugni… tieni…|6",
 "…e rilascia. Senti le mani che si aprono e si scaldano.*1",
 "Ora piega i gomiti e contrai le braccia… tieni…|6",
 "…e lascia andare. Le braccia sono pesanti e morbide.*1",
 "Solleva le spalle verso le orecchie… tieni…|6",
 "…e lasciale cadere. Senti lo spazio che si crea attorno al collo.*1",
 "Strizza il viso: occhi chiusi forte, fronte corrugata… tieni…|5",
 "…e rilascia. Il viso si distende, liscio.*1",
 "Contrai la pancia, come per prepararti a una piccola spinta… tieni…|5",
 "…e lascia andare. Il respiro torna libero.*1",
 "Spingi i talloni verso il basso e contrai le gambe… tieni…|6",
 "…e rilascia. Le gambe sono pesanti, abbandonate.*1",
 "Ora resta immobile e senti tutto il corpo rilassato, dalla testa ai piedi.*3"],{nota:"Contrai sempre in modo moderato. Salta i gruppi muscolari doloranti o infortunati."}),
X("m-camminata","Meditazione camminata","Presenza a ogni passo","meditazione","corpo","Principiante",[10,15],{intro:"cammino",pool:["Senti il contatto del piede con il terreno.","Quando la mente va avanti, torna al passo che stai facendo.","Non c'è nessun posto dove arrivare."]},[
 "Inizia a camminare molto lentamente, più lentamente del solito.|5",
 "Nota il piede che si solleva… si sposta in avanti… e si appoggia.*2",
 "Senti il peso che passa da una gamba all'altra.*2",
 "Puoi accompagnare ogni fase con una parola silenziosa: alzo, muovo, appoggio.*2",
 "Quando arrivi in fondo, fermati un istante, girati con calma, e riparti.*2",
 "Ora allarga l'attenzione: il corpo che cammina, l'aria, i suoni intorno a te.*2"],{nota:"Pratica in un luogo sicuro, senza ostacoli. Non ascoltarla mentre guidi o attraversi la strada."}),
X("m-mattino","Buongiorno consapevole","Meditazione mattutina","meditazione","momenti","Principiante",[5,10],{intro:"breve",pool:["Senti l'energia della giornata che inizia.","Respira luce, espira pesantezza."]},[
 "Buongiorno. Prima di entrare nella giornata, prenditi qualche minuto per te.|4",
 "Senti il corpo appena sveglio: forse ancora pesante, forse già pronto.*1",
 "Fai tre respiri un po' più ampi, aprendo il petto.|12",
 "Nota come ti senti stamattina, senza giudicarlo.*2",
 "Ora scegli un'intenzione semplice per oggi. Per esempio: oggi vado con calma. Oppure: oggi ascolto.*2",
 "Immagina un momento della giornata in cui ricorderai questa intenzione.*2"]),
X("m-sera","Chiudere la giornata","Meditazione serale","meditazione","momenti","Principiante",[10,15],{intro:"std",pool:RICH_GEN},[
 "La giornata sta finendo. Questo è il momento di chiuderla, con gentilezza.|4",
 "Ripercorri la giornata come un film, senza fermarti sulle scene.*2",
 "Nota un momento che è andato bene, anche piccolo. Lascia che ti scaldi.*2",
 "Nota un momento difficile. Riconoscilo, e lascialo andare: per oggi basta così.*2",
 "Ringrazia il corpo per tutto quello che ha fatto oggi.*1",
 "Ora lascia la giornata alle spalle, come si chiude una porta piano.*2"]),
X("m-stress","Sciogliere lo stress","Meditazione per la gestione dello stress","meditazione","emozioni","Principiante",[5,10,15],{intro:"breve",pool:["Allunga un po' l'espirazione.","Ammorbidisci le spalle, la fronte e la mascella."]},[
 "Lo stress è il segnale che stai portando molto. Facciamo un po' di spazio.|4",
 {b:"relax",s:60},
 "Nota dove lo stress si fa sentire nel corpo: spalle, stomaco, mascella, respiro corto.*1",
 "Respira verso quella zona, e ad ogni espirazione lasciala un poco più morbida.*2",
 "Ora immagina di posare le cose da fare su uno scaffale. Restano lì, al sicuro. Le riprenderai dopo.*2",
 "10>Chiediti: qual è la sola cosa che conta adesso? Lascia che le altre aspettino.*2",
 "Per questi momenti non devi risolvere niente. Solo respirare.*2"]),
X("m-ansia","Un porto sicuro","Meditazione per l'ansia","meditazione","emozioni","Principiante",[10,15],{intro:"breve",pool:["Sei al sicuro in questo momento.","Senti i piedi, il terreno sotto di te.","Allunga un po' l'espirazione."]},[
 "Se senti ansia, va bene. Non devi mandarla via: impariamo a starle accanto.|4",
 {b:"r46",s:60},
 "Senti i piedi a terra e il peso del corpo sostenuto. In questo momento, qui, sei al sicuro.*2",
 "Nota le sensazioni dell'ansia: il cuore, il respiro, lo stomaco. Sono sensazioni, e passano.*2",
 "Immagina un porto tranquillo. Le onde sono fuori, oltre la diga. Qui l'acqua è calma.*2",
 "Ripeti dentro di te: posso stare con questo. Un respiro alla volta.*2",
 "I pensieri ansiosi sono previsioni, non fatti. Guardali passare come barche al largo.*2"],{nota:"Se l'ansia è intensa o frequente, parlane con il tuo medico o con uno psicologo."}),
X("m-attenzione","Attenzione chiara","Meditazione per la concentrazione","meditazione","consapevolezza","Intermedio",[5,10,15],{intro:"breve",pool:["Torna all'oggetto, con fermezza gentile.","Ogni ritorno allena l'attenzione."]},[
 "Questa pratica allena la capacità di restare su un solo punto.|3",
 "Porta l'attenzione alla punta del naso, dove l'aria entra ed esce.|5",
 "Resta lì, con precisione. Senti ogni minima sensazione.*3",
 "Se arriva una distrazione, nota che è arrivata, e torna al punto. Senza commenti.*3",
 "10>Ora conta le espirazioni da uno a cinque, e ricomincia. Se perdi il conto, riparti da uno.*2",
 "Senti la stabilità che cresce: è calma e vigile insieme.*1"]),
X("m-emozioni","Consapevolezza emotiva","Riconoscere e accogliere ciò che senti","meditazione","emozioni","Intermedio",[10,15],{intro:"std",pool:RICH_GEN},[
 "In questa pratica impariamo a riconoscere le emozioni senza farci trascinare.|4",
 "Chiediti: come mi sento adesso? Lascia che la risposta arrivi da sola.*1",
 "Prova a darle un nome semplice: calma, tristezza, irritazione, gioia, stanchezza.*1",
 "Cerca dove la senti nel corpo. Che forma ha? È calda o fredda, pesante o leggera?*2",
 "Respira con questa sensazione, facendole spazio, come si apre una finestra.*2",
 "Ricorda: tu provi un'emozione, ma non sei l'emozione. Sei lo spazio che la accoglie.*2",
 "Nota come anche questa sensazione cambia, momento dopo momento.*2"]),
X("m-gratitudine","Cuore grato","Meditazione della gratitudine","meditazione","emozioni","Principiante",[5,10],{intro:"breve",pool:["Lascia che la gratitudine si senta nel corpo, nel petto.","Anche le cose piccole contano."]},[
 "La gratitudine allena la mente a notare ciò che c'è di buono.|3",
 "Pensa a una cosa semplice per cui sei grato oggi: un caffè, un sorriso, la luce del mattino.*2",
 "Pensa a una persona che ti ha aiutato, anche in modo piccolo. Ringraziala nel cuore.*2",
 "Pensa al tuo corpo, che ti porta ogni giorno. Ringrazialo.*1",
 "10>Pensa a una difficoltà che ti ha insegnato qualcosa. Riesci a trovare anche lì un dono?*2",
 "Senti il calore della gratitudine nel petto, e lascialo espandere.*2"]),
X("m-profondo","Rilassamento profondo","Lasciarsi andare, livello dopo livello","meditazione","profondo","Principiante",[15,20,30],{intro:"std",pool:["Ad ogni espirazione, un po' più morbido.","Lascia che il corpo sia pesante e sostenuto.","Non c'è niente da fare. Solo riposare."]},[
 "Questa è una pratica di rilassamento profondo. Puoi farla seduto o sdraiato.|4",
 "Immagina di scendere una scala lenta, dieci gradini. Ad ogni gradino, sei più rilassato.|5",
 "Dieci… nove… otto… le spalle si sciolgono.|10",
 "Sette… sei… cinque… il respiro rallenta da solo.|10",
 "Quattro… tre… due… uno. Sei in un luogo di quiete profonda.|10",
 "Senti il corpo pesante, caldo, completamente sostenuto.*2",
 "La mente è come un lago al tramonto: la superficie diventa liscia.*3",
 "Resta qui. Non c'è niente da fare, niente da ottenere.*4",
 "Ora risali lentamente: uno, due, tre… porti con te questa calma.|8"]),
X("m-verso-sonno","Verso il sonno","Meditazione prima di dormire","meditazione","profondo","Principiante",[10,20,30],{intro:"sonno",sonno:true,pool:RICH_SONNO},[
 "La giornata è finita. Adesso non c'è più niente da fare.|6",
 "Senti il peso del corpo che affonda nel materasso.*1",
 "Lascia andare la fronte… gli occhi… la mascella.*1",
 "Lascia andare le spalle, le braccia, le mani.*1",
 "Lascia andare la schiena, la pancia, le gambe, i piedi.*2",
 "Immagina un cielo notturno, pieno di stelle. Ogni stella è un pensiero che si allontana.*3",
 "Il respiro diventa lento e profondo, come quello di chi dorme.*3"]),
X("m-recupero","Dopo una giornata impegnativa","Meditazione per il recupero","meditazione","profondo","Principiante",[10,15],{intro:"std",pool:["Ad ogni espirazione, un po' più morbido.","Non devi fare niente adesso."]},[
 "Oggi hai dato molto. Adesso è il momento di recuperare.|4",
 {b:"relax",s:60},
 "Senti la stanchezza nel corpo, senza combatterla. Ha qualcosa da dirti: hai bisogno di riposo.*2",
 "Immagina una pioggia tiepida e leggera che scende dalla testa ai piedi, e porta via la fatica.*2",
 "Lascia andare le conversazioni, gli impegni, le richieste di oggi. Per ora, sono finite.*2",
 "Resta in questa quiete, ricaricandoti come una batteria che si riempie piano.*3"]),
X("m-cinque-minuti","Cinque minuti di calma","Meditazione breve per qualsiasi momento","meditazione","principianti","Principiante",[3,5],{intro:"none",pool:RICH_GEN},[
 "Ovunque tu sia, fermati per qualche istante.|3",
 "Fai un respiro profondo, e lascia uscire l'aria lentamente.|6",
 "Senti i piedi a terra, il corpo seduto, le mani.*1",
 "Segui il respiro per qualche momento, senza cambiarlo.*3",
 "Prima di ripartire, fai un ultimo respiro lento. Ecco: sei qui.|6"]),

/* ------------------------- RILASSAMENTO ------------------------- */
X("r-mente","Mente leggera","Rilassamento mentale","rilassamento","mente","Principiante",[5,10],{intro:"breve",pool:["Lascia che i pensieri rallentino, da soli."]},[
 "Quando la mente corre, non serve fermarla. Basta smettere di inseguirla.|4",
 "Immagina che i pensieri siano foglie su un fiume. Ognuno arriva, galleggia, e se ne va.*3",
 "Tu sei seduto sulla riva. Guardi, senza saltare nell'acqua.*2",
 "Ora il fiume rallenta. Le foglie sono sempre meno.*2",
 "Riposa nella quiete della riva.*2"]),
X("r-tensioni","Sciogliere le tensioni","Rilassamento muscolare breve","rilassamento","corpo","Principiante",[5,10],{intro:"breve",pool:["Ad ogni espirazione, un po' più morbido."]},[
 "Facciamo un giro veloce del corpo per sciogliere le tensioni.|3",
 "Stringi forte i pugni… tieni…|5",
 "…e rilascia.|6",
 "Solleva le spalle verso le orecchie… tieni…|5",
 "…e lasciale cadere.|6",
 "Spingi i piedi a terra e contrai le gambe… tieni…|5",
 "…e rilascia tutto.|6",
 "Ora nota il corpo più morbido. Dove c'è ancora tensione, espira verso quel punto.*3"]),
X("r-collo","Distensione cervicale","Collo libero, con movimenti lenti","rilassamento","corpo","Principiante",[5,10],{intro:"none",pool:["Muoviti lentamente, solo dove non c'è dolore."],nota:"Movimenti lenti e senza dolore. Con problemi cervicali, traumi recenti o vertigini, chiedi prima al medico o al fisioterapista."},[
 "Siediti con la schiena dritta e le spalle rilassate. Muoviti sempre lentamente, senza mai provare dolore.|5",
 "Inspira. Espirando, porta piano l'orecchio destro verso la spalla destra. Senza sforzo.|8",
 "Resta qualche respiro, sentendo il lato sinistro del collo che si allunga.|12",
 "Inspirando, torna al centro.|4",
 "Espirando, porta l'orecchio sinistro verso la spalla sinistra.|8",
 "Resta e respira, lasciando che il lato destro del collo si distenda.|12",
 "Torna al centro. Ora abbassa piano il mento verso il petto.|8",
 "Senti la nuca che si allunga. Respira.|12",
 "Risali lentamente, vertebra dopo vertebra, fino a portare la testa in equilibrio.|6",
 "Immagina il collo lungo e morbido, la testa leggera, come sostenuta da un filo.*3"]),
X("r-spalle","Spalle libere","Rilassamento delle spalle","rilassamento","corpo","Principiante",[5],{intro:"none",pool:["Lascia scendere le spalle, lontano dalle orecchie."],nota:"Muoviti senza dolore. Se hai problemi alle spalle, riduci l'ampiezza dei movimenti."},[
 "Le spalle trattengono molte tensioni della giornata. Liberiamole.|4",
 "Inspirando, solleva le spalle verso le orecchie.|4",
 "Espirando, lasciale cadere di colpo, con un sospiro.|6",
 "Ancora una volta. Solleva…|4",
 "…e lascia cadere.|6",
 "Ora fai dei cerchi lenti con le spalle, all'indietro, cinque volte.|20",
 "E in avanti, altre cinque volte.|20",
 "Fermati. Senti le spalle più basse, più larghe, più calde.*2",
 "Respira come se l'aria potesse arrivare fino alle spalle e scioglierle.*2"]),
X("r-sport","Dopo l'attività fisica","Recupero e defaticamento","rilassamento","corpo","Principiante",[5,10],{intro:"none",pool:["Lascia che il cuore rallenti, da solo.","Senti il corpo che si rigenera."]},[
 "Hai appena fatto attività fisica. Ora aiutiamo il corpo a tornare alla calma.|4",
 "Sdraiati o siediti comodo. Lascia che il respiro si calmi da solo, senza forzarlo.|8",
 {b:"r46",s:60},
 "Senti il cuore che rallenta, battito dopo battito.*2",
 "Porta l'attenzione ai muscoli che hai usato di più. Immagina che il respiro li raggiunga e li ammorbidisca.*2",
 "Senti il calore nei muscoli: è il segno del lavoro fatto. Ringrazia il tuo corpo.*2",
 "10>Resta in questa quiete, lasciando che ogni parte del corpo si rigeneri.*3"]),
X("r-giornata","Scaricare la giornata","Recupero dopo una giornata stressante","rilassamento","mente","Principiante",[10,15],{intro:"std",pool:["Lascia andare, e lascia andare ancora."]},[
 "La giornata è stata pesante. Adesso possiamo scaricarla.|4",
 {b:"sospiro",s:40},
 "Immagina di avere uno zaino sulle spalle, pieno di tutto quello che è successo oggi.*1",
 "Uno alla volta, togli gli oggetti dallo zaino e posali a terra. Un impegno, una preoccupazione, una conversazione.*3",
 "Ora lo zaino è leggero. Posalo accanto a te.*1",
 "Senti le spalle libere, la schiena leggera, il respiro più ampio.*2",
 "Resta qui, senza peso.*3"]),
X("r-lago","Il lago di montagna","Visualizzazione guidata","rilassamento","visualizzazione","Principiante",[10,15],{intro:"std",pool:["Respira l'aria fresca della montagna.","Lascia che l'immagine sia viva, senza sforzo."]},[
 "Immagina di camminare su un sentiero di montagna, in una mattina limpida.|5",
 "Senti l'aria fresca, il profumo dei pini, il suono dei passi sul sentiero.*2",
 "Il sentiero si apre e appare un lago. L'acqua è immobile, e riflette le montagne come uno specchio.*2",
 "Siediti sulla riva. Senti il sole tiepido sul viso.*2",
 "Il lago è la tua mente. A volte il vento la increspa, poi torna calma.*2",
 "Sotto la superficie, in profondità, l'acqua è sempre tranquilla. Anche dentro di te.*3"]),
X("r-spiaggia","La spiaggia al tramonto","Visualizzazione guidata","rilassamento","visualizzazione","Principiante",[10,15],{intro:"std",pool:["Ascolta il ritmo delle onde.","Lascia che il calore ti avvolga."]},[
 "Immagina di essere su una spiaggia, al tramonto.|5",
 "La sabbia è tiepida sotto di te. Il cielo si colora di arancio e di rosa.*2",
 "Ascolta le onde: arrivano… e si ritirano. Arrivano… e si ritirano.*2",
 "Lascia che il respiro segua le onde. Inspira quando l'onda arriva, espira quando si ritira.*3",
 "Ogni onda che si ritira porta via un po' di tensione.*2",
 "Il sole scende sull'orizzonte. Tutto è quieto, e tu sei in pace.*3"]),
X("r-giardino","Il giardino segreto","Visualizzazione guidata","rilassamento","visualizzazione","Principiante",[10],{intro:"std",pool:["Respira i profumi del giardino."]},[
 "Immagina un cancello antico, coperto di edera. Lo apri, e entri in un giardino segreto.|5",
 "È un luogo solo tuo. Nessuno può entrare senza il tuo permesso.*1",
 "Guarda i colori dei fiori, le foglie, la luce che filtra tra i rami.*2",
 "Senti il profumo dell'erba, il canto lontano di un uccello, il suono di una piccola fontana.*2",
 "Trova un posto dove sederti. Qui sei al sicuro, e puoi riposare.*3",
 "Ricorda: puoi tornare in questo giardino ogni volta che vuoi.|6"]),
X("r-grounding","Grounding 5-4-3-2-1","Tornare al presente con i sensi","rilassamento","grounding","Principiante",[5],{intro:"none",pool:["Senti i piedi, il terreno sotto di te."]},[
 "Questa tecnica ti riporta al presente attraverso i sensi. Puoi tenere gli occhi aperti.|4",
 "Guarda intorno a te e nomina cinque cose che vedi.|20",
 "Ora quattro cose che puoi toccare: i vestiti, la sedia, il pavimento sotto i piedi.|18",
 "Tre suoni che senti, vicini o lontani.|15",
 "Due profumi o odori. Se non ne senti, immagina il tuo profumo preferito.|12",
 "Un sapore. Oppure, una cosa per cui sei grato in questo momento.|10",
 "Fai un respiro lento. Senti di essere qui, adesso.*2"]),
X("r-radici","Radici","Grounding con il corpo","rilassamento","grounding","Principiante",[5,10],{intro:"breve",pool:["Senti il contatto con il terreno.","Sei stabile, sostenuto."]},[
 "Porta l'attenzione ai piedi e al contatto con il pavimento.|5",
 "Immagina che dalla pianta dei piedi crescano delle radici, che scendono nella terra.*2",
 "Ad ogni espirazione le radici vanno più in profondità.*2",
 "Senti la stabilità della terra che sale nelle gambe, nel bacino, nella schiena.*2",
 "Come un albero, puoi muovere i rami al vento, ma restare saldo.*2"]),
X("r-galleggiare","Il corpo che galleggia","Rilassamento profondo","rilassamento","corpo","Principiante",[15,20],{intro:"std",pool:["Lascia che l'acqua ti sostenga.","Ad ogni espirazione, un po' più morbido."]},[
 "Immagina di galleggiare in un'acqua calma e tiepida, sostenuto senza alcuno sforzo.|5",
 "L'acqua sostiene la testa… le spalle… la schiena.*1",
 "Le braccia si allargano, leggere. Le gambe si abbandonano.*1",
 "Il respiro ti fa salire e scendere appena, come una piccola onda.*3",
 "Non devi fare niente per restare a galla. Puoi lasciarti andare completamente.*3",
 "Il corpo diventa sempre più leggero, sempre più morbido.*3"]),

/* ------------------------- SONNO ------------------------- */
X("s-stelle","Il cielo stellato","Meditazione per addormentarsi","sonno","meditazioni","Principiante",[15,30],{intro:"sonno",sonno:true,pool:RICH_SONNO},[
 "Immagina di essere sdraiato su un prato, in una notte d'estate.|5",
 "L'erba è morbida, l'aria tiepida. Sopra di te, un cielo pieno di stelle.*2",
 "Scegli una stella e guardala. Ogni volta che espiri, diventa un po' più lontana.*3",
 "I pensieri della giornata si allontanano con lei, sempre più piccoli.*3",
 "Senti il prato che ti sostiene. Non devi tenere niente, puoi lasciarti andare.*3",
 "Il cielo è immenso e tranquillo, e tu ne fai parte.*3"]),
X("s-conto","Contare all'indietro","Il respiro e i numeri verso il sonno","sonno","meditazioni","Principiante",[10,20],{intro:"sonno",sonno:true,pool:RICH_SONNO},[
 "Ora conteremo all'indietro, molto lentamente. Ogni numero, un'espirazione.|5",
 "Se perdi il conto, va benissimo. Ricomincia da dove vuoi, o lascia andare i numeri.|5",
 "Venti… diciannove… diciotto… diciassette…*2",
 "Sedici… quindici… quattordici… tredici…*2",
 "Dodici… undici… dieci… nove…*2",
 "Otto… sette… sei… cinque…*2",
 "Quattro… tre… due… uno…*2",
 "Ora lascia andare i numeri. Resta solo il respiro, lento, profondo.*3"]),
X("s-casa","La casa sicura","Visualizzazione per il sonno","sonno","meditazioni","Principiante",[15,30],{intro:"sonno",sonno:true,pool:RICH_SONNO},[
 "Immagina una casa accogliente, in mezzo al bosco, in una sera d'inverno.|5",
 "Fuori nevica piano. Dentro, un camino acceso scalda la stanza.*2",
 "C'è un letto morbido, con coperte pesanti e calde. Ti ci infili lentamente.*2",
 "Senti il crepitio del fuoco, e il silenzio della neve fuori dalla finestra.*3",
 "Qui niente può disturbarti. La porta è chiusa, la casa ti protegge.*3",
 "Le palpebre sono pesanti. Il corpo affonda nel calore.*3"]),
X("s-yoga-nidra","Rotazione della coscienza","Ispirato allo Yoga Nidra","sonno","meditazioni","Intermedio",[20,30],{intro:"sonno",sonno:true,pool:RICH_SONNO},[
 "Ora sposterò l'attenzione velocemente da un punto all'altro del corpo. Segui la mia voce, senza sforzo.|5",
 "Il pollice della mano destra… l'indice… il medio… l'anulare… il mignolo.|8",
 "Il palmo della mano destra… il polso… il gomito… la spalla.|8",
 "Il pollice della mano sinistra… l'indice… il medio… l'anulare… il mignolo.|8",
 "Il palmo della mano sinistra… il polso… il gomito… la spalla.|8",
 "L'alluce destro… le dita del piede destro… il tallone… il ginocchio… l'anca.|8",
 "L'alluce sinistro… le dita del piede sinistro… il tallone… il ginocchio… l'anca.|8",
 "La schiena intera… la pancia… il petto… la gola… il viso.|8",
 "Tutto il corpo insieme. Tutto il corpo, pesante e quieto.*3",
 "Resta come testimone del corpo che riposa. Non devi fare più niente.*4"]),

/* ------------------------- CONCENTRAZIONE ------------------------- */
X("c-sessione","Sessione di concentrazione","Avvio guidato, lavoro in silenzio, campana finale","concentrazione","focus","Principiante",[15,25,45],{intro:"none",focus:true,pool:[]},[
 "Prima di iniziare, prepara lo spazio: allontana il telefono e tieni davanti a te solo ciò che serve.|5",
 "Scegli un solo compito per questa sessione. Uno solo.|6",
 {b:"focus",s:48},
 "Ora inizia. Ti avviserò con una campana quando la sessione sarà finita.|3",
 {silenzio:"*1",testo:"Concentrazione · lavora su un solo compito"},
 "La sessione è finita. Fai un respiro lungo e alzati, muoviti un po'. Ti sei meritato una pausa.|5"]),
X("c-pausa","Pausa consapevole","Tre minuti per staccare e ripartire","concentrazione","pause","Principiante",[3,5],{intro:"lavoro",outro:"lavoro",pool:["Senti il contatto del corpo con la sedia."]},[
 "Concediti una vera pausa. Per qualche minuto, non devi fare niente.|4",
 "Nota come stai: il corpo, il respiro, l'umore. Senza giudicare.*1",
 "Ora porta tutta l'attenzione al respiro.*2",
 "Infine allarga l'attenzione a tutto il corpo, e alla stanza intorno a te.*1"]),
X("c-studio","Respirare prima dello studio","Preparare mente e respiro","concentrazione","preparazione","Principiante",[3,5],{intro:"lavoro",outro:"lavoro",pool:["Torna al respiro con fermezza gentile."]},[
 "Prima di studiare, prepariamo la mente con il respiro.|3",
 {b:"coer",s:90},
 "Ora pensa a cosa vuoi studiare. Fissa un obiettivo piccolo e concreto per la prossima ora.*1",
 "Immagina di lavorare con calma e attenzione, una pagina alla volta.*1"]),
X("c-lavoro","Preparazione mentale al lavoro","Iniziare con chiarezza","concentrazione","preparazione","Principiante",[5,10],{intro:"lavoro",outro:"lavoro",pool:["Una cosa alla volta."]},[
 "Prima di iniziare a lavorare, raccogli le energie.|3",
 {b:"box",s:64},
 "Pensa alla giornata di lavoro che ti aspetta. Quali sono le tre cose più importanti?*2",
 "Scegli la prima. Immagina di iniziarla, con calma e attenzione.*1",
 "Se arriveranno interruzioni, potrai tornare a questo respiro e ripartire.*1",
 "10>Fissa un'intenzione per il modo in cui lavorerai oggi. Per esempio: con pazienza, con chiarezza, con gentilezza.*2"]),
X("c-breve","Meditazione breve per la mente","Un reset dell'attenzione","concentrazione","pause","Principiante",[3,5],{intro:"none",pool:["Torna al respiro con fermezza gentile."]},[
 "Chiudi gli occhi o abbassa lo sguardo. Fermiamoci un momento.|4",
 "Conta cinque respiri lenti, contando le espirazioni.|30",
 "Ora ascolta il suono più lontano che riesci a sentire.*1",
 "Torna al respiro, nel punto del naso dove l'aria entra ed esce.*2",
 "Apri gli occhi. La mente è più chiara.|4"]),
X("c-recupero","Recuperare l'attenzione","Quando la mente è dispersa","concentrazione","pause","Principiante",[5],{intro:"lavoro",outro:"lavoro",pool:["Una cosa alla volta."]},[
 "La mente è dispersa? Succede a tutti. Raccogliamola con gentilezza.|4",
 "Nota quanti pensieri ci sono adesso, senza seguirne nessuno.*1",
 {b:"r46",s:50},
 "Ora guarda un oggetto davanti a te per qualche istante, con attenzione piena: forma, colore, dettagli.*1",
 "Chiediti: qual è il prossimo, piccolo passo? Solo quello.*1"])
];

/* ---------- routine predefinite (programmi combinati) ----------
   blocco: {k:"respiro",id,min} | {k:"med",id,min} | {k:"musica",min} | {k:"silenzio",min} */
const ROUTINE_BASE = [
 {id:"rt-mattino", nome:"Routine mattutina", icona:"☀️", min:10, desc:"Respiro diaframmatico, meditazione del mattino e un momento di musica",
  blocchi:[{k:"respiro",id:"diaframmatica",min:3},{k:"med",id:"m-mattino",min:5},{k:"musica",min:2}], bg:"bosco"},
 {id:"rt-pausa", nome:"Pausa respiratoria", icona:"🍃", min:5, desc:"Cinque minuti di respirazione coerente", blocchi:[{k:"respiro",id:"coer",min:5}], bg:"none"},
 {id:"rt-sera", nome:"Rilassamento serale", icona:"🌆", min:20, desc:"Espirazione prolungata, chiusura della giornata e musica",
  blocchi:[{k:"respiro",id:"relax",min:5},{k:"med",id:"m-sera",min:10},{k:"musica",min:5}], bg:"camino"},
 {id:"rt-sonno", nome:"Preparazione al sonno", icona:"🌙", min:30, desc:"Respiro prima del sonno, meditazione e suoni per addormentarsi",
  blocchi:[{k:"respiro",id:"sonno",min:5},{k:"med",id:"m-verso-sonno",min:20},{k:"musica",min:5}], bg:"sonno", sonno:true},
 {id:"rt-focus", nome:"Sessione di concentrazione", icona:"🎯", min:15, desc:"Respiro per la concentrazione, meditazione breve e lavoro in silenzio",
  blocchi:[{k:"respiro",id:"focus",min:3},{k:"med",id:"m-attenzione",min:5},{k:"silenzio",min:7}], bg:"focus"}
];

/* =========================================================
   COSTRUZIONE DEI COPIONI
   ========================================================= */
const _sp = t => t.split(/\s+/).length*.45/.88;
const _brCyc = (id,vel=1) => BR[id].f.reduce((a,f)=>a+f[1],0)*vel;
function _parse(c,min){
 if(typeof c==="object") return {o:c};
 let m=c.match(/^(\d+)>(.*)$/s); if(m){ if(min<+m[1]) return null; c=m[2]; }
 m=c.match(/^(.*)\*(\d+(?:\.\d+)?)$/s); if(m) return {t:m[1],w:+m[2]};
 m=c.match(/^(.*)\|(\d+(?:\.\d+)?)$/s); if(m) return {t:m[1],p:+m[2]};
 return {t:c,p:6};
}
const _fixed = lines => lines.map(l=>_parse(l,99)).reduce((a,it)=>a+(it.o?0:_sp(it.t)+(it.p||0)),0);
const INTRI = {std:[IN,OUT], breve:[IN_BREVE,OUT_BREVE], sonno:[INS,OUTS], cammino:[IN_CAMMINO,OUT_CAMMINO], lavoro:[IN_SEDUTA_AL_LAVORO,OUT_LAVORO], none:[[],[]]};
function hashStr(s){let h=0;for(const c of s)h=(h*31+c.charCodeAt(0))>>>0;return h;}

/* restituisce i passi della sessione per la durata scelta (minuti) */
function copione(item,min){
 let [intro,outro]=INTRI[item.intro||"std"];
 if(item.intro==="std"&&min<=5){ intro=IN_BREVE; outro=OUT_BREVE; }
 if(item.intro==="sonno"&&min<=10){ intro=INS_BREVE; }
 if(item.outro) outro=INTRI[item.outro][1];
 if(item.focus) outro=[];
 const items=item.core.map(l=>_parse(l,min)).filter(Boolean);
 const pool=item.pool||[];
 let fixed=_fixed(intro)+_fixed(outro);
 items.forEach(it=>{ if(it.o){ if(it.o.b) fixed+=it.o.s+4; } else fixed+=_sp(it.t)+(it.p||0); });
 const W=items.reduce((a,it)=>a+(it.w||0),0);
 const silW=items.reduce((a,it)=>a+(it.o&&it.o.silenzio?1:0),0);
 const free=Math.max(0,min*60-fixed);
 const steps=[...intro]; let k=hashStr(item.id)%Math.max(1,pool.length);
 items.forEach(it=>{
  if(it.o){
   if(it.o.b){ const n=Math.max(2,Math.round(it.o.s/_brCyc(it.o.b))); steps.push({b:it.o.b,n}); }
   else if(it.o.silenzio){ steps.push({t:it.o.testo,p:Math.max(60,free),silent:true}); }
   return;
  }
  if(it.w==null||silW){ steps.push(it.t+"|"+(it.w!=null?6:it.p)); return; }
  let p=Math.max(5,free*it.w/(W||1)); const n=pool.length?Math.floor(p/(item.sonno?100:80)):0;
  if(n>0){ const r=[]; for(let j=0;j<n;j++) r.push(pool[k++%pool.length]); p=Math.max(8,p-r.reduce((a,x)=>a+_sp(x),0)); const part=Math.round(p/(n+1));
   steps.push(it.t+"|"+part); r.forEach(x=>steps.push(x+"|"+part)); }
  else steps.push(it.t+"|"+Math.round(p));
 });
 steps.push(...outro);
 return steps;
}

/* sessione di respiro: intro + scheda vocale + cicli + chiusura */
function copioneRespiro(id,min,opz={}){
 const b=BR[id], vel=opz.vel||1, f=opz.f||b.f;
 const cyc=f.reduce((a,x)=>a+x[1],0)*vel;
 const n=opz.cicli||Math.max(2,Math.round(min*60/cyc));
 const steps=[BR_INTRO+"|2"];
 if(!opz.custom&&b.voce&&opz.istruzioni!==false) b.voce.forEach(v=>steps.push(v));
 steps.push({b:id,n,f,vel});
 steps.push((b.tag&&b.tag.includes("sonno")?BR_FINE_SONNO:BR_FINE)+"|6");
 return steps;
}

/* tutte le frasi pronunciabili del nuovo catalogo (per generare gli audio) */
function frasiCatalogo(){
 const out=new Map(); const add=(t,b)=>{ t=String(t).trim(); if(t&&!out.has(t)) out.set(t,b); };
 const fromLine=(l,b)=>{ if(typeof l!=="string") return; const it=_parse(l,99); if(it&&it.t) add(it.t,b); };
 [IN_CAMMINO,OUT_CAMMINO,IN_SEDUTA_AL_LAVORO,OUT_LAVORO].forEach(a=>a.forEach(l=>fromLine(l,"v2-comune")));
 RICH_GEN.concat(RICH_SONNO).forEach(t=>add(t,"v2-comune"));
 CATALOGO.forEach(it=>{ const b="v2-"+it.sez; it.core.forEach(l=>fromLine(l,b)); (it.pool||[]).forEach(t=>add(t,b)); });
 BR_PAROLE.forEach(t=>add(t,"v2-respiro"));
 [BR_INTRO,BR_FINE,BR_FINE_SONNO].forEach(t=>add(t,"v2-respiro"));
 Object.values(BR).forEach(b=>(b.voce||[]).forEach(l=>fromLine(l,"v2-respiro")));
 (window.FRASI_APP||[]).forEach(t=>add(t,"v2-comune"));
 return [...out].map(([t,b])=>({t,b}));
}
window.CATALOGO=CATALOGO;
