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
import { ProfitSharingSection } from './components/ProfitSharingSection';
import { SuggestedImprovements } from './components/SuggestedImprovements';
import { ResultCard } from './components/ResultCard';
import { PayslipBreakdown } from './components/PayslipBreakdown';
import { ArbitrageCard } from './components/ArbitrageCard';
import { EmployerCostCard } from './components/EmployerCostCard';
import { ChangelogModal } from './components/ChangelogModal';
import { APP_VERSION } from './data/changelog';

export default function App() {
  // State variables
  const [grossAnnual, setGrossAnnual] = useState<number>(0);
  const [status, setStatus] = useState<EmployeeStatus>('cadre');
  const [monthsCount, setMonthsCount] = useState<12 | 13 | 14>(12);

  // Part variable annuelle cadre (+1% step)
  const [variableBonus, setVariableBonus] = useState<VariableBonusConfig>({
    enabled: false,
    percent: 10,
  });

  // Épargne Salariale : Activable / Désactivable, avec valeurs par défaut à 0 €
  const [profitSharingEnabled, setProfitSharingEnabled] = useState<boolean>(false);

  // Bonus items (Participation & Intéressement with choice of versement or placement)
  const [participation, setParticipation] = useState<BonusItem>({
    amount: 0,
    choice: 'placement',
    employerMatchPercent: 50,
  });

  const [interessement, setInteressement] = useState<BonusItem>({
    amount: 0,
    choice: 'placement',
    employerMatchPercent: 50,
  });

  const [smoothBonuses, setSmoothBonuses] = useState<boolean>(false);

  // Suggested Improvement 1: Prélèvement à la source (Tax at source)
  const [taxSource, setTaxSource] = useState<TaxSourceConfig>({
    enabled: false,
    mode: 'auto',
    customRate: 7.5,
    customAmount: 220,
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
      monthsCount,
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
      monthsCount,
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
    setGrossAnnual(0);
    setStatus('cadre');
    setMonthsCount(12);
    setVariableBonus({
      enabled: false,
      percent: 10,
    });
    setProfitSharingEnabled(false);
    setParticipation({
      amount: 0,
      choice: 'placement',
      employerMatchPercent: 50,
    });
    setInteressement({
      amount: 0,
      choice: 'placement',
      employerMatchPercent: 50,
    });
    setSmoothBonuses(false);
    setTaxSource({
      enabled: false,
      mode: 'auto',
      customRate: 7.5,
      customAmount: 220,
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
    const text = `--- SYNTHÈSE SALAIRE NET FRANCE ---
Salaire Brut Fixe : ${formatEuro(breakdown.baseGrossAnnual)} / an
${breakdown.variableBonusEnabled && breakdown.variableBonusAmount > 0 ? `Part variable (${breakdown.variableBonusPercent}%) : +${formatEuro(breakdown.variableBonusAmount)} / an (+${formatEuro(breakdown.variableBonusMonthly)} / mois)\nTotal Brut : ${formatEuro(breakdown.grossAnnual)} / an (${formatEuro(breakdown.grossMonthly)} / mois)\n` : `Total Brut : ${formatEuro(breakdown.grossAnnual)} / an (${formatEuro(breakdown.grossMonthly)} / mois)\n`}Statut : ${breakdown.employeeStatus === 'cadre' ? 'Cadre (~25% cotisations)' : 'Non-cadre (~24% cotisations)'}
Nombre de mois de versement : ${monthsCount} mois
Net à payer avant impôt : ${formatEuro(breakdown.netBeforeTaxMonthly)}/mois
Prélèvement à la source : ${breakdown.estimatedTaxRate}% (-${formatEuro(breakdown.incomeTaxMonthly)}/mois)
Net Viré en Banque : ${formatEuro(breakdown.netInBankMonthlyStandard)}/mois

Épargne Salariale :
- Participation (${formatEuro(breakdown.participationCalc.grossAmount)} brut) : ${breakdown.participationCalc.choice === 'placement' ? `Placé sur PEE/PER (${formatEuro(breakdown.participationCalc.totalPlaced)} capitalisé)` : `Versé sur compte (${formatEuro(breakdown.participationCalc.netAfterTax)} net)`}
- Intéressement (${formatEuro(breakdown.interessementCalc.grossAmount)} brut) : ${breakdown.interessementCalc.choice === 'placement' ? `Placé sur PEE/PER (${formatEuro(breakdown.interessementCalc.totalPlaced)} capitalisé)` : `Versé sur compte (${formatEuro(breakdown.interessementCalc.netAfterTax)} net)`}
Économie d'impôt réalisée : +${formatEuro(breakdown.totalTaxSavedByPlacement)}

Coût Global Entreprise (Super-Brut) : ${formatEuro(breakdown.totalEmployerCostMonthly)}/mois (${formatEuro(breakdown.totalEmployerCostAnnual)}/an)
-----------------------------------`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Intro Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Simulateur de Salaire Net Mensuel en France
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              Calculez instantanément votre rémunération nette d&apos;après votre brut annuel, votre statut cadre/non-cadre, l&apos;arbitrage de votre participation & intéressement (versement vs placement PEE) et les déductions réelles de la fiche de paie.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 font-medium shrink-0">
            <span>Barème fiscal & social 2025/2026</span>
            <span aria-hidden="true">·</span>
            <span>Règles Urssaf & Agirc-Arrco</span>
          </div>
        </div>

        {/* 2-Column Split: Inputs & Results */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Inputs (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Gross Salary & Status */}
            <SalaryInputSection
              grossAnnual={grossAnnual}
              setGrossAnnual={setGrossAnnual}
              status={status}
              setStatus={setStatus}
              monthsCount={monthsCount}
              setMonthsCount={setMonthsCount}
              variableBonus={variableBonus}
              setVariableBonus={setVariableBonus}
            />

            {/* Step 2: Impôt sur le Revenu (PAS) & Avantages Sociaux */}
            <SuggestedImprovements
              taxSource={taxSource}
              setTaxSource={setTaxSource}
              mealVouchers={mealVouchers}
              setMealVouchers={setMealVouchers}
              transportPass={transportPass}
              setTransportPass={setTransportPass}
              mutuelle={mutuelle}
              setMutuelle={setMutuelle}
              calculatedTaxRate={breakdown.estimatedTaxRate}
              netBeforeTaxMonthly={breakdown.netBeforeTaxMonthly}
              incomeTaxMonthly={breakdown.incomeTaxMonthly}
            />

            {/* Step 3: Participation & Intéressement with choice versement / placement */}
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

          {/* Right Column: Dynamic Results & Breakdown (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            {/* Primary KPI Result Card */}
            <ResultCard
              breakdown={breakdown}
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
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
