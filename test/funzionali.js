/* Test funzionali di MeditoPedia (Playwright + Chromium).
   Uso:  python3 -m http.server 8765 &   poi   node test/funzionali.js
   Verifica: viste, timeline, pausa/ripresa, avanti/indietro, eventi audio
   programmati in anticipo (anche con JavaScript bloccato), fine sessione,
   storico, ripresa da posizione salvata, timer di autospegnimento. */
const { chromium } = require('playwright');
const URL = process.env.URL || 'http://localhost:8765/index.html';
let ok = 0, ko = 0;
const verifica = (cond, nome, info='') => { if (cond) { ok++; console.log('  ✓', nome); } else { ko++; console.log('  ✗', nome, info); } };
const attendi = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errori = []; p.on('pageerror', e => errori.push(e.message));
  await p.addInitScript(() => {
    localStorage.setItem('meditopedia_state', JSON.stringify({ checkinAuto: false, voice: true }));
    // registra gli istanti a cui vengono programmati i suoni
    window.__start = [];
    for (const C of [AudioBufferSourceNode, OscillatorNode]) {
      const o = C.prototype.start;
      C.prototype.start = function (when, ...r) { window.__start.push({ quando: when || 0, chiamato: this.context.currentTime, tipo: C.name }); return o.call(this, when, ...r); };
    }
  });
  await p.goto(URL); await p.waitForTimeout(1200);

  console.log('Viste');
  for (const h of ['home','esplora','sezione/meditazione','sezione/rilassamento','sezione/sonno','sezione/concentrazione','contenuto/m-body-scan','programma/impara','respiro','tecnica/nadi','timer','suoni','preferiti','cronologia','routine','routine/nuova','promemoria','tu','impostazioni']) {
    await p.evaluate(h => location.hash = h, h); await p.waitForTimeout(120);
    const n = await p.evaluate(() => document.querySelector('#vista').innerText.length);
    verifica(n > 100, 'vista ' + h, n);
  }

  console.log('Copioni e timeline');
  const tl = await p.evaluate(() => {
    const err = [];
    for (const it of CATALOGO) for (const m of it.durate) {
      const t = Motore.costruisci(Motore.parse(copione(it, m)), {});
      if (!(t.durata > 30) || t.ev.some(e => !isFinite(e.t))) err.push(it.id + ':' + m);
      if (Math.abs(t.durata / 60 - m) > m * .35 + 1) err.push(it.id + ':' + m + ' dur ' + (t.durata / 60).toFixed(1));
    }
    for (const id of BR_ORDINE) { const t = Motore.costruisci(Motore.parse(copioneRespiro(id, 5)), {}); if (!(t.durata > 60)) err.push('br ' + id); }
    for (const r of ROUTINE_BASE) { const t = Motore.costruisci(Motore.parse(passiRef({ k: 'rt', id: r.id })), {}); if (Math.abs(t.durata / 60 - r.min) > r.min * .35) err.push('rt ' + r.id + ' ' + (t.durata / 60).toFixed(1)); }
    for (const pr of PROGRAMS) pr.sessioni.forEach((s, i) => { const t = Motore.costruisci(Motore.parse(s.steps), {}); if (!(t.durata > 30)) err.push(pr.id + i); });
    return err;
  });
  verifica(tl.length === 0, 'tutti i contenuti generano una timeline valida e della durata attesa', tl.join(', '));

  console.log('Respiro personalizzato 4-0-6-0, 1 minuto');
  await p.evaluate(() => { ST.brCustom = Object.assign({}, ST.brCustom, { in: 4, h1: 0, out: 6, h2: 0, min: 1, modo: 'durata', vel: 1, cue: 'off', toni: true, bg: 'none' }); location.hash = 'respiro'; });
  await p.waitForTimeout(300);
  await p.click('[data-act="brcustom"]');
  await p.waitForFunction(() => Motore.S.on && !Motore.S.preparando, null, { timeout: 30000 });
  const info = await p.evaluate(() => { const f = Motore.S.ev.filter(e => e.k === 'fase'); return { n: f.length, cicli: f[0].cicli, d: f.slice(0, 4).map(x => x.d) }; });
  verifica(info.cicli === 6 && info.n === 12, 'cicli calcolati dalla durata (60 s / 10 s = 6)', JSON.stringify(info));
  verifica(JSON.stringify(info.d) === '[4,6,4,6]', 'fasi 4 s e 6 s', JSON.stringify(info.d));
  await p.waitForFunction(() => Motore.istante().fase, null, { timeout: 30000 });
  const coer = await p.evaluate(() => { const r = Motore.istante(), f = r.fase; return { ok: r.pos >= f.t && r.pos < f.t + f.d && Math.abs(f.rest - (f.t + f.d - r.pos)) < .01, r }; });
  verifica(coer.ok, 'fase attuale coerente con l\'orologio della sessione');
  const futuri = await p.evaluate(() => { const now = A.now(); return window.__start.filter(s => s.tipo === 'OscillatorNode' && s.quando > now + 20).length; });
  verifica(futuri >= 4, 'segnali delle fasi già programmati con oltre 20 s di anticipo', futuri);

  console.log('Pausa e ripresa');
  const p1 = await p.evaluate(async () => { await Motore.pausa(); return Motore.pos(); });
  await attendi(2500);
  const p2 = await p.evaluate(() => Motore.pos());
  verifica(Math.abs(p2 - p1) < .05, 'in pausa il tempo della sessione è fermo', `${p1} → ${p2}`);
  verifica(await p.evaluate(() => A.ctx.state === 'suspended' && document.querySelector('#player').classList.contains('is-paused')), 'audio sospeso e interfaccia in pausa');
  await p.evaluate(() => Motore.riprendi()); await attendi(1500);
  const p3 = await p.evaluate(() => Motore.pos());
  verifica(p3 > p2 + 1 && p3 < p2 + 2.2, 'dopo la ripresa il tempo riparte da dove era', `${p2} → ${p3}`);

  console.log('JavaScript bloccato per 8 s (come a schermo spento)');
  const prima = await p.evaluate(() => ({ pos: Motore.pos(), ctx: A.now() }));
  await p.evaluate(() => { const t = Date.now(); while (Date.now() - t < 8000) {} });
  const dopo = await p.evaluate(() => ({ pos: Motore.pos(), ctx: A.now(), suonati: window.__start.filter(s => s.tipo === 'OscillatorNode' && s.quando > 0).length }));
  verifica(dopo.pos - prima.pos > 7.5, 'l\'orologio della sessione avanza anche con JS bloccato', `${(dopo.pos - prima.pos).toFixed(2)} s`);
  const ist = await p.evaluate(() => Motore.istante());
  verifica(!ist.fase || (ist.pos >= ist.fase.t && ist.pos < ist.fase.t + ist.fase.d), 'al "risveglio" lo stato si riallinea dalla timeline');

  console.log('Avanti / indietro');
  const s0 = await p.evaluate(() => Motore.pos());
  await p.evaluate(() => Motore.avanti()); await attendi(300);
  const s1 = await p.evaluate(() => ({ pos: Motore.pos(), passi: Motore.S.passi.map(x => x.t) }));
  verifica(s1.passi.some(t => Math.abs(t - s1.pos) < .6) && s1.pos > s0, 'avanti porta all\'inizio del passo successivo', JSON.stringify(s1));
  await p.evaluate(() => Motore.indietro()); await attendi(300);
  const s2 = await p.evaluate(() => Motore.pos());
  verifica(s2 < s1.pos, 'indietro torna al passo precedente', `${s1.pos} → ${s2}`);

  console.log('Fine sessione e storico');
  await p.evaluate(() => Motore.vaiA(Motore.S.durata - 2));
  await p.waitForSelector('#plDone.on', { timeout: 15000 });
  const st = await p.evaluate(() => ({ h: ST.hist[0], last: ST.last }));
  verifica(st.h && st.h.full && st.h.ref && st.h.ref.id === 'custom', 'sessione completata registrata nello storico', JSON.stringify(st.h));
  await p.click('[data-act="pldone"]');
  verifica(await p.evaluate(() => !Motore.S.on && !document.querySelector('#player').classList.contains('on')), 'lettore chiuso');

  console.log('Riprendi da posizione salvata');
  await p.evaluate(() => avvia({ k: 'cat', id: 'm-respiro', min: 5 }, 60));
  await p.waitForFunction(() => Motore.S.on && !Motore.S.preparando, null, { timeout: 30000 });
  const rp = await p.evaluate(() => Motore.pos());
  verifica(rp > 59 && rp < 62, 'la sessione riparte dalla posizione richiesta', rp);
  const voce = await p.evaluate(() => Motore.S.ev.filter(e => e.k === 'voce').length);
  verifica(voce > 5, 'frasi della voce presenti nella timeline (audio disponibile)', voce);
  await p.evaluate(() => { Motore.stop(true); chiudiPlayer(); });

  console.log('Musica e timer di autospegnimento');
  await p.evaluate(() => { location.hash = 'suoni'; });
  await p.waitForTimeout(300);
  await p.click('[data-act="preset"][data-id="temporale"]'); await attendi(800);
  verifica(await p.evaluate(() => mixActive() && A.playing() && Sfondo.attivo), 'atmosfera in riproduzione e modalità background attiva');
  await p.evaluate(() => { ST.fade = 2; A.sleep(4, 2); });
  await attendi(2600);
  const g = await p.evaluate(() => A.sonnoG.gain.value);
  verifica(g < .9, 'dissolvenza in corso prima della scadenza', g);
  await attendi(2500);
  verifica(await p.evaluate(() => !mixActive() && !A.playing() && !Sfondo.attivo && !A.sleepEnd), 'alla scadenza musica fermata e servizio chiuso');

  console.log('Preferiti, routine, promemoria');
  await p.evaluate(() => { toggleFav({ k: 'cat', id: 'm-body-scan' }); location.hash = 'preferiti'; });
  await p.waitForTimeout(200);
  verifica(await p.evaluate(() => document.querySelector('#vista').innerText.includes('Body scan')), 'preferito mostrato');
  await p.evaluate(() => { location.hash = 'routine/nuova'; }); await p.waitForTimeout(200);
  await p.click('[data-act="rtsalva"]'); await p.waitForTimeout(200);
  verifica(await p.evaluate(() => ST.routine.length === 1), 'routine personalizzata salvata');
  await p.evaluate(() => { location.hash = 'promemoria'; }); await p.waitForTimeout(200);
  await p.click('[data-act="pradd"]'); await p.waitForTimeout(200);
  verifica(await p.evaluate(() => ST.promemoria.length === 1 && ST.promemoria[0].giorni.length === 7), 'promemoria creato (ogni giorno)');

  console.log('Lettore: pausa, finestra ridotta, ricomincia, stop');
  await p.evaluate(() => { location.hash = 'contenuto/m-respiro'; }); await p.waitForTimeout(300);
  await p.click('.phead .btn.lg');
  await p.waitForFunction(() => Motore.S.on && !Motore.S.preparando, null, { timeout: 30000 });
  await attendi(1500);
  verifica(await p.evaluate(() => mixActive()), 'musica di sottofondo attiva durante la sessione');
  await p.click('#plPlay'); await attendi(600);
  const pa = await p.evaluate(() => ({ s: Motore.S.paused, ui: document.querySelector('#player').classList.contains('is-paused'), pos: Motore.pos() }));
  await attendi(1200);
  verifica(pa.s && pa.ui && Math.abs(await p.evaluate(() => Motore.pos()) - pa.pos) < .05, 'il tasto pausa del lettore mette in pausa');
  await p.click('#plPlay'); await attendi(600);
  verifica(await p.evaluate(() => !Motore.S.paused), 'il tasto pausa riprende la sessione');
  await p.click('[data-act="plmin"]'); await attendi(200);
  verifica(await p.evaluate(() => document.querySelector('#player').classList.contains('minimale')), 'il tasto modalità minimale funziona');
  await p.click('[data-act="plmin"]');
  await p.click('[data-act="plclose"]'); await attendi(700);
  const mini = await p.evaluate(() => ({ on: Motore.S.on, pl: document.querySelector('#player').classList.contains('on'), mini: document.querySelector('#mini').classList.contains('on'), txt: document.querySelector('#miniTxt').textContent }));
  verifica(mini.on && !mini.pl && mini.mini && mini.txt.includes('Consapevolezza del respiro'), 'riducendo, la sessione continua nella finestra in basso', JSON.stringify(mini));
  await p.click('#miniPlay'); await attendi(500);
  verifica(await p.evaluate(() => Motore.S.paused), 'pausa dalla finestra ridotta');
  await p.click('#miniPlay'); await attendi(500);
  await p.click('#miniTxt'); await attendi(400);
  verifica(await p.evaluate(() => document.querySelector('#player').classList.contains('on') && !Motore.S.paused), 'toccando la finestra si apre il lettore principale');
  await attendi(1500);
  await p.click('[data-act="plrestart"]'); await attendi(400);
  verifica(await p.evaluate(() => Motore.pos() < 1.5 && Motore.S.on), 'il tasto ricomincia riparte dall\'inizio');
  await p.click('.pl-ctrl [data-act="plstop"]'); await attendi(600);
  verifica(await p.evaluate(() => !Motore.S.on && !mixActive() && !document.querySelector('#mini').classList.contains('on')), 'lo stop ferma sessione e musica di sottofondo');

  verifica(errori.length === 0, 'nessun errore JavaScript', errori.join(' | '));
  console.log(`\n${ok} superati, ${ko} falliti`);
  await b.close(); process.exit(ko ? 1 : 0);
})();
