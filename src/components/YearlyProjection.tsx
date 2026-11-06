/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import { SalaryBreakdown, SimulationParams } from '../types/salary';
import { calculateSalary, formatEuro } from '../utils/salaryCalculations';
import { Calendar, TrendingUp, Minus, Plus, Sparkles, LayoutGrid, Table } from 'lucide-react';

interface YearlyProjectionProps {
  simulationParams: SimulationParams;
  baseBreakdown: SalaryBreakdown;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  yearlyIncreases: number[];
  onChangeIncrease: (yearIndex: number, newPercent: number) => void;
  onApplyPreset: (percent: number) => void;
}

export const YearlyProjection: React.FC<YearlyProjectionProps> = ({
  simulationParams,
  baseBreakdown,
  enabled,
  onToggle,
  yearlyIncreases,
  onChangeIncrease,
  onApplyPreset,
}) => {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Calcul en cascade des augmentations annuelles sur 5 ans
  const projectedYears = useMemo(() => {
    let currentGross = simulationParams.grossAnnual;

    return yearlyIncreases.map((percent, index) => {
      // Revalorisation annuelle composée
      currentGross = Math.round(currentGross * (1 + (percent || 0) / 100));

      const yearParams: SimulationParams = {
        ...simulationParams,
        grossAnnual: currentGross,
      };

      const breakdown = calculateSalary(yearParams);
      const gainNetAfterTaxMonthly = breakdown.netAfterTaxMonthly - baseBreakdown.netAfterTaxMonthly;
      const gainNetBeforeTaxMonthly = breakdown.netBeforeTaxMonthly - baseBreakdown.netBeforeTaxMonthly;
      const totalCumulativePercent = simulationParams.grossAnnual > 0
        ? Math.round(((currentGross - simulationParams.grossAnnual) / simulationParams.grossAnnual) * 1000) / 10
        : 0;

      return {
        yearIndex: index + 1,
        percent,
        projectedGross: currentGross,
        breakdown,
        gainNetAfterTaxMonthly,
        gainNetBeforeTaxMonthly,
        totalCumulativePercent,
      };
    });
  }, [simulationParams, yearlyIncreases, baseBreakdown]);

  const presets = [1.5, 2, 2.5, 3, 5];

  return (
    <div className="mt-4 pt-3.5 border-t border-slate-700/60">
      {/* En-tête avec interrupteur discret et non surchargé */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-wide">
                Projection sur 5 ans (Augmentations annuelles)
              </span>
              <span className="text-[10px] font-medium text-blue-300/80 bg-blue-900/40 border border-blue-700/40 px-1.5 py-0.2 rounded">
                Optionnel
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Anticipez l&apos;évolution de votre salaire Net Avant & Après impôts d&apos;après vos augmentations futures
            </p>
          </div>
        </div>

        {/* Toggle switch */}
        <label className="relative inline-flex items-center cursor-pointer select-none shrink-0">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => onToggle(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
          <span className="ml-2 text-xs font-semibold text-slate-400 peer-checked:text-emerald-400">
            {enabled ? 'Active' : 'Désactivée'}
          </span>
        </label>
      </div>

      {/* Contenu déroulé lorsque l'option est activée */}
      {enabled && (
        <div className="mt-3.5 space-y-3">
          {/* Barre d'application rapide de pourcentages prédéfinis et sélecteur de vue */}
          <div className="flex items-center justify-between gap-2 flex-wrap text-xs bg-slate-800/60 border border-slate-700/50 p-2 rounded-xl">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                Appliquer à tous :
              </span>
              <div className="flex items-center gap-1 flex-wrap">
                {presets.map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => onApplyPreset(rate)}
                    className="px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-slate-700/80 hover:bg-slate-600 text-slate-200 hover:text-white transition-colors cursor-pointer"
                    title={`Appliquer +${rate}% chaque année`}
                  >
                    +{rate}%
                  </button>
                ))}
              </div>
            </div>

            {/* View Mode Switcher: Cards vs Table */}
            <div className="flex items-center gap-1 bg-slate-900/80 p-0.5 rounded-lg border border-slate-700/60">
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  viewMode === 'cards'
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Affichage sous forme de cartes"
              >
                <LayoutGrid className="w-3 h-3" />
                <span>Cartes</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Affichage sous forme de tableau comparatif"
              >
                <Table className="w-3 h-3" />
                <span>Tableau</span>
              </button>
            </div>
          </div>

          {/* VUE 1 : GRILLE DE CARTES (vision sur 5 ans aérée) */}
          {viewMode === 'cards' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-2.5">
              {projectedYears.map((item, idx) => (
                <div
                  key={item.yearIndex}
                  className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 hover:border-slate-600 rounded-xl p-3 flex flex-col justify-between transition-all shadow-xs min-w-[130px]"
                >
                  {/* Entête de l'année */}
                  <div className="flex items-center justify-between gap-1 mb-2 pb-1.5 border-b border-slate-700/50">
                    <span className="text-xs font-extrabold text-slate-200 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-blue-400 shrink-0" />
                      Année {item.yearIndex}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400/90 font-semibold whitespace-nowrap">
                      +{item.totalCumulativePercent}% cum.
                    </span>
                  </div>

                  {/* Sélecteur de pourcentage pour cette année */}
                  <div className="my-1.5 flex items-center justify-between bg-slate-900/80 border border-slate-700/70 rounded-lg p-1">
                    <button
                      type="button"
                      onClick={() => onChangeIncrease(idx, Math.max(0, Math.round((item.percent - 0.5) * 10) / 10))}
                      className="w-6 h-6 flex items-center justify-center rounded bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 font-bold transition-colors cursor-pointer"
                      title="Diminuer de 0,5%"
                      aria-label={`Diminuer le pourcentage année ${item.yearIndex}`}
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-mono font-bold text-xs text-blue-300 tabular-nums">
                      +{item.percent}%
                    </span>
                    <button
                      type="button"
                      onClick={() => onChangeIncrease(idx, Math.min(30, Math.round((item.percent + 0.5) * 10) / 10))}
                      className="w-6 h-6 flex items-center justify-center rounded bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 font-bold transition-colors cursor-pointer"
                      title="Augmenter de 0,5%"
                      aria-label={`Augmenter le pourcentage année ${item.yearIndex}`}
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Montants projetés clés (Avant & Après impôts) */}
                  <div className="mt-2 space-y-1.5 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Net Après impôts :</span>
                      <span className="font-mono font-black text-emerald-400 text-sm whitespace-nowrap">
                        {formatEuro(item.breakdown.netAfterTaxMonthly)}
                        <span className="text-[10px] font-normal text-emerald-300/80"> /m</span>
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block">Net Avant impôts :</span>
                      <span className="font-mono font-semibold text-slate-300 text-xs whitespace-nowrap">
                        {formatEuro(item.breakdown.netBeforeTaxMonthly)}
                        <span className="text-[9px] font-normal text-slate-400"> /m</span>
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-400">
                      Brut : <span className="font-mono text-slate-300">{formatEuro(item.projectedGross)}</span>
                    </div>

                    {/* Badge de gain mensuel */}
                    <div className="pt-1.5 border-t border-slate-700/50 flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">Gain net :</span>
                      <strong className="font-mono text-emerald-300">
                        +{formatEuro(item.gainNetAfterTaxMonthly)}/m
                      </strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* VUE 2 : TABLEAU COMPARATIF ULTRA-LISIBLE */}
          {viewMode === 'table' && (
            <div className="overflow-x-auto rounded-xl border border-slate-700/60 bg-slate-900/60">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-700/80 bg-slate-800/80 text-slate-300 text-[11px]">
                    <th className="py-2 px-3 font-semibold">Année</th>
                    <th className="py-2 px-3 font-semibold text-center">Augmentation</th>
                    <th className="py-2 px-3 font-semibold">Brut annuel</th>
                    <th className="py-2 px-3 font-semibold text-emerald-400">Net Après impôts</th>
                    <th className="py-2 px-3 font-semibold">Net Avant impôts</th>
                    <th className="py-2 px-3 font-semibold text-right">Gain mensuel</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {projectedYears.map((item, idx) => (
                    <tr key={item.yearIndex} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-white flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        Année {item.yearIndex}
                        <span className="text-[10px] text-slate-400 font-normal ml-1">
                          (+{item.totalCumulativePercent}%)
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => onChangeIncrease(idx, Math.max(0, Math.round((item.percent - 0.5) * 10) / 10))}
                            className="w-5 h-5 flex items-center justify-center rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-colors cursor-pointer"
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="font-mono font-bold text-blue-300 w-12 text-center">
                            +{item.percent}%
                          </span>
                          <button
                            type="button"
                            onClick={() => onChangeIncrease(idx, Math.min(30, Math.round((item.percent + 0.5) * 10) / 10))}
                            className="w-5 h-5 flex items-center justify-center rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-colors cursor-pointer"
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-300">
                        {formatEuro(item.projectedGross)} / an
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">
                        {formatEuro(item.breakdown.netAfterTaxMonthly)} / m
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-300">
                        {formatEuro(item.breakdown.netBeforeTaxMonthly)} / m
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-300">
                        +{formatEuro(item.gainNetAfterTaxMonthly)} / m
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Synthèse globale à 5 ans */}
          {projectedYears.length === 5 && (
            <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-blue-950/60 border border-emerald-500/30 flex items-center justify-between gap-3 flex-wrap text-xs">
              <div className="flex items-center gap-2 text-slate-200">
                <span className="font-bold text-emerald-400">Bilan à 5 ans :</span>
                <span>
                  Net après impôts de <strong className="font-mono text-emerald-300">{formatEuro(projectedYears[4].breakdown.netAfterTaxMonthly)} / mois</strong>
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="font-mono font-bold text-emerald-400">
                  +{formatEuro(projectedYears[4].gainNetAfterTaxMonthly)} / mois net
                </span>
                <span className="text-[10px] text-slate-400 ml-1.5">
                  (+{formatEuro(projectedYears[4].projectedGross - simulationParams.grossAnnual)} brut/an)
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

