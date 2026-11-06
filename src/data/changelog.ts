/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ChangeEntry {
  type: 'feat' | 'fix' | 'refactor' | 'ux';
  description: string;
}

export interface VersionRelease {
  version: string;
  date: string;
  title: string;
  badge: 'Dernière version' | 'Majeure' | 'Évolution' | 'Correctif' | 'Initiale';
  userPrompt: string; // Demande originale de l'utilisateur
  summary: string;
  changes: ChangeEntry[];
  highlights: string[];
}

export const APP_VERSION = 'v1.25.0';
export const APP_RELEASE_DATE = '3 Novembre 2026';

export const CHANGELOG_DATA: VersionRelease[] = [
  {
    version: 'v1.25.0',
    date: '3 Novembre 2026',
    title: 'Séparation en 4 Encadrés Dédiés & Accordéon Généralisé (Bulletin, Arbitrage, Coût Employeur)',
    badge: 'Dernière version',
    userPrompt:
      'sépare en 2 encadrés les avantages et les impots et dote ces encadrés du même mécanisme de pliage/dépliage de même pour:\nl\'encadré "Bulletin de Paie Clarifié (Mensuel)"\net Arbitrage Epargne et coût total employeur. L\'encadré 2 deviendra Avantages sociaux, les impots en 3 et l\'épargne salariale en 4.',
    summary:
      'Scission de l\'ancien encadré combiné en deux encadrés autonomes avec accordéon (bouton chevron interactif) : l\'encadré 2 devient « 2. Avantages Sociaux » et l\'encadré 3 devient « 3. Impôt sur le Revenu (PAS) », l\'épargne salariale passant en encadré 4. Généralisation du mécanisme de pliage/dépliage à l\'ensemble des cartes de restitution : Bulletin de Paie Clarifié (Mensuel), Arbitrage Épargne Salariale et Coût Total Employeur (Super-Brut).',
    highlights: [
      'Encadré 2 indépendant : 2. Avantages Sociaux (Transports, Mutuelle santé, Titres-restaurant) avec repli/dépliage',
      'Encadré 3 indépendant : 3. Impôt sur le Revenu (PAS) avec badge du taux actif et accordéon fluide',
      'Encadré 4 renuméroté : 4. Épargne Salariale : Participation & Intéressement',
      'Généralisation du pliage/dépliage : Bulletin de Paie Clarifié, Arbitrage Épargne et Coût Total Employeur',
    ],
    changes: [
      {
        type: 'feat',
        description:
          'Séparation physique en 2 encadrés distincts : 2. Avantages Sociaux et 3. Impôt sur le Revenu (PAS), dotés chacun de leur propre accordéon de pliage/dépliage.',
      },
      {
        type: 'refactor',
        description:
          'Renumérotation ordonnée des 4 encadrés de gauche : 1. Salaire Brut -> 2. Avantages Sociaux -> 3. Impôt sur le Revenu -> 4. Épargne Salariale.',
      },
      {
        type: 'ux',
        description:
          'Ajout du mécanisme de pliage/dépliage uniforme avec bandeau cliquable et bouton chevron sur Bulletin de Paie Clarifié, Arbitrage Épargne Salariale et Coût Total Employeur.',
      },
    ],
  },
  {
    version: 'v1.24.0',
    date: '3 Novembre 2026',
    title: 'Pliage/Dépliage des Encadrés & Réordonnancement : Avantages Sociaux en Premier',
    badge: 'Évolution',
    userPrompt:
      'de la même manière que l\'encadré "2. impôts sur le revenu..." rend la possibilité de réduire les autres encadrés voir image.png\ndans l\'encadré "2. impôts sur le revenu..." inverse la partie impots avec la partie avantages qui doit se retrouver donc en premier.',
    summary:
      'Harmonisation ergonomique complète de la colonne de saisie : ajout du mécanisme de pliage/dépliage (accordéon avec bouton chevron) sur l\'encadré 1 (Salaire Brut Annuel & Statut) et l\'encadré 3 (Épargne Salariale : Participation & Intéressement) à l\'identique de l\'encadré 2. Dans l\'encadré 2, inversion des sous-sections pour afficher les Avantages du Quotidien (Transports, Mutuelle santé, Titres-restaurant) en premier, suivis du Prélèvement à la Source (PAS).',
    highlights: [
      'Encadré 1 (Salaire brut & Statut) pliable et dépliable avec rappel du brut mensuel visible en mode replié',
      'Encadré 3 (Épargne Salariale) pliable et dépliable avec bouton chevron et maintien du sélecteur d\'activation rapide',
      'Inversion dans l\'encadré 2 : les Avantages du Quotidien s\'affichent désormais en tête, avant l\'Impôt sur le Revenu',
      'Mise à jour des titres et sous-titres (« 2. Avantages Sociaux & Impôt sur le Revenu (PAS) »)',
    ],
    changes: [
      {
        type: 'feat',
        description:
          'Possibilité de replier ou déplier les encadrés 1 (Salaire Brut) et 3 (Épargne Salariale) grâce à un bouton chevron interactif et un bandeau d\'en-tête cliquable.',
      },
      {
        type: 'ux',
        description:
          'Conservation du résumé des valeurs clés dans l\'en-tête lorsque les encadrés sont repliés pour garder un repère visuel immédiat.',
      },
      {
        type: 'refactor',
        description:
          'Inversion de l\'ordre intérieur de l\'encadré 2 : les Avantages du Quotidien (Transports, Mutuelle santé, Titres-restaurant) sont présentés en première position, suivis du Prélèvement à la Source (PAS).',
      },
    ],
  },
  {
    version: 'v1.23.0',
    date: '3 Novembre 2026',
    title: 'Élargissement de la Colonne de Saisie & Refonte Spacieuse des Avantages du Quotidien',
    badge: 'Évolution',
    userPrompt: 'il faut élargir l\'affichage à gauche voir image.png pour avoir un affichage clair',
    summary:
      'Élargissement substantiel de la colonne de saisie à gauche (passage à 7 colonnes sur 12, soit ~58% de la largeur totale) et refonte ergonomique des 3 cartes d\'avantages du quotidien (Transports publics, Mutuelle santé, Titres-restaurant). Chaque libellé est désormais disposé au-dessus de sa commande, les champs de saisie s\'adaptent de façon fluide avec flex-1 sans déborder ni couper les boutons pas-à-pas (+/-), et tous les montants et pourcentages sont affichés sans aucun saut de ligne disgracieux.',
    highlights: [
      'Élargissement de la colonne de saisie à gauche à 7 colonnes sur 12 (lg:col-span-7 / xl:col-span-7 / 2xl:col-span-7)',
      'Refonte ergonomique des cartes Transports, Mutuelle et Titres-restaurant : libellés placés au-dessus pour éliminer tout retour à la ligne étriqué',
      'Champs de saisie fluides et adaptatifs avec flex-1, sans aucun débordement ni boutons coupés par la bordure de carte',
      'Boutons pas-à-pas confortables (w-8 h-8) avec retours haptiques visuels et alignement parfait des montants calculés',
    ],
    changes: [
      {
        type: 'ux',
        description:
          'Attribution de 7 colonnes sur 12 à la section de saisie pour un espace de travail élargi et confortable',
      },
      {
        type: 'refactor',
        description:
          'Réorganisation verticale des contrôles de saisie dans chaque carte d\'avantage pour une lisibilité parfaite',
      },
      {
        type: 'fix',
        description:
          'Suppression du débordement des boutons pas-à-pas et des césures de mots inopportunes dans les libellés',
      },
    ],
  },
  {
    version: 'v1.22.0',
    date: '3 Novembre 2026',
    title: 'Intégration des Avantages du Quotidien dans la Synthèse Nette, Élargissement de la Projection & Correction des Incrémentations',
    badge: 'Majeure',
    userPrompt:
      'prend en compte les avantages au quotidien dans la Synthèse Salariale Nette.\nconcernant la projection, Elargi l\'affichage de la page pour une meilleure clarté voir imagne.png ou bien trouve une autre astuce pour un meilleur affichage.\nLes incrémentations dans les champs de saisie dans les Avantages du quotidien ne fonctionnent pas',
    summary:
      'Prise en compte complète des avantages du quotidien dans la Synthèse Salariale Nette (ResultCard), affichant le virement bancaire effectif, le détail des prises en charge employeur et le pouvoir d\'achat net mensuel total. Élargissement complet de la page (conteneur max-w-[1600px] et colonnes équilibrées 50/50) avec double mode d\'affichage Cartes et Tableau comparatif pour la projection sur 5 ans. Correction définitive des incrémentations pas à pas (+/-) et suppression des conflits avec les flèches natives des champs de saisie des avantages du quotidien.',
    highlights: [
      'Intégration visible des avantages du quotidien dans la Synthèse Salariale Nette : Virement bancaire effectif, part salariale déduite, part employeur et pouvoir d\'achat net total',
      'Élargissement de la mise en page à max-w-[1600px] et rééquilibrage 50/50 des colonnes pour un confort de lecture optimal',
      'Nouvel affichage de la projection sur 5 ans : vue en Cartes spacieuses ou en Tableau comparatif synthétique ultra-lisible',
      'Correction intégrale des incrémentations dans les Avantages du quotidien : boutons pas-à-pas confortables et suppression des collisions avec les flèches natives de saisie',
    ],
    changes: [
      {
        type: 'feat',
        description:
          'Prise en compte des avantages au quotidien (Transports, Mutuelle santé, Titres-Restaurant) directement dans la Synthèse Salariale Nette',
      },
      {
        type: 'ux',
        description:
          'Élargissement du conteneur principal à 1600px et colonne de résultats équilibrée à 6 colonnes (50%)',
      },
      {
        type: 'feat',
        description:
          'Ajout d\'un commutateur de vue Cartes / Tableau comparatif pour la projection des augmentations sur 5 ans',
      },
      {
        type: 'fix',
        description:
          'Résolution des incrémentations (+/-) sur les champs de saisie des avantages sociaux (coût transport, mutuelle santé, valeur et nombre de tickets restaurant)',
      },
    ],
  },
  {
    version: 'v1.21.0',
    date: '3 Novembre 2026',
    title: '14ème Mois (Dénominateur 14) & Projection d\'Augmentations sur 5 Ans',
    badge: 'Majeure',
    userPrompt:
      'si 14ème mois est coché le calcul remplace celui du 13ème mois mais remplace 13ème mois par 14ème mois dans le calcul.\ndans l\'encadré "Montants Avant & Après impôts" rajoute une option pour calculer les augmentations annuelles pour se projeter dans l\'avenir.\ncette option sera la sélection d\'un pourcentage obtenue par année 1, puis nouveau % année 2 etc....vision sur 5 ans. L\'afficahge ne doit pas être surchargé.\ncette option est désactivée par défaut.',
    summary:
      'Mise à jour de la règle de calcul du 14ème mois : lorsque la case 14ème mois est cochée, le calcul remplace fidèlement celui du 13ème mois en appliquant un dénominateur de 14 (base (brut/14)×12 pour les mensualités régulières et lissage avec +2/12èmes). Ajout d\'une nouvelle fonctionnalité de projection sur 5 ans dans l\'encadré « Montants Avant & Après impôts », permettant de simuler l\'évolution de son salaire Net Avant & Après impôts selon le pourcentage d\'augmentation obtenu pour chaque année (année 1 à 5). L\'option est discrète, épurée et désactivée par défaut.',
    highlights: [
      'Règle 14ème mois stricte : le dénominateur de calcul passe à 14 (base (brut fixe / 14) × 12) et remplace le 13ème mois',
      'Projection sur 5 ans dans l\'encadré « Montants Avant & Après impôts » (désactivée par défaut)',
      'Ajustement pas à pas du pourcentage d\'augmentation pour chaque année individuelle (Année 1 à Année 5)',
      'Boutons d\'application rapide de presets (+1,5%, +2%, +2,5%, +3%, +5%)',
      'Affichage sobre et compact sans surcharger l\'interface : Net après impôts, Net avant impôts et gain mensuel par an',
      'Synthèse bilan de projection au terme de la 5ème année',
    ],
    changes: [
      {
        type: 'fix',
        description:
          'Application du dénominateur 14 au lieu de 13 dans le calcul du salaire régulier lors de l\'activation du 14ème mois',
      },
      {
        type: 'feat',
        description:
          'Création du composant YearlyProjection pour simuler les augmentations annuelles d\'année en année sur 5 ans',
      },
      {
        type: 'ux',
        description:
          'Interrupteur sobre et optionnel dans « Montants Avant & Après impôts », désactivé par défaut',
      },
      {
        type: 'refactor',
        description:
          'Passage en version v1.21.0 et synchronisation de la documentation des modifications',
      },
    ],
  },
  {
    version: 'v1.20.0',
    date: '3 Novembre 2026',
    title: 'Conditionnement Strict du Lissage des Primes & Suppression du Total Versement Ponctuel',
    badge: 'Évolution',
    userPrompt:
      'affiche le "Net mensuel lissé avec primes" uniquement si 13ème ou 14ème mois coché, sinon le montant se base sur le Salaire Net avant ou Après impôts.\nn\'affiche "Net mensuel lissé avec primes " que si l\'option "Lisser les montants versé sur 12 mois dans le net mensuel" est cochée.\nPar défaut l\'option "Lisser les montants versé sur 12 mois dans le net mensuel" est cochée.\nSupprime le total "Versement ponctuel" de la prime voir image.png',
    summary:
      'Le « Net mensuel lissé avec primes » est désormais conditionné de façon stricte à l\'activation de l\'option « Lisser les montants versés sur 12 mois dans le net mensuel » (cochée par défaut). Lorsque le 13ème ou 14ème mois est coché, il s\'ajoute au Net lissé du mois correspondant ; sinon, le montant lissé se base directement sur le Salaire Net Avant et Après impôts contractuel. Suppression complète du bloc et du badge « Versement ponctuel » de la prime sous la carte résultat.',
    highlights: [
      'Affichage conditionnel strict : « Net mensuel lissé avec primes » n\'apparaît que si l\'option de lissage est cochée',
      'Option de lissage de la prime cochée par défaut dans l\'état initial et lors de la remise à zéro',
      'Calcul adapté : ajout au Net lissé 13e/14e si coché, ou calculé directement sur le Salaire Net Avant et Après impôts sinon',
      'Suppression intégrale du bloc récapitulatif « Versement ponctuel » en pied de carte résultat',
      'Synchronisation du résumé copié dans le presse-papier avec les montants lissés',
    ],
    changes: [
      {
        type: 'feat',
        description:
          'Conditionnement strict de l\'affichage de « Net mensuel lissé avec primes » à la coche de l\'option de lissage sur 12 mois',
      },
      {
        type: 'refactor',
        description:
          'Activation par défaut de l\'option « Lisser les montants versés sur 12 mois dans le net mensuel » (smoothBonuses: true)',
      },
      {
        type: 'feat',
        description:
          'Calcul du Net mensuel lissé avec primes basé sur le Salaire Net Avant et Après impôts lorsque le 13e/14e mois n\'est pas coché',
      },
      {
        type: 'ux',
        description:
          'Suppression définitive du total et du badge « Versement ponctuel » sous la carte résultat',
      },
    ],
  },
  {
    version: 'v1.19.0',
    date: '3 Novembre 2026',
    title: 'Suppression Doublon Primes Lissées, Lissage Différencié 14e Mois & Préréglages par Défaut',
    badge: 'Évolution',
    userPrompt:
      'supprime l\'affichage de l\'un des deux "Net mensuel lissé avec primes :" voir image image.png\nDans la partie "1. Salaire Net Avant impôts" le montant "Net mensuel lissé avec 14ème mois " est inchangé selon si 13ème mois ou 14ème mois est coché. idem dans la partie "2. Salaire Net Après impôts" -> revoit ton calcul\npar défaut l\'affichage doit être:\nSalaire brut fixe annuel = 60000\nStatut professionnel = cadre\n13ème & 14ème mois (Optionnel) = 13ème mois coché\nPAS activé et taux en % = 4,6\nÉpargne Salariale : Participation & Intéressement = 5000 pour Participation Annuelle et 5000 pour Intéressement Annuel les deux en versement sur le compte.',
    summary:
      'Suppression du doublon d\'affichage de la ligne « Net mensuel lissé avec primes » en bas de la carte résultat. Correction du calcul de lissage pour le 14ème mois (+2/12èmes de salaire au lieu de +1/12ème), permettant de bien différencier les montants lissés avant et après impôts entre le 13ème et le 14ème mois. Initialisation de l\'application et du bouton de remise à zéro avec les valeurs demandées par défaut : 60 000 € brut annuel, statut cadre, 13ème mois coché, PAS à 4,6% et 5 000 € chacun pour la participation et l\'intéressement en versement direct sur le compte bancaire.',
    highlights: [
      'Suppression du doublon « Net mensuel lissé avec primes » au pied de la carte résultat',
      'Calcul différencié du 14ème mois : +2/12èmes de salaire mensuel net lissés (+577 €/m avant impôts et +550 €/m après impôts)',
      'Préréglages par défaut : 60 000 € brut, statut Cadre, 13ème mois coché, PAS à 4,6% (-159 €/m)',
      'Primes d\'épargne salariale par défaut : 5 000 € de participation et 5 000 € d\'intéressement en versement direct (9 047 € nets/an, soit +754 €/m)',
      'Net mensuel lissé avec primes conforme : 4 331 €/m (13e mois) et 4 606 €/m (14e mois)',
    ],
    changes: [
      {
        type: 'ux',
        description:
          'Suppression du doublon d\'affichage du Net mensuel lissé avec primes en pied de la carte résultat',
      },
      {
        type: 'fix',
        description:
          'Différenciation effective du lissage du 14ème mois (+2/12èmes) par rapport au 13ème mois (+1/12ème)',
      },
      {
        type: 'feat',
        description:
          'Configuration des valeurs par défaut exactes demandées (60 000 € brut, cadre, 13e mois, PAS 4,6%, participation 5 000 €, intéressement 5 000 € en versement)',
      },
      {
        type: 'refactor',
        description:
          'Passage en version v1.19.0 et synchronisation du journal de versions',
      },
    ],
  },
  {
    version: 'v1.18.0',
    date: '3 Novembre 2026',
    title: 'Harmonisation des Libellés de Lissage & Primes Ajoutées au Net Lissé 13e/14e Mois',
    badge: 'Évolution',
    userPrompt:
      'remplace "Net mensuel lissé avant impôts (13ème mois) :" par "Net mensuel lissé avec 13ème mois :" -> variable selon 13ème ou 14ème mois coché.\nremplace "Net mensuel lissé après impôts (13ème mois) :" par "Net mensuel lissé 13ème mois :" -> variable selon 13ème ou 14ème mois coché.\nle "Net mensuel lissé avec primes" doit être ajouté au "Net mensuel lissé après impôts (13ème mois) :" ou "Net mensuel lissé après impôts (14ème mois) :" si coche correspondante cochée.',
    summary:
      'Mise à jour des libellés de lissage : « Net mensuel lissé avec 13ème mois : » (ou 14ème mois) pour la partie avant impôts et « Net mensuel lissé 13ème mois : » (ou 14ème mois) pour la partie après impôts. Intégration du calcul : lorsque la case 13ème ou 14ème mois est cochée, le montant du « Net mensuel lissé avec primes » est désormais ajouté directement au Net mensuel lissé 13ème/14ème mois après impôts.',
    highlights: [
      'Libellé avant impôts actualisé : « Net mensuel lissé avec 13ème mois : » (ou 14ème mois)',
      'Libellé après impôts actualisé : « Net mensuel lissé 13ème mois : » (ou 14ème mois)',
      'Règle de cumul : le Net mensuel lissé avec primes prend pour base le Net lissé du 13e/14e mois et y ajoute les primes de participation/intéressement lissées',
      'Affichage contextuel direct dans l\'encart du 13ème/14ème mois et dans le récapitulatif global',
      'Synchronisation du bulletin clarifié et de la synthèse copiée dans le presse-papier',
    ],
    changes: [
      {
        type: 'ux',
        description:
          'Harmonisation des intitulés de lissage : « Net mensuel lissé avec 13ème mois : » avant impôts et « Net mensuel lissé 13ème mois : » après impôts',
      },
      {
        type: 'feat',
        description:
          'Calcul du « Net mensuel lissé avec primes » ajouté au Net mensuel lissé 13ème ou 14ème mois après impôts si la coche est active',
      },
      {
        type: 'ux',
        description:
          'Affichage enrichi dans l\'encart de lissage après impôts avec la quote-part de primes détaillée',
      },
      {
        type: 'refactor',
        description:
          'Mise à jour du format d\'export de synthèse et incrémentation de version vers v1.18.0',
      },
    ],
  },
  {
    version: 'v1.17.0',
    date: '3 Novembre 2026',
    title: '13ème Mois Compris dans le Brut Annuel : Base (Brut/13)*12 & Lissage +1/12e',
    badge: 'Évolution',
    userPrompt:
      "tu as ajouté le 13 ème mois alors qu'il est compris dans le salaire brut fixe annuel. Ce 13ème mois est un salaire un versement unique sur l'année en une fois. La demande est:\n1/ Calcule et affiche le 1. Salaire Net Avant impôts et le 2. Salaire Net Après impôts sur la base de (Salaire brut fixe annuel/13)*12 en déduisant les Cotisations salariales et le PAS si activé.\n2/ le lissage ajouté précédemment doit être: la même règle que le point 1/ en ajoutant 1/12 de salaire mensuel. Fait le calcul pour la partie avant et après impots",
    summary:
      "Intégration de la règle de versement unique : le 13ème mois est compris dans le salaire brut fixe annuel. Les montants 1. Salaire Net Avant impôts et 2. Salaire Net Après impôts sont calculés sur la base régulière de (Salaire brut fixe annuel / 13) * 12 en déduisant les cotisations salariales et le prélèvement à la source (PAS). Le lissage mensuel applique cette même règle en y ajoutant 1/12ème de salaire mensuel net avant et après impôts.",
    highlights: [
      'Calcul régulier 1. Salaire Net Avant impôts sur base (brut annuel / 13) * 12 déduit des cotisations salariales',
      'Calcul régulier 2. Salaire Net Après impôts déduit du prélèvement à la source (PAS) et des tickets restaurant',
      'Lissage avant impôts : règle de base + 1/12ème de salaire mensuel avant impôts',
      'Lissage après impôts : règle de base + 1/12ème de salaire mensuel après impôts',
      'Prise en compte symétrique pour l\'option 14ème mois sur base (brut / 14) * 12 et +2/12èmes de salaire mensuel',
      'Mise à jour du bulletin de paie clarifié et du texte copié dans le presse-papier',
    ],
    changes: [
      {
        type: 'feat',
        description:
          'Calcul du salaire net mensuel régulier sur base (Salaire brut fixe annuel / 13) * 12 déduit des cotisations et du PAS',
      },
      {
        type: 'feat',
        description:
          'Calcul du lissage mensuel net avant et après impôts en ajoutant 1/12ème de salaire mensuel à la mensualité régulière',
      },
      {
        type: 'ux',
        description:
          'Affichage didactique des formules (brut/13)*12 et +1/12e de salaire mensuel dans les cartes de résultat et la saisie',
      },
      {
        type: 'refactor',
        description:
          'Synchronisation de l\'export de synthèse copié et de la table du bulletin clarifié',
      },
    ],
  },
  {
    version: 'v1.16.0',
    date: '3 Novembre 2026',
    title: 'Suppression Déduction Mois Supplémentaires & Lissage Net Avant/Après Impôts',
    badge: 'Évolution',
    userPrompt:
      "supprime la fonction de Mois supplémentaires\najoute l'affichage du lissage du salaire net mensuel avant et après impots dans le cas du 13ème ou 14ème mois activé",
    summary:
      "Suppression intégrale de la fonction de déduction de mois supplémentaires sur le salaire de base : le salaire net mensuel avant et après impôts affiche la rémunération contractuelle standard sur 12 mois. Ajout d'un affichage distinct et explicite du lissage du salaire net mensuel avant et après impôts lorsque le 13ème ou 14ème mois est activé.",
    highlights: [
      'Suppression de la déduction des mois supplémentaires sur le salaire mensuel de base',
      'Affichage du salaire net contractuel de référence sur 12 mois (avant et après impôts)',
      'Affichage dynamique du lissage du salaire net mensuel avant impôts (+ quote-part lissée du 13e/14e mois)',
      'Affichage dynamique du lissage du salaire net mensuel après impôts (+ quote-part lissée du 13e/14e mois)',
      'Mise à jour synchronisée du bulletin de paie clarifié et de la synthèse exportée',
    ],
    changes: [
      {
        type: 'refactor',
        description:
          'Suppression définitive de la déduction de mois supplémentaires sur le salaire net de base',
      },
      {
        type: 'feat',
        description:
          'Ajout de l\'encart de lissage du salaire net mensuel avant impôts lors de l\'activation du 13e/14e mois',
      },
      {
        type: 'feat',
        description:
          'Ajout de l\'encart de lissage du salaire net mensuel après impôts lors de l\'activation du 13e/14e mois',
      },
      {
        type: 'ux',
        description:
          'Mise à jour du bulletin de paie et du résumé copiable dans le presse-papier avec les montants lissés',
      },
    ],
  },
  {
    version: 'v1.15.0',
    date: '3 Novembre 2026',
    title: 'Cases à Cocher 13ème & 14ème Mois (+1/12e & +2/12e de Brut Ajoutés au Net)',
    badge: 'Évolution',
    userPrompt:
      'remplace totalement la fonctionnalité de Nombre de mois de versement par la règle suivante:\nCase à cocher 13ème mois + case à cocher 14 ème mois.\nSi case à cocher 13ème mois = cochée: ajoute au Salaire Net Avant et après impôts le 1/12ème de salaire brut annuel et si 14ème mois = cochée ajoute 2/12 etc....',
    summary:
      'Remplacement intégral de l\'ancien sélecteur de nombre de mois par deux cases à cocher exclusives et intuitives : « 13ème mois » et « 14ème mois ». Application stricte de la règle de calcul : l\'activation du 13ème mois ajoute directement 1/12ème du salaire brut annuel au Salaire Net Avant impôts et au Salaire Net Après impôts ; l\'activation du 14ème mois ajoute 2/12èmes. Intégration en temps réel des montants ajoutés dans les indicateurs mensuels et annuels.',
    highlights: [
      'Suppression intégrale du sélecteur à boutons 12/13/14 mois au profit de deux cases à cocher indépendantes',
      'Règle de calcul : 13ème mois coché = +1/12ème de salaire brut annuel ajouté directement au Net Avant et Après impôts',
      '14ème mois coché = +2/12èmes de salaire brut annuel ajoutés directement au Net Avant et Après impôts',
      'Gestion ergonomique cohérente : cocher le 14ème mois active le 13ème mois ; décocher le 13ème mois décoche le 14ème mois',
      'Affichage transparent dans le résultat, le bulletin de paie et la synthèse exportée',
    ],
    changes: [
      {
        type: 'refactor',
        description:
          'Remplacement complet du composant de sélection du nombre de mois de versement par deux cases à cocher',
      },
      {
        type: 'feat',
        description:
          'Ajout automatique de 1/12ème (13e mois) ou 2/12èmes (14e mois) de salaire brut annuel au Salaire Net Avant et Après impôts',
      },
      {
        type: 'ux',
        description:
          'Badges dynamiques affichant la quote-part mensuelle et annuelle exacte ajoutée (+X €/an, +X €/mois)',
      },
      {
        type: 'ux',
        description:
          'Mise à jour synchronisée du bulletin de paie et du texte copié dans le presse-papier',
      },
    ],
  },
  {
    version: 'v1.14.0',
    date: '3 Novembre 2026',
    title: 'Séparation Net Avant/Après Impôts, Curseur Cotisations 1% & Réactivité 12 Mois',
    badge: 'Évolution',
    userPrompt:
      'en recliquant sur le bouton "12 mois" il n\'y a pas de remise à 12 mois.\nAjoute un curseur pour ajuster la part de cotisations salariales avec incrémentation de 1%.\nSépare l\'affichage du salaire net: montant avant impots et montant après impots\ncorrige l\'incohérence de l\'affichage du salaire avant ou après impots, dans l\'image fournie le montant est le même selon si on est avant ou après impots',
    summary:
      'Séparation claire en deux blocs dédiés pour le Salaire Net Avant impôts et le Salaire Net Après impôts. Résolution de l\'incohérence d\'égalité des montants en activant le prélèvement à la source (PAS) automatique par défaut. Ajout d\'un curseur de cotisations salariales ajustable de 15% à 35% avec pas de 1%. Correction de la remise à zéro visuelle lors du clic sur le bouton 12 mois (suppression de l\'affichage inconditionnel de la ligne 13ème mois).',
    highlights: [
      'Séparation distincte et soignée en 2 blocs : 1. Salaire Net Avant impôts (contractuel) & 2. Salaire Net Après impôts (en poche)',
      'Correction de l\'incohérence : le Net après impôt déduit désormais le PAS réel calculé selon le barème officiel, différenciant nettement les 2 montants',
      'Curseur interactif de cotisations salariales avec pas de 1% (+/- 1% et champ direct)',
      'Correction du bouton 12 mois : suppression immédiate de la ligne de supplément 13ème mois lorsqu\'on repasse à 12 mois',
    ],
    changes: [
      {
        type: 'ux',
        description:
          'Séparation visuelle et typographique complète du montant Avant impôts et du montant Après impôts',
      },
      {
        type: 'fix',
        description:
          'Correction de l\'incohérence d\'affichage en activant le calcul effectif du prélèvement à la source par défaut',
      },
      {
        type: 'feat',
        description:
          'Curseur interactif d\'ajustement des cotisations salariales avec incrémentation de 1% (15% à 35%)',
      },
      {
        type: 'fix',
        description:
          'Correction de la réactivité du bouton 12 mois avec affichage conditionnel strict des suppléments de 13e/14e mois',
      },
    ],
  },
  {
    version: 'v1.13.0',
    date: '3 Novembre 2026',
    title: 'Net sur 12 Mois par Défaut & Ligne Supplément 1/12ème pour 13e/14e Mois',
    badge: 'Évolution',
    userPrompt:
      'rollback la règle de calcul du 13ème et 14ème mois.\nTu afficheras le montant net à payer après impots sur 12 mois par défaut.\nTu ajouteras une ligne en dessous qui affichera le montant mensuel supplémentaire en cas de 13 ou 14 ème mois, ce montant sera égal à 1/12ème de salaire sur 12 mois',
    summary:
      'Rollback de la règle de calcul complexe du 13e/14e mois. Le montant net à payer après impôts affiché par défaut est désormais calculé sur 12 mois. Une ligne dédiée située juste en dessous affiche clairement le montant mensuel supplémentaire en cas de 13ème ou 14ème mois, égal à 1/12ème de salaire sur 12 mois.',
    highlights: [
      'Montant net à payer après impôts calculé sur 12 mois par défaut comme référence principale',
      'Ligne dédiée sous le montant net affichant le supplément mensuel (+1/12ème du salaire sur 12 mois pour le 13e mois, +2/12èmes pour le 14e mois)',
      'Rollback complet de la division complexe réinjectée dans le mensuel brut',
      'Harmonisation pédagogique dans la saisie, le résultat principal, le bulletin clarifié et l\'export de synthèse',
    ],
    changes: [
      {
        type: 'refactor',
        description:
          'Rollback de l\'ancienne règle de calcul du 13ème et 14ème mois au profit de la base 12 mois standard',
      },
      {
        type: 'feat',
        description:
          'Affichage par défaut du montant net à payer après impôts sur 12 mois',
      },
      {
        type: 'feat',
        description:
          'Ajout d\'une ligne dédiée affichant le montant mensuel supplémentaire égal à 1/12ème de salaire sur 12 mois',
      },
      {
        type: 'ux',
        description:
          'Synchronisation des mentions explicatives et de l\'export de synthèse copié',
      },
    ],
  },
  {
    version: 'v1.12.0',
    date: '3 Novembre 2026',
    title: 'Repositionnement Part Variable & Règle de Calcul 13ème / 14ème Mois',
    badge: 'Évolution',
    userPrompt:
      'positionne la saisie de la part variable sous "statut professionnel" et é nombre de vmois de versement"\nrègle de calcul du 13ème et 14ème mois:\nIl faut diviser le salaire brut annuel par le nombre de mois de versement. Avec le résultat obtenu, il faut diviser par 12 pour obtenir le montant mensuel brut avant impôts. le 13ème mois est alors égal au montant du salaire annuel brut saisi divisé par le montant mensuel brut obtenu juste avant. Il faut alors divisé ce 13ème mois par 12 et ajouter le résultat au mensuel brut.',
    summary:
      'Repositionnement de la part variable sous les blocs Statut professionnel et Nombre de mois de versement. Intégration de la règle de calcul du 13ème et 14ème mois : mensualité de base = salaire brut annuel / mois, prime de 13ème mois divisée par 12, et ajout au salaire mensuel brut pour obtenir le montant mensuel brut avant impôts lissé.',
    highlights: [
      'Saisie de la part variable repositionnée SOUS le statut professionnel et le nombre de mensualités',
      'Règle de calcul du 13e/14e mois intégrée : mensualité de base (ex: 4 615 €) + quote-part de prime lissée (385 €/m) = 5 000 €/mois brut avant impôt',
      'Affichage détaillé et pédagogique de la décomposition du 13ème mois dans la saisie, le résultat et le bulletin de paie',
      'Export de synthèse enrichi avec le détail de la mensualité de base et de la prime de 13ème mois',
    ],
    changes: [
      {
        type: 'ux',
        description:
          'Déplacement du bloc de saisie de la part variable sous « Statut professionnel » et « Nombre de mois de versement »',
      },
      {
        type: 'feat',
        description:
          'Application de la règle de calcul du 13ème et 14ème mois (mensualité de base + 13ème mois divisé par 12)',
      },
      {
        type: 'ux',
        description:
          'Encart pédagogique interactif affichant le calcul pas à pas du 13ème mois sous les options 12, 13 et 14 mois',
      },
      {
        type: 'refactor',
        description:
          'Passage en version v1.12.0 et mise à jour de la documentation dans CHANGELOG.md',
      },
    ],
  },
  {
    version: 'v1.11.0',
    date: '3 Novembre 2026',
    title: "Guide et Précisions d'Utilisation : Où et Comment Coller la Synthèse",
    badge: 'Évolution',
    userPrompt: 'Précise oû coller la synthèse copiée via le bouton "Copier synthèse".',
    summary:
      "Ajout d'indications explicites et d'un guide interactif détaillant où coller la synthèse copiée dans le presse-papier (e-mails RH pour négociation salariale, tableurs Excel/Google Sheets pour budget, notes Notion/Word, messageries professionnelles) avec raccourcis clavier associés et notification informative au clic.",
    highlights: [
      "Bouton d'aide direct « Où coller ? » intégré dans le header à côté du bouton de copie",
      "Notification contextuelle dynamique dès la copie avec rappel des raccourcis (Ctrl+V / ⌘V) et des destinations clés",
      "Modal interactive « Où coller la synthèse ? » détaillant les 4 usages professionnels et personnels ainsi que le contenu exact du presse-papier",
      "Enrichissement du résumé copié pour inclure le détail des avantages du quotidien activés (tickets resto, transports, mutuelle)",
    ],
    changes: [
      {
        type: 'feat',
        description:
          "Création de la modale interactive d'aide CopyDestinationModal et du bouton « Où coller ? » dans le Header",
      },
      {
        type: 'ux',
        description:
          "Notification toast contextuelle lors du clic « Copier synthèse » précisant les destinations et raccourcis clavier",
      },
      {
        type: 'feat',
        description:
          "Enrichissement du format texte exporté avec les données des titres-restaurant, transports publics et mutuelle santé",
      },
      {
        type: 'refactor',
        description:
          'Passage en version v1.11.0 et synchronisation complète de la documentation CHANGELOG.md',
      },
    ],
  },
  {
    version: 'v1.10.0',
    date: '3 Novembre 2026',
    title: "Bouton 'Tout verser en cash' Actif en Vert & Refonte Lisibilité Anti-Coupure",
    badge: 'Évolution',
    userPrompt:
      "Quand je clique sur le bouton \"tout verser en cash\" Il ne bascule pas en vert. Pour autant la bascule Tout placer sur PEE Et tout versé en cash fonctionne.\nAméliore la lisibilité des informations dans cet encadré. \nMinimise les sauts de ligne sur l'ensemble de l'application",
    summary:
      "Correction de l'indicateur visuel vert sur le bouton « Tout verser en cash » dans l'arbitrage d'épargne salariale. Restructuration complète de l'encadré Résultat de la simulation pour supprimer les collisions de texte et minimisation systématique des sauts de ligne orphelins.",
    highlights: [
      "Le bouton « Tout verser en cash » bascule fidèlement en vert avec coche de validation lorsqu'activé",
      "Refonte de l'encadré Résultat : fin des colonnes étroites écrasées, mise en page étagée et fin des chevauchements de chiffres",
      "Élimination des sauts de ligne incongrus (/ mois, / an, montants coupés) sur tous les composants",
    ],
    changes: [
      {
        type: 'fix',
        description:
          "Bascule en vert du bouton « Tout verser en cash » en synchronisation avec le statut d'arbitrage",
      },
      {
        type: 'ux',
        description:
          "Refonte ergonomique de l'encadré Résultat de la simulation pour une lisibilité optimale sans texte superposé",
      },
      {
        type: 'ux',
        description:
          "Sécurisation anti-coupure (whitespace-nowrap) sur les montants, devises et fréquences dans toute l'interface",
      },
      {
        type: 'refactor',
        description:
          'Passage en version v1.10.0 et documentation CHANGELOG.md synchronisée',
      },
    ],
  },
  {
    version: 'v1.9.0',
    date: '30 Octobre 2026',
    title: "Désactivation par Défaut de l'IR et des Avantages & Correctif Typographique",
    badge: 'Évolution',
    userPrompt:
      "mets les Avantages du quotidien et l'impôt à la source désactivés par défaut. \nModifie l'orthographe de \"Activer l'épargne salariale\" voir screenshot .",
    summary:
      "Désactivation par défaut de l'impôt sur le revenu (PAS) et de l'ensemble des avantages sociaux (titres-restaurant, transports, mutuelle) pour un démarrage net et direct. Correction typographique de l'apostrophe dans le libellé « Activer l'épargne salariale ».",
    highlights: [
      "Impôt à la source désactivé par défaut (Net avant impôt = Net après impôt à l'initialisation)",
      "Avantages du quotidien désactivés par défaut (titres-restaurant, abonnement transport, mutuelle santé)",
      "Nouvel interrupteur global pour activer/désactiver tous les avantages sociaux en un clic",
      "Correction de l'entité d'échappement &apos; sur le bouton « Activer l'épargne salariale »",
    ],
    changes: [
      {
        type: 'feat',
        description:
          "Impôt à la source (PAS) désactivé par défaut avec carte d'état inactive et réactivation rapide en 1 clic",
      },
      {
        type: 'feat',
        description:
          "Avantages du quotidien désactivés par défaut (tickets resto, transports, mutuelle) avec interrupteur général",
      },
      {
        type: 'fix',
        description:
          "Correction du rendu de l'apostrophe dans le texte du toggle « Activer l'épargne salariale »",
      },
      {
        type: 'refactor',
        description:
          'Passage en version v1.9.0 et synchronisation de la documentation CHANGELOG.md',
      },
    ],
  },
  {
    version: 'v1.8.0',
    date: '30 Octobre 2026',
    title: "Avertissement Légal & Prévalence d'Entreprise dans le Header",
    badge: 'Évolution',
    userPrompt:
      "Précise dans le header que les chiffres sont purement à titre indicatif et seule la fiche de paye et même si les calculs sont basés sur des barèmes officiels, seules les règles de l'entreprise prévalent sur les projections affichées dans l'application et aucun chiffre annoncé ici ne peut les contredire..",
    summary:
      "Intégration d'un bandeau d'avertissement officiel permanent dans l'en-tête (Header) rappelant le caractère strictement indicatif des simulations, la valeur juridique exclusive du bulletin de paie et la primauté absolue des accords et règles d'entreprise sur toute projection.",
    highlights: [
      "Bandeau d'avertissement fixé directement sous la barre de navigation du header",
      "Mention explicite du caractère purement indicatif des estimations et de l'autorité exclusive de la fiche de paie",
      "Rappel que les règles et accords de l'entreprise prévalent sur toute projection de l'application",
    ],
    changes: [
      {
        type: 'feat',
        description:
          "Intégration de la mention d'avertissement légal et indicatif dans le header",
      },
      {
        type: 'ux',
        description:
          "Affichage haute lisibilité ambré avec icône d'alerte, visible en continu sans perturber la navigation",
      },
      {
        type: 'refactor',
        description:
          'Incrémentation de version vers v1.8.0 et synchronisation du journal des modifications',
      },
    ],
  },
  {
    version: 'v1.7.0',
    date: '30 Octobre 2026',
    title: 'Module Changelog & Gestion du Versioning',
    badge: 'Évolution',
    userPrompt: 'créer un changelog avec récapitulatif des demandes de modifications et gère le versioning.',
    summary:
      'Mise en place d\'un module interactif de suivi des versions (SemVer) avec historique chronologique complet des demandes de modifications, recherche et affichage transparent de l\'évolution de l\'application.',
    highlights: [
      'Historique complet des 7 itérations depuis la création initiale',
      'Modal interactif avec recherche, filtres et détail des demandes utilisateur',
      'Badge de version v1.7.0 cliquable dans l\'en-tête et le pied de page',
      'Documentation CHANGELOG.md à la racine du projet',
    ],
    changes: [
      {
        type: 'feat',
        description: 'Création du centre de versioning et changelog visuel interactif',
      },
      {
        type: 'feat',
        description: 'Badge de version dans le header avec accès direct au journal des modifications',
      },
      {
        type: 'feat',
        description: 'Génération du fichier de documentation CHANGELOG.md selon les standards Keep a Changelog',
      },
      {
        type: 'ux',
        description: 'Possibilité de filtrer et copier la synthèse des versions',
      },
    ],
  },
  {
    version: 'v1.6.0',
    date: '30 Octobre 2026',
    title: 'Épargne Salariale Activable, Brut à 0 € & Tickets Restaurant',
    badge: 'Évolution',
    userPrompt:
      'rend activable ou désactivable et adapte les calculs en fonction du choix de la partie "Épargne Salariale : Participation & Intéressement" et met la valeur par défaut à 0€ pour les 2. Mets à 0€ la valeur de Salaire brut fixe annuel. Ajoute une fonction "Tickets restaurant" avec la possibilité de saisir le montant du ticket et le pourcentage de prise en charge employeur. Déduis la part employé du montant du salaire net après impôts',
    summary:
      'Refonte de l\'épargne salariale pour devenir optionnelle avec montants à 0 €, remise à zéro du brut initial, et calcul fiscal strict des tickets restaurant déduits du Salaire Net Après impôts.',
    highlights: [
      'Section Épargne Salariale activable/désactivable avec recalcul instantané',
      'Participation et Intéressement initialisés à 0 €',
      'Salaire brut fixe annuel démarrant à 0 € avec slider fluide',
      'Module Tickets Restaurant complet (montant, % employeur) et déduction de la part salarié du Net Après impôts',
    ],
    changes: [
      {
        type: 'feat',
        description: 'Ajout d\'un interrupteur toggle on/off sur la section Épargne Salariale',
      },
      {
        type: 'refactor',
        description: 'Valeur par défaut du brut fixe annuel passée à 0 € (dans l\'état et le reset)',
      },
      {
        type: 'feat',
        description: 'Nouveau formulaire Tickets restaurant avec saisie libre du montant unitaire et boutons rapides 50% / 60%',
      },
      {
        type: 'fix',
        description: 'Déduction comptable directe de la part salarié des tickets restaurant du Salaire Net Après impôts',
      },
    ],
  },
  {
    version: 'v1.5.0',
    date: '30 Octobre 2026',
    title: 'Harmonisation du Taux des Cotisations Non-Cadre à 24%',
    badge: 'Correctif',
    userPrompt: 'applique 24% à Cotisations salariales estimées à ~22% (taux moyen conventionnel du secteur privé).',
    summary:
      'Mise à niveau du barème des cotisations salariales conventionnelles pour le statut non-cadre de 22% à 24%.',
    highlights: [
      'Taux de cotisations salariales non-cadre réévalué à 24%',
      'Actualisation des explications légales et des totaux de cotisations du bulletin',
    ],
    changes: [
      {
        type: 'fix',
        description: 'Remplacement du taux salarial 0.22 par 0.24 pour le statut non-cadre',
      },
      {
        type: 'ux',
        description: 'Mise à jour des mentions informatives sous le sélecteur de statut et sur le bulletin clarifié',
      },
    ],
  },
  {
    version: 'v1.4.0',
    date: '30 Octobre 2026',
    title: 'Réorganisation des Étapes & Avantages Employeur Modifiables',
    badge: 'Évolution',
    userPrompt:
      'fais passer en 2ème position l\'encadré N°3 et puisque les améliorations sont en place, supprime la notion "Amélioration appliquée". ajoute la possibilité de modifier la prise en charge du montant employeur concernant les transports publics et le montant de la part employeur de la mutuelle santé',
    summary:
      'Réordonnancement logique des blocs de saisie, suppression des libellés temporaires et personnalisation avancée des prises en charge employeur pour les transports et la mutuelle.',
    highlights: [
      'Nouvel ordre logique : 1. Brut & Statut → 2. IR & Avantages Sociaux → 3. Épargne Salariale',
      'Nettoyage des tags "Amélioration appliquée" pour une interface de production pérenne',
      'Remboursement transport personnalisable en % (50% légal, 75%, 100%)',
      'Part employeur de la mutuelle santé modifiable avec impact sur le net fiscal et super-brut',
    ],
    changes: [
      {
        type: 'ux',
        description: 'Section 2 déplacée pour regrouper le Prélèvement à la Source et les avantages sociaux',
      },
      {
        type: 'refactor',
        description: 'Suppression définitive des mentions textuelles "Amélioration appliquée"',
      },
      {
        type: 'feat',
        description: 'Saisie et boutons rapides pour le taux de prise en charge transport employeur',
      },
      {
        type: 'feat',
        description: 'Double saisie salariale et patronale pour la mutuelle d\'entreprise',
      },
    ],
  },
  {
    version: 'v1.3.0',
    date: '30 Octobre 2026',
    title: 'Affichage du Variable dans le Résultat & Fiscalité des Primes',
    badge: 'Évolution',
    userPrompt:
      'Applique les améliorations 1 et 2. Ajoute le montant du variable dans l\'encadré "Résultat de la simulation". Supprime le taux marginal d\'imposition des "Participation & Intéressement" dans le calcul "Net touché en direct :". Pourquoi le Net viré en banque (Après impôts) et le Net direct après impôts dans l\'encadré Résultat de la simulation sont différents.',
    summary:
      'Intégration du bonus variable dans l\'encadré de résultat, suppression de la retenue fiscale TMI sur le versement immédiat des primes et explicitation de la différence avec le virement bancaire.',
    highlights: [
      'Montant du variable mis en exergue dans le résultat (+X €/mois)',
      'Calcul du net direct des primes sans prélèvement de TMI (uniquement CSG/CRDS 9,7%)',
      'Explicitation didactique de l\'écart entre le Net après impôts contractuel et le virement bancaire effectif',
    ],
    changes: [
      {
        type: 'feat',
        description: 'Ajout de la ligne dédiée au variable cadre dans l\'encadré principal de résultat',
      },
      {
        type: 'fix',
        description: 'Suppression de la déduction du TMI sur le versement d\'épargne salariale en direct',
      },
      {
        type: 'ux',
        description: 'Clarification des lignes d\'ajustement du virement bancaire (transport, mutuelle, tickets)',
      },
    ],
  },
  {
    version: 'v1.2.0',
    date: '30 Octobre 2026',
    title: 'Prélèvement à la Source (PAS) avec Pas de 0,1%',
    badge: 'Majeure',
    userPrompt:
      'ajoute la possibilité de saisir le montant de l\'IR + un pas à pas de 0,1%. ce pourcentage viendra influencer le salaire net et sera affiché "Après impôts", tu garderas l\'affichage du montant du salaire net avant impôts',
    summary:
      'Implémentation du prélèvement à la source de l\'impôt sur le revenu avec ajustement ultra-précis au dixième de pourcent et double affichage Avant/Après impôts.',
    highlights: [
      'Ajustement du taux de PAS par pas à pas de 0,1% (+ boutons minus/plus)',
      'Saisie alternative directe du montant de l\'impôt en euros par mois',
      'Double affichage permanent : Net Avant Impôts et Net Après Impôts',
      'Barème officiel de l\'IR français avec quotient familial',
    ],
    changes: [
      {
        type: 'feat',
        description: 'Sélecteur 3 modes d\'IR : Taux libre (0,1%), Montant en €/m, ou Barème automatique',
      },
      {
        type: 'feat',
        description: 'Contrôleurs pas à pas de 0,1% intégrés dans les paramètres et directement sur la carte résultat',
      },
      {
        type: 'ux',
        description: 'Distinction claire du Net Avant Impôts (officiel bulletin) et Net Après Impôts',
      },
    ],
  },
  {
    version: 'v1.1.0',
    date: '30 Octobre 2026',
    title: 'Part Variable Cadre (+1%) & Option 14ème Mois',
    badge: 'Majeure',
    userPrompt:
      'ajoute dans l\'encadré "1. Salaire Brut Annuel & Statut" une option activable/désactivable avec pas à pas de +1% concernant la part variable versée annuellement en général pour les cadres. Prends en compte ce variable dans le calcul du salaire net mensuel. Supprime le "repères rapides". Ajoute une option "14ème mois"',
    summary:
      'Ajout du bonus annuel contractuel pour les cadres, calcul du brut global mensualisé, suppression des repères rapides et mensualisation sur 14 mois.',
    highlights: [
      'Part variable annuelle activable/désactivable avec pas de +1%',
      'Calcul du variable mensuel et intégration dans le net perçu',
      'Sélecteur de mensualisation étendu : 12, 13 et 14 mois',
      'Nettoyage visuel de la section 1 (suppression des repères rapides)',
    ],
    changes: [
      {
        type: 'feat',
        description: 'Module de part variable annuelle avec boutons +/- 1% et curseur de 0 à 50%',
      },
      {
        type: 'feat',
        description: 'Option 14ème mois ajoutée au sélecteur de répartition des mensualités',
      },
      {
        type: 'ux',
        description: 'Suppression des boutons de repères rapides superflus',
      },
    ],
  },
  {
    version: 'v1.0.0',
    date: '30 Octobre 2026',
    title: 'Lancement Initial : Simulateur Salaire Net & Épargne Salariale',
    badge: 'Initiale',
    userPrompt:
      'créer un simulateur de salaire net mensuel en France. il faut pouvoir saisir le montant du salaire brut annuel avec incrémentation de 1000 en 1000, il faut sélectionner si on est cadre ou non cadre, ajoute deux cases à saisir pour renseigner les montants des participations et intéressements qui seront ajoutés dans le calcul du salaire mensuel avec un sélecteur de versement sur le compte ou de placement. Suggère 1 ou 2 améliorations que je n\'aurais pas pensé',
    summary:
      'Création du simulateur initial de salaire français : conversion brut/net, statut cadre/non-cadre, arbitrage épargne salariale (versement vs placement PEE/PER), suggestions d\'améliorations.',
    highlights: [
      'Saisie du brut annuel avec pas à pas de 1 000 €',
      'Statuts Cadre (~25%) et Non-cadre',
      'Participation & Intéressement avec choix d\'arbitrage Versement direct vs Placement PEE',
      'Calculs de l\'abondement employeur et exonération d\'impôt sur PEE',
      'Proposition des améliorations : Prélèvement à la source et Avantages du quotidien',
    ],
    changes: [
      {
        type: 'feat',
        description: 'Moteur de calcul de paie française (cotisations salariales & patronales)',
      },
      {
        type: 'feat',
        description: 'Module d\'arbitrage de la loi Pacte pour l\'épargne salariale',
      },
      {
        type: 'feat',
        description: 'Bulletin de paie clarifié et calcul du super-brut employeur',
      },
    ],
  },
];
