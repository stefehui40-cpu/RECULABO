# RECULABO

Application statique mobile, nouveau dépôt GitHub public RECULABO.

## Modèle
Référence visuelle : v2.sgch (1).PDF. Une page A4, un reçu de laboratoire, tableau dont le nombre de lignes dépend des prestations choisies.

## Informations modifiables
Nom et prénom, ISN, sexe, âge, enregistré par, encaissé par, numéro du reçu et chiffres du numéro d’ordre.
Service : LABORATOIRE. Logo et coordonnées fixes du modèle.

## Dates et calculs
Heure d’Abidjan. Paiement à l’heure de génération ; émission exactement 17 secondes après le paiement, avec gestion du changement de minute et de date.
Quantité 1 et réduction Aucune pour chaque prestation.
Total de ligne égal au prix de la prestation. Montant total et montant reçu égaux à la somme des lignes. Monnaie 0 FCFA.
Numéro d’ordre : préfixe LAB suivi de chiffres, identique sur toutes les lignes.
QR code : numéro du reçu uniquement, en préservant les zéros initiaux.

## Prestations
Choix dans une liste déroulante. Bouton pour ajouter une prestation, possibilité de supprimer une ligne.
Catalogue de 13 prestations importé depuis LISTE LABO.docx.

## Usage
Générer, ouvrir, télécharger et partager le PDF sur mobile. Reprendre le fonctionnement hors connexion et l’effacement des informations après génération du projet précédent.
Ne publier aucune donnée personnelle du reçu de référence dans les exemples du dépôt.

## Numéro d’ordre
Les chiffres sont saisis dans un champ dédié. LAB est ajouté automatiquement et le numéro complet est répété à chaque ligne.
