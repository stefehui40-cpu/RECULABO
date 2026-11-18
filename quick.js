import {completeNumber} from './core.js?v=15';
export const ABBREVIATIONS={NFS:'nfs',GRH:'rhesus',GE:'goutte',CRP:'crp',UREE:'uree',CREA:'creatinine',GLY:'glycemie',TGO:'asat',TGP:'alat',TP:'tp',TCA:'tca',LCR:'calcium',PCT:'pct',BT:'bilirubine-totale',BC:'bilirubine-conjuguee',PRO:'protidemie',IONO:'ionogramme-urinaire',CAL:'calcemie',ELHB:'electrophorese'};
const aliases={...ABBREVIATIONS,ASAT:'asat',ALAT:'alat',GLYCEMIE:'glycemie',CREATININE:'creatinine',CREATIMINE:'creatinine',PROTIDEMIE:'protidemie',CALCEMIE:'calcemie'};
export function parseQuick(message,now=new Date()){
 const tokens=String(message).normalize('NFD').replace(/\p{M}/gu,'').toUpperCase().match(/[A-Z]+|\d+/g)||[];
 const first=tokens.findIndex(t=>/^\d+$/.test(t));
 if(first<1)throw Error('Commencez par le nom et prénom, puis l’ISN.');
 const result={name:tokens.slice(0,first).join(' '),isn:tokens[first],age:0,months:0,days:0,sex:'F',items:[]};
 const units={AN:'age',ANS:'age',ANNEE:'age',ANNEES:'age',A:'age',MOIS:'months',JOUR:'days',JOURS:'days',J:'days'};
 const ages=new Set(),numbers=[],unknown=[];let sex;
 for(let i=first+1;i<tokens.length;i++){
   const token=tokens[i];
   if(/^\d+$/.test(token)){
     const unit=units[tokens[i+1]];
     if(unit){if(ages.has(unit))throw Error('Chaque partie de l’âge doit être indiquée une seule fois.');ages.add(unit);result[unit]=Number(token);i++;}
     else numbers.push(token);
   }else if(token==='F'||token==='M'){
     if(sex&&sex!==token)throw Error('Indiquez un seul sexe : F ou M.');sex=token;result.sex=token;
   }else if(aliases[token]){if(!result.items.includes(aliases[token]))result.items.push(aliases[token]);}
   else unknown.push(token);
 }
 if(unknown.length)throw Error('Non reconnu : '+unknown.join(', ')+'. Consultez les abréviations sous la zone de saisie.');
 if(!ages.size)throw Error('Précisez l’âge avec son unité : 12ans, 6mois ou 14jours.');
 if(result.age>120||result.months>11||result.days>30)throw Error('Vérifiez l’âge : 0 à 120 ans, 0 à 11 mois et 0 à 30 jours.');
 if(numbers.length!==2)throw Error('Indiquez deux numéros après l’ISN : d’abord le reçu, puis le numéro d’ordre LAB.');
 if([result.isn,...numbers].some(n=>n.length>18))throw Error('Un identifiant ne peut pas dépasser 18 chiffres.');
 if(!result.items.length)throw Error('Ajoutez au moins une abréviation de prestation, par exemple GLY CREA UREE.');
 result.receipt=completeNumber(numbers[0],now);result.order=completeNumber(numbers[1],now);
 return result;
}
