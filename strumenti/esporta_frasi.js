/* Aggiorna strumenti/frasi.json con le frasi del nuovo catalogo.
   Uso: node strumenti/esporta_frasi.js
   Le frasi già presenti restano invariate (stesso hash, stesso pacchetto). */
const fs=require("fs"), path=require("path");
const R=path.join(__dirname,"..");
global.window=global;
const src=["js/contenuti.js","js/catalogo.js"].map(f=>fs.readFileSync(path.join(R,f),"utf8")).join("\n;\n");
const fnv=s=>{let h=0x811c9dc5;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,0x01000193)>>>0;}return ("0000000"+h.toString(16)).slice(-8);};
const nuove=(0,eval)(src+";frasiCatalogo()");
const file=path.join(R,"strumenti/frasi.json");
const frasi=JSON.parse(fs.readFileSync(file,"utf8"));
const noti=new Set(frasi.map(f=>f.h)); let agg=0;
for(const f of nuove){ const h=fnv(f.t); if(noti.has(h)) continue; frasi.push({t:f.t,h,b:f.b}); noti.add(h); agg++; }
fs.writeFileSync(file,JSON.stringify(frasi,null,0).replace(/\},\{/g,"},\n{"));
console.log("frasi totali:",frasi.length,"· nuove:",agg);
