/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import {
  BonusItem,
  EmployeeStatus,
  MealVoucherConfig,
  MutuelleConfig,
  PaymentChoice,
  SimulationParams,
  TaxSourceConfig,
  TransportPassConfig,
  VariableBonusConfig,
} from './types/salary';
import { calculateSalary, formatEuro } from './utils/salaryCalculations';
import { Header } from './components/Header';
import { SalaryInputSection } from './components/SalaryInputSection';
import { SocialBenefitsSection } from './components/SocialBenefitsSection';
import { IncomeTaxSection } from './components/IncomeTaxSection';
import { ProfitSharingSection } from './components/ProfitSharingSection';
import { ResultCard } from './components/ResultCard';
import { PayslipBreakdown } from './components/PayslipBreakdown';
import { ArbitrageCard } from './components/ArbitrageCard';
import { EmployerCostCard } from './components/EmployerCostCard';
import { ChangelogModal } from './components/ChangelogModal';
import { APP_VERSION } from './data/changelog';

export default function App() {
  // State variables initialisés selon les valeurs demandées par défaut
  const [grossAnnual, setGrossAnnual] = useState<number>(60000);
  const [status, setStatus] = useState<EmployeeStatus>('cadre');
  const [employeeContributionRate, setEmployeeContributionRate] = useState<number>(25);
  const [has13thMonth, setHas13thMonth] = useState<boolean>(true);
  const [has14thMonth, setHas14thMonth] = useState<boolean>(false);

  // Part variable annuelle cadre (+1% step)
  const [variableBonus, setVariableBonus] = useState<VariableBonusConfig>({
    enabled: false,
    percent: 10,
  });

  // Épargne Salariale : Activable / Désactivable, avec valeurs par défaut à 5000 € chacune en versement direct
  const [profitSharingEnabled, setProfitSharingEnabled] = useState<boolean>(true);

  // Bonus items (Participation & Intéressement = 5000 € en versement sur le compte)
  const [participation, setParticipation] = useState<BonusItem>({
    amount: 5000,
    choice: 'versement',
    employerMatchPercent: 50,
  });

  const [interessement, setInteressement] = useState<BonusItem>({
    amount: 5000,
    choice: 'versement',
    employerMatchPercent: 50,
  });

  const [smoothBonuses, setSmoothBonuses] = useState<boolean>(true);

  // Prélèvement à la source : activé par défaut avec taux de 4.6%
  const [taxSource, setTaxSource] = useState<TaxSourceConfig>({
    enabled: true,
    mode: 'custom',
    customRate: 4.6,
    customAmount: 159,
    familyParts: 1,
  });

  // Suggested Improvement 2: Workplace benefits & real payslip line items (Avantages du quotidien)
  const [mealVouchers, setMealVouchers] = useState<MealVoucherConfig>({
    enabled: false,
    countPerMonth: 20,
    faceValue: 10,
    employerSharePercent: 50,
  });

  const [transportPass, setTransportPass] = useState<TransportPassConfig>({
    enabled: false,
    monthlyCost: 86.4,
    employerSharePercent: 50,
  });

  const [mutuelle, setMutuelle] = useState<MutuelleConfig>({
    enabled: false,
    employeeMonthlyCost: 40,
    employerMonthlyCost: 40,
  });

  const [activeSection, setActiveSection] = useState<string>('simulateur');
  const [copied, setCopied] = useState<boolean>(false);
  const [isChangelogOpen, setIsChangelogOpen] = useState<boolean>(false);

  // Compute breakdown dynamically
  const simulationParams: SimulationParams = useMemo(
    () => ({
      grossAnnual,
      status,
      employeeContributionRate,
      has13thMonth,
      has14thMonth,
      monthsCount: (has14thMonth ? 14 : has13thMonth ? 13 : 12) as 12 | 13 | 14,
      variableBonus,
      profitSharingEnabled,
      participation,
      interessement,
      smoothBonuses,
      taxSource,
      mealVouchers,
      transportPass,
      mutuelle,
    }),
    [
      grossAnnual,
      status,
      employeeContributionRate,
      has13thMonth,
      has14thMonth,
      variableBonus,
      profitSharingEnabled,
      participation,
      interessement,
      smoothBonuses,
      taxSource,
      mealVouchers,
      transportPass,
      mutuelle,
    ]
  );

  const breakdown = useMemo(() => calculateSalary(simulationParams), [simulationParams]);

  // Adjust tax rate by delta (+0.1% / -0.1%)
  const handleAdjustTaxRate = (delta: number) => {
    setTaxSource((prev) => {
      const current = prev.mode === 'auto' ? breakdown.estimatedTaxRate : (prev.customRate || 0);
      const nextRate = Math.max(0, Math.min(60, Math.round((current + delta) * 10) / 10));
      const nextAmount = Math.round(breakdown.netBeforeTaxMonthly * (nextRate / 100));
      return {
        ...prev,
        enabled: true,
        mode: 'custom',
        customRate: nextRate,
        customAmount: nextAmount,
      };
    });
  };

  // Quick reset to standard defaults
  const handleReset = () => {
    setGrossAnnual(60000);
    setStatus('cadre');
    setEmployeeContributionRate(25);
    setHas13thMonth(true);
    setHas14thMonth(false);
    setVariableBonus({
      enabled: false,
      percent: 10,
    });
    setProfitSharingEnabled(true);
    setParticipation({
      amount: 5000,
      choice: 'versement',
      employerMatchPercent: 50,
    });
    setInteressement({
      amount: 5000,
      choice: 'versement',
      employerMatchPercent: 50,
    });
    setSmoothBonuses(true);
    setTaxSource({
      enabled: true,
      mode: 'custom',
      customRate: 4.6,
      customAmount: 159,
      familyParts: 1,
    });
    setMealVouchers({
      enabled: false,
      countPerMonth: 20,
      faceValue: 10,
      employerSharePercent: 50,
    });
    setTransportPass({
      enabled: false,
      monthlyCost: 86.4,
      employerSharePercent: 50,
    });
    setMutuelle({
      enabled: false,
      employeeMonthlyCost: 40,
      employerMonthlyCost: 40,
    });
  };

  // Quick bulk selector for arbitration
  const handleSetAllBonusesTo = (choice: PaymentChoice) => {
    setParticipation((prev) => ({ ...prev, choice }));
    setInteressement((prev) => ({ ...prev, choice }));
  };

  // Copy structured summary to clipboard
  const handleCopySummary = async () => {
    const advantages: string[] = [];
    if (mealVouchers.enabled) {
      advantages.push(
        `- Titres-restaurant : Part employeur +${formatEuro(breakdown.mealVouchersEmployerMonthly)}/mois | Part salarié déduite -${formatEuro(breakdown.mealVouchersDeductionMonthly)}/mois`
      );
    }
    if (transportPass.enabled) {
      advantages.push(
        `- Transports publics : Prise en charge employeur (${transportPass.employerSharePercent}%) soit +${formatEuro(breakdown.transportReimbursementMonthly)}/mois`
      );
    }
    if (mutuelle.enabled) {
      advantages.push(
        `- Mutuelle santé : Part employeur +${formatEuro(mutuelle.employerMonthlyCost)}/mois | Part salarié déduite -${formatEuro(breakdown.mutuelleDeductionMonthly)}/mois`
      );
    }

    const text = `--- SYNTHÈSE SALAIRE NET FRANCE ---
Salaire Brut Fixe Annuel : ${formatEuro(breakdown.baseGrossAnnual)} / an
${breakdown.variableBonusEnabled && breakdown.variableBonusAmount > 0 ? `Part variable (${breakdown.variableBonusPercent}%) : +${formatEuro(breakdown.variableBonusAmount)} / an (+${formatEuro(breakdown.variableBonusMonthly)} / mois)\nTotal Brut : ${formatEuro(breakdown.grossAnnual)} / an (${formatEuro(breakdown.grossMonthly)} / mois)\n` : `Brut régulier : ${formatEuro(breakdown.grossMonthly)} / mois (base ${breakdown.monthsCount} mois)\n`}Statut : ${breakdown.employeeStatus === 'cadre' ? 'Cadre (~25% cotisations)' : 'Non-cadre (~24% cotisations)'}
${breakdown.has13thMonth ? `Modalité de versement : ${breakdown.has14thMonth ? '14 mois (13e et 14e mois compris dans le brut, versés en une fois)' : '13 mois (13ème mois compris dans le brut, versé en une fois)'}\n` : ''}1. Salaire Net Avant impôts : ${formatEuro(breakdown.netBeforeTaxMonthly)}/mois (${formatEuro(breakdown.netBeforeTaxAnnual)}/an régulier, base [brut/${breakdown.monthsCount}]×12)
2. Salaire Net Après impôts : ${formatEuro(breakdown.netAfterTaxMonthly)}/mois (${formatEuro(breakdown.netAfterTaxAnnual)}/an régulier, net en poche)
${breakdown.has13thMonth ? `Lissage budgétaire :
- ${breakdown.has14thMonth ? 'Net mensuel lissé avec 14ème mois :' : 'Net mensuel lissé avec 13ème mois :'} ${formatEuro(breakdown.smoothedNetBeforeTaxMonthly)}/mois (${formatEuro(breakdown.smoothedNetBeforeTaxAnnual)}/an)
- ${breakdown.has14thMonth ? 'Net mensuel lissé 14ème mois :' : 'Net mensuel lissé 13ème mois :'} ${formatEuro(breakdown.smoothedNetAfterTaxMonthly)}/mois (${formatEuro(breakdown.smoothedNetAfterTaxAnnual)}/an)
${smoothBonuses && breakdown.totalBonusNetImmediateAnnual > 0 ? `- Net mensuel lissé avec primes : ${formatEuro(breakdown.smoothedNetAfterTaxWithBonuses)}/mois (inclus ${formatEuro(breakdown.monthlyBonusAddition)}/m de primes)\n` : ''}\n` : (smoothBonuses && breakdown.totalBonusNetImmediateAnnual > 0 ? `Lissage budgétaire (primes) :
- Net mensuel lissé avec primes (après impôts) : ${formatEuro(breakdown.smoothedNetAfterTaxWithBonuses)}/mois (base ${formatEuro(breakdown.netAfterTaxMonthly)}/m + ${formatEuro(breakdown.monthlyBonusAddition)}/m de primes)
- Net mensuel lissé avec primes (avant impôts) : ${formatEuro(breakdown.smoothedNetBeforeTaxWithBonuses)}/mois (base ${formatEuro(breakdown.netBeforeTaxMonthly)}/m + ${formatEuro(breakdown.monthlyBonusAddition)}/m de primes)\n\n` : '')}Prélèvement à la source : ${breakdown.estimatedTaxRate}% (-${formatEuro(breakdown.incomeTaxMonthly)}/mois)
Net Viré en Banque : ${formatEuro(breakdown.netInBankMonthlyStandard)}/mois
${advantages.length > 0 ? `\nAvantages du Quotidien :\n${advantages.join('\n')}\n` : ''}
Épargne Salariale :
- Participation (${formatEuro(breakdown.participationCalc.grossAmount)} brut) : ${breakdown.participationCalc.choice === 'placement' ? `Placé sur PEE/PER (${formatEuro(breakdown.participationCalc.totalPlaced)} capitalisé)` : `Versé sur compte (${formatEuro(breakdown.participationCalc.netAfterTax)} net)`}
- Intéressement (${formatEuro(breakdown.interessementCalc.grossAmount)} brut) : ${breakdown.interessementCalc.choice === 'placement' ? `Placé sur PEE/PER (${formatEuro(breakdown.interessementCalc.totalPlaced)} capitalisé)` : `Versé sur compte (${formatEuro(breakdown.interessementCalc.netAfterTax)} net)`}
Économie d'impôt réalisée : +${formatEuro(breakdown.totalTaxSavedByPlacement)}

Coût Global Entreprise (Super-Brut) : ${formatEuro(breakdown.totalEmployerCostMonthly)}/mois (${formatEuro(breakdown.totalEmployerCostAnnual)}/an)
-----------------------------------`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        onReset={handleReset}
        onCopySummary={handleCopySummary}
        copied={copied}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onOpenChangelog={() => setIsChangelogOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 space-y-8">
        {/* Intro Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Simulateur de Salaire Net Mensuel en France
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-4xl">
              Calculez instantanément votre rémunération nette d&apos;après votre brut annuel, votre statut cadre/non-cadre, l&apos;arbitrage de votre participation & intéressement (versement vs placement PEE) et les déductions réelles de la fiche de paie.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 font-medium shrink-0">
            <span>Barème fiscal & social 2025/2026</span>
            <span aria-hidden="true">·</span>
            <span>Règles Urssaf & Agirc-Arrco</span>
          </div>
        </div>

        {/* 2-Column Split: Inputs & Results (Wider left column for crystal clear inputs without text wrapping) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Inputs (7 cols on lg/xl) */}
          <div className="lg:col-span-7 xl:col-span-7 2xl:col-span-7 space-y-6">
            {/* Step 1: Gross Salary & Status */}
            <SalaryInputSection
              grossAnnual={grossAnnual}
              setGrossAnnual={setGrossAnnual}
              status={status}
              setStatus={setStatus}
              employeeContributionRate={employeeContributionRate}
              setEmployeeContributionRate={setEmployeeContributionRate}
              has13thMonth={has13thMonth}
              setHas13thMonth={setHas13thMonth}
              has14thMonth={has14thMonth}
              setHas14thMonth={setHas14thMonth}
              variableBonus={variableBonus}
              setVariableBonus={setVariableBonus}
            />

            {/* Step 2: Avantages Sociaux */}
            <SocialBenefitsSection
              mealVouchers={mealVouchers}
              setMealVouchers={setMealVouchers}
              transportPass={transportPass}
              setTransportPass={setTransportPass}
              mutuelle={mutuelle}
              setMutuelle={setMutuelle}
            />

            {/* Step 3: Impôt sur le Revenu (PAS) */}
            <IncomeTaxSection
              taxSource={taxSource}
              setTaxSource={setTaxSource}
              calculatedTaxRate={breakdown.estimatedTaxRate}
              netBeforeTaxMonthly={breakdown.netBeforeTaxMonthly}
              incomeTaxMonthly={breakdown.incomeTaxMonthly}
              mealVoucherEmployeeDeduction={breakdown.mealVouchersDeductionMonthly}
            />

            {/* Step 4: Épargne Salariale : Participation & Intéressement */}
            <ProfitSharingSection
              enabled={profitSharingEnabled}
              setEnabled={setProfitSharingEnabled}
              participation={participation}
              setParticipation={setParticipation}
              interessement={interessement}
              setInteressement={setInteressement}
              smoothBonuses={smoothBonuses}
              setSmoothBonuses={setSmoothBonuses}
              marginalTaxRate={breakdown.marginalTaxRate}
            />
          </div>

          {/* Right Column: Dynamic Results & Breakdown (5 cols on lg/xl) */}
          <div className="lg:col-span-5 xl:col-span-5 2xl:col-span-5 space-y-6 lg:sticky lg:top-20">
            {/* Primary KPI Result Card */}
            <ResultCard
              breakdown={breakdown}
              simulationParams={simulationParams}
              smoothBonuses={smoothBonuses}
              onAdjustTaxRate={handleAdjustTaxRate}
            />

            {/* Condensed Action Tabs */}
            <div className="flex p-1 bg-slate-200/80 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveSection('simulateur')}
                className={`flex-1 py-2 text-center rounded-lg transition-all cursor-pointer ${
                  activeSection === 'simulateur' || activeSection === 'bulletin'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Fiche de Paie
              </button>
              <button
                type="button"
                onClick={() => setActiveSection('arbitrage')}
                className={`flex-1 py-2 text-center rounded-lg transition-all cursor-pointer ${
                  activeSection === 'arbitrage'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Arbitrage Épargne
              </button>
              <button
                type="button"
                onClick={() => setActiveSection('cout-employeur')}
                className={`flex-1 py-2 text-center rounded-lg transition-all cursor-pointer ${
                  activeSection === 'cout-employeur'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Coût Employeur
              </button>
            </div>

            {/* Tab 1: Fiche de Paie */}
            {(activeSection === 'simulateur' || activeSection === 'bulletin') && (
              <PayslipBreakdown breakdown={breakdown} />
            )}

            {/* Tab 2: Arbitrage Épargne Salariale */}
            {activeSection === 'arbitrage' && (
              <ArbitrageCard
                breakdown={breakdown}
                onSetAllTo={handleSetAllBonusesTo}
              />
            )}

            {/* Tab 3: Coût Total Employeur */}
            {activeSection === 'cout-employeur' && (
              <EmployerCostCard breakdown={breakdown} />
            )}
          </div>
        </div>

        {/* Detailed Secondary Sections on desktop view (Full Width for in-depth consultation) */}
        <div className="pt-8 border-t border-slate-200 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ArbitrageCard
              breakdown={breakdown}
              onSetAllTo={handleSetAllBonusesTo}
            />
            <EmployerCostCard breakdown={breakdown} />
          </div>
        </div>
      </main>

      {/* Clean Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2 flex-wrap">
            <span>Simulateur de salaire net indicatif · Conforme législation Urssaf & barème 2026.</span>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setIsChangelogOpen(true)}
              className="inline-flex items-center gap-1.5 px-2 py-0.5 text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 font-mono font-semibold transition-colors cursor-pointer"
              title="Consulter le journal des modifications"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Changelog ({APP_VERSION})</span>
            </button>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <span>Participation & Intéressement (Loi Pacte)</span>
            <span aria-hidden="true">·</span>
            <span>Prélèvement à la Source (PAS)</span>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setIsChangelogOpen(true)}
              className="hover:text-blue-600 underline underline-offset-2 transition-colors cursor-pointer"
            >
              Historique des demandes
            </button>
          </div>
        </div>
      </footer>

      {/* Changelog & Versioning Modal */}
      <ChangelogModal
        isOpen={isChangelogOpen}
        onClose={() => setIsChangelogOpen(false)}
      />
    </div>
  );
}
