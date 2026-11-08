# Changelog — Simulateur de Salaire Net France

Toutes les modifications notables apportées à ce projet sont documentées dans ce fichier.
Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/) et ce projet adhère à [Semantic Versioning](https://semver.org/lang/fr/).

## [1.26.0] - 2026-11-08

### Demande de modification
> « supprime les deux encadrés voir image.png car doublon avec l'encadré "bulletin de paye"
> Rend les encadrés pliés par défaut sauf l'encadré 1 »

### Modifié
- **Suppression des deux encadrés en doublon en bas de page** :
  - Suppression de la grille secondaire inférieure qui réaffichait `ArbitrageCard` et `EmployerCostCard` en pleine largeur en bas de page. Ces modules restent consultables instantanément via le système d'onglets du panneau de droite (« Arbitrage Épargne » et « Coût Employeur »).
- **Repli automatique par défaut de tous les encadrés (sauf l'encadré 1)** :
  - **Encadré 1 — Salaire Brut Annuel & Statut** : reste **déplié** par défaut pour permettre à l'utilisateur de saisir ou ajuster immédiatement son salaire brut, statut et part variable.
  - **Encadré 2 — Avantages Sociaux** : plié par défaut.
  - **Encadré 3 — Impôt sur le Revenu (PAS)** : plié par défaut.
  - **Encadré 4 — Épargne Salariale : Participation & Intéressement** : plié par défaut.
  - **Cartes d'onglets (Bulletin de Paie Clarifié, Arbitrage Épargne, Coût Employeur)** : pliées par défaut.

---

## [1.25.0] - 2026-11-03

### Demande de modification
> « sépare en 2 encadrés les avantages et les impots et dote ces encadrés du même mécanisme de pliage/dépliage de même pour:
> l'encadré "Bulletin de Paie Clarifié (Mensuel)"
> et Arbitrage Epargne et coût total employeur. L'encadré 2 deviendra Avantages sociaux, les impots en 3 et l'épargne salariale en 4. »

### Ajouté
- **Séparation en 4 encadrés de saisie autonomes et pliables/dépliables** :
  - **Encadré 1** : `1. Salaire Brut Annuel & Statut` (avec rappel du brut mensuel configuré même replié).
  - **Encadré 2** : `2. Avantages Sociaux` (Transports publics, Mutuelle santé, Titres-restaurant) avec bouton chevron et commande d'activation globale.
  - **Encadré 3** : `3. Impôt sur le Revenu (PAS)` (Saisie par taux au 0,1%, montant en €/m ou barème officiel) avec badge du taux en cours et bouton chevron.
  - **Encadré 4** : `4. Épargne Salariale : Participation & Intéressement` (Arbitrage versement compte vs placement PEE/PER).
- **Généralisation du mécanisme de pliage/dépliage aux cartes de résultat** :
  - **Bulletin de Paie Clarifié (Mensuel)** : bandeau d'en-tête cliquable avec rappel du virement net mensuel et bouton chevron interactif.
  - **Arbitrage Épargne Salariale (Cash vs Placement PEE/PER)** : bandeau interactif avec boutons d'actions rapides et repli/dépliage complet.
  - **Coût Total Employeur (Super-Brut)** : bandeau cliquable avec rappel du super-brut mensuel et chevron de repli/dépliage.

---

## [1.24.0] - 2026-11-03

### Demande de modification
> « de la même manière que l'encadré "2. impôts sur le revenu..." rend la possibilité de réduire les autres encadrés voir image.png
> dans l'encadré "2. impôts sur le revenu..." inverse la partie impots avec la partie avantages qui doit se retrouver donc en premier. »

### Ajouté
- **Pliage/dépliage interactif de l'ensemble des encadrés de saisie** :
  - **Encadré 1 (Salaire Brut Annuel & Statut)** : bandeau d'en-tête cliquable avec icône chevron (`ChevronUp` / `ChevronDown`) pour replier ou déplier à volonté. En mode replié, le brut mensuel correspondant (`/ mois`) reste bien visible pour assurer un repère instantané.
  - **Encadré 3 (Épargne Salariale : Participation & Intéressement)** : bandeau d'en-tête cliquable avec icône chevron et préservation du sélecteur d'activation directe (« Option activée ») sans déclencher le pliage.
- **Réordonnancement intérieur de l'encadré 2 (Avantages Sociaux & Impôt sur le Revenu)** :
  - **Avantages du quotidien en première position** : Transports publics, Mutuelle santé et Titres-restaurant s'affichent immédiatement en haut de l'encadré.
  - **Impôt sur le Revenu (PAS) en deuxième position** : options de renseignement de l'IR (taux au dixième de %, montant direct en euros ou barème automatique) positionnées après les avantages.
  - Mise à jour du libellé d'en-tête : « 2. Avantages Sociaux & Impôt sur le Revenu (PAS) ».

---

## [1.23.0] - 2026-11-03

### Demande de modification
> « il faut élargir l'affichage à gauche voir image.png pour avoir un affichage clair »

### Modifié
- **Élargissement de la colonne de saisie à gauche** :
  - Passage de la colonne gauche à 7 colonnes sur 12 (`lg:col-span-7 xl:col-span-7 2xl:col-span-7`), offrant ~58% de l'espace total (~900px) aux formulaires de saisie.
  - La colonne de droite conserve 5 colonnes sur 12 (`lg:col-span-5 xl:col-span-5 2xl:col-span-5`), garantissant une largeur idéale pour la synthèse nette et les projections.
- **Refonte ergonomique des 3 cartes d'Avantages du Quotidien** :
  - **Positionnement vertical des libellés** : chaque libellé (« Coût de l'abonnement », « Prise en charge employeur », « Part salariale », « Valeur unitaire du ticket », etc.) est désormais placé au-dessus de son contrôle, empêchant tout retour à la ligne étriqué mot par mot.
  - **Champs de saisie fluides (`flex-1`)** : adaptation parfaite à la largeur de chaque carte sans déborder ni tronquer les boutons `+` / `-`.
  - **Boutons pas-à-pas confortables (`w-8 h-8`)** : zones de clic élargies avec état hover/active et retours visuels nets.
  - **Affichage des totaux sur une seule ligne** : `Remboursement employeur : +43 € / mois`, `Retenue nette : -40 € / mois` sans césure intempestive.

---

## [1.22.0] - 2026-11-03

### Demande de modification
> « prend en compte les avantages au quotidien dans la Synthèse Salariale Nette.
> concernant la projection, Elargi l'affichage de la page pour une meilleure clarté voir imagne.png ou bien trouve une autre astuce pour un meilleur affichage.
> Les incrémentations dans les champs de saisie dans les Avantages du quotidien ne fonctionnent pas »

### Ajouté
- **Avantages du quotidien dans la Synthèse Salariale Nette (ResultCard)** :
  - Virement bancaire effectif mis en valeur avec explicitation détaillée des flux monétaires : transports remboursés (+X €/m), mutuelle santé retenue (-Y €/m), part salariale des titres-restaurant (-Z €/m).
  - Pouvoir d'achat net mensuel global incluant la part patronale des titres-restaurant utilisable pour les courses et repas.
  - Prise en charge patronale totale des avantages sociaux au quotidien (+W €/mois non imposables).
- **Élargissement de la mise en page (max-w-[1600px])** :
  - Passage du conteneur central à 1600px avec répartition équilibrée 50/50 (`lg:col-span-6 xl:col-span-6`).
  - Espace doublé pour la colonne de synthèse et de projection sur les écrans d'ordinateur.
- **Double mode d'affichage de la Projection sur 5 ans** :
  - Mode **Cartes** : 5 cartes annuelles spacieuses et aérées avec progression cumulée et boutons de variation pas à pas.
  - Mode **Tableau** : vue tabulaire comparative ultra-lisible pour embrasser d'un coup d'œil l'ensemble des 5 années.

### Corrigé
- **Incrémentations dans les champs de saisie des Avantages du quotidien** :
  - Ajout de boutons pas-à-pas confortables (`-` et `+`) avec zones de clic agrandies.
  - Neutralisation des collisions d'événements grâce à `pointer-events-none` sur les unités (`€`, `%`, `€/m`) et masquage des flèches natives de navigateur (`[appearance:textfield]`).

---

## [1.21.0] - 2026-11-03

### Demande de modification
> « si 14ème mois est coché le calcul remplace celui du 13ème mois mais remplace 13ème mois par 14ème mois dans le calcul.
> dans l'encadré "Montants Avant & Après impôts" rajoute une option pour calculer les augmentations annuelles pour se projeter dans l'avenir.
> cette option sera la sélection d'un pourcentage obtenue par année 1, puis nouveau % année 2 etc....vision sur 5 ans. L'afficahge ne doit pas être surchargé.
> cette option est désactivée par défaut. »

### Modifié
- **Règle de calcul du 14ème mois (dénominateur 14)** :
  - Lorsque la case **14ème mois** est cochée, le dénominateur de calcul passe rigoureusement à **14** (remplaçant le 13).
  - La base contractuelle mensuelle est de `(Salaire brut fixe / 14)` et les mensualités régulières sur 12 mois sont calculées sur `(brut / 14) * 12`.
  - Le lissage mensuel ajoute `2/12èmes` de salaire mensuel net avant et après impôts.

### Ajouté
- **Projection sur 5 ans des augmentations annuelles** :
  - Intégration d'un interrupteur sobre et optionnel dans l'encadré « Montants Avant & Après impôts » (désactivé par défaut).
  - Vision sur 5 ans détaillée et épurée (Année 1 à Année 5) sans surcharger l'interface :
    - Sélection et ajustement individuel du pourcentage d'augmentation pour chaque année (`+/- 0,5%`).
    - Boutons d'application rapide en un clic de préréglages conventionnels (`+1,5%`, `+2%`, `+2,5%`, `+3%`, `+5%`).
    - Projection en temps réel du **Net Après impôts**, du **Net Avant impôts**, du gain mensuel net et du brut annuel correspondant.
    - Bandeau récapitulatif du bilan au terme de la 5ème année (gain net cumulé en euros et en pourcentage).

---

## [1.20.0] - 2026-11-03

### Demande de modification
> « affiche le "Net mensuel lissé avec primes" uniquement si 13ème ou 14ème mois coché, sinon le montant se base sur le Salaire Net avant ou Après impôts.
> n'affiche "Net mensuel lissé avec primes " que si l'option "Lisser les montants versé sur 12 mois dans le net mensuel" est cochée.
> Par défaut l'option "Lisser les montants versé sur 12 mois dans le net mensuel" est cochée.
> Supprime le total "Versement ponctuel" de la prime voir image.png »

### Modifié
- **Conditionnement strict du « Net mensuel lissé avec primes »** :
  - N'apparaît désormais que si la case **« Lisser les montants versés sur 12 mois dans le net mensuel »** est active.
  - Cette option est désormais **activée par défaut** (au chargement et après reset).
- **Règle de calcul et d'affichage adaptée** :
  - **Si 13ème ou 14ème mois coché** : le « Net mensuel lissé avec primes » s'ajoute au Net mensuel lissé 13e/14e mois (ex : 3 577 € + 754 € = 4 331 € / mois pour le 13e mois ; 3 852 € + 754 € = 4 606 € / mois pour le 14e mois).
  - **Sinon (base standard 12 mois)** : le montant se base directement sur le Salaire Net Avant et Après impôts (ex : Net après impôts 3 302 € + 754 € = 4 056 € / mois ; Net avant impôts 3 462 € + 754 € = 4 216 € / mois).

### Supprimé
- **Suppression du total et de l'encart « Versement ponctuel »** :
  - Suppression intégrale de la ligne/badge récapitulative `X € versés en direct (Versement ponctuel)` sous la carte de résultat, évitant toute redondance et confusion avec le salaire lissé.

---

## [1.19.0] - 2026-11-03

### Demande de modification
> « supprime l'affichage de l'un des deux "Net mensuel lissé avec primes :" voir image image.png
> Dans la partie "1. Salaire Net Avant impôts" le montant "Net mensuel lissé avec 14ème mois " est inchangé selon si 13ème mois ou 14ème mois est coché. idem dans la partie "2. Salaire Net Après impôts" -> revoit ton calcul
> par défaut l'affichage doit être:
> Salaire brut fixe annuel = 60000
> Statut professionnel = cadre
> 13ème & 14ème mois (Optionnel) = 13ème mois coché
> PAS activé et taux en % = 4,6
> Épargne Salariale : Participation & Intéressement = 5000 pour Participation Annuelle et 5000 pour Intéressement Annuel les deux en versement sur le compte. »

### Corrigé
- **Suppression du doublon « Net mensuel lissé avec primes »** :
  - Suppression de la ligne redondante située en bas de la carte résultat lorsque la coche 13ème ou 14ème mois est active.
  - La valeur lissée avec primes n'apparaît plus qu'une seule et unique fois, intégrée avec clarté dans l'encart vert de lissage après impôts.
- **Différenciation réelle du calcul de lissage du 14ème mois** :
  - Pour le **13ème mois** : ajout de `1/12ème` de salaire mensuel net (+288 € avant impôts, +275 € après impôts).
  - Pour le **14ème mois** : ajout de `2/12èmes` de salaire mensuel net (+577 € avant impôts, +550 € après impôts).
  - Les montants lissés avant et après impôts augmentent désormais rigoureusement lorsqu'on passe du 13ème mois au 14ème mois.

### Modifié
- **Configuration des valeurs par défaut au chargement et lors de la remise à zéro (`handleReset`)** :
  - **Salaire brut fixe annuel** : `60 000 € / an` (4 615 € / mois brut régulier).
  - **Statut professionnel** : `Cadre` (cotisations salariales à 25%).
  - **13ème & 14ème mois** : `13ème mois` coché par défaut.
  - **Prélèvement à la source (PAS)** : Activé avec taux à `4,6%` (-159 € / mois).
  - **Épargne salariale** : Activée avec `5 000 €` de Participation annuelle et `5 000 €` d'Intéressement annuel, tous deux en `versement sur le compte` (+754 € net / mois).
- **Résultats instantanés au chargement** :
  - 1. Salaire Net Avant impôts : **3 462 € / mois** (Lissé avec 13ème mois : **3 750 € / mois**).
  - 2. Salaire Net Après impôts : **3 302 € / mois** (Lissé 13ème mois : **3 577 € / mois**).
  - Net mensuel lissé avec primes : **4 331 € / mois**.

---

## [1.18.0] - 2026-11-03

### Demande de modification
> « remplace "Net mensuel lissé avant impôts (13ème mois) :" par "Net mensuel lissé avec 13ème mois :" -> variable selon 13ème ou 14ème mois coché.
> remplace "Net mensuel lissé après impôts (13ème mois) :" par "Net mensuel lissé 13ème mois :" -> variable selon 13ème ou 14ème mois coché.
> le "Net mensuel lissé avec primes" doit être ajouté au "Net mensuel lissé après impôts (13ème mois) :" ou "Net mensuel lissé après impôts (14ème mois) :" si coche correspondante cochée. »

### Modifié
- **Harmonisation des libellés de lissage** :
  - **Bloc 1 (Avant impôts)** : remplacement par `Net mensuel lissé avec 13ème mois :` ou `Net mensuel lissé avec 14ème mois :` selon la case cochée.
  - **Bloc 2 (Après impôts)** : remplacement par `Net mensuel lissé 13ème mois :` ou `Net mensuel lissé 14ème mois :` selon la case cochée.
- **Ajout des primes au Net mensuel lissé du 13ème/14ème mois** :
  - Le `Net mensuel lissé avec primes` est désormais calculé en ajoutant directement la quote-part de primes au `Net mensuel lissé 13ème mois` (ou 14ème mois) lorsque la coche est active.
  - Affichage direct et explicite de la ligne `Net mensuel lissé avec primes` au sein même de l'encart de lissage après impôts lorsque des primes de participation/intéressement sont perçues.
  - Actualisation du résumé copié dans le presse-papier et du bulletin clarifié.

---

## [1.17.0] - 2026-11-03

### Demande de modification
> « tu as ajouté le 13 ème mois alors qu'il est compris dans le salaire brut fixe annuel. Ce 13ème mois est un salaire un versement unique sur l'année en une fois. La demande est:
> 1/ Calcule et affiche le 1. Salaire Net Avant impôts et le 2. Salaire Net Après impôts sur la base de (Salaire brut fixe annuel/13)*12 en déduisant les Cotisations salariales et le PAS si activé.
> 2/ le lissage ajouté précédemment doit être: la même règle que le point 1/ en ajoutant 1/12 de salaire mensuel. Fait le calcul pour la partie avant et après impots »

### Modifié
- **1. Calcul régulier 13e / 14e mois compris dans le salaire brut fixe annuel** :
  - **1. Salaire Net Avant impôts** : calculé sur la base de `(Salaire brut fixe annuel / 13) * 12` (ou `/ 14` pour le 14ème mois) en déduisant les cotisations salariales.
  - **2. Salaire Net Après impôts** : calculé à partir du net avant impôts en déduisant le prélèvement à la source (PAS) et la part salarié des tickets restaurant.
- **2. Lissage du salaire net mensuel avant et après impôts** :
  - **Net mensuel lissé avant impôts** : calculé selon la même règle que le point 1 en y ajoutant `1/12ème` de salaire mensuel net avant impôts.
  - **Net mensuel lissé après impôts** : calculé selon la même règle que le point 1 en y ajoutant `1/12ème` de salaire mensuel net après impôts.
  - Prise en compte symétrique pour l'option 14ème mois avec ajout de `2/12èmes` de salaire mensuel.
- **Harmonisation générale** :
  - Carte de résultat détaillée, bulletin de paie clarifié et export de synthèse synchronisés.

---

## [1.16.0] - 2026-11-03

### Demande de modification
> « supprime la fonction de Mois supplémentaires
> ajoute l'affichage du lissage du salaire net mensuel avant et après impots dans le cas du 13ème ou 14ème mois activé »

### Modifié
- **Suppression intégrale de la fonction de déduction de mois supplémentaires** :
  - Fin de toute déduction sur les montants de base contractuels (le Net Avant et Après impôts de base reste le montant mensuel sur 12 mois).
- **Affichage explicite du lissage du salaire net mensuel avant et après impôts** :
  - **Bloc 1 (Salaire Net Avant Impôts)** : affichage de la base standard (ex: 3 750 €/mois) et, lorsque le 13e ou 14e mois est coché, encart dédié de « Net mensuel lissé avant impôts » (ex: 4 063 €/mois pour 13e mois, 4 375 €/mois pour 14e mois).
  - **Bloc 2 (Salaire Net Après Impôts)** : affichage du net en poche de base (ex: 3 469 €/mois) et, lorsque le 13e ou 14e mois est coché, encart dédié de « Net mensuel lissé après impôts » (ex: 3 758 €/mois pour 13e mois, 4 047 €/mois pour 14e mois).
- **Bulletin de paie et export de synthèse** :
  - Ligne de lissage budgétaire mensuel informatif dans le bulletin clarifié.
  - Export de synthèse dans le presse-papier intégrant les montants contractuels standard et les montants lissés avec le 13e/14e mois.

---

## [1.15.0] - 2026-11-03

### Demande de modification
> « remplace totalement la fonctionnalité de Nombre de mois de versement par la règle suivante:
> Case à cocher 13ème mois + case à cocher 14 ème mois.
> Si case à cocher 13ème mois = cochée: ajoute au Salaire Net Avant et après impôts le 1/12ème de salaire brut annuel et si 14ème mois = cochée ajoute 2/12 etc.... »

### Modifié
- **Remplacement complet du sélecteur Nombre de mois de versement** :
  - Suppression intégrale des boutons « 12 mois », « 13 mois », « 14 mois ».
  - Ajout de deux cases à cocher exclusives : **13ème mois** et **14ème mois**.
- **Application de la règle de calcul 13e / 14e mois** :
  - **13ème mois coché** : ajoute directement **1/12ème du salaire brut annuel** au Salaire Net Avant impôts et au Salaire Net Après impôts (+417 €/mois pour 60 000 € de brut).
  - **14ème mois coché** : ajoute directement **2/12èmes du salaire brut annuel** au Salaire Net Avant impôts et au Salaire Net Après impôts (+833 €/mois pour 60 000 € de brut).
- **Liaison ergonomique intelligente** :
  - Cocher le 14ème mois active automatiquement le 13ème mois.
  - Décocher le 13ème mois désactive automatiquement le 14ème mois pour prévenir tout état incohérent.
- **Affichage et Synthèse** :
  - Badges dynamiques dans les blocs Avant et Après impôts précisant la quote-part mensuelle et annuelle ajoutée.
  - Actualisation du bulletin de paie clarifié et du texte copié dans le presse-papier.

---

## [1.14.0] - 2026-11-03

### Demande de modification
> « en recliquant sur le bouton "12 mois" il n'y a pas de remise à 12 mois.
> Ajoute un curseur pour ajuster la part de cotisations salariales avec incrémentation de 1%.
> Sépare l'affichage du salaire net: montant avant impots et montant après impots
> corrige l'incohérence de l'affichage du salaire avant ou après impots, dans l'image fournie le montant est le même selon si on est avant ou après impots »

### Modifié
- **Séparation distincte de l'affichage du salaire net** :
  - **1. Salaire Net Avant Impôts** : bloc dédié mettant en valeur le montant contractuel (ex: 3 750 €/mois), le net annuel et le détail des cotisations salariales déduites.
  - **2. Salaire Net Après Impôts** : bloc dédié émeraude mettant en valeur le montant perçu en poche (ex: 3 308 €/mois), le prélèvement à la source (PAS) déduit avec boutons +/- 0,1% et les tickets restaurant.
- **Résolution de l'incohérence entre Avant et Après impôts** :
  - Activation effective par défaut du prélèvement à la source calculé selon le barème officiel de l'impôt sur le revenu (IR), évitant l'égalité trompeuse entre les deux montants.
- **Ajout d'un curseur pour la part de cotisations salariales** :
  - Nouveau curseur interactif de 15% à 35% avec pas de 1%, boutons d'incrémentation `[-] 1%` et `[+] 1%`, et saisie directe en %.
  - Préréglages automatiques : 24% pour Non-cadre et 25% pour Cadre.
- **Correction de la remise à 12 mois** :
  - La ligne de supplément du 13ème / 14ème mois est désormais strictement conditionnée à un choix supérieur à 12 mois (`monthsCount > 12`). Lors d'un clic sur « 12 mois », l'affichage repasse instantanément en configuration 12 mensualités standard.

---

## [1.13.0] - 2026-11-03

### Demande de modification
> « rollback la règle de calcul du 13ème et 14ème mois.
> Tu afficheras le montant net à payer après impots sur 12 mois par défaut.
> Tu ajouteras une ligne en dessous qui affichera le montant mensuel supplémentaire en cas de 13 ou 14 ème mois, ce montant sera égal à 1/12ème de salaire sur 12 mois »

### Modifié
- **Rollback de la règle de calcul du 13ème et 14ème mois** :
  - Suppression de la formule de division intermédiaire réinjectée dans le mensuel brut.
  - Rétablissement du calcul de salaire standard sur base 12 mois par défaut (`Salaire annuel / 12`).
- **Affichage du montant net à payer après impôts sur 12 mois par défaut** :
  - Le chiffre principal (hero KPI) de l'encadré « Résultat de la simulation » affiche désormais le salaire net après impôts sur 12 mois par défaut.
- **Ajout de la ligne dédiée sous le montant net** :
  - Une ligne spécifique est insérée directement sous le montant net à payer après impôts affichant :
    - Pour le 13ème mois : le montant mensuel supplémentaire égal à **1/12ème de salaire sur 12 mois** (`+X € / mois`).
    - Pour le 14ème mois : le montant mensuel supplémentaire égal à **2/12èmes de salaire sur 12 mois** (`+Y € / mois`).
- **Harmonisation générale** :
  - Mise à jour des explications et libellés sous le sélecteur « Nombre de mois de versement » (12, 13, 14 mois).
  - Décomposition adaptée dans le bulletin de paie clarifié et l'export de synthèse copiable.

---

## [1.12.0] - 2026-11-03

### Demande de modification
> « positionne la saisie de la part variable sous "statut professionnel" et é nombre de vmois de versement"
> règle de calcul du 13ème et 14ème mois:
> Il faut diviser le salaire brut annuel par le nombre de mois de versement. Avec le résultat obtenu, il faut diviser par 12 pour obtenir le montant mensuel brut avant impôts. le 13ème mois est alors égal au montant du salaire annuel brut saisi divisé par le montant mensuel brut obtenu juste avant. Il faut alors divisé ce 13ème mois par 12 et ajouter le résultat au mensuel brut. »

### Modifié
- **Repositionnement ergonomique de la part variable** :
  - Le bloc de saisie de la part variable annuelle (bonus sur objectifs / cadres) a été déplacé **SOUS** les sélecteurs « Statut professionnel » (Cadre / Non-cadre) et « Nombre de mois de versement » (12, 13, 14 mois).
- **Application de la règle de calcul du 13ème et 14ème mois** :
  - 1. Calcul de la mensualité contractuelle de base : `Salaire brut annuel / Nombre de mois` (ex: 60 000 € / 13 = 4 615 €).
  - 2. Calcul du montant de la prime de 13ème mois (et 14ème mois).
  - 3. Division de cette prime par 12 pour obtenir la quote-part mensuelle lissée (ex: 4 615 € / 12 = 385 € / mois).
  - 4. Ajout de cette quote-part au salaire mensuel brut pour obtenir le montant mensuel brut avant impôts complet (ex: 4 615 € + 385 € = 5 000 € / mois).
- **Affichage transparent et pédagogique** :
  - Ajout d'un encart explicatif détaillé sous les options de mensualités (12, 13, 14 mois) affichant les calculs intermédiaires en temps réel.
  - Décomposition claire dans le récapitulatif brut, la carte de résultat et le tableau du bulletin de paie clarifié.

---

## [1.11.0] - 2026-11-03

### Demande de modification
> « Précise oû coller la synthèse copiée via le bouton "Copier synthèse". »

### Ajouté
- **Guide interactif des destinations (« Où coller la synthèse ? »)** :
  - Intégration d'un bouton d'aide dédié `Où coller ?` dans la barre de navigation supérieure à côté du bouton `Copier synthèse`.
  - Création du composant `CopyDestinationModal` détaillant de manière exhaustive et illustrée les 4 grandes catégories de destinations professionnelles et personnelles :
    1. **E-mails RH, Recruteurs et Managers** (Gmail, Outlook, Apple Mail) pour les entretiens annuels, propositions contractuelles et négociations salariales.
    2. **Tableurs et Budgets** (Excel, Google Sheets, Calc) pour intégrer la simulation dans un plan financier prévisionnel ou un comparateur d'offres d'emploi.
    3. **Notes et Documents** (Notion, Obsidian, Apple Notes, Word, Google Docs) pour archiver ses simulations et suivre l'évolution de son package au fil du temps.
    4. **Messageries d'entreprise et privées** (Slack, Teams, WhatsApp) pour un échange direct et clair.
- **Rappels des raccourcis clavier et tactiles** :
  - Mention explicite de `Ctrl + V` (Windows / Linux), `⌘ Cmd + V` (macOS) et appui long tactile > `Coller` (iOS & Android).
- **Notification Toast contextuelle instantanée** :
  - Dès le clic sur « Copier synthèse », une bulle d'information apparaît directement sous le bouton pour rappeler instantanément les raccourcis et destinations recommandées, avec lien direct vers le guide complet.
- **Enrichissement du contenu exporté** :
  - Inclusion automatique des avantages du quotidien activés (titres-restaurant, abonnement transport en commun et mutuelle santé) dans le texte brut copié.

---

## [1.10.0] - 2026-11-03

### Demande de modification
> « Quand je clique sur le bouton "tout verser en cash" Il ne bascule pas en vert. Pour autant la bascule Tout placer sur PEE Et tout versé en cash fonctionne. Améliore la lisibilité des informations dans cet encadré. Minimise les sauts de ligne sur l'ensemble de l'application »

### Corrigé
- **Bouton « Tout verser en cash » actif en vert** : bascule dynamique de couleur verte (`bg-emerald-600`) et coche de validation lorsque l'ensemble des primes est orienté vers le versement bancaire direct, identique au comportement de « Tout placer sur PEE ».

### Amélioré
- **Refonte intégrale de l'encadré « Résultat de la simulation » (`ResultCard`)** :
  - Suppression de la grille interne étroite 2 colonnes qui écrasait les données et provoquait des chevauchements de chiffres (notamment le montant vert lissé sur les textes gris).
  - Disposition étagée verticale à haute lisibilité avec carte principale « Net en poche » et encart secondaire « Détail & Repères clés ».
  - Suppression des coupures de mots indésirables : « Salaire Net Après impôts », « Base brute : X € / mois » et le grand montant net ne cassent plus sur plusieurs lignes.
- **Minimisation globale des sauts de ligne sur toute l'application** : application de règles `whitespace-nowrap` sur l'ensemble des montants en euros, des fréquences temporelles (`/ mois`, `/ an`, `/ m`) et des pourcentages dans tous les composants de l'application.

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
