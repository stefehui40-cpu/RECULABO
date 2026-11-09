# RECULABO

Générateur statique de reçus de laboratoire, adapté au mobile. Les 13 prestations et leurs prix proviennent de la liste fournie. Quantité 1, aucune réduction, totaux automatiques. L’émission suit le paiement de 17 secondes, à l’heure d’Abidjan. Le QR contient exclusivement le numéro du reçu. Le numéro LAB saisi est répété sur chaque prestation.

Les données patient restent en mémoire sur l’appareil et le formulaire est vidé après génération. Le PDF peut être téléchargé ou partagé. Une première visite avec Internet installe les fichiers nécessaires au fonctionnement hors connexion.

Les reçus longs passent sur une nouvelle page sans réduire la typographie. Le modèle présente XOF dans les lignes de prestations et FCFA dans le récapitulatif ; cette présentation est conservée.

Lancer : `npm start`. Contrôles : `npm test`. Déployer la branche main à la racine avec GitHub Pages. Les fichiers Word et PDF source contenant des données personnelles ne font pas partie du dépôt.
