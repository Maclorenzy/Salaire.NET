/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EmployeeStatus, VariableBonusConfig } from '../types/salary';
import { formatEuro } from '../utils/salaryCalculations';
import { Minus, Plus, Briefcase, UserCheck, TrendingUp } from 'lucide-react';

interface SalaryInputSectionProps {
  grossAnnual: number;
  setGrossAnnual: (value: number) => void;
  status: EmployeeStatus;
  setStatus: (status: EmployeeStatus) => void;
  monthsCount: 12 | 13 | 14;
  setMonthsCount: (months: 12 | 13 | 14) => void;
  variableBonus: VariableBonusConfig;
  setVariableBonus: React.Dispatch<React.SetStateAction<VariableBonusConfig>>;
}

export const SalaryInputSection: React.FC<SalaryInputSectionProps> = ({
  grossAnnual,
  setGrossAnnual,
  status,
  setStatus,
  monthsCount,
  setMonthsCount,
  variableBonus,
  setVariableBonus,
}) => {
  const handleIncrement = (delta: number) => {
    const nextVal = Math.max(0, Math.round((grossAnnual + delta) / 1000) * 1000);
    setGrossAnnual(nextVal);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      setGrossAnnual(Math.max(0, val));
    } else {
      setGrossAnnual(0);
    }
  };

  // Variable bonus handlers (+1% step)
  const handleVariableIncrement = (delta: number) => {
    const current = variableBonus.percent || 0;
    const next = Math.max(0, Math.min(100, Math.round(current + delta)));
    setVariableBonus({
      ...variableBonus,
      percent: next,
    });
  };

  const handleVariableInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setVariableBonus({
      ...variableBonus,
      percent: isNaN(val) ? 0 : Math.max(0, Math.min(100, val)),
    });
  };

  // Calculations for display
  const variableAmountAnnual = variableBonus.enabled
    ? Math.round(grossAnnual * (variableBonus.percent / 100))
    : 0;
  const totalGrossAnnual = grossAnnual + variableAmountAnnual;
  const monthlyGrossTotal = Math.round(totalGrossAnnual / monthsCount);
  const monthlyGrossBase = Math.round(grossAnnual / monthsCount);
  const monthlyVariableGross = Math.round(variableAmountAnnual / monthsCount);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            1. Salaire Brut Annuel & Statut
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Fixe annuel (par 1 000 €) · Part variable cadre · Statut & mensualités
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400 font-medium">
            {variableBonus.enabled ? 'Brut total moyen' : 'Brut mensuel'}
          </span>
          <div className="text-sm font-bold text-slate-800 font-mono tabular-nums">
            {formatEuro(monthlyGrossTotal)} <span className="text-xs font-normal text-slate-500">/ mois</span>
          </div>
        </div>
      </div>

      {/* Main Base Gross Input with Steppers */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="gross-input" className="block text-xs font-semibold text-slate-700">
            Salaire brut fixe annuel
          </label>
          <span className="text-xs font-mono text-slate-500">
            {formatEuro(monthlyGrossBase)} / mois (fixe)
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Quick -1000 button */}
          <button
            type="button"
            onClick={() => handleIncrement(-1000)}
            className="flex items-center justify-center w-10 h-11 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer shrink-0"
            title="Diminuer de 1 000 €"
            aria-label="Diminuer de 1 000 euros"
          >
            <Minus className="w-4 h-4" />
          </button>

          {/* Stepper Input with 1000 step */}
          <div className="relative flex-1">
            <input
              id="gross-input"
              type="number"
              step={1000}
              min={0}
              max={500000}
              value={grossAnnual || ''}
              onChange={handleInputChange}
              className="w-full h-11 pl-4 pr-14 text-lg sm:text-xl font-bold font-mono tabular-nums text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
              placeholder="Ex: 45000"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
              € / an
            </span>
          </div>

          {/* Quick +1000 button */}
          <button
            type="button"
            onClick={() => handleIncrement(1000)}
            className="flex items-center justify-center w-10 h-11 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer shrink-0"
            title="Augmenter de 1 000 €"
            aria-label="Augmenter de 1 000 euros"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Range Slider with 1000 step */}
        <div className="mt-3">
          <input
            type="range"
            min={0}
            max={120000}
            step={1000}
            value={grossAnnual}
            onChange={(e) => setGrossAnnual(parseInt(e.target.value, 10) || 0)}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-1">
            <span>0 €</span>
            <span>40 000 €</span>
            <span>80 000 €</span>
            <span>120 000 €</span>
          </div>
        </div>
      </div>

      {/* Part variable cadre (Activable/Désactivable avec pas de +1%) */}
      <div className="mb-5 p-4 rounded-xl border border-slate-200 bg-slate-50/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600 shrink-0" />
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Part variable annuelle (Bonus sur objectifs / Cadres)
              </span>
              <span className="text-[11px] text-slate-500">
                Prévue au contrat, calculée en % du salaire brut fixe
              </span>
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-slate-700 self-start sm:self-center">
            <input
              type="checkbox"
              checked={variableBonus.enabled}
              onChange={(e) =>
                setVariableBonus({ ...variableBonus, enabled: e.target.checked })
              }
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <span>{variableBonus.enabled ? 'Variable activé' : 'Activer le variable'}</span>
          </label>
        </div>

        {variableBonus.enabled && (
          <div className="pt-3 border-t border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-700">
                Pourcentage variable annuel :
              </span>
              <div className="flex items-center gap-1.5">
                {/* -1% button */}
                <button
                  type="button"
                  onClick={() => handleVariableIncrement(-1)}
                  className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                  title="Diminuer de 1%"
                  aria-label="Diminuer de 1 pourcent"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                {/* Direct % input with step 1% */}
                <div className="relative w-20">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={1}
                    value={variableBonus.percent}
                    onChange={handleVariableInputChange}
                    className="w-full h-8 px-2 pr-6 text-center text-sm font-bold font-mono text-slate-900 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                    %
                  </span>
                </div>

                {/* +1% button */}
                <button
                  type="button"
                  onClick={() => handleVariableIncrement(1)}
                  className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                  title="Augmenter de 1%"
                  aria-label="Augmenter de 1 pourcent"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Slider with step of 1% */}
            <input
              type="range"
              min={0}
              max={50}
              step={1}
              value={variableBonus.percent}
              onChange={(e) =>
                setVariableBonus({ ...variableBonus, percent: parseInt(e.target.value, 10) || 0 })
              }
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />

            {/* Live calculation breakdown */}
            <div className="grid grid-cols-2 gap-2 p-2.5 bg-white border border-slate-200 rounded-lg text-xs">
              <div>
                <span className="text-[11px] text-slate-500 block">Montant du variable brut :</span>
                <span className="font-mono font-bold text-blue-700">
                  +{formatEuro(variableAmountAnnual)} / an
                </span>
                <span className="text-[10px] text-slate-400 block">
                  (+{formatEuro(monthlyVariableGross)} / mois)
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-500 block">Total Brut (Fixe + Variable) :</span>
                <span className="font-mono font-bold text-slate-900">
                  {formatEuro(totalGrossAnnual)} / an
                </span>
                <span className="text-[10px] text-slate-400 block">
                  ({formatEuro(monthlyGrossTotal)} / mois)
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cadre vs Non-Cadre Selector & Months Count */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
        {/* Statut Cadre / Non-Cadre */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Statut professionnel
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => setStatus('non_cadre')}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium rounded-md transition-all cursor-pointer ${
                status === 'non_cadre'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-slate-500" />
              <span>Non-cadre</span>
            </button>
            <button
              type="button"
              onClick={() => setStatus('cadre')}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium rounded-md transition-all cursor-pointer ${
                status === 'cadre'
                  ? 'bg-white text-blue-700 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-blue-600" />
              <span>Cadre</span>
            </button>
          </div>
          <div className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
            {status === 'cadre' ? (
              <span>
                Cotisations salariales estimées à <strong>~25%</strong> (APEC, prévoyance cadre 1,5% et retraite tranche 2).
              </span>
            ) : (
              <span>
                Cotisations salariales estimées à <strong>~24%</strong> (taux moyen conventionnel du secteur privé).
              </span>
            )}
          </div>
        </div>

        {/* Months Count: 12, 13 or 14 months */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Nombre de mois de versement
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => setMonthsCount(12)}
              className={`py-2 px-2 text-xs font-medium rounded-md transition-all cursor-pointer ${
                monthsCount === 12
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              12 mois
            </button>
            <button
              type="button"
              onClick={() => setMonthsCount(13)}
              className={`py-2 px-2 text-xs font-medium rounded-md transition-all cursor-pointer ${
                monthsCount === 13
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              13 mois
            </button>
            <button
              type="button"
              onClick={() => setMonthsCount(14)}
              className={`py-2 px-2 text-xs font-medium rounded-md transition-all cursor-pointer ${
                monthsCount === 14
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              14 mois
            </button>
          </div>
          <div className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
            {monthsCount === 14
              ? 'Réparti sur 14 mensualités (ex: banques, assurances, chimie ou conventions spécifiques).'
              : monthsCount === 13
              ? 'Réparti sur 13 mensualités (inclut la prime de 13ème mois de fin d\'année).'
              : 'Paiement standard régulier réparti sur 12 mensualités.'}
          </div>
        </div>
      </div>
    </div>
  );
};
