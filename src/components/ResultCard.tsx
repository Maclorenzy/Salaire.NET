/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SalaryBreakdown } from '../types/salary';
import { formatEuro } from '../utils/salaryCalculations';
import { CreditCard, TrendingUp, PiggyBank, Minus, Plus, ShieldCheck, Landmark } from 'lucide-react';

interface ResultCardProps {
  breakdown: SalaryBreakdown;
  smoothBonuses: boolean;
  onAdjustTaxRate?: (delta: number) => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  breakdown,
  smoothBonuses,
  onAdjustTaxRate,
}) => {
  const hasPlacedBonuses = breakdown.totalBonusNetPlacedAnnual > 0;
  const hasDirectBonuses = breakdown.totalBonusNetImmediateAnnual > 0;

  // Différence entre Net après impôts et Virement bancaire
  const bankWireDeltaMonthly =
    breakdown.transportReimbursementMonthly -
    breakdown.mutuelleDeductionMonthly;
  const hasBankAdjustments =
    breakdown.transportReimbursementMonthly > 0 ||
    breakdown.mutuelleDeductionMonthly > 0;

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-lg relative overflow-hidden">
      {/* Background visual accents */}
      <div className="absolute -right-16 -top-16 w-56 h-56 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute right-20 -bottom-20 w-44 h-44 bg-emerald-600/15 rounded-full blur-2xl pointer-events-none" />

      {/* Primary KPI Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-slate-800">
        <div>
          <span className="text-xs font-semibold tracking-wide uppercase text-blue-400">
            Résultat de la simulation
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-0.5">
            Salaire Net Après impôts
          </h2>
        </div>
        <div className="text-left sm:text-right">
          <span className="text-xs text-slate-400">
            {breakdown.variableBonusEnabled && breakdown.variableBonusAmount > 0
              ? `Brut total (${breakdown.variableBonusPercent}% var. inclus) :`
              : 'Base brute :'}
          </span>
          <div className="text-sm font-mono font-semibold text-slate-200">
            {formatEuro(breakdown.grossMonthly)} <span className="text-xs text-slate-400">/ mois</span>
          </div>
          {breakdown.variableBonusEnabled && breakdown.variableBonusAmount > 0 && (
            <div className="text-[11px] font-mono text-blue-300">
              dont {formatEuro(breakdown.variableBonusMonthly)}/m de variable
            </div>
          )}
        </div>
      </div>

      {/* Main Numbers Grid */}
      <div className="relative z-10 py-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Dominant Hero Value : Salaire Net Après impôts */}
        <div className="space-y-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
              <CreditCard className="w-4 h-4" />
              <span>Salaire Net Après impôts</span>
            </div>
            <div className="text-4xl sm:text-5xl font-black font-mono tabular-nums tracking-tight text-white">
              {formatEuro(breakdown.netAfterTaxMonthly)}
              <span className="text-lg sm:text-xl font-normal text-slate-400 ml-1">/ mois</span>
            </div>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Calculé à partir du Net avant impôt ({formatEuro(breakdown.netBeforeTaxMonthly)}) déduit de l&apos;IR ({breakdown.estimatedTaxRate}%, soit -{formatEuro(breakdown.incomeTaxMonthly)}/m)
              {breakdown.mealVouchersDeductionMonthly > 0 ? ` et de la part employé tickets restaurant (-${formatEuro(breakdown.mealVouchersDeductionMonthly)}/m)` : ''}.
            </p>
          </div>

          {/* Virement bancaire final avec explicitation des ajustements */}
          {hasBankAdjustments && (
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs space-y-1.5">
              <div className="flex items-center justify-between text-slate-200">
                <span className="font-semibold flex items-center gap-1.5 text-emerald-400">
                  <Landmark className="w-3.5 h-3.5" />
                  Virement bancaire effectif :
                </span>
                <span className="font-mono font-bold text-white text-sm">
                  {formatEuro(breakdown.netInBankMonthlyStandard)} / mois
                </span>
              </div>
              <div className="text-[11px] text-slate-400 leading-normal">
                Différence de {bankWireDeltaMonthly > 0 ? `+${formatEuro(bankWireDeltaMonthly)}` : formatEuro(bankWireDeltaMonthly)} liée aux compléments employeur :
                {breakdown.mutuelleDeductionMonthly > 0 && ` Mutuelle (-${formatEuro(breakdown.mutuelleDeductionMonthly)})`}
                {breakdown.transportReimbursementMonthly > 0 && ` · Remboursement transport (+${formatEuro(breakdown.transportReimbursementMonthly)})`}
              </div>
            </div>
          )}
        </div>

        {/* Secondary KPI Block : Avant impôts + Montant du variable + Réglage IR */}
        <div className="space-y-3 bg-slate-800/60 rounded-xl p-4 border border-slate-700/60">
          {/* Salaire Net Avant impôts (gardé bien en évidence) */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-300 font-semibold block">
                Salaire Net Avant impôts :
              </span>
              <span className="text-[10px] text-slate-400">
                (Montant contractuel avant prélèvement à la source)
              </span>
            </div>
            <span className="text-lg font-bold font-mono text-white tabular-nums">
              {formatEuro(breakdown.netBeforeTaxMonthly)} <span className="text-xs text-slate-400 font-normal">/ mois</span>
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
            <span className="text-xs text-slate-300 font-medium">Net annuel avant impôts :</span>
            <span className="text-sm font-bold font-mono text-slate-200 tabular-nums">
              {formatEuro(breakdown.netBeforeTaxAnnual)} <span className="text-xs text-slate-400 font-normal">/ an</span>
            </span>
          </div>

          {/* Montant du variable (si activé) */}
          {breakdown.variableBonusEnabled && breakdown.variableBonusAmount > 0 && (
            <div className="flex items-center justify-between pt-2 border-t border-slate-700/50 bg-blue-950/30 -mx-4 px-4 py-2 rounded-lg">
              <div>
                <span className="text-xs text-blue-300 font-bold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                  Montant du variable ({breakdown.variableBonusPercent}%) :
                </span>
                <span className="text-[10px] text-slate-400">
                  (Prime sur objectifs intégrée au brut)
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold font-mono text-blue-300 tabular-nums block">
                  +{formatEuro(breakdown.variableBonusMonthly)} / mois
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  +{formatEuro(breakdown.variableBonusAmount)} / an brut
                </span>
              </div>
            </div>
          )}

          {/* Quick 0.1% Adjuster directly on card if handler provided */}
          {onAdjustTaxRate && (
            <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                Taux IR (PAS) :
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onAdjustTaxRate(-0.1)}
                  className="w-6 h-6 flex items-center justify-center rounded bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold transition-colors cursor-pointer"
                  title="Diminuer le taux d'impôt de 0,1%"
                  aria-label="Diminuer de 0,1 pourcent"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="font-mono font-bold text-blue-300 w-12 text-center">
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

          {/* If bonuses are smoothed */}
          {hasDirectBonuses && (
            <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
              <div>
                <span className="text-xs text-emerald-300 font-medium flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  Net mensuel lissé avec primes :
                </span>
                <span className="text-[10px] text-slate-400">
                  (+{formatEuro(Math.round(breakdown.totalBonusNetImmediateAnnual / 12))}/m participation/intéressement)
                </span>
              </div>
              <span className="text-sm font-bold font-mono text-emerald-400 tabular-nums">
                {formatEuro(breakdown.netInBankMonthlySmoothed)}/m
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bonus / Epargne Salariale Notification Strip */}
      {(hasPlacedBonuses || hasDirectBonuses) && (
        <div className="relative z-10 pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {hasPlacedBonuses && (
            <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/50 text-xs">
              <PiggyBank className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-emerald-300 font-semibold">
                  {formatEuro(breakdown.totalBonusNetPlacedAnnual)} placés sur PEE/PER
                </span>
                <p className="text-[11px] text-emerald-400/80">
                  Exonéré d&apos;impôt · Économie : +{formatEuro(breakdown.totalTaxSavedByPlacement)}
                </p>
              </div>
            </div>
          )}

          {hasDirectBonuses && (
            <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-blue-950/40 border border-blue-800/50 text-xs">
              <CreditCard className="w-4 h-4 text-blue-400 shrink-0" />
              <div>
                <span className="text-blue-300 font-semibold">
                  {formatEuro(breakdown.totalBonusNetImmediateAnnual)} versés en direct
                </span>
                <p className="text-[11px] text-blue-400/80">
                  {smoothBonuses
                    ? 'Inclus dans votre budget mensuel lissé'
                    : 'Perçu en un versement ponctuel (mai/juin)'}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
