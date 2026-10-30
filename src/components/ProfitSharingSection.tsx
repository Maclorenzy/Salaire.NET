/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BonusItem, PaymentChoice } from '../types/salary';
import { formatEuro } from '../utils/salaryCalculations';
import { Landmark, PiggyBank, Wallet, Sparkles, HelpCircle } from 'lucide-react';

interface ProfitSharingSectionProps {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  participation: BonusItem;
  setParticipation: React.Dispatch<React.SetStateAction<BonusItem>>;
  interessement: BonusItem;
  setInteressement: React.Dispatch<React.SetStateAction<BonusItem>>;
  smoothBonuses: boolean;
  setSmoothBonuses: (smooth: boolean) => void;
  marginalTaxRate: number;
}

export const ProfitSharingSection: React.FC<ProfitSharingSectionProps> = ({
  enabled,
  setEnabled,
  participation,
  setParticipation,
  interessement,
  setInteressement,
  smoothBonuses,
  setSmoothBonuses,
  marginalTaxRate,
}) => {
  const handleAmountChange = (
    setter: React.Dispatch<React.SetStateAction<BonusItem>>,
    current: BonusItem,
    value: string
  ) => {
    const val = parseInt(value, 10);
    setter({
      ...current,
      amount: isNaN(val) ? 0 : Math.max(0, val),
    });
  };

  const handleChoiceChange = (
    setter: React.Dispatch<React.SetStateAction<BonusItem>>,
    current: BonusItem,
    choice: PaymentChoice
  ) => {
    setter({
      ...current,
      choice,
    });
  };

  const handleMatchChange = (
    setter: React.Dispatch<React.SetStateAction<BonusItem>>,
    current: BonusItem,
    matchPercent: number
  ) => {
    setter({
      ...current,
      employerMatchPercent: matchPercent,
    });
  };

  // Preview calculations for tooltips / quick helper tags
  const getBonusPreview = (bonus: BonusItem) => {
    const gross = bonus.amount || 0;
    const csg = gross * 0.097 * 0.9825;
    const netBeforeTax = gross - csg;
    // Net touché en direct : après déduction de la CSG/CRDS uniquement (sans TMI)
    const inPocket = netBeforeTax;
    const placed = netBeforeTax * (1 + (bonus.employerMatchPercent || 0) / 100);
    const taxSaved = netBeforeTax * (marginalTaxRate / 100);

    return { gross, inPocket: Math.round(inPocket), placed: Math.round(placed), taxSaved: Math.round(taxSaved) };
  };

  const partPreview = getBonusPreview(participation);
  const interPreview = getBonusPreview(interessement);

  return (
    <div className={`bg-white rounded-xl border transition-all p-5 sm:p-6 shadow-sm ${enabled ? 'border-slate-200' : 'border-slate-200/70 bg-slate-50/40'}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>3. Épargne Salariale : Participation & Intéressement</span>
            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
              Loi Pacte
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Saisissez les montants et choisissez entre un versement immédiat sur compte ou un placement exonéré d&apos;impôt (PEE/PER)
          </p>
        </div>

        {/* Toggle Activable / Désactivable */}
        <div className="flex items-center gap-3 self-start sm:self-center shrink-0">
          <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-slate-700 bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg shadow-xs hover:border-slate-300 transition-colors">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <span className={enabled ? 'text-blue-700' : 'text-slate-600'}>
              {enabled ? 'Option activée' : "Activer l'épargne salariale"}
            </span>
          </label>
        </div>
      </div>

      {!enabled ? (
        <div className="py-6 px-4 text-center rounded-xl border border-dashed border-slate-300 bg-white/70">
          <PiggyBank className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-700">
            L&apos;épargne salariale est actuellement désactivée
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-3">
            Activez cette section si vous percevez une prime d&apos;intéressement ou de participation pour simuler son arbitrage (versement bancaire vs placement PEE/PER).
          </p>
          <button
            type="button"
            onClick={() => setEnabled(true)}
            className="px-3.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors cursor-pointer"
          >
            Activer la participation & intéressement
          </button>
        </div>
      ) : (
        <>
          {/* Controls bar: Lissage option */}
          <div className="flex justify-end mb-4">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg">
              <label className="text-xs font-medium text-slate-700 cursor-pointer select-none flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={smoothBonuses}
                  onChange={(e) => setSmoothBonuses(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span>Lisser les montants versés sur 12 mois dans le net mensuel</span>
              </label>
            </div>
          </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Case 1: Participation */}
        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                P
              </div>
              <span className="text-sm font-bold text-slate-900">Participation Annuelle</span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">Bénéfices de l&apos;entreprise</span>
          </div>

          {/* Amount input */}
          <div className="relative mb-3">
            <input
              type="number"
              min={0}
              step={100}
              value={participation.amount || ''}
              onChange={(e) => handleAmountChange(setParticipation, participation, e.target.value)}
              placeholder="0"
              className="w-full h-10 pl-3 pr-10 text-base font-bold font-mono tabular-nums text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
              € brut
            </span>
          </div>

          {/* Selector: Versement vs Placement */}
          <div className="mb-3">
            <span className="block text-[11px] font-semibold text-slate-600 mb-1.5">
              Choix d&apos;attribution :
            </span>
            <div className="grid grid-cols-2 gap-2 p-1 bg-white border border-slate-200 rounded-lg">
              <button
                type="button"
                onClick={() => handleChoiceChange(setParticipation, participation, 'versement')}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 text-xs font-medium rounded-md transition-all cursor-pointer ${
                  participation.choice === 'versement'
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Wallet className="w-3.5 h-3.5" />
                <span className="truncate">Versement compte</span>
              </button>
              <button
                type="button"
                onClick={() => handleChoiceChange(setParticipation, participation, 'placement')}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 text-xs font-medium rounded-md transition-all cursor-pointer ${
                  participation.choice === 'placement'
                    ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <PiggyBank className="w-3.5 h-3.5" />
                <span className="truncate">Placement PEE / PER</span>
              </button>
            </div>
          </div>

          {/* Placement specific: Abondement entreprise */}
          {participation.choice === 'placement' ? (
            <div className="bg-emerald-50 border border-emerald-200/80 rounded-lg p-2.5 mb-2 text-xs text-emerald-900">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-emerald-800 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  Abondement employeur :
                </span>
                <span className="font-mono font-bold text-emerald-700">
                  +{participation.employerMatchPercent || 0}%
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {[0, 25, 50, 100].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => handleMatchChange(setParticipation, participation, pct)}
                    className={`flex-1 py-1 text-[11px] font-medium rounded border transition-colors cursor-pointer ${
                      participation.employerMatchPercent === pct
                        ? 'bg-emerald-600 text-white border-emerald-600 font-semibold'
                        : 'bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-100/50'
                    }`}
                  >
                    {pct === 0 ? 'Aucun' : `+${pct}%`}
                  </button>
                ))}
              </div>
              <div className="mt-2 text-[11px] text-emerald-800 leading-tight">
                Net placé sur PEE : <strong className="font-mono">{formatEuro(partPreview.placed)}</strong> · Économie d&apos;impôt : <strong className="font-mono">+{formatEuro(partPreview.taxSaved)}</strong>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50/70 border border-blue-200/60 rounded-lg p-2.5 mb-2 text-xs text-blue-950">
              <div className="flex justify-between items-center text-[11px]">
                <span>Net touché en direct :</span>
                <span className="font-mono font-bold text-blue-900">{formatEuro(partPreview.inPocket)}</span>
              </div>
              <p className="text-[10px] text-blue-700 mt-1">
                Net versé après déduction des prélèvements sociaux CSG/CRDS (9,7%).
              </p>
            </div>
          )}
        </div>

        {/* Case 2: Intéressement */}
        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                I
              </div>
              <span className="text-sm font-bold text-slate-900">Intéressement Annuel</span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">Objectifs & Performance</span>
          </div>

          {/* Amount input */}
          <div className="relative mb-3">
            <input
              type="number"
              min={0}
              step={100}
              value={interessement.amount || ''}
              onChange={(e) => handleAmountChange(setInteressement, interessement, e.target.value)}
              placeholder="0"
              className="w-full h-10 pl-3 pr-10 text-base font-bold font-mono tabular-nums text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
              € brut
            </span>
          </div>

          {/* Selector: Versement vs Placement */}
          <div className="mb-3">
            <span className="block text-[11px] font-semibold text-slate-600 mb-1.5">
              Choix d&apos;attribution :
            </span>
            <div className="grid grid-cols-2 gap-2 p-1 bg-white border border-slate-200 rounded-lg">
              <button
                type="button"
                onClick={() => handleChoiceChange(setInteressement, interessement, 'versement')}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 text-xs font-medium rounded-md transition-all cursor-pointer ${
                  interessement.choice === 'versement'
                    ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Wallet className="w-3.5 h-3.5" />
                <span className="truncate">Versement compte</span>
              </button>
              <button
                type="button"
                onClick={() => handleChoiceChange(setInteressement, interessement, 'placement')}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 text-xs font-medium rounded-md transition-all cursor-pointer ${
                  interessement.choice === 'placement'
                    ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <PiggyBank className="w-3.5 h-3.5" />
                <span className="truncate">Placement PEE / PER</span>
              </button>
            </div>
          </div>

          {/* Placement specific: Abondement entreprise */}
          {interessement.choice === 'placement' ? (
            <div className="bg-emerald-50 border border-emerald-200/80 rounded-lg p-2.5 mb-2 text-xs text-emerald-900">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-emerald-800 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  Abondement employeur :
                </span>
                <span className="font-mono font-bold text-emerald-700">
                  +{interessement.employerMatchPercent || 0}%
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {[0, 25, 50, 100].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => handleMatchChange(setInteressement, interessement, pct)}
                    className={`flex-1 py-1 text-[11px] font-medium rounded border transition-colors cursor-pointer ${
                      interessement.employerMatchPercent === pct
                        ? 'bg-emerald-600 text-white border-emerald-600 font-semibold'
                        : 'bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-100/50'
                    }`}
                  >
                    {pct === 0 ? 'Aucun' : `+${pct}%`}
                  </button>
                ))}
              </div>
              <div className="mt-2 text-[11px] text-emerald-800 leading-tight">
                Net placé sur PEE : <strong className="font-mono">{formatEuro(interPreview.placed)}</strong> · Économie d&apos;impôt : <strong className="font-mono">+{formatEuro(interPreview.taxSaved)}</strong>
              </div>
            </div>
          ) : (
            <div className="bg-indigo-50/70 border border-indigo-200/60 rounded-lg p-2.5 mb-2 text-xs text-indigo-950">
              <div className="flex justify-between items-center text-[11px]">
                <span>Net touché en direct :</span>
                <span className="font-mono font-bold text-indigo-900">{formatEuro(interPreview.inPocket)}</span>
              </div>
              <p className="text-[10px] text-indigo-700 mt-1">
                Net versé après déduction des prélèvements sociaux CSG/CRDS (9,7%).
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Fiscal Advice Banner */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-start gap-2 text-xs text-slate-600">
        <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-slate-800">Règle fiscale en France :</strong> Les sommes placées sur un PEE sont bloquées pendant 5 ans (ou déblocables en cas d&apos;achat de résidence principale, mariage, etc.) mais bénéficient d&apos;une <strong>exonération totale d&apos;Impôt sur le Revenu</strong>. Seuls les prélèvements sociaux (CSG/CRDS à 9,7%) s&apos;appliquent.
        </div>
      </div>
        </>
      )}
    </div>
  );
};
