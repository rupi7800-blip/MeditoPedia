# MeditoPedia

Web app di meditazione in un singolo file (`index.html`), pronta per GitHub Pages.

## Contenuti
- **16 programmi, 54 sessioni guidate** con voce italiana (sintesi vocale del browser) e testo a schermo
  - Percorso: Impara a meditare (corso 7 giorni), Base, Intermedio, Avanzato, Trascendente
  - Pratiche: Mindfulness, Gentilezza amorevole (Metta), Concentrazione, Gratitudine, Mattino ed energia
  - Benessere: Sonno, Rilassamento, Ansia e stress, Guarigione, Lasciar andare, Migliorarsi
- **7 tecniche di respiro** con cerchio animato (quadrato, 4-7-8, coerenza cardiaca, sospiro fisiologico…)
- **Timer silenzioso** con campane di inizio, fine e a intervalli
- **Musiche e suoni** generati in tempo reale (nessun file audio): pioggia, onde, vento, ruscello, camino, uccelli, drone armonico, melodia, campane tibetane, onde binaurali alfa/theta/delta. 8 atmosfere, mixer e timer di spegnimento
- Progressi, serie di giorni, traguardi e umore dopo la pratica, salvati in locale sul dispositivo

## File
- `index.html` — l'app
- `sessioni-extra.js` — 120 sessioni lunghe (8 per programma, escluso Base: 4 da 12-17 min e 4 da 20-30 min)
- `voci.js` — 4 maestri (2 donne, 2 uomini) con le voci del dispositivo
- `voce-integrata.js` + cartella `audio/` — voci integrate Paola (donna) e Riccardo (uomo), pre-registrate: uguali per tutti, senza installare niente

I due file `.js` vanno nella stessa cartella di `index.html`, che li carica con queste righe prima di `</body>`:
```html
<script src="sessioni-extra.js"></script>
<script src="voci.js"></script>
<script src="voce-integrata.js"></script>
```

## Pubblicare su GitHub Pages
1. Crea un repository (es. `meditopedia`) e carica nella radice i file `.html` e `.js` **e la cartella `audio/`** (con le sottocartelle `paola` e `riccardo`).
2. Settings → Pages → Source: *Deploy from a branch* → branch `main`, cartella `/ (root)` → Save.
3. Dopo un minuto l'app è online su `https://<tuo-utente>.github.io/meditopedia/`.

## Note
- La voce usa le voci italiane installate sul dispositivo; si può scegliere voce e velocità in **Tu → Impostazioni**.
- Le onde binaurali richiedono le cuffie.
- Su iPhone l'audio può fermarsi a schermo bloccato: meglio tenere l'app in primo piano.

## Voci integrate
Le frasi sono state sintetizzate con [Piper](https://github.com/rhasspy/piper) (voci italiane gratuite *paola-medium* e *riccardo-x_low*).
Ogni voce ha `audio/<voce>/indice.json` e un pacchetto `.bin` per programma: l'app scarica solo quello che serve.
Se modifichi il testo di una frase, quella frase non avrà più l'audio e verrà letta con la voce del dispositivo, finché non rigeneri gli audio.
