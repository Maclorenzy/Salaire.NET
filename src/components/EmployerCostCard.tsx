/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SalaryBreakdown } from '../types/salary';
import { formatEuro } from '../utils/salaryCalculations';
import { Building2, PieChart, ChevronDown, ChevronUp } from 'lucide-react';

interface EmployerCostCardProps {
  breakdown: SalaryBreakdown;
}

export const EmployerCostCard: React.FC<EmployerCostCardProps> = ({ breakdown }) => {
  const [isOpen, setIsOpen] = useState(true);

  const totalCost = breakdown.totalEmployerCostMonthly;
  const netInPocket = breakdown.netInBankMonthlyStandard;
  const totalSocial = breakdown.employeeContributionsMonthly + breakdown.employerContributionsMonthly;
  const incomeTax = breakdown.incomeTaxMonthly;

  const netPercent = totalCost > 0 ? Math.round((netInPocket / totalCost) * 100) : 0;
  const taxPercent = totalCost > 0 ? Math.round((incomeTax / totalCost) * 100) : 0;
  const socialPercent = Math.max(0, 100 - netPercent - taxPercent);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="bg-slate-50/80 p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-100/60 transition-colors select-none border-b border-slate-200/80"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Coût Total Employeur (Super-Brut)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Ce que votre entreprise débourse réellement chaque mois pour votre poste
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] text-slate-400 font-medium block whitespace-nowrap">
              Super-brut mensuel
            </span>
            <div className="text-sm sm:text-base font-bold font-mono text-slate-800 tabular-nums whitespace-nowrap">
              {formatEuro(breakdown.totalEmployerCostMonthly)}{' '}
              <span className="text-xs font-normal text-slate-500">/ mois</span>
            </div>
          </div>

          <button
            type="button"
            className="text-slate-500 hover:text-slate-800 p-1 rounded-md cursor-pointer"
            aria-label={isOpen ? 'Replier le coût employeur' : 'Déplier le coût employeur'}
          >
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="p-5 sm:p-6 space-y-4">
          {/* Main KPI Cost */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
          <span className="text-xs font-medium text-slate-500 block mb-1">
            Coût Total Mensuel (Entreprise)
          </span>
          <div className="text-xl sm:text-2xl font-black font-mono text-slate-900 tabular-nums">
            {formatEuro(breakdown.totalEmployerCostMonthly)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Brut + cotisations patronales (~{Math.round(breakdown.employerRate * 100)}%)
          </span>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
          <span className="text-xs font-medium text-slate-500 block mb-1">
            Cotisations Patronales
          </span>
          <div className="text-xl sm:text-2xl font-black font-mono text-indigo-900 tabular-nums">
            {formatEuro(breakdown.employerContributionsMonthly)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Sécurité sociale, chômage, retraite, prévoyance
          </span>
        </div>

        <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-3">
          <span className="text-xs font-medium text-emerald-800 block mb-1">
            Reste Net dans votre poche
          </span>
          <div className="text-xl sm:text-2xl font-black font-mono text-emerald-700 tabular-nums">
            {formatEuro(breakdown.netInBankMonthlyStandard)}
          </div>
          <span className="text-[11px] text-emerald-700/80 mt-1 block">
            Soit <strong>{netPercent}%</strong> du coût global entreprise
          </span>
        </div>
      </div>

      {/* Distribution visual progress bar */}
      <div className="pt-2">
        <div className="flex justify-between text-xs font-medium text-slate-600 mb-1.5">
          <span>Ventilation du budget employeur (100%) :</span>
        </div>
        <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
          <div
            style={{ width: `${netPercent}%` }}
            className="bg-emerald-500 transition-all duration-300"
            title={`Net Salarié : ${netPercent}%`}
          />
          <div
            style={{ width: `${socialPercent}%` }}
            className="bg-indigo-500 transition-all duration-300"
            title={`Cotisations sociales (salariales + patronales) : ${socialPercent}%`}
          />
          <div
            style={{ width: `${taxPercent}%` }}
            className="bg-amber-500 transition-all duration-300"
            title={`Impôt sur le Revenu : ${taxPercent}%`}
          />
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs mt-2.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-700 font-medium">Votre net en poche ({netPercent}%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <span className="text-slate-700 font-medium">Cotisations sociales ({socialPercent}%)</span>
          </div>
          {taxPercent > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-slate-700 font-medium">Impôt sur le revenu ({taxPercent}%)</span>
            </div>
          )}
        </div>
      </div>
        </div>
      )}
    </div>
  );
};
