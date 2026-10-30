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

export const APP_VERSION = 'v1.9.0';
export const APP_RELEASE_DATE = '30 Octobre 2026';

export const CHANGELOG_DATA: VersionRelease[] = [
  {
    version: 'v1.9.0',
    date: '30 Octobre 2026',
    title: "Désactivation par Défaut de l'IR et des Avantages & Correctif Typographique",
    badge: 'Dernière version',
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
