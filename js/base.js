/* =========================================================
   MeditoPedia — Stato, memoria locale e utilità comuni
   I dati restano sul dispositivo (localStorage, chiave meditopedia_state).
   La struttura è compatibile con le versioni precedenti: progressi,
   storico, voce scelta e preferenze vengono conservati e migrati.
   ========================================================= */
"use strict";
const store = {
 get(k,d){try{const v=localStorage.getItem("meditopedia_"+k);return v?JSON.parse(v):d}catch(e){return d}},
 set(k,v){try{localStorage.setItem("meditopedia_"+k,JSON.stringify(v))}catch(e){}}
};
const DEF = {
 done:{}, minutes:0, sessions:0, hist:[],
 voice:true, voceInt:"sara", voceSpeed:1, rate:.88,
 bg:"spazio", volMusica:.7, volVoce:1, duck:.45, mix:{}, lastPreset:null,
 brDur:5, brCue:"inizio", brToni:false, brVel:1,
 brCustom:{in:4,h1:0,out:6,h2:0,min:5,cicli:0,modo:"durata",vel:1,cue:"inizio",toni:true,bg:"none"},
 brPreset:[], tmDur:10, tmInt:0, tmBg:"none",
 fav:[], last:null, routine:[], playlist:[], durScelta:{},
 fade:30, sleepMin:0, tema:"auto", minimale:false, promemoria:[], promemoriaOn:true,
 schema:2
};
let ST = Object.assign({}, DEF, store.get("state",{}));
// migrazioni dalla versione 1.x
if(ST.vol!=null&&ST.schema!==2){ ST.volMusica=ST.vol; }
if(!ST.brCustom||typeof ST.brCustom!=="object") ST.brCustom=Object.assign({},DEF.brCustom);
ST.brCustom=Object.assign({},DEF.brCustom,ST.brCustom);
["fav","routine","playlist","brPreset","promemoria","hist"].forEach(k=>{ if(!Array.isArray(ST[k])) ST[k]=[]; });
ST.schema=2;
const save = () => store.set("state", ST);
save();
const dayKey = (d=new Date()) => d.toLocaleDateString("sv-SE");
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmt = s => { s=Math.max(0,Math.round(s)); const h=Math.floor(s/3600), m=Math.floor(s%3600/60), x=String(s%60).padStart(2,"0"); return h?h+":"+String(m).padStart(2,"0")+":"+x:m+":"+x; };
const minuti = s => Math.max(1,Math.round(s/60))+" min";
function toast(t){
 const d=document.createElement("div"); d.className="toast"; d.textContent=t; d.setAttribute("role","status");
 document.body.appendChild(d); requestAnimationFrame(()=>d.classList.add("on"));
 setTimeout(()=>{ d.classList.remove("on"); setTimeout(()=>d.remove(),400); },2600);
}
