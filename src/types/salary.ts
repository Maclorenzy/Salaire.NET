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
  monthsCount: 12 | 13 | 14;
  variableBonus: VariableBonusConfig;
  profitSharingEnabled: boolean; // Épargne salariale activable / désactivable
  participation: BonusItem;
  interessement: BonusItem;
  smoothBonuses: boolean; // Lisser la participation/intéressement sur 12 mois
  taxSource: TaxSourceConfig;
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
  grossAnnual: number; // Total brut (base + variable)
  grossMonthly: number;
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

  // Avantages et déductions
  mealVouchersDeductionMonthly: number;
  mealVouchersEmployerMonthly: number;
  transportReimbursementMonthly: number;
  mutuelleDeductionMonthly: number;

  // Net final perçu en banque (mois standard)
  netInBankMonthlyStandard: number;

  // Épargne salariale
  participationCalc: BonusCalculation;
  interessementCalc: BonusCalculation;
  totalBonusNetImmediateAnnual: number;
  totalBonusNetPlacedAnnual: number;
  totalTaxSavedByPlacement: number;

  // Net mensuel lissé (avec intéressement/participation versés lissés)
  netInBankMonthlySmoothed: number;

  // Coût employeur (Super-brut)
  employerRate: number; // ~42%
  employerContributionsMonthly: number;
  totalEmployerCostMonthly: number;
  totalEmployerCostAnnual: number;
}
