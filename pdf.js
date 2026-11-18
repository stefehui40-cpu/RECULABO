import {amount} from './core.js?v=14';
export async function generatePdf(d){
 const {PDFDocument,StandardFonts,rgb}=globalThis.PDFLib;
 const doc=await PDFDocument.create();doc.registerFontkit(globalThis.fontkit);
 const bytes=await Promise.all(['ReceiptSans.ttf','identity.png','table-header.pdf','cut-line.png'].map(async n=>{const r=await fetch(new URL(n,import.meta.url));if(!r.ok)throw Error('Modèle indisponible : reconnectez-vous et rechargez la page.');return new Uint8Array(await r.arrayBuffer());}));
 const font=await doc.embedFont(bytes[0],{subset:true}),bold=await doc.embedFont(StandardFonts.HelveticaBold),logo=await doc.embedPng(bytes[1]);
 const [tableHeader]=await doc.embedPdf(bytes[2]);
 const black=rgb(0,0,0),gray=rgb(.30,.35,.42),line=rgb(.85,.85,.85),green=rgb(.08,.64,.31);
 const cutLine=await doc.embedPng(bytes[3]);
 const width=595;let height=841,page,flowOffset=0;const textBands=[];
 function text(s,x,y,size=10.5,f=font,color=black){textBands.push([flowOffset+y-size,flowOffset+y+size*.25]);page.drawText(String(s),{x,y:height-y,size,font:f,color});}
 function strong(s,x,y,size,color=black){page.pushOperators(PDFLib.pushGraphicsState(),PDFLib.setLineWidth(.28),PDFLib.setStrokingRgbColor(color.red,color.green,color.blue),PDFLib.setTextRenderingMode(PDFLib.TextRenderingMode.FillAndOutline));text(s,x,y,size,font,color);page.pushOperators(PDFLib.popGraphicsState());}
 function wrap(s,max,size=10,f=font){const rows=[];let row='';for(const word of String(s).split(/\s+/)){if(f.widthOfTextAtSize(word,size)>max)throw Error('Un mot ou numéro est trop long pour le reçu.');if(row&&f.widthOfTextAtSize(row+' '+word,size)>max){rows.push(row);row=word;}else row+=(row?' ':'')+word;}if(row)rows.push(row);return rows;}
 function rule(x,y,x2,y2){page.drawLine({start:{x,y:height-y},end:{x:x2,y:height-y2},thickness:.55,color:line});}
 function box(x,y,w,h,r=3){page.drawSvgPath(`M ${r} 0 H ${w-r} Q ${w} 0 ${w} ${r} V ${h-r} Q ${w} ${h} ${w-r} ${h} H ${r} Q 0 ${h} 0 ${h-r} V ${r} Q 0 0 ${r} 0 Z`,{x,y:height-y,borderWidth:.6,borderColor:line,color:rgb(1,1,1)});}
 const qr=globalThis.qrcode(0,'M');qr.addData(d.receipt,'Numeric');qr.make();
 function heading(){textBands.push([flowOffset+185,flowOffset+206.4]);page.drawImage(logo,{x:26.4,y:height-26.4-180,width:124.8,height:180});strong('REÇU',301.47656,43.33002,15);text('N° '+d.receipt,301.47656,59.08002,10.5,font,gray);strong('PAYÉ',301.47656,91.33002,13.5,green);
 const n=qr.getModuleCount(),cell=55/n;for(let r=0;r<n;r++)for(let c=0;c<n;c++)if(qr.isDark(r,c))page.drawRectangle({x:444+c*cell,y:height-37.5-(r+1)*cell,width:cell+.005,height:cell+.005,color:black});
 ['Mode de paiement : Espèces',`Date de paiement : ${d.paid}`,`Date d’émission ${d.issued}`,`Montant total : ${amount(d.total)} FCFA`,`Montant reçu : ${amount(d.total)} FCFA`,'Monnaie : 0 FCFA'].forEach((s,i)=>text(s,298.5,119+i*18,10.5,font,gray));
 }
 const left=[['Nom & Prenom : ',d.name],['ISN & Sexe: ',`${d.isn} / ${d.sex}`],['Age [Année / mois / jours ] : ',`${d.age} ans/ ${d.months} mois / ${d.days} jour (s)`]];
 const right=[['Service : ','LABORATOIRE'],['Enregistré par : ',d.registrar],['Encaissé par : ',d.cashier]];
 function fieldRows(fields,max){return fields.map(([label,value])=>{
   const available=label.startsWith('Age [')?max+8.25:max;
   const lines=[[]];let used=0;
   for(const [content,isLabel]of [[label,true],[value,false]])for(const token of String(content).match(/\S+\s*/g)||[]){
     const f=font;
     const tokenWidth=f.widthOfTextAtSize(token,10.5);
     if(tokenWidth>available)throw Error('Un mot est trop long dans les informations du patient ou des agents.');
     const visibleWidth=f.widthOfTextAtSize(token.trimEnd(),10.5);
     if(used&&used+visibleWidth>available){lines.push([]);used=0;}
     lines[lines.length-1].push({text:token,font:f,x:used,isLabel});used+=tokenWidth;
   }
   return {lines};
 });}
 // Balance the two frames using the agents' text width, within the reference proportions.
 const infoTop=240.58002;
 const agentTextWidth=Math.max(...right.map(([label,value])=>font.widthOfTextAtSize(label+value,10.5)));
 const agentWidth=agentTextWidth<=195.75?230.25:Math.min(272.25,Math.max(240.75,agentTextWidth+29.5));
 const patientWidth=533.25-agentWidth,agentX=28.5+patientWidth+6;
 const a=fieldRows(left,patientWidth-19.5),b=fieldRows(right,agentWidth-19.5),infoHeight=Math.max(61.5,...[a,b].map(fields=>fields.reduce((h,f)=>h+f.lines.length*15+3,7.5)));
 function info(){box(28.5,infoTop,patientWidth,infoHeight);box(agentX,infoTop,agentWidth,infoHeight);for(const [fields,x]of [[a,38.25],[b,agentX+9.75]]){let y=254.83002;for(const f of fields){for(const line of f.lines){for(const run of line){
   if(run.isLabel)page.pushOperators(PDFLib.pushGraphicsState(),PDFLib.setLineWidth(.28),PDFLib.setStrokingRgbColor(0,0,0),PDFLib.setTextRenderingMode(PDFLib.TextRenderingMode.FillAndOutline));
   text(run.text,x+run.x,y,10.5,run.font);
   if(run.isLabel)page.pushOperators(PDFLib.popGraphicsState());
 }y+=15;}y+=3;}}}
 const cols=[28.5,129.75,289.5,360.75,397.5,474.75,567.75];
 function table(rows,top){let y=top+36;const hs=rows.map(item=>Math.max(36,wrap(item.label,133.5,9.75).length*15+6));const bottom=y+hs.reduce((s,h)=>s+h,0);box(cols[0],top,539.25,bottom-top,7.5);for(let i=1;i<cols.length-1;i++)rule(cols[i],top,cols[i],bottom);page.drawPage(tableHeader,{x:28.5,y:height-top-36,width:539.25,height:36});rule(cols[0],y,cols[6],y);
 rows.forEach((item,j)=>{const h=hs[j],lines=wrap(item.label,133.5,9.75);let orderSize=Math.min(9.75,80/font.widthOfTextAtSize(d.order,1));if(orderSize<6.4)throw Error('Le numéro d’ordre est trop long.');text(d.order,40,y+h/2+3.5,orderSize);lines.forEach((s,k)=>text(s,141.515625,y+(h-lines.length*15)/2+10.5+k*15,9.75));text(amount(item.price)+' XOF',298.078125,y+h/2+3.5,9.75);text('1',373.04297,y+h/2+3.5,9.75);text('Aucune',409.79297,y+h/2+3.5,9.75);text(amount(item.price)+' XOF',486.80859,y+h/2+3.5,9.75);y+=h;if(j<rows.length-1)rule(cols[0],y,cols[6],y);});}
 // The reference prints two identical copies in a continuous flow, not two scaled receipts.
 const top=infoTop+infoHeight+12;
 const bottom=top+36+d.items.reduce((sum,item)=>sum+Math.max(36,wrap(item.label,133.5,9.75).length*15+6),0);
 const secondOffset=bottom+14.41998,contentEnd=secondOffset+bottom;
 height=contentEnd+30;page=doc.addPage([width,height]);
 heading();info();table(d.items,top);
 page.drawImage(cutLine,{x:28.5,y:height-bottom-10.41998-22,width:405,height:22});
 page.pushOperators(PDFLib.pushGraphicsState(),PDFLib.concatTransformationMatrix(1,0,0,1,0,-secondOffset));
 flowOffset=secondOffset;
 heading();info();table(d.items,top);page.pushOperators(PDFLib.popGraphicsState());
 const output=await PDFDocument.create();
 const margin=27.58002,stride=785.25;
 const sourceBytes=await doc.save();
 for(let start=margin;start<contentEnd;){let end=Math.min(start+stride,contentEnd);
   // Move a line intact to the following page rather than clipping its letters.
   let previous;do{previous=end;for(const [top,bottom]of textBands)if(top<end&&bottom>end)end=Math.min(end,top);}while(end!==previous);
   const sliceHeight=end-start;
   const [slice]=await output.embedPdf(sourceBytes,[0]);
   const target=output.addPage([width,841]);
   target.pushOperators(PDFLib.pushGraphicsState(),PDFLib.rectangle(0,841-margin-sliceHeight,width,sliceHeight),PDFLib.clip(),PDFLib.endPath());
   target.drawPage(slice,{x:0,y:841-margin-height+start,width,height});target.pushOperators(PDFLib.popGraphicsState());start=end;
 }
 output.setTitle('Reçu '+d.receipt);output.setCreator('RECULABO');return output.save();
}
