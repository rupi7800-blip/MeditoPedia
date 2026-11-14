"""Genera (in modo incrementale) gli audio mancanti delle voci Kokoro di MeditoPedia.

Usa kokoro-onnx: stesso modello Kokoro-82M (Apache 2.0) e stesse voci di genera_kokoro.py,
ma senza PyTorch, quindi gira anche su un normale computer.

Preparazione (una volta):
  pip install kokoro-onnx misaki phonemizer-fork espeakng-loader soundfile numpy        (serve anche ffmpeg)
  scarica kokoro-v1.0.onnx e voices-v1.0.bin da
  https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0

Uso:  python strumenti/genera_kokoro_onnx.py CARTELLA_MODELLO [sara] [nicola]
Legge strumenti/frasi.json e aggiunge ai pacchetti audio/<voce>/*.bin solo le frasi
che non hanno ancora un audio; aggiorna audio/<voce>/indice.json.
"""
import json, os, sys, time
import numpy as np
from kokoro_onnx import Kokoro
sys.path.insert(0, os.path.dirname(__file__))
from genera_kokoro import VOCI, SR, VELOCITA, PAUSA_FRASE, PAUSA_PUNTINI, frasi_di, in_mp3

# stessi fonemi della pipeline originale (misaki + eSpeak NG), così la pronuncia coincide
import espeakng_loader
from phonemizer.backend.espeak.wrapper import EspeakWrapper
EspeakWrapper.set_library(espeakng_loader.get_library_path())
EspeakWrapper.set_data_path(espeakng_loader.get_data_path())
from misaki import espeak
G2P = espeak.EspeakG2P(language="it")

# a parità di parametri kokoro-onnx parla un po' più in fretta della pipeline PyTorch:
# velocità tarate confrontando le durate con le frasi già registrate
VELOCITA_ONNX = {"if_sara": 0.77, "im_nicola": 0.80}

def sintetizza(k, voce, testo):
    blocchi = [np.zeros(int(SR * 0.08), dtype=np.float32)]
    for frase in frasi_di(testo):
        ps = G2P(frase)
        ps = ps[0] if isinstance(ps, tuple) else ps
        a, sr = k.create(ps, voice=voce, speed=VELOCITA_ONNX.get(voce, VELOCITA), is_phonemes=True)
        assert sr == SR
        blocchi.append(np.asarray(a, dtype=np.float32))
        pausa = PAUSA_PUNTINI if frase.rstrip().endswith(("…", "...")) else PAUSA_FRASE
        blocchi.append(np.zeros(int(SR * pausa), dtype=np.float32))
    blocchi[-1] = np.zeros(int(SR * 0.15), dtype=np.float32)
    return np.concatenate(blocchi)

def main():
    cartella = sys.argv[1]
    voci = sys.argv[2:] or list(VOCI)
    k = Kokoro(os.path.join(cartella, "kokoro-v1.0.onnx"), os.path.join(cartella, "voices-v1.0.bin"))
    frasi = json.load(open("strumenti/frasi.json"))
    for nome in voci:
        out = f"audio/{nome}"; os.makedirs(out, exist_ok=True)
        ixf = f"{out}/indice.json"
        indice = json.load(open(ixf)) if os.path.exists(ixf) else {}
        mancanti = [f for f in frasi if f["h"] not in indice]
        print(f"{nome}: {len(mancanti)} frasi da generare", flush=True)
        pacchetti, t0 = {}, time.time()
        for i, f in enumerate(mancanti):
            dati = in_mp3(sintetizza(k, VOCI[nome], f["t"]))
            if f["b"] not in pacchetti:
                p = f"{out}/{f['b']}.bin"
                pacchetti[f["b"]] = bytearray(open(p, "rb").read()) if os.path.exists(p) else bytearray()
            buf = pacchetti[f["b"]]
            indice[f["h"]] = [f["b"], len(buf), len(dati)]
            buf += dati
            if i % 25 == 0:
                print(f"{nome}: {i}/{len(mancanti)} ({time.time()-t0:.0f}s)", flush=True)
        for b, buf in pacchetti.items():
            open(f"{out}/{b}.bin", "wb").write(buf)
        json.dump(indice, open(ixf, "w"), separators=(",", ":"))
        print(f"{nome}: fatto ({time.time()-t0:.0f}s)", flush=True)

if __name__ == "__main__":
    main()
