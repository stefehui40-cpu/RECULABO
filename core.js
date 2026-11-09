export const CATALOG=[
 ['nfs','GOP_NUMÉRATION FORMULE SANGUINE (NFS)',4500],
 ['rhesus','GROUPE-RHESUS/PGOP',4500],['goutte','GOUTE EPAISSE/PGOP',3000],
 ['crp','GOP_C-RÉACTIVE PROTÉINE (CRP)',6000],['uree','UREE/PGOP',1500],
 ['creatinine','CREATIMINE/GOP',1500],['glycemie','GLYCÉMIE/GOP',1500],
 ['asat','GOP_ASAT (TGO) TRANSAMINASES',3750],['alat','GOP_ALAT (TGP) TRANSAMINASES',3750],
 ['tp','GOP_TAUX DE PROTHROMBINE (TP)',3750],['tca','GOP_TEMPS DE CÉPHALINE ACTIVÉ (TCA)',3750],
 ['calcium','GOP_CALCIUM DU LCR',3000],['pct','GOP_PROCALCITONINE (PCT)',15000]
].map(([id,label,price])=>({id,label,price}));
export const REGISTRARS=['KOUAME AFFOUE SABINE','ALLEGBE ARDON RUBEN BORIS JOSE','BOH KANGRO','KPAZAI ROCK FELLER','AGRE OHIE JEAN FERLUS'];
export const CASHIERS=['AKA OI AKA LAURENT','KOFFI FRANCOISE AMLAN','KOUADIO YAH REBECCA TEMA ANZIAN'];
export const amount=n=>new Intl.NumberFormat('fr-FR').format(n).replace(/[\u00a0\u202f]/g,' ');
function dateParts(date){return Object.fromEntries(new Intl.DateTimeFormat('fr-FR',{timeZone:'Africa/Abidjan',day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(date).map(p=>[p.type,p.value]));}
export function stamp(date){const p=dateParts(date);return `${p.day}/${p.month}/${p.year} , ${p.hour}:${p.minute}:${p.second}`;}
export function completeNumber(value,now=new Date()){const s=String(value).trim();if(!/^\d{5}$/.test(s))return s;const p=dateParts(now);return s+p.day+p.month+p.year.slice(-2);}
export function receiptData(input,now=new Date()){
 const d={...input};
 for(const key of ['name','registrar','cashier']){d[key]=String(d[key]||'').trim().toLocaleUpperCase('fr');if(!d[key]||d[key].length>90)throw Error('Renseignez le patient et les deux agents (90 caractères maximum).');}
 for(const key of ['isn','receipt','order']){d[key]=String(d[key]||'').trim();if(!/^\d{1,18}$/.test(d[key]))throw Error('ISN, reçu et numéro d’ordre : 1 à 18 chiffres, sans le préfixe LAB.');}
 d.age=Number(d.age);d.months=Number(d.months||0);d.days=Number(d.days||0);
 if(!Number.isInteger(d.age)||d.age<0||d.age>120||!Number.isInteger(d.months)||d.months<0||d.months>11||!Number.isInteger(d.days)||d.days<0||d.days>30)throw Error('Vérifiez l’âge du patient.');
 if(!['F','M'].includes(d.sex))throw Error('Choisissez le sexe.');
 if(!Array.isArray(d.items)||!d.items.length||d.items.length>CATALOG.length)throw Error(`Choisissez de 1 à ${CATALOG.length} prestations.`);
 if(new Set(d.items).size!==d.items.length)throw Error('Une prestation ne peut figurer qu’une seule fois sur le reçu.');
 d.items=d.items.map(id=>{const item=CATALOG.find(x=>x.id===id);if(!item)throw Error('Sélectionnez une prestation pour chaque ligne.');return item;});
 d.total=d.items.reduce((sum,p)=>sum+p.price,0);d.receipt=completeNumber(d.receipt,now);d.order='LAB'+completeNumber(d.order,now);
 d.paid=stamp(now);d.issued=stamp(new Date(now.getTime()+53000));return d;
}
