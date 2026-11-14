/* =========================================================
   MeditoPedia — Crediti e licenze
   Elenco delle opere di terzi usate dall'app (mostrato in Impostazioni).
   Per ogni risorsa: fonte, autore, licenza, attribuzione, uso commerciale, distribuzione.
   ========================================================= */
"use strict";
const CREDITI = [
 {t:"Voci Sara e Nicola", d:"Frasi pre-generate con il modello Kokoro-82M di hexgrad (voci if_sara e im_nicola). Le frasi aggiunte nella versione 2 sono generate con kokoro-onnx (stesso modello). Uso commerciale consentito; attribuzione non obbligatoria ma indicata qui. Distribuite come file MP3 dentro l'app e sul sito.", l:"Apache 2.0", u:"https://huggingface.co/hexgrad/Kokoro-82M"},
 {t:"Pronuncia italiana", d:"Fonemi ricavati con misaki ed eSpeak NG, usati solo per generare gli audio (non sono inclusi nell'app).", l:"misaki: Apache 2.0 · eSpeak NG: GPL 3.0", u:"https://github.com/espeak-ng/espeak-ng"},
 {t:"Voce Riccardo (precedente)", d:"Modello Piper addestrato sul dataset M-AILABS (registrazioni LibriVox di pubblico dominio). Solo versione web.", l:"Dataset M-AILABS · Piper (MIT)", u:"https://github.com/rhasspy/piper"},
 {t:"Voce Paola (precedente)", d:"Modello Piper con dataset di Paola Persico (CC0), derivato dal modello di base «lessac» con licenza di ricerca non commerciale: solo uso personale, esclusa dall'app Android.", l:"CC0 / uso non commerciale", u:"https://huggingface.co/paolapersico1/Piper-TTS-Italian"},
 {t:"Musiche e suoni", d:"Pioggia, onde, vento, tuoni, grilli, camino, pianoforte, ambient, rumori bianco/rosa/marrone e campane sono sintetizzati in tempo reale dal codice dell'app: nessuna registrazione di terzi.", l:"Originali di MeditoPedia", u:""},
 {t:"Testi delle meditazioni", d:"Scritti appositamente per MeditoPedia, ispirati a pratiche tradizionali (mindfulness, Metta, body scan, rilassamento progressivo, Yoga Nidra, pranayama).", l:"© MeditoPedia", u:""},
 {t:"Font Fraunces e Inter", d:"Caratteri tipografici dell'app, da Google Fonts.", l:"SIL Open Font License 1.1", u:"https://fonts.google.com"},
 {t:"App Android", d:"Realizzata con Capacitor di Ionic e i plugin App e Local Notifications; servizio audio in background scritto per MeditoPedia con AndroidX Media.", l:"MIT · Apache 2.0", u:"https://capacitorjs.com"}
];
