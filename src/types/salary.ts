/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type EmployeeStatus = 'cadre' | 'non_cadre';

export type PaymentChoice = 'versement' | 'placement';

export interface BonusItem {
  amount: number;
  choice: PaymentChoice;
  employerMatchPercent: number; // Abondement employeur (e.g. 0%, 50%, 100%)
}

export interface MealVoucherConfig {
  enabled: boolean;
  countPerMonth: number;
  faceValue: number; // Montant unitaire du ticket en €
  employerSharePercent: number; // Pourcentage de prise en charge employeur (ex: 50% ou 60%)
}

export interface TransportPassConfig {
  enabled: boolean;
  monthlyCost: number;
  employerSharePercent: number;
}

export interface MutuelleConfig {
  enabled: boolean;
  employeeMonthlyCost: number;
  employerMonthlyCost: number;
}

export interface TaxSourceConfig {
  enabled: boolean;
  mode: 'auto' | 'custom' | 'amount';
  customRate: number; // in percent, step 0.1%
  customAmount: number; // montant direct de l'IR en € / mois
  familyParts: number; // parts fiscales (1, 1.5, 2, 2.5, 3)
}

export interface VariableBonusConfig {
  enabled: boolean;
  percent: number; // Part variable en %, incrémentable de 1 en 1
}

export interface SimulationParams {
  grossAnnual: number; // Salaire brut fixe annuel
  status: EmployeeStatus;
  has13thMonth: boolean; // Case à cocher 13ème mois (+1/12ème du salaire brut annuel)
  has14thMonth: boolean; // Case à cocher 14ème mois (+2/12èmes du salaire brut annuel)
  monthsCount?: 12 | 13 | 14; // Dérivé pour rétrocompatibilité
  variableBonus: VariableBonusConfig;
  profitSharingEnabled: boolean; // Épargne salariale activable / désactivable
  participation: BonusItem;
  interessement: BonusItem;
  smoothBonuses: boolean; // Lisser la participation/intéressement sur 12 mois
  taxSource: TaxSourceConfig;
  employeeContributionRate?: number; // Taux personnalisé de cotisations salariales en % (ex: 24, 25)
  mealVouchers: MealVoucherConfig;
  transportPass: TransportPassConfig;
  mutuelle: MutuelleConfig;
}

export interface BonusCalculation {
  grossAmount: number;
  choice: PaymentChoice;
  csgCrds: number; // 9.7% sur 98.25%
  netBeforeTax: number;
  incomeTax: number;
  netAfterTax: number; // Ce qui est reçu si versement
  employerMatchAmount: number;
  totalPlaced: number; // Ce qui arrive sur le PEE/PER si placement
  taxSavedIfPlaced: number;
}

export interface SalaryBreakdown {
  baseGrossAnnual: number;
  variableBonusEnabled: boolean;
  variableBonusPercent: number;
  variableBonusAmount: number;
  variableBonusMonthly: number;
  grossAnnual: number; // Total brut contractuel global (base + variable)
  annualGrossRegular: number; // Base annuelle brute répartie sur les mois courants (ex: (brut/13)*12)
  has13thMonth: boolean;
  has14thMonth: boolean;
  extraFraction: number; // 0, 1/12 ou 2/12
  
  // Lissage du 13ème et 14ème mois (avant et après impôts)
  smoothed13th14thNetBeforeTaxMonthly: number; // Quote-part mensuelle lissée du 13e/14e mois avant impôt
  smoothed13th14thNetAfterTaxMonthly: number; // Quote-part mensuelle lissée du 13e/14e mois après impôt
  smoothedNetBeforeTaxMonthly: number; // Salaire net mensuel lissé avant impôts
  smoothedNetBeforeTaxAnnual: number; // Salaire net annuel lissé avant impôts
  smoothedNetAfterTaxMonthly: number; // Salaire net mensuel lissé après impôts
  smoothedNetAfterTaxAnnual: number; // Salaire net annuel lissé après impôts

  grossMonthly: number; // Brut mensuel régulier (base / 13 si 13e mois, / 14 si 14e mois, / 12 sinon)
  baseGrossMonthlyStandard: number; // Brut fixe mensuel régulier
  baseNetBeforeTaxMonthly: number; // Net avant impôts de base standard
  baseNetAfterTaxMonthly: number; // Net après impôts de base standard
  baseNetBeforeTaxAnnual: number;
  baseNetAfterTaxAnnual: number;
  monthsCount: 12 | 13 | 14;
  extraMonthsCount: number;
  employeeStatus: EmployeeStatus;
  employeeRate: number; // e.g. 0.24 or 0.25
  employeeContributionsAnnual: number;
  employeeContributionsMonthly: number;
  
  // Cotisations salariales détaillées (estimation mensuelle)
  socialDetails: {
    health: number;
    basicRetirement: number;
    complementaryRetirement: number;
    csgCrdsTotal: number;
    csgDeductible: number;
    csgNonDeductibleCrds: number;
    cadreSpecific: number; // APEC + prévoyance
  };

  netBeforeTaxAnnual: number;
  netBeforeTaxMonthly: number;

  taxableNetAnnual: number;
  taxableNetMonthly: number;

  // Prélèvement à la source
  estimatedTaxRate: number; // in %
  marginalTaxRate: number; // TMI in %
  incomeTaxAnnual: number;
  incomeTaxMonthly: number;

  // Net après impôts (avant autres avantages/retenues)
  netAfterTaxMonthly: number;
  netAfterTaxAnnual: number;

  // Avantages et déductions
  mealVouchersDeductionMonthly: number;
  mealVouchersEmployerMonthly: number;
  transportReimbursementMonthly: number;
  mutuelleDeductionMonthly: number;
  mutuelleEmployerMonthly: number;
  totalEmployerBenefitsMonthly: number; // Total pouvoir d'achat net offert par l'employeur (transports + mutuelle patronale + tickets patronaux)
  totalEmployeeBenefitsCostMonthly: number; // Total part salarié déduite pour les avantages (mutuelle + tickets)

  // Net final perçu en banque (mois standard)
  netInBankMonthlyStandard: number;
  netWithAllBenefitsMonthly: number;

  // Épargne salariale
  participationCalc: BonusCalculation;
  interessementCalc: BonusCalculation;
  totalBonusNetImmediateAnnual: number;
  totalBonusNetPlacedAnnual: number;
  totalTaxSavedByPlacement: number;

  // Net mensuel lissé (avec intéressement/participation versés lissés)
  netInBankMonthlySmoothed: number;
  smoothedNetAfterTaxWithBonuses: number; // Net lissé après impôts + primes lissées
  smoothedNetBeforeTaxWithBonuses: number; // Net lissé avant impôts + primes lissées
  monthlyBonusAddition: number; // Quote-part mensuelle de prime lissée

  // Coût employeur (Super-brut)
  employerRate: number; // ~42%
  employerContributionsMonthly: number;
  totalEmployerCostMonthly: number;
  totalEmployerCostAnnual: number;
}
