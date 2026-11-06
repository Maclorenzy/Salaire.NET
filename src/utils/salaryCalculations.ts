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

  const has14thMonth = !!params.has14thMonth;
  const has13thMonth = has14thMonth || !!params.has13thMonth;
  const months = (has14thMonth ? 14 : has13thMonth ? 13 : 12) as 12 | 13 | 14;
  const extraMonthsCount = has14thMonth ? 2 : has13thMonth ? 1 : 0;
  const extraFraction = has14thMonth ? 2 / 12 : has13thMonth ? 1 / 12 : 0;

  // Règle 1: Le 13ème / 14ème mois est compris dans le salaire brut fixe annuel et versé en une fois.
  // Si le 14ème mois est coché, il remplace le 13ème mois avec un dénominateur de 14 au lieu de 13.
  const denominator = has14thMonth ? 14 : has13thMonth ? 13 : 12;
  const baseAnnualGrossRegular = (baseGrossAnnual / denominator) * 12;
  const baseGrossMonthlyStandard = Math.round(baseGrossAnnual / denominator);
  const variableBonusMonthly = Math.round(variableBonusAmount / 12);
  const annualGrossRegular = Math.round(baseAnnualGrossRegular + variableBonusAmount);
  const grossMonthly = Math.round(baseGrossMonthlyStandard + variableBonusMonthly);

  // Taux de cotisations salariales (curseur personnalisable par pas de 1%)
  // Par défaut : Non-cadre ~24%, Cadre ~25%
  const isCadre = params.status === 'cadre';
  const defaultRatePercent = isCadre ? 25 : 24;
  const effectiveContributionPercent = params.employeeContributionRate != null
    ? Math.max(0, Math.min(60, params.employeeContributionRate))
    : defaultRatePercent;
  const employeeRate = effectiveContributionPercent / 100;

  const employeeContributionsAnnual = annualGrossRegular * employeeRate;
  const employeeContributionsMonthly = Math.round(grossMonthly * employeeRate);

  // Détail estimé des cotisations salariales mensuelles sur les mois courants
  const socialDetails = {
    health: Math.round(grossMonthly * 0.004), // Maladie/maternité
    basicRetirement: Math.round(grossMonthly * 0.073), // Vieillesse plafonnée et déplafonnée
    complementaryRetirement: Math.round(grossMonthly * (isCadre ? 0.055 : 0.048)), // Agirc-Arrco
    csgCrdsTotal: Math.round(grossMonthly * 0.097 * 0.9825), // CSG/CRDS 9.7% sur 98.25%
    csgDeductible: Math.round(grossMonthly * 0.068 * 0.9825), // CSG déductible
    csgNonDeductibleCrds: Math.round(grossMonthly * 0.029 * 0.9825), // CSG non déductible + CRDS
    cadreSpecific: isCadre ? Math.round(grossMonthly * 0.018) : 0, // APEC (0.024%) + Prévoyance cadre
  };

  // 1. Salaire Net Avant Impôts (mensuel et annuel) calculé sur la base de (brut/13)*12
  const baseNetBeforeTaxAnnual = Math.round(annualGrossRegular - employeeContributionsAnnual);
  const baseNetBeforeTaxMonthly = Math.round(grossMonthly - employeeContributionsMonthly);
  const netBeforeTaxAnnual = baseNetBeforeTaxAnnual;
  const netBeforeTaxMonthly = baseNetBeforeTaxMonthly;

  // Net fiscal imposable
  const employerMutuelleTaxableAnnual = params.mutuelle.enabled ? params.mutuelle.employerMonthlyCost * 12 : 0;
  const nonDeductibleCsgAnnual = annualGrossRegular * 0.029 * 0.9825;
  const taxableNetAnnual = baseNetBeforeTaxAnnual + nonDeductibleCsgAnnual + employerMutuelleTaxableAnnual;
  const taxableNetMonthly = taxableNetAnnual / 12;

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
      finalTaxRate = baseNetBeforeTaxMonthly > 0
        ? Math.round((incomeTaxMonthly / baseNetBeforeTaxMonthly) * 1000) / 10
        : 0;
    } else if (params.taxSource.mode === 'custom') {
      finalTaxRate = Math.max(0, Math.min(60, Math.round((params.taxSource.customRate || 0) * 10) / 10));
      incomeTaxMonthly = Math.round(baseNetBeforeTaxMonthly * (finalTaxRate / 100));
    } else {
      finalTaxRate = taxCalculated.averageRate;
      incomeTaxMonthly = Math.round(baseNetBeforeTaxMonthly * (finalTaxRate / 100));
    }
  }

  const marginalTaxRate = taxCalculated.marginalRate;
  const incomeTaxAnnual = incomeTaxMonthly * 12;

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

  // 2. Salaire Net Après Impôts (mensuel et annuel) calculé après cotisations salariales et PAS
  const baseNetAfterTaxMonthly = Math.max(
    0,
    baseNetBeforeTaxMonthly - incomeTaxMonthly - mealVouchersDeductionMonthly
  );
  const baseNetAfterTaxAnnual = Math.max(
    0,
    baseNetBeforeTaxAnnual - incomeTaxAnnual - mealVouchersDeductionMonthly * 12
  );
  const netAfterTaxMonthly = baseNetAfterTaxMonthly;
  const netAfterTaxAnnual = baseNetAfterTaxAnnual;

  // Règle 2: Lissage du salaire net mensuel avant et après impôts en cas de 13ème ou 14ème mois activé
  // Règle: ajouter 1/12 de salaire mensuel (avant et après impôts)
  const smoothed13th14thNetBeforeTaxMonthly = extraMonthsCount > 0
    ? Math.round((baseNetBeforeTaxMonthly * extraMonthsCount) / 12)
    : 0;
  const smoothedNetBeforeTaxMonthly = baseNetBeforeTaxMonthly + smoothed13th14thNetBeforeTaxMonthly;
  const smoothedNetBeforeTaxAnnual = Math.round(smoothedNetBeforeTaxMonthly * 12);

  const smoothed13th14thNetAfterTaxMonthly = extraMonthsCount > 0
    ? Math.round((baseNetAfterTaxMonthly * extraMonthsCount) / 12)
    : 0;
  const smoothedNetAfterTaxMonthly = baseNetAfterTaxMonthly + smoothed13th14thNetAfterTaxMonthly;
  const smoothedNetAfterTaxAnnual = Math.round(smoothedNetAfterTaxMonthly * 12);

  let transportReimbursementMonthly = 0;
  if (params.transportPass.enabled) {
    const employerPercent = (params.transportPass.employerSharePercent / 100);
    transportReimbursementMonthly = Math.round(params.transportPass.monthlyCost * employerPercent);
  }

  let mutuelleDeductionMonthly = 0;
  let mutuelleEmployerMonthly = 0;
  if (params.mutuelle.enabled) {
    mutuelleDeductionMonthly = Math.round(params.mutuelle.employeeMonthlyCost);
    mutuelleEmployerMonthly = Math.round(params.mutuelle.employerMonthlyCost);
  }

  // Total pouvoir d'achat net offert par l'employeur (transports + tickets employeur + mutuelle employeur)
  const totalEmployerBenefitsMonthly =
    transportReimbursementMonthly +
    mealVouchersEmployerMonthly +
    mutuelleEmployerMonthly;

  // Total part salarié déduite pour les avantages du quotidien
  const totalEmployeeBenefitsCostMonthly =
    mealVouchersDeductionMonthly +
    mutuelleDeductionMonthly;

  // Net final perçu en banque (Mois standard sans prime de participation/intéressement)
  const netInBankMonthlyStandard = Math.max(
    0,
    Math.round(
      netAfterTaxMonthly -
      mutuelleDeductionMonthly +
      transportReimbursementMonthly
    )
  );
  const netWithAllBenefitsMonthly = netInBankMonthlyStandard;

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
  
  // Règle : le "Net mensuel lissé avec primes" doit être ajouté au "Net mensuel lissé après impôts"
  // (13ème ou 14ème mois) si la coche correspondante est cochée, ou au net après impôts standard sinon.
  const baseNetForSmoothedWithBonuses = extraMonthsCount > 0
    ? smoothedNetAfterTaxMonthly
    : netAfterTaxMonthly;
  const smoothedNetAfterTaxWithBonuses = baseNetForSmoothedWithBonuses + monthlyBonusAddition;

  // Règle équivalente avant impôts : ajouté au Net mensuel lissé avant impôts (13e/14e mois) ou au Net avant impôts standard sinon
  const baseNetBeforeTaxForSmoothedWithBonuses = extraMonthsCount > 0
    ? smoothedNetBeforeTaxMonthly
    : netBeforeTaxMonthly;
  const smoothedNetBeforeTaxWithBonuses = baseNetBeforeTaxForSmoothedWithBonuses + monthlyBonusAddition;

  const baseInBankForSmoothed = extraMonthsCount > 0
    ? Math.max(0, Math.round(smoothedNetAfterTaxMonthly - mutuelleDeductionMonthly + transportReimbursementMonthly))
    : netInBankMonthlyStandard;
  const netInBankMonthlySmoothed = baseInBankForSmoothed + monthlyBonusAddition;

  // Coût global employeur (Super-Brut)
  const employerRate = grossAnnual < 35000 ? 0.38 : isCadre ? 0.45 : 0.42;
  const employerContributionsMonthly = Math.round(grossMonthly * employerRate);
  const totalEmployerCostMonthly = Math.round(
    grossMonthly +
    employerContributionsMonthly +
    mealVouchersEmployerMonthly +
    transportReimbursementMonthly +
    (params.mutuelle.enabled ? params.mutuelle.employerMonthlyCost : 0)
  );
  const totalEmployerCostAnnual = totalEmployerCostMonthly * 12;

  return {
    baseGrossAnnual,
    variableBonusEnabled,
    variableBonusPercent,
    variableBonusAmount,
    variableBonusMonthly,
    grossAnnual,
    annualGrossRegular,
    grossMonthly: Math.round(grossMonthly),
    has13thMonth,
    has14thMonth,
    extraFraction,
    smoothed13th14thNetBeforeTaxMonthly,
    smoothed13th14thNetAfterTaxMonthly,
    smoothedNetBeforeTaxMonthly,
    smoothedNetBeforeTaxAnnual,
    smoothedNetAfterTaxMonthly,
    smoothedNetAfterTaxAnnual,
    baseGrossMonthlyStandard,
    baseNetBeforeTaxMonthly,
    baseNetAfterTaxMonthly,
    baseNetBeforeTaxAnnual,
    baseNetAfterTaxAnnual,
    monthsCount: months,
    extraMonthsCount,
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
    netAfterTaxAnnual: Math.round(netAfterTaxAnnual),
    mealVouchersDeductionMonthly,
    mealVouchersEmployerMonthly,
    transportReimbursementMonthly,
    mutuelleDeductionMonthly,
    mutuelleEmployerMonthly,
    totalEmployerBenefitsMonthly,
    totalEmployeeBenefitsCostMonthly,
    netInBankMonthlyStandard,
    netWithAllBenefitsMonthly,
    participationCalc,
    interessementCalc,
    totalBonusNetImmediateAnnual,
    totalBonusNetPlacedAnnual,
    totalTaxSavedByPlacement,
    netInBankMonthlySmoothed,
    smoothedNetAfterTaxWithBonuses,
    smoothedNetBeforeTaxWithBonuses,
    monthlyBonusAddition,
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
