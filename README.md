# RECULABO

Générateur statique de reçus de laboratoire, adapté au mobile. Les 13 prestations et leurs prix proviennent de la liste fournie. Quantité 1, aucune réduction, totaux automatiques. L’émission suit le paiement de 53 secondes, à l’heure d’Abidjan. Le QR contient exclusivement le numéro du reçu. Le numéro LAB saisi est répété sur chaque prestation.

Les données patient restent en mémoire sur l’appareil et le formulaire est vidé après génération. Le PDF peut être téléchargé ou partagé. Une première visite avec Internet installe les fichiers nécessaires au fonctionnement hors connexion.

Les reçus longs passent sur une nouvelle page sans réduire la typographie. Le modèle présente XOF dans les lignes de prestations et FCFA dans le récapitulatif ; cette présentation est conservée.

La version 9 utilise le modèle v2.sgch(2) (1) : cadre patient de 292,5 points, cadre agents de 240,75 points et hauteur de 61,5 points, extensible pour les textes longs. L’âge passe naturellement à la ligne si nécessaire. `table-header.pdf` contient uniquement les six titres fixes et leur police vectorielle d’origine, sans page source ni données patient. Les colonnes et la typographie suivent ce nouveau modèle.

Lancer : `npm start`. Contrôles : `npm test`. Déployer la branche main à la racine avec GitHub Pages. Les fichiers Word et PDF source contenant des données personnelles ne font pas partie du dépôt.
