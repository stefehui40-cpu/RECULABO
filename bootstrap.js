async function start(){
 const button=document.getElementById('add'),status=document.getElementById('offline');
 button.disabled=true;status.textContent='Chargement des prestations…';
 try{await import('./app.js?v=2');button.disabled=false;}
 catch(error){status.textContent='Chargement incomplet';const message=document.getElementById('error');message.textContent='Les prestations n’ont pas pu se charger. Vérifiez votre connexion puis appuyez sur Réessayer.';message.hidden=false;button.textContent='Réessayer le chargement';button.disabled=false;button.onclick=()=>location.reload();}
}
start();
