package it.meditopedia.app;

import android.content.Intent;
import android.os.Handler;
import android.os.Looper;
import android.view.View;
import android.webkit.WebView;
import androidx.core.content.ContextCompat;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * Ponte JavaScript ↔ servizio audio in primo piano.
 * avvia/aggiorna/ferma controllano SfondoAudioService; le azioni dell'utente
 * (notifica, cuffie, schermata di blocco) e le interruzioni (chiamate,
 * cuffie scollegate) tornano al JavaScript come evento "azione".
 */
@CapacitorPlugin(name = "SfondoAudio")
public class SfondoAudioPlugin extends Plugin {
    static SfondoAudioPlugin istanza;
    private boolean attivo = false;
    private final Handler main = new Handler(Looper.getMainLooper());

    @Override
    public void load() { istanza = this; }

    private Intent intent(String azione, PluginCall call) {
        Intent i = new Intent(getContext(), SfondoAudioService.class).setAction(azione);
        if (call != null) {
            i.putExtra("titolo", call.getString("titolo", "MeditoPedia"));
            i.putExtra("testo", call.getString("testo", ""));
            i.putExtra("inPausa", call.getBoolean("inPausa", false));
        }
        return i;
    }

    @PluginMethod
    public void avvia(PluginCall call) {
        try {
            ContextCompat.startForegroundService(getContext(), intent(SfondoAudioService.AVVIA, call));
            attivo = true;
            call.resolve();
        } catch (Exception e) {
            call.reject("Servizio audio non avviato: " + e.getMessage());
        }
    }

    @PluginMethod
    public void aggiorna(PluginCall call) {
        if (!attivo) { call.resolve(); return; }
        try { getContext().startService(intent(SfondoAudioService.AGGIORNA, call)); } catch (Exception ignored) { }
        call.resolve();
    }

    @PluginMethod
    public void ferma(PluginCall call) {
        attivo = false;
        try { getContext().startService(intent(SfondoAudioService.FERMA, null)); } catch (Exception ignored) { }
        call.resolve();
    }

    /** chiamato dal servizio */
    void emetti(String azione) {
        main.post(() -> {
            JSObject o = new JSObject();
            o.put("azione", azione);
            notifyListeners("azione", o, true);
        });
    }

    void servizioTerminato() { attivo = false; }

    /* Con una sessione attiva il WebView resta "visibile" anche ad app in background:
       Chromium non rallenta i timer, così fine sessione, timer di spegnimento e
       salvataggio dello storico avvengono puntuali. L'audio è comunque già
       programmato in anticipo sull'orologio audio. */
    private void tieniVivo() {
        if (!attivo) return;
        main.postDelayed(() -> {
            try {
                WebView wv = getBridge().getWebView();
                wv.onResume();
                wv.resumeTimers();
                wv.dispatchWindowVisibilityChanged(View.VISIBLE);
            } catch (Exception ignored) { }
        }, 800);
    }

    @Override
    protected void handleOnPause() { super.handleOnPause(); tieniVivo(); }

    @Override
    protected void handleOnStop() { super.handleOnStop(); tieniVivo(); }

    @Override
    protected void handleOnDestroy() {
        try { getContext().startService(intent(SfondoAudioService.FERMA, null)); } catch (Exception ignored) { }
        istanza = null;
        super.handleOnDestroy();
    }
}
