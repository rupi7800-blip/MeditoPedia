# MeditoPedia

App di meditazione, respirazione, rilassamento, sonno e suoni rilassanti.
Funziona come sito/PWA (GitHub Pages) e come app Android (APK costruito da GitHub Actions con Capacitor).

## Contenuti
- **Catalogo v2** (`js/catalogo.js`): 39 pratiche in 5 sezioni (Meditazione, Rilassamento, Sonno, Concentrazione + Respirazione), ognuna con più durate (3–45 min). Lo stesso copione si adatta alla durata scelta allungando le pause.
- **17 tecniche di respirazione** con nome, descrizione, obiettivo, istruzioni, durata consigliata, livello e precauzioni; **editor personalizzato** (inspirazione, pause, espirazione, durata o numero di cicli, velocità, voce, segnali, musica) con calcolo automatico dei cicli e preset salvabili.
- **Programmi originali** (`js/contenuti.js`, `sessioni-extra.js`, `umore.js`): 17 programmi e oltre 180 sessioni, corso "Impara a meditare", check-in dell'umore.
- **Routine**: 5 pronte (mattino, pausa respiratoria, sera, sonno, concentrazione) e un editor per combinare respiro, meditazione, musica e silenzio.
- **Suoni** (`js/audio.js`): 25 generatori (pioggia, temporale, onde, vento, ruscello, cascata, foresta, grilli, gufo, camino, pianoforte, ambient, suoni eterei, drone, campane, rumore bianco/rosa/marrone, binaurali) e 29 atmosfere; mixer, playlist con casuale/ripetizione, preferiti, timer di autospegnimento con dissolvenza regolabile.
- **Timer silenzioso**, preferiti, cronologia, "riprendi da dove eri rimasto", promemoria, tema notte/giorno, esportazione/importazione dei dati.

## Architettura
| File | Ruolo |
|---|---|
| `index.html`, `css/app.css` | struttura e stile |
| `js/base.js` | stato (`localStorage`, compatibile con la v1), utilità |
| `js/contenuti.js`, `sessioni-extra.js`, `umore.js` | contenuti originali (testi invariati: gli audio sono legati al testo) |
| `js/catalogo.js` | nuovi contenuti, schede del respiro, routine, generatore dei copioni |
| `js/audio.js` | motore audio: bus separati voce/musica/segnali, ducking, timer di spegnimento, generatori di suoni |
| `js/voce.js` | voci integrate: pacchetti, durata esatta dagli MP3, rallentamento WSOLA, voce di riserva |
| `js/motore.js` | **motore delle sessioni a timeline sull'orologio audio** |
| `js/sfondo.js` | riproduzione in background: Media Session, elemento audio "keep-alive", ponte col plugin Android |
| `js/app.js` | interfaccia, router (`#home`, `#esplora`, `#respiro`, `#suoni`, `#tu`…), promemoria |
| `android-nativo/` | plugin e servizio Android (foreground service `mediaPlayback`, MediaSession, focus audio, cuffie) |

### Tempo e schermo spento
Ogni sessione diventa una timeline deterministica. Il tempo è `AudioContext.currentTime − base`: orologio monotono che avanza anche a schermo spento e si ferma in pausa (contesto audio sospeso), quindi non c'è deriva. Voce, segnali delle fasi, campane e abbassamenti della musica sono programmati con `start(quando)` fino a 75 s in anticipo, quindi suonano all'istante giusto anche se il browser rallenta i timer JavaScript. L'interfaccia ricalcola lo stato dalla timeline quando torna visibile. Il timer di autospegnimento è una rampa di volume programmata sull'orologio audio.

Su Android (APK) il servizio in primo piano impedisce al sistema di congelare l'app, fornisce i controlli su notifica/schermata di blocco/cuffie, mette in pausa durante le chiamate e quando si scollegano le cuffie.

## Voci
Sara e Nicola: Kokoro-82M (Apache 2.0), frasi pre-generate in `audio/<voce>/` (indice + pacchetti `.bin`). Per aggiungere frasi:
```
node strumenti/esporta_frasi.js                       # aggiorna strumenti/frasi.json
python strumenti/genera_kokoro_onnx.py CARTELLA_MODELLO sara nicola   # genera solo le frasi mancanti
```
`genera_kokoro_onnx.py` usa kokoro-onnx (senza PyTorch); `genera_kokoro.py` e il workflow `voci-kokoro.yml` restano per la rigenerazione completa.

## Test
```
python3 -m http.server 8765 &
node test/funzionali.js
```
51 verifiche: viste, durate di tutti i copioni, calcolo dei cicli, pausa/ripresa, JavaScript bloccato per 8 s, avanti/indietro, fine sessione e storico, ripresa da posizione, timer di autospegnimento, preferiti, routine, promemoria, comandi del lettore (pausa, finestra ridotta, ricomincia, stop).

## Pubblicazione
- **Web**: GitHub Pages dalla radice del ramo `main`.
- **Android**: il workflow `APK Android` costruisce l'APK a ogni push su `main` e lo pubblica nella release `android-latest`. Avviato a mano su un altro ramo, produce un APK di prova come artefatto senza toccare la release.

Le pratiche sono di benessere e non sostituiscono il parere di medici o psicoterapeuti.
