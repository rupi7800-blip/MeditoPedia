package it.meditopedia.app;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.ServiceInfo;
import android.media.AudioAttributes;
import android.media.AudioFocusRequest;
import android.media.AudioManager;
import android.os.Build;
import android.os.IBinder;
import android.os.PowerManager;
import android.support.v4.media.MediaMetadataCompat;
import android.support.v4.media.session.MediaSessionCompat;
import android.support.v4.media.session.PlaybackStateCompat;
import androidx.core.app.NotificationCompat;
import androidx.core.app.ServiceCompat;
import androidx.core.content.ContextCompat;

/**
 * Servizio in primo piano di tipo mediaPlayback.
 * - impedisce ad Android di congelare o chiudere l'app a schermo spento;
 * - MediaSession: controlli su notifica, schermata di blocco, cuffie e Bluetooth;
 * - focus audio: pausa durante le chiamate e quando un'altra app prende l'audio;
 * - ACTION_AUDIO_BECOMING_NOISY: pausa quando si scollegano le cuffie;
 * - wake lock parziale (con scadenza) per tutta la durata della sessione.
 * Il suono è prodotto dal WebView; questo servizio ne garantisce la continuità.
 */
public class SfondoAudioService extends Service {
    static final String AVVIA = "it.meditopedia.AVVIA", AGGIORNA = "it.meditopedia.AGGIORNA", FERMA = "it.meditopedia.FERMA";
    static final String CMD = "it.meditopedia.CMD";
    private static final String CANALE = "meditopedia_riproduzione";
    private static final int ID = 7301;

    private MediaSessionCompat sessione;
    private AudioManager am;
    private AudioFocusRequest richiesta;
    private PowerManager.WakeLock wl;
    private boolean inPausa = false, perditaTemporanea = false, inPrimoPiano = false, ricevitore = false;
    private String titolo = "MeditoPedia", testo = "";

    private final BroadcastReceiver cuffie = new BroadcastReceiver() {
        @Override public void onReceive(Context c, Intent i) {
            if (AudioManager.ACTION_AUDIO_BECOMING_NOISY.equals(i.getAction())) emetti("interrotto");
        }
    };

    private final AudioManager.OnAudioFocusChangeListener focus = cambio -> {
        switch (cambio) {
            case AudioManager.AUDIOFOCUS_LOSS_TRANSIENT:
                if (!inPausa) { perditaTemporanea = true; emetti("interrotto"); }
                break;
            case AudioManager.AUDIOFOCUS_LOSS:
                perditaTemporanea = false; emetti("interrotto");
                break;
            case AudioManager.AUDIOFOCUS_GAIN:
                if (perditaTemporanea) { perditaTemporanea = false; emetti("ripreso"); }
                break;
            default: break;   // LOSS_TRANSIENT_CAN_DUCK: il sistema abbassa il volume da solo
        }
    };

    @Override public IBinder onBind(Intent intent) { return null; }

    @Override
    public void onCreate() {
        super.onCreate();
        am = (AudioManager) getSystemService(Context.AUDIO_SERVICE);
        if (Build.VERSION.SDK_INT >= 26) {
            NotificationChannel ch = new NotificationChannel(CANALE, "Riproduzione", NotificationManager.IMPORTANCE_LOW);
            ch.setDescription("Controlli della sessione in corso");
            ch.setShowBadge(false);
            ((NotificationManager) getSystemService(NOTIFICATION_SERVICE)).createNotificationChannel(ch);
        }
        sessione = new MediaSessionCompat(this, "MeditoPedia");
        sessione.setCallback(new MediaSessionCompat.Callback() {
            @Override public void onPlay() { emetti("play"); }
            @Override public void onPause() { emetti("pause"); }
            @Override public void onStop() { emetti("stop"); }
            @Override public void onSkipToNext() { emetti("next"); }
            @Override public void onSkipToPrevious() { emetti("prev"); }
        });
        sessione.setActive(true);
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        String a = intent != null ? intent.getAction() : null;
        if (a == null) a = AGGIORNA;
        if (CMD.equals(a)) {
            emetti(intent.getStringExtra("cmd"));
            return START_NOT_STICKY;
        }
        if (FERMA.equals(a)) { termina(); return START_NOT_STICKY; }
        if (intent != null) {
            if (intent.hasExtra("titolo")) titolo = intent.getStringExtra("titolo");
            if (intent.hasExtra("testo")) testo = intent.getStringExtra("testo");
            inPausa = intent.getBooleanExtra("inPausa", inPausa);
        }
        aggiornaSessione();
        Notification n = notifica();
        if (AVVIA.equals(a) || !inPrimoPiano) {
            int tipo = Build.VERSION.SDK_INT >= 29 ? ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK : 0;
            ServiceCompat.startForeground(this, ID, n, tipo);
            inPrimoPiano = true;
            chiediFocus();
            if (!ricevitore) {
                ContextCompat.registerReceiver(this, cuffie, new IntentFilter(AudioManager.ACTION_AUDIO_BECOMING_NOISY), ContextCompat.RECEIVER_NOT_EXPORTED);
                ricevitore = true;
            }
            if (wl == null) {
                PowerManager pm = (PowerManager) getSystemService(POWER_SERVICE);
                wl = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "MeditoPedia:sessione");
                wl.setReferenceCounted(false);
            }
            wl.acquire(4 * 60 * 60 * 1000L);   // al massimo 4 ore, poi si rilascia da solo
        } else {
            ((NotificationManager) getSystemService(NOTIFICATION_SERVICE)).notify(ID, n);
        }
        return START_NOT_STICKY;
    }

    private void chiediFocus() {
        if (Build.VERSION.SDK_INT >= 26) {
            AudioAttributes attr = new AudioAttributes.Builder().setUsage(AudioAttributes.USAGE_MEDIA).setContentType(AudioAttributes.CONTENT_TYPE_MUSIC).build();
            richiesta = new AudioFocusRequest.Builder(AudioManager.AUDIOFOCUS_GAIN).setAudioAttributes(attr)
                    .setOnAudioFocusChangeListener(focus).setWillPauseWhenDucked(false).build();
            am.requestAudioFocus(richiesta);
        } else {
            am.requestAudioFocus(focus, AudioManager.STREAM_MUSIC, AudioManager.AUDIOFOCUS_GAIN);
        }
    }

    private void aggiornaSessione() {
        sessione.setMetadata(new MediaMetadataCompat.Builder()
                .putString(MediaMetadataCompat.METADATA_KEY_TITLE, titolo)
                .putString(MediaMetadataCompat.METADATA_KEY_ARTIST, testo)
                .putString(MediaMetadataCompat.METADATA_KEY_ALBUM, "MeditoPedia").build());
        sessione.setPlaybackState(new PlaybackStateCompat.Builder()
                .setActions(PlaybackStateCompat.ACTION_PLAY | PlaybackStateCompat.ACTION_PAUSE | PlaybackStateCompat.ACTION_PLAY_PAUSE
                        | PlaybackStateCompat.ACTION_STOP | PlaybackStateCompat.ACTION_SKIP_TO_NEXT | PlaybackStateCompat.ACTION_SKIP_TO_PREVIOUS)
                .setState(inPausa ? PlaybackStateCompat.STATE_PAUSED : PlaybackStateCompat.STATE_PLAYING, PlaybackStateCompat.PLAYBACK_POSITION_UNKNOWN, 1f)
                .build());
    }

    private PendingIntent comando(String cmd, int req) {
        Intent i = new Intent(this, SfondoAudioService.class).setAction(CMD).putExtra("cmd", cmd);
        return PendingIntent.getService(this, req, i, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    private Notification notifica() {
        Intent apri = getPackageManager().getLaunchIntentForPackage(getPackageName());
        PendingIntent pi = PendingIntent.getActivity(this, 0, apri, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        return new NotificationCompat.Builder(this, CANALE)
                .setSmallIcon(inPausa ? android.R.drawable.ic_media_pause : android.R.drawable.ic_media_play)
                .setContentTitle(titolo)
                .setContentText(inPausa ? "In pausa" : (testo == null || testo.isEmpty() ? "In corso" : testo))
                .setContentIntent(pi)
                .setOngoing(!inPausa)
                .setOnlyAlertOnce(true)
                .setSilent(true)
                .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
                .setCategory(NotificationCompat.CATEGORY_TRANSPORT)
                .addAction(android.R.drawable.ic_media_previous, "Indietro", comando("prev", 1))
                .addAction(inPausa ? android.R.drawable.ic_media_play : android.R.drawable.ic_media_pause, inPausa ? "Riprendi" : "Pausa", comando(inPausa ? "play" : "pause", 2))
                .addAction(android.R.drawable.ic_media_next, "Avanti", comando("next", 3))
                .addAction(android.R.drawable.ic_menu_close_clear_cancel, "Termina", comando("stop", 4))
                .setStyle(new androidx.media.app.NotificationCompat.MediaStyle()
                        .setMediaSession(sessione.getSessionToken())
                        .setShowActionsInCompactView(0, 1, 2))
                .build();
    }

    private void emetti(String azione) {
        if (azione == null) return;
        SfondoAudioPlugin p = SfondoAudioPlugin.istanza;
        if (p != null) p.emetti(azione);
    }

    private void termina() {
        try { if (ricevitore) { unregisterReceiver(cuffie); ricevitore = false; } } catch (Exception ignored) { }
        try {
            if (Build.VERSION.SDK_INT >= 26 && richiesta != null) am.abandonAudioFocusRequest(richiesta);
            else am.abandonAudioFocus(focus);
        } catch (Exception ignored) { }
        try { if (wl != null && wl.isHeld()) wl.release(); } catch (Exception ignored) { }
        inPrimoPiano = false;
        ServiceCompat.stopForeground(this, ServiceCompat.STOP_FOREGROUND_REMOVE);
        SfondoAudioPlugin p = SfondoAudioPlugin.istanza;
        if (p != null) p.servizioTerminato();
        stopSelf();
    }

    /** l'utente chiude l'app dalle recenti: chiusura volontaria, si ferma tutto */
    @Override
    public void onTaskRemoved(Intent rootIntent) {
        termina();
        super.onTaskRemoved(rootIntent);
    }

    @Override
    public void onDestroy() {
        try { if (ricevitore) unregisterReceiver(cuffie); } catch (Exception ignored) { }
        try { if (wl != null && wl.isHeld()) wl.release(); } catch (Exception ignored) { }
        sessione.setActive(false);
        sessione.release();
        super.onDestroy();
    }
}
