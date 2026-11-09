import {amount} from './core.js?v=7';
export async function generatePdf(d){
 const {PDFDocument,StandardFonts,rgb}=globalThis.PDFLib;
 const doc=await PDFDocument.create();doc.registerFontkit(globalThis.fontkit);
 const bytes=await Promise.all(['ReceiptSans.ttf','identity.png','table-header.pdf'].map(async n=>{const r=await fetch(new URL(n,import.meta.url));if(!r.ok)throw Error('Modèle indisponible : reconnectez-vous et rechargez la page.');return new Uint8Array(await r.arrayBuffer());}));
 const font=await doc.embedFont(bytes[0],{subset:true}),bold=await doc.embedFont(StandardFonts.HelveticaBold),logo=await doc.embedPng(bytes[1]);
 const [tableHeader]=await doc.embedPdf(bytes[2]);
 const black=rgb(0,0,0),gray=rgb(.30,.35,.42),line=rgb(.85,.85,.85),green=rgb(.08,.64,.31);
 const width=595,height=841;let page;
 function text(s,x,y,size=10.5,f=font,color=black){page.drawText(String(s),{x,y:height-y,size,font:f,color});}
 function wrap(s,max,size=10,f=font){const rows=[];let row='';for(const word of String(s).split(/\s+/)){if(f.widthOfTextAtSize(word,size)>max)throw Error('Un mot ou numéro est trop long pour le reçu.');if(row&&f.widthOfTextAtSize(row+' '+word,size)>max){rows.push(row);row=word;}else row+=(row?' ':'')+word;}if(row)rows.push(row);return rows;}
 function rule(x,y,x2,y2){page.drawLine({start:{x,y:height-y},end:{x:x2,y:height-y2},thickness:.55,color:line});}
 function box(x,y,w,h,r=3){page.drawSvgPath(`M ${r} 0 H ${w-r} Q ${w} 0 ${w} ${r} V ${h-r} Q ${w} ${h} ${w-r} ${h} H ${r} Q 0 ${h} 0 ${h-r} V ${r} Q 0 0 ${r} 0 Z`,{x,y:height-y,borderWidth:.6,borderColor:line,color:rgb(1,1,1)});}
 const qr=globalThis.qrcode(0,'M');qr.addData(d.receipt,'Numeric');qr.make();
 function heading(){page=doc.addPage([width,height]);page.drawImage(logo,{x:26.4,y:height-26.4-180,width:124.8,height:180});text('REÇU',298.5,43.5,16,bold);text('N° '+d.receipt,298.5,59,10.5,font,gray);text('PAYÉ',298.5,91,14,bold,green);
 const n=qr.getModuleCount(),cell=55/n;for(let r=0;r<n;r++)for(let c=0;c<n;c++)if(qr.isDark(r,c))page.drawRectangle({x:444+c*cell,y:height-37.5-(r+1)*cell,width:cell+.005,height:cell+.005,color:black});
 ['Mode de paiement : Espèces',`Date de paiement : ${d.paid}`,`Date d’émission ${d.issued}`,`Montant total : ${amount(d.total)} FCFA`,`Montant reçu : ${amount(d.total)} FCFA`,'Monnaie : 0 FCFA'].forEach((s,i)=>text(s,298.5,119+i*18,10.5,font,gray));
 }
 const left=[['Nom & Prenom : ',d.name],['ISN & Sexe: ',`${d.isn} / ${d.sex}`],['Age [Année / mois / jours ] : ',`${d.age} ans/ ${d.months} mois / ${d.days} jour (s)`]];
 const right=[['Service : ','LABORATOIRE'],['Enregistré par : ',d.registrar],['Encaissé par : ',d.cashier]];
 function fieldRows(fields,max){return fields.map(([label,value])=>{
   const lines=[[]];let used=0;
   for(const [content,isLabel]of [[label,true],[value,false]])for(const token of String(content).match(/\S+\s*/g)||[]){
     const f=font;
     const tokenWidth=f.widthOfTextAtSize(token,10.5);
     if(tokenWidth>max)throw Error('Un mot est trop long dans les informations du patient ou des agents.');
     if(used+tokenWidth>max&&used){lines.push([]);used=0;}
     lines[lines.length-1].push({text:token,font:f,x:used,isLabel});used+=tokenWidth;
   }
   return {lines};
 });}
 // Measurements in points from the reference PDF; additional lines may expand both boxes equally.
 const infoTop=240.58002;
 const a=fieldRows(left,241.5),b=fieldRows(right,252.75),infoHeight=Math.max(76.5,...[a,b].map(fields=>fields.reduce((h,f)=>h+f.lines.length*15+3,7.5)));
 function info(){box(28.5,infoTop,261,infoHeight);box(295.5,infoTop,272.25,infoHeight);for(const [fields,x]of [[a,38.25],[b,305.25]]){let y=254.83002;for(const f of fields){for(const line of f.lines){for(const run of line){
   if(run.isLabel)page.pushOperators(PDFLib.pushGraphicsState(),PDFLib.setLineWidth(.28),PDFLib.setStrokingRgbColor(0,0,0),PDFLib.setTextRenderingMode(PDFLib.TextRenderingMode.FillAndOutline));
   text(run.text,x+run.x,y,10.5,run.font);
   if(run.isLabel)page.pushOperators(PDFLib.popGraphicsState());
 }y+=15;}y+=3;}}}
 const cols=[28.5,131.25,289.5,360.75,397.5,474.75,567.75];
 function table(rows,top){let y=top+36;const hs=rows.map(item=>Math.max(36,wrap(item.label,135,10).length*15+6));const bottom=y+hs.reduce((s,h)=>s+h,0);box(cols[0],top,539.25,bottom-top,7.5);for(let i=1;i<cols.length-1;i++)rule(cols[i],top,cols[i],bottom);page.drawPage(tableHeader,{x:28.5,y:height-top-36,width:539.25,height:36});rule(cols[0],y,cols[6],y);
 rows.forEach((item,j)=>{const h=hs[j],lines=wrap(item.label,135,10);let orderSize=Math.min(10,80/font.widthOfTextAtSize(d.order,1));if(orderSize<6.4)throw Error('Le numéro d’ordre est trop long.');text(d.order,40,y+h/2+3.5,orderSize);lines.forEach((s,k)=>text(s,143.25,y+(h-lines.length*15)/2+11+k*15,10));text(amount(item.price)+' XOF',301.5,y+h/2+3.5,10);text('1',372,y+h/2+3.5,10);text('Aucune',409.5,y+h/2+3.5,10);text(amount(item.price)+' XOF',487.5,y+h/2+3.5,10);y+=h;if(j<rows.length-1)rule(cols[0],y,cols[6],y);});}
 let remaining=[...d.items],pages=0;
 while(remaining.length){heading();info();const top=infoTop+infoHeight+12;let used=36,count=0;for(const item of remaining){const h=Math.max(36,wrap(item.label,135,10).length*15+6);if(top+used+h>800)break;used+=h;count++;}if(!count)throw Error('Les informations sont trop longues pour le modèle.');table(remaining.splice(0,count),top);pages++;}
 if(pages>1)doc.getPages().forEach((p,i)=>{page=p;text(`${i+1}/${pages}`,548,824,8,font,gray);});
 doc.setTitle('Reçu '+d.receipt);doc.setCreator('RECULABO');return doc.save();
}
