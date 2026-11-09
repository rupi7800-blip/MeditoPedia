"""Genera gli audio di MeditoPedia con Kokoro (Apache 2.0).

Uso:  python strumenti/genera_kokoro.py [voce ...]
Voci: sara (if_sara, donna), nicola (im_nicola, uomo)
Legge strumenti/frasi.json e scrive audio/<voce>/indice.json + un pacchetto .bin per programma.
"""
import json, os, re, subprocess, sys, time
import numpy as np
from kokoro import KPipeline

VOCI = {"sara": "if_sara", "nicola": "im_nicola"}
SR = 24000
VELOCITA = 0.88          # ritmo lento, da insegnante di meditazione
PAUSA_FRASE = 0.6        # secondi di silenzio tra le frasi
PAUSA_PUNTINI = 0.95

def prep(t):
    t = t.replace("RAIN", "Rèin").replace("STOP", "Stop").replace("So Ham", "So, Ham").replace("Metta", "Mètta")
    t = re.sub(r"(\d)-(?=\d)", r"\1, ", t)
    return t

def frasi_di(t):
    # divide in frasi tenendo i puntini come pausa lunga
    parti = re.split(r"(?<=[.!?…:;])\s+", prep(t).strip())
    return [p for p in parti if re.search(r"\w", p)]

def sintetizza(pipe, voce, testo):
    blocchi = [np.zeros(int(SR * 0.08), dtype=np.float32)]
    for frase in frasi_di(testo):
        audio = []
        for _, _, a in pipe(frase, voice=voce, speed=VELOCITA, split_pattern=None):
            if a is not None:
                audio.append(a.numpy() if hasattr(a, "numpy") else np.asarray(a))
        if not audio:
            continue
        blocchi.append(np.concatenate(audio).astype(np.float32))
        pausa = PAUSA_PUNTINI if frase.rstrip().endswith(("…", "...")) else PAUSA_FRASE
        blocchi.append(np.zeros(int(SR * pausa), dtype=np.float32))
    blocchi[-1] = np.zeros(int(SR * 0.15), dtype=np.float32)
    return np.concatenate(blocchi)

def in_mp3(a):
    pcm = (np.clip(a, -1, 1) * 32767).astype("<i2").tobytes()
    p = subprocess.run(["ffmpeg", "-loglevel", "error", "-f", "s16le", "-ar", str(SR), "-ac", "1", "-i", "-",
                        "-af", "highpass=f=60,loudnorm=I=-20:TP=-3:LRA=11,afade=t=in:d=0.03",
                        "-ar", str(SR), "-c:a", "libmp3lame", "-b:a", "80k", "-f", "mp3", "-"],
                       input=pcm, capture_output=True)
    if p.returncode:
        raise RuntimeError(p.stderr.decode())
    return p.stdout

def main():
    frasi = json.load(open("strumenti/frasi.json"))
    voci = sys.argv[1:] or list(VOCI)
    pipe = KPipeline(lang_code="i", repo_id="hexgrad/Kokoro-82M")
    for nome in voci:
        out = f"audio/{nome}"; os.makedirs(out, exist_ok=True)
        pacchetti, indice, t0 = {}, {}, time.time()
        for i, f in enumerate(frasi):
            dati = in_mp3(sintetizza(pipe, VOCI[nome], f["t"]))
            buf = pacchetti.setdefault(f["b"], bytearray())
            indice[f["h"]] = [f["b"], len(buf), len(dati)]
            buf += dati
            if i % 50 == 0:
                print(f"{nome}: {i}/{len(frasi)}  ({time.time()-t0:.0f}s)", flush=True)
        for b, buf in pacchetti.items():
            open(f"{out}/{b}.bin", "wb").write(buf)
        json.dump(indice, open(f"{out}/indice.json", "w"), separators=(",", ":"))
        print(f"{nome}: fatto, {len(indice)} frasi, {sum(len(x) for x in pacchetti.values())/1e6:.1f} MB", flush=True)

if __name__ == "__main__":
    main()
