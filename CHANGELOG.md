# Changelog — Simulateur de Salaire Net France

Toutes les modifications notables apportées à ce projet sont documentées dans ce fichier.
Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/) et ce projet adhère à [Semantic Versioning](https://semver.org/lang/fr/).

---

## [1.9.0] - 2026-10-30

### Demande de modification
> « mets les Avantages du quotidien et l'impôt à la source désactivés par défaut. Modifie l'orthographe de "Activer l'épargne salariale" voir screenshot . »

### Modifié
- **Impôt sur le Revenu (PAS) désactivé par défaut** : au chargement et après réinitialisation, le PAS est désactivé avec 0 € d'IR retenu (le salaire net avant impôt est strictement égal au net après impôt). Un bouton d'activation en 1 clic permet de l'enclencher immédiatement.
- **Avantages du quotidien désactivés par défaut** : les titres-restaurant, la participation à l'abonnement de transport en commun et la mutuelle santé sont désormais décochés par défaut.
- **Interrupteur global pour les avantages** : ajout d'un interrupteur principal permettant d'activer ou désactiver d'un seul geste l'ensemble des avantages sociaux, tout en conservant le réglage fin individuel pour chaque avantage.

### Corrigé
- **Orthographe du libellé d'activation de l'épargne salariale** : suppression de l'entité HTML brute `&apos;` affichée dans le bouton, remplacée par l'apostrophe typographique correcte `Activer l'épargne salariale`.

---

## [1.8.0] - 2026-10-30

### Demande de modification
> « Précise dans le header que les chiffres sont purement à titre indicatif et seule la fiche de paye et même si les calculs sont basés sur des barèmes officiels, seules les règles de l'entreprise prévalent sur les projections affichées dans l'application et aucun chiffre annoncé ici ne peut les contredire.. »

### Ajouté
- **Bandeau d'avertissement permanent dans l'en-tête (`Header`)** : mention légale informant que les chiffres sont purement à titre indicatif et que seule la fiche de paie fait foi.
- **Rappel de prévalence d'entreprise** : précision expresse que même si les calculs s'appuient sur les barèmes légaux officiels, seules les règles et conventions de l'entreprise prévalent sur les projections affichées dans l'application et aucun chiffre annoncé ne peut les contredire.
- **Mise à niveau du versioning** vers `v1.8.0` dans l'ensemble de l'application et synchronisation du journal interactif.

---

## [1.7.0] - 2026-10-30

### Demande de modification
> « créer un changelog avec récapitulatif des demandes de modifications et gère le versioning. »

### Ajouté
- **Module interactif Changelog & Versioning** accessible via le badge `v1.7.0` dans l'en-tête et le pied de page, ainsi que par un onglet dédié.
- **Historique complet et chronologique** des 7 itérations avec retranscription exacte des demandes utilisateur, dates et points clés.
- **Filtres de recherche** par mots-clés, version ou type de modification (Fonctionnalité, Correctif, Ergonomie, Refactor).
- **Export et copie de synthèse** pour extraire les notes de version au format Markdown ou texte.
- Présent fichier `CHANGELOG.md` exhaustif à la racine du projet.

---

## [1.6.0] - 2026-10-30

### Demande de modification
> « rend activable ou désactivable et adapte les calculs en fonction du choix de la partie "Épargne Salariale : Participation & Intéressement" et met la valeur par défaut à 0€ pour les 2. Mets à 0€ la valeur de Salaire brut fixe annuel. Ajoute une fonction "Tickets restaurant" avec la possibilité de saisir le montant du ticket et le pourcentage de prise en charge employeur. Déduis la part employé du montant du salaire net après impôts »

### Ajouté
- Interrupteur on/off sur la section **Épargne Salariale : Participation & Intéressement** avec recalcul instantané des sommes versées et placées (0 € lorsque désactivé).
- **Module Tickets Restaurant** avec saisie unitaire du montant du ticket (valeur faciale en €) et du pourcentage de prise en charge employeur (boutons rapides 50% légal et 60% plafond d'exonération Urssaf).
- Déduction directe et automatique de la part salariale des tickets restaurant du **Salaire Net Après impôts**.

### Modifié
- Valeur par défaut du **Salaire brut fixe annuel** initialisée à `0 €` (au lieu de 45 000 €), avec slider et incrémenteurs adaptés dès 0 €.
- Valeurs par défaut de la **Participation** et de l'**Intéressement** initialisées à `0 €` (au lieu de 2 000 € et 2 500 €).
- Formule et affichage du bulletin clarifié pour distinguer le sous-total Net Après impôts (déduit de l'IR et des tickets restaurant) du virement bancaire effectif.

---

## [1.5.0] - 2026-10-30

### Demande de modification
> « applique 24% à Cotisations salariales estimées à ~22% (taux moyen conventionnel du secteur privé). »

### Modifié
- Actualisation du taux de cotisations salariales moyen pour le statut **Non-cadre** de `22%` à `24%` pour refléter les barèmes conventionnels et les cotisations Agirc-Arrco récentes.
- Mise à jour des libellés et explications sous le sélecteur de statut professionnel et sur le bulletin de paie clarifié.

---

## [1.4.0] - 2026-10-30

### Demande de modification
> « fais passer en 2ème position l'encadré N°3 et puisque les améliorations sont en place, supprime la notion "Amélioration appliquée". ajoute la possibilité de modifier la prise en charge du montant employeur concernant les transports publics et le montant de la part employeur de la mutuelle santé »

### Modifié
- Réorganisation ergonomique des étapes : 
  1. Salaire Brut Annuel & Statut
  2. Impôt sur le Revenu (PAS) & Avantages Sociaux
  3. Épargne Salariale : Participation & Intéressement
- Suppression définitive des bandeaux et mentions textuelles « Amélioration appliquée ».
- Remplacement du taux fixe de transport par un **sélecteur de prise en charge employeur personnalisable** (50% légal, 75%, 100% ou libre).
- Ajout de la saisie personnalisée de la **part employeur pour la mutuelle santé**, impactant le net fiscal et le coût employeur (Super-brut).

---

## [1.3.0] - 2026-10-30

### Demande de modification
> « Applique les améliorations 1 et 2. Ajoute le montant du variable dans l'encadré "Résultat de la simulation". Supprime le taux marginal d'imposition des "Participation & Intéressement" dans le calcul "Net touché en direct :". Pourquoi le Net viré en banque (Après impôts) et le Net direct après impôts dans l'encadré Résultat de la simulation sont différents. »

### Ajouté
- Affichage proéminent du **montant du variable cadre (+X € / mois et +Y € / an)** dans l'encadré de synthèse principal « Résultat de la simulation ».
- Bloc explicatif didactique détaillant la distinction entre le **Salaire Net Après impôts** (contractuel issu du bulletin) et le **Net Viré en Banque** (impacté par les avantages en nature et remboursements).

### Modifié
- Suppression de la déduction du TMI sur le **Net touché en direct** pour l'épargne salariale : seule la CSG/CRDS (9,7% sur 98,25%) est prélevée à la source par l'établissement bancaire / teneur de compte.

---

## [1.2.0] - 2026-10-30

### Demande de modification
> « ajoute la possibilité de saisir le montant de l'IR + un pas à pas de 0,1%. ce pourcentage viendra influencer le salaire net et sera affiché "Après impôts", tu garderas l'affichage du montant du salaire net avant impôts »

### Ajouté
- Module de gestion du **Prélèvement à la Source (PAS)** avec 3 modes :
  1. Taux personnalisé avec pas à pas de **0,1%** (boutons +/- 0.1% et slider)
  2. Montant direct de l'impôt en **euros par mois** (€/mois)
  3. Barème progressif officiel français avec parts de quotient familial
- Double affichage permanent : **Salaire Net Avant impôts** et **Salaire Net Après impôts**.
- Boutons rapides de réglage fin de l'IR directement intégrés dans l'encadré résultat.

---

## [1.1.0] - 2026-10-30

### Demande de modification
> « ajoute dans l'encadré "1. Salaire Brut Annuel & Statut" une option activable/désactivable avec pas à pas de +1% concernant la part variable versée annuellement en général pour les cadres. Prends en compte ce variable dans le calcul du salaire net mensuel. Supprime le "repères rapides". Ajoute une option "14ème mois" »

### Ajouté
- Option activable / désactivable pour la **Part variable annuelle** (bonus cadre) avec pas à pas de **+1% / -1%**, saisie libre et curseur de 0% à 50%.
- Prise en compte du variable dans le brut global mensualisé et le net perçu.
- Support du versement sur **14 mois** (conventions spécifiques chimie, banque, assurance) en complément du 12 et 13 mois.

### Supprimé
- Suppression des boutons de « repères rapides » pré-remplis pour épurer la saisie du salaire brut.

---

## [1.0.0] - 2026-10-30

### Demande de création initiale
> « créer un simulateur de salaire net mensuel en France. il faut pouvoir saisir le montant du salaire brut annuel avec incrémentation de 1000 en 1000, il faut sélectionner si on est cadre ou non cadre, ajoute deux cases à saisir pour renseigner les montants des participations et intéressements qui seront ajoutés dans le calcul du salaire mensuel avec un sélecteur de versement sur le compte ou de placement. Suggère 1 ou 2 améliorations que je n'aurais pas pensé »

### Ajouté
- Moteur de conversion **Salaire Brut Annuel vers Net Mensuel** en France.
- Incrémentation par pas de 1 000 € avec saisie manuelle et slider.
- Sélecteur de statut professionnel : **Cadre (~25% de cotisations)** vs **Non-cadre**.
- Module **Épargne Salariale (Participation & Intéressement)** conforme à la Loi Pacte avec arbitrage Versement direct vs Placement PEE/PER et calcul de l'abondement employeur.
- Bulletin de paie clarifié mensuel détaillant santé, retraite de base, Agirc-Arrco et CSG/CRDS.
- Calcul du **Coût Total Employeur (Super-Brut)** avec ventilation en pourcentage.
