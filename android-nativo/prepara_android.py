"""Integra il codice nativo di MeditoPedia nel progetto Android generato da Capacitor.
Uso (dalla cartella build/):  python3 ../android-nativo/prepara_android.py
"""
import os, re, shutil
QUI = os.path.dirname(os.path.abspath(__file__))
PKG = "android/app/src/main/java/it/meditopedia/app"
os.makedirs(PKG, exist_ok=True)
for f in ("MainActivity.java", "SfondoAudioPlugin.java", "SfondoAudioService.java"):
    shutil.copy(os.path.join(QUI, f), os.path.join(PKG, f))

man = "android/app/src/main/AndroidManifest.xml"
s = open(man).read()
perm = ["android.permission.FOREGROUND_SERVICE", "android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK",
        "android.permission.WAKE_LOCK", "android.permission.POST_NOTIFICATIONS"]
for p in perm:
    if p not in s:
        s = s.replace("</manifest>", f'    <uses-permission android:name="{p}" />\n</manifest>')
if "SfondoAudioService" not in s:
    s = s.replace("</application>", '        <service android:name=".SfondoAudioService" android:exported="false" android:foregroundServiceType="mediaPlayback" />\n    </application>')
open(man, "w").write(s)

g = "android/app/build.gradle"
s = open(g).read()
if "androidx.media:media" not in s:
    s = re.sub(r"dependencies\s*\{", 'dependencies {\n    implementation "androidx.media:media:1.7.0"', s, count=1)
open(g, "w").write(s)
print("Codice nativo integrato")
