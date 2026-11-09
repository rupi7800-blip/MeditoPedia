/* =========================================================
   MeditoPedia — Crediti e licenze
   Sezione in Tu → Impostazioni, con l'elenco delle opere di terzi usate.
   ========================================================= */
(function(){
"use strict";
const CREDITI = [
 {t:"Voci Sara e Nicola", d:"Generate con Kokoro-82M di hexgrad.", l:"Apache 2.0", u:"https://huggingface.co/hexgrad/Kokoro-82M"},
 {t:"Voce Riccardo", d:"Modello Piper addestrato sul dataset M-AILABS (registrazioni LibriVox di pubblico dominio).", l:"Dataset M-AILABS · Piper (MIT)", u:"https://github.com/rhasspy/piper"},
 {t:"Voce Paola", d:"Modello Piper con dataset di Paola Persico (CC0). Solo per uso personale: derivato dal modello di base «lessac», con licenza di ricerca non commerciale.", l:"CC0 / uso non commerciale", u:"https://huggingface.co/paolapersico1/Piper-TTS-Italian"},
 {t:"Sintesi vocale italiana", d:"Pronuncia ricavata con eSpeak NG.", l:"GPL 3.0 (solo per generare gli audio)", u:"https://github.com/espeak-ng/espeak-ng"},
 {t:"Font Fraunces e Inter", d:"Caratteri tipografici dell'app, da Google Fonts.", l:"SIL Open Font License 1.1", u:"https://fonts.google.com"},
 {t:"App Android", d:"Realizzata con Capacitor di Ionic.", l:"MIT", u:"https://capacitorjs.com"},
 {t:"Musiche e suoni", d:"Pioggia, onde, vento, campane, drone e melodie sono generati in tempo reale dal codice dell'app.", l:"Originali di MeditoPedia", u:""},
 {t:"Testi delle meditazioni", d:"Scritti appositamente per MeditoPedia, ispirati a pratiche tradizionali (mindfulness, Metta, Yoga Nidra, respirazione).", l:"© MeditoPedia", u:""}
];
const _rt=renderTu;
renderTu=function(){
 _rt();
 const v=document.getElementById("view-tu"); if(!v) return;
 const note=[...v.querySelectorAll("p.muted.small")].pop();
 const html=`<h2>Crediti e licenze</h2>
  <div class="card">${CREDITI.map(c=>`<div class="hist" style="display:block">
   <b>${c.t}</b> <span class="small" style="color:var(--accent)">· ${c.l}</span>
   <p class="muted small" style="margin-top:2px">${c.d}${c.u?` <a href="${c.u}" target="_blank" rel="noopener" style="color:var(--muted)">↗</a>`:""}</p></div>`).join("")}
  <p class="muted small" style="margin-top:12px">Le meditazioni non sostituiscono il parere di medici o psicoterapeuti.</p></div>`;
 if(note) note.insertAdjacentHTML("beforebegin",html); else v.insertAdjacentHTML("beforeend",html);
};
try{ if(document.getElementById("view-tu").classList.contains("on")) renderTu(); }catch(e){}
})();
