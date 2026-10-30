/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BonusCalculation, BonusItem, SalaryBreakdown, SimulationParams } from '../types/salary';

// Barème progressif de l'Impôt sur le Revenu en France (Revenus 2025/2026)
const TAX_BRACKETS = [
  { limit: 11520, rate: 0.0 },
  { limit: 29373, rate: 0.11 },
  { limit: 83824, rate: 0.30 },
  { limit: 180294, rate: 0.41 },
  { limit: Infinity, rate: 0.45 },
];

/**
 * Calcule l'impôt sur le revenu selon le barème progressif français
 * avec abattement forfaitaire de 10% pour frais professionnels et quotient familial
 */
export function calculateIncomeTax(netTaxableIncome: number, familyParts: number = 1): {
  totalTax: number;
  averageRate: number;
  marginalRate: number;
} {
  if (netTaxableIncome <= 0 || familyParts <= 0) {
    return { totalTax: 0, averageRate: 0, marginalRate: 0 };
  }

  // Abattement de 10% pour frais professionnels (Plafond mini 504 € et maxi 14 171 € en 2025/2026)
  const deduction10 = Math.min(Math.max(netTaxableIncome * 0.10, 504), 14171);
  const adjustedIncome = Math.max(0, netTaxableIncome - deduction10);

  // Quotient familial (Revenu par part)
  const incomePerPart = adjustedIncome / familyParts;

  let taxPerPart = 0;
  let previousLimit = 0;
  let marginalRate = 0;

  for (const bracket of TAX_BRACKETS) {
    if (incomePerPart > previousLimit) {
      const taxableInBracket = Math.min(incomePerPart, bracket.limit) - previousLimit;
      taxPerPart += taxableInBracket * bracket.rate;
      if (taxableInBracket > 0 && bracket.rate > 0) {
        marginalRate = bracket.rate;
      }
      previousLimit = bracket.limit;
    } else {
      break;
    }
  }

  // Application de la décote pour les ménages modestes (règles fiscales françaises)
  let rawTotalTax = taxPerPart * familyParts;
  // Plafonnement du quotient familial si pertinent, ou décote
  if (rawTotalTax < 1929 && rawTotalTax > 0) {
    // Célibataire décote simplifiée
    const decoteThreshold = familyParts >= 2 ? 3191 : 1929;
    const decoteBase = familyParts >= 2 ? 1444 : 873;
    const decote = Math.max(0, decoteBase - (rawTotalTax * 0.4525));
    rawTotalTax = Math.max(0, rawTotalTax - decote);
  }

  const averageRate = netTaxableIncome > 0 ? (rawTotalTax / netTaxableIncome) * 100 : 0;

  return {
    totalTax: Math.round(rawTotalTax),
    averageRate: Math.round(averageRate * 10) / 10,
    marginalRate: Math.round(marginalRate * 100),
  };
}

/**
 * Calcule l'impact d'une prime d'intéressement ou de participation
 * selon l'arbitrage Versement direct vs Placement
 */
export function calculateBonusImpact(
  bonus: BonusItem,
  marginalTaxRatePercent: number = 0
): BonusCalculation {
  const grossAmount = Math.max(0, bonus.amount || 0);
  const choice = bonus.choice;
  const matchPercent = Math.max(0, bonus.employerMatchPercent || 0);

  // Prélèvements sociaux CSG / CRDS à 9,70% sur 98,25% du montant
  const csgRateEffective = 0.097 * 0.9825; // 9.53025%
  const csgCrds = grossAmount * csgRateEffective;
  const netBeforeTax = grossAmount - csgCrds;

  // Net touché en direct : après déduction unique de la CSG/CRDS (sans déduction du TMI)
  const netAfterTax = choice === 'versement' ? netBeforeTax : 0;
  const incomeTax = 0;

  // Si placement (PEE/PER) : exonéré d'Impôt sur le Revenu + Abondement employeur
  const employerMatchAmount = choice === 'placement' ? (netBeforeTax * (matchPercent / 100)) : 0;
  const totalPlaced = choice === 'placement' ? netBeforeTax + employerMatchAmount : 0;

  // Économie d'impôt indicative en cas de placement vs versement fiscalisé
  const taxSavedIfPlaced = netBeforeTax * (marginalTaxRatePercent / 100);

  return {
    grossAmount,
    choice,
    csgCrds: Math.round(csgCrds),
    netBeforeTax: Math.round(netBeforeTax),
    incomeTax: Math.round(incomeTax),
    netAfterTax: Math.round(netAfterTax),
    employerMatchAmount: Math.round(employerMatchAmount),
    totalPlaced: Math.round(totalPlaced),
    taxSavedIfPlaced: Math.round(taxSavedIfPlaced),
  };
}

/**
 * Calcul complet de la simulation de paie française
 */
export function calculateSalary(params: SimulationParams): SalaryBreakdown {
  const baseGrossAnnual = Math.max(0, params.grossAnnual);
  const variableBonusEnabled = !!params.variableBonus?.enabled;
  const variableBonusPercent = Math.max(0, params.variableBonus?.percent || 0);
  const variableBonusAmount = variableBonusEnabled
    ? Math.round(baseGrossAnnual * (variableBonusPercent / 100))
    : 0;
  const grossAnnual = baseGrossAnnual + variableBonusAmount;

  const months = params.monthsCount || 12;
  const grossMonthly = grossAnnual / months;
  const variableBonusMonthly = Math.round(variableBonusAmount / months);

  // Taux de cotisations salariales moyen en France
  // Non-cadre : ~24%
  // Cadre : ~25% (APEC, prévoyance cadre 1.5% tranche A, retraite tranche 2)
  const isCadre = params.status === 'cadre';
  const employeeRate = isCadre ? 0.25 : 0.24;

  const employeeContributionsAnnual = grossAnnual * employeeRate;
  const employeeContributionsMonthly = grossMonthly * employeeRate;

  // Détail estimé des cotisations salariales mensuelles
  const socialDetails = {
    health: Math.round(grossMonthly * 0.004), // Maladie/maternité
    basicRetirement: Math.round(grossMonthly * 0.073), // Vieillesse plafonnée et déplafonnée
    complementaryRetirement: Math.round(grossMonthly * (isCadre ? 0.055 : 0.048)), // Agirc-Arrco
    csgCrdsTotal: Math.round(grossMonthly * 0.097 * 0.9825), // CSG/CRDS 9.7% sur 98.25%
    csgDeductible: Math.round(grossMonthly * 0.068 * 0.9825), // CSG déductible
    csgNonDeductibleCrds: Math.round(grossMonthly * 0.029 * 0.9825), // CSG non déductible + CRDS
    cadreSpecific: isCadre ? Math.round(grossMonthly * 0.018) : 0, // APEC (0.024%) + Prévoyance cadre
  };

  // Net avant impôt (Net à payer avant PAS)
  const netBeforeTaxAnnual = grossAnnual - employeeContributionsAnnual;
  const netBeforeTaxMonthly = grossMonthly - employeeContributionsMonthly;

  // Net fiscal imposable (le net avant impôt + CSG/CRDS non déductible + part patronale mutuelle)
  // En France : Net fiscal ≈ Net à payer + CSG non déductible (~2.9% * 98.25%) + mutuelle patronale
  const employerMutuelleTaxableAnnual = params.mutuelle.enabled ? params.mutuelle.employerMonthlyCost * 12 : 0;
  const nonDeductibleCsgAnnual = grossAnnual * 0.029 * 0.9825;
  const taxableNetAnnual = netBeforeTaxAnnual + nonDeductibleCsgAnnual + employerMutuelleTaxableAnnual;
  const taxableNetMonthly = taxableNetAnnual / months;

  // Calcul du taux d'impôt et du TMI
  const taxCalculated = calculateIncomeTax(
    taxableNetAnnual,
    params.taxSource.familyParts || 1
  );

  let finalTaxRate = 0;
  let incomeTaxMonthly = 0;

  if (params.taxSource.enabled) {
    if (params.taxSource.mode === 'amount') {
      incomeTaxMonthly = Math.max(0, Math.round(params.taxSource.customAmount || 0));
      finalTaxRate = netBeforeTaxMonthly > 0
        ? Math.round((incomeTaxMonthly / netBeforeTaxMonthly) * 1000) / 10
        : 0;
    } else if (params.taxSource.mode === 'custom') {
      finalTaxRate = Math.max(0, Math.min(60, Math.round((params.taxSource.customRate || 0) * 10) / 10));
      incomeTaxMonthly = Math.round(netBeforeTaxMonthly * (finalTaxRate / 100));
    } else {
      finalTaxRate = taxCalculated.averageRate;
      incomeTaxMonthly = Math.round(netBeforeTaxMonthly * (finalTaxRate / 100));
    }
  }

  const marginalTaxRate = taxCalculated.marginalRate;
  const incomeTaxAnnual = incomeTaxMonthly * months;

  // Avantages et déductions concrètes en entreprise
  let mealVouchersDeductionMonthly = 0;
  let mealVouchersEmployerMonthly = 0;
  if (params.mealVouchers.enabled) {
    const totalVoucherValue = (params.mealVouchers.countPerMonth || 0) * (params.mealVouchers.faceValue || 0);
    const employerRate = Math.max(0, Math.min(100, params.mealVouchers.employerSharePercent ?? 50)) / 100;
    const employeeRate = 1 - employerRate;
    mealVouchersDeductionMonthly = Math.round(totalVoucherValue * employeeRate);
    mealVouchersEmployerMonthly = Math.round(totalVoucherValue * employerRate);
  }

  // Net après impôts (déduit de l'impôt à la source PAS ET de la part salarié des tickets restaurant)
  const netAfterTaxMonthly = Math.max(
    0,
    netBeforeTaxMonthly - incomeTaxMonthly - mealVouchersDeductionMonthly
  );

  let transportReimbursementMonthly = 0;
  if (params.transportPass.enabled) {
    const employerPercent = (params.transportPass.employerSharePercent / 100);
    transportReimbursementMonthly = Math.round(params.transportPass.monthlyCost * employerPercent);
  }

  let mutuelleDeductionMonthly = 0;
  if (params.mutuelle.enabled) {
    mutuelleDeductionMonthly = Math.round(params.mutuelle.employeeMonthlyCost);
  }

  // Net final en banque (Mois standard sans prime de participation/intéressement)
  // Formule fiche de paie : Net après impôts (incluant déduction tickets resto) - Part Mutuelle + Remboursement Navigo
  const netInBankMonthlyStandard = Math.max(
    0,
    Math.round(
      netAfterTaxMonthly -
      mutuelleDeductionMonthly +
      transportReimbursementMonthly
    )
  );

  // Calcul des primes de participation et d'intéressement (si section activée)
  const isProfitSharingActive = !!params.profitSharingEnabled;
  const participationCalc = isProfitSharingActive
    ? calculateBonusImpact(params.participation, marginalTaxRate)
    : calculateBonusImpact({ ...params.participation, amount: 0 }, marginalTaxRate);
  const interessementCalc = isProfitSharingActive
    ? calculateBonusImpact(params.interessement, marginalTaxRate)
    : calculateBonusImpact({ ...params.interessement, amount: 0 }, marginalTaxRate);

  // Sommes annuelles
  const totalBonusNetImmediateAnnual = isProfitSharingActive
    ? (participationCalc.choice === 'versement' ? participationCalc.netAfterTax : 0) +
      (interessementCalc.choice === 'versement' ? interessementCalc.netAfterTax : 0)
    : 0;

  const totalBonusNetPlacedAnnual = isProfitSharingActive
    ? (participationCalc.choice === 'placement' ? participationCalc.totalPlaced : 0) +
      (interessementCalc.choice === 'placement' ? interessementCalc.totalPlaced : 0)
    : 0;

  const totalTaxSavedByPlacement = isProfitSharingActive
    ? (participationCalc.choice === 'placement' ? participationCalc.taxSavedIfPlaced : 0) +
      (interessementCalc.choice === 'placement' ? interessementCalc.taxSavedIfPlaced : 0)
    : 0;

  // Net mensuel lissé sur 12 mois (avec les primes versées réparties sur l'année pour le budget réel)
  const monthlyBonusAddition = Math.round(totalBonusNetImmediateAnnual / 12);
  const netInBankMonthlySmoothed = netInBankMonthlyStandard + monthlyBonusAddition;

  // Coût global employeur (Super-Brut)
  // Cotisations patronales moyennes : ~42% (peut monter à 45% pour hauts salaires, ou 30% proche SMIC)
  const employerRate = grossAnnual < 35000 ? 0.38 : isCadre ? 0.45 : 0.42;
  const employerContributionsMonthly = Math.round(grossMonthly * employerRate);
  const totalEmployerCostMonthly = Math.round(
    grossMonthly +
    employerContributionsMonthly +
    mealVouchersEmployerMonthly +
    transportReimbursementMonthly +
    (params.mutuelle.enabled ? params.mutuelle.employerMonthlyCost : 0)
  );
  const totalEmployerCostAnnual = totalEmployerCostMonthly * months;

  return {
    baseGrossAnnual,
    variableBonusEnabled,
    variableBonusPercent,
    variableBonusAmount,
    variableBonusMonthly,
    grossAnnual,
    grossMonthly: Math.round(grossMonthly),
    employeeStatus: params.status,
    employeeRate,
    employeeContributionsAnnual: Math.round(employeeContributionsAnnual),
    employeeContributionsMonthly: Math.round(employeeContributionsMonthly),
    socialDetails,
    netBeforeTaxAnnual: Math.round(netBeforeTaxAnnual),
    netBeforeTaxMonthly: Math.round(netBeforeTaxMonthly),
    taxableNetAnnual: Math.round(taxableNetAnnual),
    taxableNetMonthly: Math.round(taxableNetMonthly),
    estimatedTaxRate: finalTaxRate,
    marginalTaxRate,
    incomeTaxAnnual,
    incomeTaxMonthly,
    netAfterTaxMonthly,
    mealVouchersDeductionMonthly,
    mealVouchersEmployerMonthly,
    transportReimbursementMonthly,
    mutuelleDeductionMonthly,
    netInBankMonthlyStandard,
    participationCalc,
    interessementCalc,
    totalBonusNetImmediateAnnual,
    totalBonusNetPlacedAnnual,
    totalTaxSavedByPlacement,
    netInBankMonthlySmoothed,
    employerRate,
    employerContributionsMonthly,
    totalEmployerCostMonthly,
    totalEmployerCostAnnual,
  };
}

export function formatEuro(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);
}
