/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SalaryBreakdown, SimulationParams } from '../types/salary';
import { formatEuro } from '../utils/salaryCalculations';
import { CreditCard, TrendingUp, PiggyBank, Minus, Plus, ShieldCheck, Landmark, Bus, HeartPulse, Utensils, Wallet } from 'lucide-react';
import { YearlyProjection } from './YearlyProjection';

interface ResultCardProps {
  breakdown: SalaryBreakdown;
  simulationParams: SimulationParams;
  smoothBonuses: boolean;
  onAdjustTaxRate?: (delta: number) => void;
  projectionEnabled?: boolean;
  onToggleProjection?: (enabled: boolean) => void;
  yearlyIncreases?: number[];
  onChangeYearlyIncrease?: (yearIndex: number, newPercent: number) => void;
  onApplyProjectionPreset?: (percent: number) => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  breakdown,
  simulationParams,
  smoothBonuses,
  onAdjustTaxRate,
  projectionEnabled,
  onToggleProjection,
  yearlyIncreases,
  onChangeYearlyIncrease,
  onApplyProjectionPreset,
}) => {
  // Local state fallbacks if not controlled by parent
  const [internalProjectionEnabled, setInternalProjectionEnabled] = useState<boolean>(false);
  const [internalYearlyIncreases, setInternalYearlyIncreases] = useState<number[]>([2.5, 2.5, 2.5, 2.5, 2.5]);

  const isProjectionActive = projectionEnabled !== undefined ? projectionEnabled : internalProjectionEnabled;
  const toggleProjection = onToggleProjection || setInternalProjectionEnabled;
  const currentIncreases = yearlyIncreases || internalYearlyIncreases;
  const changeIncrease = onChangeYearlyIncrease || ((idx: number, val: number) => {
    setInternalYearlyIncreases((prev) => {
      const next = [...prev];
      next[idx] = val;
      return next;
    });
  });
  const applyPreset = onApplyProjectionPreset || ((val: number) => {
    setInternalYearlyIncreases([val, val, val, val, val]);
  });
  const hasPlacedBonuses = breakdown.totalBonusNetPlacedAnnual > 0;
  const hasDirectBonuses = breakdown.totalBonusNetImmediateAnnual > 0;

  const hasDailyBenefits =
    simulationParams.transportPass.enabled ||
    simulationParams.mutuelle.enabled ||
    simulationParams.mealVouchers.enabled;

  const netPurchasingPowerMonthly =
    breakdown.netInBankMonthlyStandard + breakdown.mealVouchersEmployerMonthly;

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-lg relative overflow-hidden">
      {/* Background visual accents */}
      <div className="absolute -right-16 -top-16 w-56 h-56 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute right-20 -bottom-20 w-44 h-44 bg-emerald-600/15 rounded-full blur-2xl pointer-events-none" />

      {/* Primary Card Header */}
      <div className="relative z-10 pb-4 border-b border-slate-800 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30 whitespace-nowrap">
            Synthèse Salariale Nette
          </span>
          <div className="text-right text-xs text-slate-400 whitespace-nowrap">
            <span>
              {breakdown.variableBonusEnabled && breakdown.variableBonusAmount > 0
                ? 'Brut total : '
                : 'Base brute : '}
            </span>
            <strong className="font-mono font-bold text-slate-100 whitespace-nowrap">
              {formatEuro(breakdown.grossMonthly)}
              <span className="font-normal text-slate-400"> / mois</span>
            </strong>
          </div>
        </div>

        <div className="flex items-baseline justify-between gap-2 flex-wrap">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white whitespace-nowrap">
            Montants Avant & Après impôts
          </h2>
          {breakdown.variableBonusEnabled && breakdown.variableBonusAmount > 0 && (
            <span className="text-[11px] font-mono text-blue-300 whitespace-nowrap bg-blue-900/40 px-2 py-0.5 rounded border border-blue-700/50">
              dont +{formatEuro(breakdown.variableBonusMonthly)}/m de variable
            </span>
          )}
        </div>
      </div>

      {/* Main Numbers Section - Separate visual blocks for Avant and Après impôts */}
      <div className="relative z-10 pt-4 pb-2 space-y-4">
        {/* BLOC 1: Salaire Net Avant Impôts (Contractuel / Fiche de paie) */}
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 rounded-2xl p-4 sm:p-5 border border-slate-700/80 shadow-md">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>1. Salaire Net Avant impôts</span>
            </div>
            <span className="text-[11px] font-semibold text-blue-300 bg-blue-950/60 border border-blue-800/60 px-2 py-0.5 rounded-md whitespace-nowrap">
              Contractuel fiche de paie
            </span>
          </div>

          <div className="flex items-baseline gap-2 flex-wrap my-1">
            <span className="text-3xl sm:text-4xl lg:text-5xl font-black font-mono tabular-nums tracking-tight text-white whitespace-nowrap">
              {formatEuro(breakdown.netBeforeTaxMonthly)}
            </span>
            <span className="text-base sm:text-lg font-medium text-slate-400 whitespace-nowrap">
              / mois
            </span>
          </div>

          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            {breakdown.has13thMonth ? (
              <span>
                Calculé sur la base de (brut/{breakdown.monthsCount})×12 ({formatEuro(breakdown.annualGrossRegular)}/an, soit {formatEuro(breakdown.grossMonthly)}/m brut) déduit de {Math.round(breakdown.employeeRate * 100)}% de cotisations salariales (-{formatEuro(breakdown.employeeContributionsMonthly)}/m).
              </span>
            ) : (
              <span>
                Montant issu du salaire brut ({formatEuro(breakdown.grossMonthly)}/m) déduit de {Math.round(breakdown.employeeRate * 100)}% de cotisations salariales (-{formatEuro(breakdown.employeeContributionsMonthly)}/m).
              </span>
            )}
          </p>

          <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-300">
            <span>Net annuel avant impôts (mois réguliers) :</span>
            <span className="font-mono font-bold text-white text-sm">
              {formatEuro(breakdown.netBeforeTaxAnnual)} / an
            </span>
          </div>

          {/* Net mensuel lissé avec 13ème ou 14ème mois */}
          {breakdown.has13thMonth ? (
            <div className="mt-3 pt-2.5 border-t border-blue-500/30 bg-blue-950/40 -mx-1 px-3 py-2 rounded-xl flex items-center justify-between gap-2 flex-wrap text-xs">
              <div className="flex items-center gap-1.5 text-blue-200 font-medium">
                <TrendingUp className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>
                  {breakdown.has14thMonth
                    ? 'Net mensuel lissé avec 14ème mois :'
                    : 'Net mensuel lissé avec 13ème mois :'}
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="font-mono font-bold text-blue-300 text-sm whitespace-nowrap">
                  {formatEuro(breakdown.smoothedNetBeforeTaxMonthly)}{' '}
                  <span className="text-xs font-normal text-blue-300/80">/ mois</span>
                </span>
                <span className="block text-[10px] text-slate-400 font-normal whitespace-nowrap">
                  Base {formatEuro(breakdown.baseNetBeforeTaxMonthly)}/m + {breakdown.has14thMonth ? '2/12èmes' : '1/12ème'} (+{formatEuro(breakdown.smoothed13th14thNetBeforeTaxMonthly)}/m) lissé sur l&apos;année ({formatEuro(breakdown.smoothedNetBeforeTaxAnnual)}/an)
                </span>
              </div>
            </div>
          ) : (
            /* Si 13e/14e mois non coché : le montant se base sur le Salaire Net Avant impôts, affiché si l'option lisser est cochée */
            smoothBonuses && hasDirectBonuses && (
              <div className="mt-3 pt-2.5 border-t border-blue-500/30 bg-blue-950/40 -mx-1 px-3 py-2 rounded-xl flex items-center justify-between gap-2 flex-wrap text-xs">
                <div className="flex items-center gap-1.5 text-blue-200 font-medium">
                  <TrendingUp className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Net mensuel lissé avec primes :</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-mono font-bold text-blue-300 text-sm whitespace-nowrap">
                    {formatEuro(breakdown.smoothedNetBeforeTaxWithBonuses)}{' '}
                    <span className="text-xs font-normal text-blue-300/80">/ mois</span>
                  </span>
                  <span className="block text-[10px] text-slate-400 font-normal whitespace-nowrap">
                    Net avant impôts ({formatEuro(breakdown.netBeforeTaxMonthly)}/m) + primes (+{formatEuro(breakdown.monthlyBonusAddition)}/m)
                  </span>
                </div>
              </div>
            )
          )}
        </div>

        {/* BLOC 2: Salaire Net Après Impôts (Net en poche) */}
        <div className="bg-gradient-to-br from-emerald-950/40 via-slate-800/90 to-slate-800/50 rounded-2xl p-4 sm:p-5 border border-emerald-500/40 shadow-inner">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <CreditCard className="w-4 h-4 shrink-0" />
              <span>2. Salaire Net Après impôts</span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-300 bg-emerald-950/80 border border-emerald-700/60 px-2 py-0.5 rounded-md whitespace-nowrap">
              Net en poche
            </span>
          </div>

          <div className="flex items-baseline gap-2 flex-wrap my-1">
            <span className="text-3xl sm:text-4xl lg:text-5xl font-black font-mono tabular-nums tracking-tight text-white whitespace-nowrap">
              {formatEuro(breakdown.netAfterTaxMonthly)}
            </span>
            <span className="text-base sm:text-lg font-medium text-slate-400 whitespace-nowrap">
              / mois
            </span>
          </div>

          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            {breakdown.has13thMonth ? (
              <span>
                Net en poche sur les 12 mois réguliers ({breakdown.has14thMonth ? 'les 13ème et 14ème mois sont versés en une fois' : 'le 13ème mois est versé en une fois'}). Calculé sur base (brut/{breakdown.monthsCount})×12 à partir du Net avant impôt ({formatEuro(breakdown.netBeforeTaxMonthly)}) déduit de l&apos;IR ({breakdown.estimatedTaxRate}%, soit -{formatEuro(breakdown.incomeTaxMonthly)}/m)
                {breakdown.mealVouchersDeductionMonthly > 0 && ` et des tickets restaurant (-${formatEuro(breakdown.mealVouchersDeductionMonthly)}/m)`}.
              </span>
            ) : breakdown.incomeTaxMonthly > 0 ? (
              <span>
                Calculé à partir du Net avant impôt ({formatEuro(breakdown.netBeforeTaxMonthly)}) déduit de l&apos;IR ({breakdown.estimatedTaxRate}%, soit -{formatEuro(breakdown.incomeTaxMonthly)}/m)
                {breakdown.mealVouchersDeductionMonthly > 0 && ` et des tickets restaurant (-${formatEuro(breakdown.mealVouchersDeductionMonthly)}/m)`}.
              </span>
            ) : (
              <span>
                Taux de prélèvement à la source à 0% (non imposable ou désactivé).
                {breakdown.mealVouchersDeductionMonthly > 0 && ` Déduit des tickets restaurant (-${formatEuro(breakdown.mealVouchersDeductionMonthly)}/m)`}.
              </span>
            )}
          </p>

          {/* Quick 0.1% Adjuster directly on card if handler provided */}
          {onAdjustTaxRate && (
            <div className="mt-2.5 pt-2 border-t border-slate-700/50 flex items-center justify-between gap-3 text-xs">
              <span className="text-slate-300 font-medium flex items-center gap-1.5 whitespace-nowrap">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                Taux IR (PAS) :
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => onAdjustTaxRate(-0.1)}
                  className="w-6 h-6 flex items-center justify-center rounded bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold transition-colors cursor-pointer"
                  title="Diminuer le taux d'impôt de 0,1%"
                  aria-label="Diminuer de 0,1 pourcent"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="font-mono font-bold text-emerald-400 w-14 text-center whitespace-nowrap">
                  {breakdown.estimatedTaxRate}%
                </span>
                <button
                  type="button"
                  onClick={() => onAdjustTaxRate(0.1)}
                  className="w-6 h-6 flex items-center justify-center rounded bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold transition-colors cursor-pointer"
                  title="Augmenter le taux d'impôt de 0,1%"
                  aria-label="Augmenter de 0,1 pourcent"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* Net mensuel lissé 13ème ou 14ème mois */}
          {breakdown.has13thMonth ? (
            <div className="mt-3 pt-2.5 border-t border-emerald-500/40 bg-emerald-950/50 -mx-1 px-3 py-2 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 text-emerald-200 font-medium">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>
                    {breakdown.has14thMonth
                      ? 'Net mensuel lissé 14ème mois :'
                      : 'Net mensuel lissé 13ème mois :'}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-mono font-bold text-emerald-300 text-sm whitespace-nowrap">
                    {formatEuro(breakdown.smoothedNetAfterTaxMonthly)}{' '}
                    <span className="text-xs font-normal text-emerald-300/80">/ mois</span>
                  </span>
                  <span className="block text-[10px] text-slate-400 font-normal whitespace-nowrap">
                    Base {formatEuro(breakdown.baseNetAfterTaxMonthly)}/m + {breakdown.has14thMonth ? '2/12èmes' : '1/12ème'} (+{formatEuro(breakdown.smoothed13th14thNetAfterTaxMonthly)}/m) lissé sur l&apos;année ({formatEuro(breakdown.smoothedNetAfterTaxAnnual)}/an)
                  </span>
                </div>
              </div>

              {/* Ajout du "Net mensuel lissé avec primes" au Net mensuel lissé 13e/14e mois si primes perçues ET option de lissage cochée */}
              {smoothBonuses && hasDirectBonuses && (
                <div className="pt-2 border-t border-emerald-500/30 flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 text-emerald-300 font-semibold">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Net mensuel lissé avec primes :</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-emerald-400 text-sm whitespace-nowrap">
                      {formatEuro(breakdown.smoothedNetAfterTaxWithBonuses)}{' '}
                      <span className="text-xs font-normal text-emerald-300/80">/ mois</span>
                    </span>
                    <span className="block text-[10px] text-emerald-400/90 font-normal whitespace-nowrap">
                      Net lissé ({formatEuro(breakdown.smoothedNetAfterTaxMonthly)}) + primes (+{formatEuro(breakdown.monthlyBonusAddition)}/m)
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Si 13e/14e mois non coché : le montant se base sur le Salaire Net Après impôts, uniquement si l'option lisser est cochée */
            smoothBonuses && hasDirectBonuses && (
              <div className="mt-3 pt-2.5 border-t border-emerald-500/40 bg-emerald-950/50 -mx-1 px-3 py-2 rounded-xl text-xs">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 text-emerald-300 font-semibold">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Net mensuel lissé avec primes :</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-emerald-400 text-sm whitespace-nowrap">
                      {formatEuro(breakdown.smoothedNetAfterTaxWithBonuses)}{' '}
                      <span className="text-xs font-normal text-emerald-300/80">/ mois</span>
                    </span>
                    <span className="block text-[10px] text-emerald-400/90 font-normal whitespace-nowrap">
                      Net après impôts ({formatEuro(breakdown.netAfterTaxMonthly)}) + primes (+{formatEuro(breakdown.monthlyBonusAddition)}/m)
                    </span>
                  </div>
                </div>
              </div>
            )
          )}

          {/* Virement bancaire effectif & Avantages du quotidien */}
          {hasDailyBenefits ? (
            <div className="mt-3.5 p-3.5 rounded-xl bg-slate-900/90 border border-emerald-500/30 text-xs space-y-2.5">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="font-bold flex items-center gap-1.5 text-emerald-400 text-xs uppercase tracking-wide">
                  <Landmark className="w-4 h-4 shrink-0 text-emerald-400" />
                  Virement bancaire effectif :
                </span>
                <span className="font-mono font-black text-white text-base whitespace-nowrap">
                  {formatEuro(breakdown.netInBankMonthlyStandard)}{' '}
                  <span className="text-xs font-normal text-slate-400">/ mois</span>
                </span>
              </div>

              {/* Détails concrets des ajustements sur le compte bancaire */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-[11px]">
                {simulationParams.transportPass.enabled && (
                  <div className="bg-slate-800/60 p-2 rounded-lg border border-slate-700/60">
                    <span className="text-slate-400 block flex items-center gap-1">
                      <Bus className="w-3 h-3 text-blue-400 shrink-0" />
                      Transports :
                    </span>
                    <strong className="font-mono text-emerald-400 block mt-0.5">
                      +{formatEuro(breakdown.transportReimbursementMonthly)} € / m
                    </strong>
                    <span className="text-[10px] text-slate-500">
                      Remboursé {simulationParams.transportPass.employerSharePercent}%
                    </span>
                  </div>
                )}

                {simulationParams.mutuelle.enabled && (
                  <div className="bg-slate-800/60 p-2 rounded-lg border border-slate-700/60">
                    <span className="text-slate-400 block flex items-center gap-1">
                      <HeartPulse className="w-3 h-3 text-rose-400 shrink-0" />
                      Mutuelle salarié :
                    </span>
                    <strong className="font-mono text-rose-400 block mt-0.5">
                      -{formatEuro(breakdown.mutuelleDeductionMonthly)} € / m
                    </strong>
                    <span className="text-[10px] text-slate-500">
                      Patronale : +{formatEuro(breakdown.mutuelleEmployerMonthly)} €/m
                    </span>
                  </div>
                )}

                {simulationParams.mealVouchers.enabled && (
                  <div className="bg-slate-800/60 p-2 rounded-lg border border-slate-700/60">
                    <span className="text-slate-400 block flex items-center gap-1">
                      <Utensils className="w-3 h-3 text-amber-400 shrink-0" />
                      Tickets resto :
                    </span>
                    <strong className="font-mono text-amber-300 block mt-0.5">
                      +{formatEuro(breakdown.mealVouchersEmployerMonthly)} € / m
                    </strong>
                    <span className="text-[10px] text-slate-500">
                      (Part salarié -{formatEuro(breakdown.mealVouchersDeductionMonthly)} € déduite)
                    </span>
                  </div>
                )}
              </div>

              {/* Pouvoir d'achat net global (Virement + Tickets resto employeur) */}
              {simulationParams.mealVouchers.enabled && (
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2 flex-wrap text-xs">
                  <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                    <Wallet className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    Pouvoir d&apos;achat net mensuel avec tickets resto :
                  </span>
                  <span className="font-mono font-bold text-emerald-300 whitespace-nowrap">
                    {formatEuro(netPurchasingPowerMonthly)} € / mois
                  </span>
                </div>
              )}

              {/* Prise en charge employeur totale */}
              <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between gap-2 flex-wrap text-[11px] text-slate-400">
                <span>Prise en charge globale employeur au quotidien :</span>
                <span className="font-mono font-bold text-emerald-400">
                  +{formatEuro(breakdown.totalEmployerBenefitsMonthly)} € / mois non imposables
                </span>
              </div>
            </div>
          ) : (
            <div className="mt-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between gap-2 flex-wrap">
              <span className="flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                Avantages du quotidien (Transports, Mutuelle, Titres-Restaurant) : désactivés.
              </span>
              <span className="text-slate-500 italic text-[10px]">
                Activables dans l&apos;étape 2
              </span>
            </div>
          )}
        </div>

        {/* Part variable si activée */}
        {breakdown.variableBonusEnabled && breakdown.variableBonusAmount > 0 && (
          <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-blue-950/40 border border-blue-800/50 text-xs">
            <div>
              <span className="text-blue-300 font-bold flex items-center gap-1.5 whitespace-nowrap">
                <TrendingUp className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                Montant du variable ({breakdown.variableBonusPercent}%) :
              </span>
              <span className="text-[10px] text-slate-400 block whitespace-nowrap">
                +{formatEuro(breakdown.variableBonusAmount)} / an brut
              </span>
            </div>
            <span className="text-sm font-bold font-mono text-blue-300 tabular-nums whitespace-nowrap shrink-0">
              +{formatEuro(breakdown.variableBonusMonthly)} / mois
            </span>
          </div>
        )}

        {/* Projection des augmentations annuelles sur 5 ans (désactivée par défaut) */}
        <YearlyProjection
          simulationParams={simulationParams}
          baseBreakdown={breakdown}
          enabled={isProjectionActive}
          onToggle={toggleProjection}
          yearlyIncreases={currentIncreases}
          onChangeIncrease={changeIncrease}
          onApplyPreset={applyPreset}
        />
      </div>

      {/* Bonus / Epargne Salariale Notification Strip (Placements PEE/PER uniquement) */}
      {hasPlacedBonuses && (
        <div className="relative z-10 pt-4 border-t border-slate-800 space-y-2.5">
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/50 text-xs">
            <PiggyBank className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2 flex-wrap">
                <span className="text-emerald-300 font-semibold whitespace-nowrap">
                  {formatEuro(breakdown.totalBonusNetPlacedAnnual)} placés sur PEE/PER
                </span>
                <span className="text-[11px] font-mono text-emerald-400/90 whitespace-nowrap">
                  Économie : +{formatEuro(breakdown.totalTaxSavedByPlacement)}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                100% exonéré d&apos;impôt sur le revenu
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
