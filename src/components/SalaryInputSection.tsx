/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { EmployeeStatus, VariableBonusConfig } from '../types/salary';
import { formatEuro } from '../utils/salaryCalculations';
import { Minus, Plus, Briefcase, UserCheck, TrendingUp, Calendar, Info, ChevronDown, ChevronUp, Coins } from 'lucide-react';

interface SalaryInputSectionProps {
  grossAnnual: number;
  setGrossAnnual: (value: number) => void;
  status: EmployeeStatus;
  setStatus: (status: EmployeeStatus) => void;
  employeeContributionRate: number;
  setEmployeeContributionRate: (rate: number) => void;
  has13thMonth: boolean;
  setHas13thMonth: (checked: boolean) => void;
  has14thMonth: boolean;
  setHas14thMonth: (checked: boolean) => void;
  variableBonus: VariableBonusConfig;
  setVariableBonus: React.Dispatch<React.SetStateAction<VariableBonusConfig>>;
}

export const SalaryInputSection: React.FC<SalaryInputSectionProps> = ({
  grossAnnual,
  setGrossAnnual,
  status,
  setStatus,
  employeeContributionRate,
  setEmployeeContributionRate,
  has13thMonth,
  setHas13thMonth,
  has14thMonth,
  setHas14thMonth,
  variableBonus,
  setVariableBonus,
}) => {
  const [isOpen, setIsOpen] = useState(true);

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

  // Calcul standard sur base 12 mois
  const variableAmountAnnual = variableBonus.enabled
    ? Math.round(grossAnnual * (variableBonus.percent / 100))
    : 0;
  const totalGrossAnnual = grossAnnual + variableAmountAnnual;

  // Salaire brut mensuel régulier selon le nombre de mois (12, 13 ou 14)
  const monthsCount = has14thMonth ? 14 : has13thMonth ? 13 : 12;
  const monthlyGrossBase = Math.round(grossAnnual / monthsCount);
  const monthlyVariableGross = Math.round(variableAmountAnnual / 12);
  const monthlyGrossTotal = monthlyGrossBase + monthlyVariableGross;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Clickable Card Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="bg-slate-50/80 p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-100/60 transition-colors select-none border-b border-slate-200/80"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Coins className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              1. Salaire Brut Annuel & Statut
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Fixe annuel (par 1 000 €) · Statut & 13e/14e mois · Part variable
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="text-right">
            <span className="text-[11px] text-slate-400 font-medium block whitespace-nowrap">
              {variableBonus.enabled ? `Brut total (${monthsCount} m.)` : `Brut mensuel (${monthsCount} m.)`}
            </span>
            <div className="text-sm sm:text-base font-bold text-slate-900 font-mono tabular-nums whitespace-nowrap">
              {formatEuro(monthlyGrossTotal)}{' '}
              <span className="text-xs font-normal text-slate-500">/ mois</span>
            </div>
          </div>

          <button
            type="button"
            className="text-slate-500 hover:text-slate-800 p-1 rounded-md cursor-pointer"
            aria-label={isOpen ? 'Replier la section' : 'Déplier la section'}
          >
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="p-5 sm:p-6 space-y-5">

      {/* 1. Main Base Gross Input with Steppers */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-1.5 gap-2">
          <label htmlFor="gross-input" className="block text-xs font-semibold text-slate-700 whitespace-nowrap">
            Salaire brut fixe annuel
          </label>
          <span className="text-xs font-mono text-slate-500 whitespace-nowrap">
            {formatEuro(monthlyGrossBase)} / mois (base {monthsCount} mois)
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

      {/* 2. Statut professionnel & Nombre de mois de versement (placé AU-DESSUS de la part variable) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 mb-5">
        {/* Statut Cadre / Non-Cadre */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Statut professionnel
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => {
                setStatus('non_cadre');
                setEmployeeContributionRate(24);
              }}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 text-xs rounded-md transition-all cursor-pointer ${
                status === 'non_cadre'
                  ? 'bg-white text-slate-900 shadow-sm font-bold border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 font-medium'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-slate-500" />
              <span>Non-cadre</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setStatus('cadre');
                setEmployeeContributionRate(25);
              }}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 text-xs rounded-md transition-all cursor-pointer ${
                status === 'cadre'
                  ? 'bg-white text-blue-700 shadow-sm font-bold border border-blue-200'
                  : 'text-slate-600 hover:text-slate-900 font-medium'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-blue-600" />
              <span>Cadre</span>
            </button>
          </div>

          {/* Curseur pour ajuster la part de cotisations salariales avec incrémentation de 1% */}
          <div className="mt-2.5 p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
            <div className="flex items-center justify-between gap-1">
              <div>
                <span className="text-[11px] font-bold text-slate-800 block">
                  Cotisations salariales :
                </span>
                <span className="text-[10px] text-slate-500">
                  {status === 'cadre' ? 'Standard Cadre : 25%' : 'Standard Non-cadre : 24%'}
                </span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setEmployeeContributionRate(Math.max(10, Math.min(45, employeeContributionRate - 1)))}
                  className="w-6 h-6 flex items-center justify-center rounded border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                  title="Diminuer de 1%"
                  aria-label="Diminuer les cotisations de 1 pourcent"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <div className="relative w-14">
                  <input
                    type="number"
                    min={10}
                    max={45}
                    step={1}
                    value={employeeContributionRate}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (!isNaN(val)) setEmployeeContributionRate(Math.max(10, Math.min(45, val)));
                    }}
                    className="w-full h-6 px-1 pr-4 text-center text-xs font-bold font-mono text-slate-900 bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-slate-400">
                    %
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setEmployeeContributionRate(Math.max(10, Math.min(45, employeeContributionRate + 1)))}
                  className="w-6 h-6 flex items-center justify-center rounded border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                  title="Augmenter de 1%"
                  aria-label="Augmenter les cotisations de 1 pourcent"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Slider avec pas de 1% */}
            <input
              type="range"
              min={15}
              max={35}
              step={1}
              value={employeeContributionRate}
              onChange={(e) => setEmployeeContributionRate(parseInt(e.target.value, 10) || 24)}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />

            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>15%</span>
              <span className="text-blue-700 font-semibold">{employeeContributionRate}% appliqué</span>
              <span>35%</span>
            </div>
          </div>
        </div>

        {/* 13ème et 14ème mois : options pour activer l'affichage du lissage de salaire */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-slate-700">
              13ème & 14ème mois (Optionnel)
            </label>
            <span className="text-[11px] font-mono text-slate-500">
              {has14thMonth
                ? '13e & 14e mois activés'
                : has13thMonth
                ? '13e mois activé'
                : 'Base 12 mois'}
            </span>
          </div>

          <div className="space-y-2.5">
            {/* Case à cocher 13ème mois */}
            <label
              className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                has13thMonth
                  ? 'border-blue-300 bg-blue-50/80 shadow-xs'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100/70'
              }`}
            >
              <input
                type="checkbox"
                checked={has13thMonth}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setHas13thMonth(checked);
                  if (!checked) {
                    setHas14thMonth(false);
                  }
                }}
                className="mt-0.5 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 flex-wrap">
                  <span className="text-xs font-bold text-slate-900">
                    13ème mois
                  </span>
                  {has13thMonth && (
                    <span className="text-[11px] font-mono font-bold text-blue-700 whitespace-nowrap">
                      Base (brut / 13) × 12
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Compris dans le brut annuel (versé en une fois). Mensualités régulières sur base (brut/13)×12 et lissage avec +1/12 de salaire mensuel.
                </p>
              </div>
            </label>

            {/* Case à cocher 14ème mois */}
            <label
              className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                has14thMonth
                  ? 'border-blue-400 bg-blue-50/90 shadow-xs'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100/70'
              }`}
            >
              <input
                type="checkbox"
                checked={has14thMonth}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setHas14thMonth(checked);
                  if (checked) {
                    setHas13thMonth(true);
                  }
                }}
                className="mt-0.5 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 flex-wrap">
                  <span className="text-xs font-bold text-slate-900">
                    14ème mois
                  </span>
                  {has14thMonth && (
                    <span className="text-[11px] font-mono font-bold text-blue-700 whitespace-nowrap">
                      Base (brut / 14) × 12
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Compris dans le brut annuel (versé en une fois). Mensualités régulières sur base (brut/14)×12 et lissage avec +2/12 de salaire mensuel.
                </p>
              </div>
            </label>
          </div>

          {/* Explications claires */}
          <div className="text-[11px] text-slate-600 mt-2 leading-relaxed bg-slate-50 border border-slate-200/80 rounded-lg p-2.5 flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
            <div>
              {has14thMonth ? (
                <span>
                  <strong>13e et 14e mois compris dans le brut annuel :</strong> Les mensualités régulières sont calculées sur la base de <code>(brut fixe / 14) × 12</code> déduit des cotisations et du PAS. Le lissage mensuel ajoute <code>2/12èmes</code> de salaire mensuel avant et après impôts.
                </span>
              ) : has13thMonth ? (
                <span>
                  <strong>13e mois compris dans le brut annuel :</strong> Les mensualités régulières sont calculées sur la base de <code>(brut fixe / 13) × 12</code> déduit des cotisations et du PAS. Le lissage mensuel ajoute <code>1/12ème</code> de salaire mensuel avant et après impôts.
                </span>
              ) : (
                <span>
                  <strong>Base standard 12 mois :</strong> Le salaire annuel brut est réparti sur 12 mensualités régulières. Cochez le 13e ou 14e mois si votre rémunération annuelle inclut une prime versée en une fois.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Part variable cadre (POSITIONNÉE SOUS le Statut professionnel & le Nombre de mois) */}
      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
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
                <span className="text-[11px] text-slate-500 block whitespace-nowrap">Montant du variable brut :</span>
                <span className="font-mono font-bold text-blue-700 whitespace-nowrap">
                  +{formatEuro(variableAmountAnnual)} / an
                </span>
                <span className="text-[10px] text-slate-400 block whitespace-nowrap">
                  (+{formatEuro(monthlyVariableGross)} / mois lissé)
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-500 block whitespace-nowrap">Total Brut (Fixe + Variable) :</span>
                <span className="font-mono font-bold text-slate-900 whitespace-nowrap">
                  {formatEuro(totalGrossAnnual)} / an
                </span>
                <span className="text-[10px] text-slate-400 block whitespace-nowrap">
                  ({formatEuro(monthlyGrossTotal)} / mois lissé)
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
        </div>
      )}
    </div>
  );
};
