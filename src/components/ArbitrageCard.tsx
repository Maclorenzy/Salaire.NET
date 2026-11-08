/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BonusCalculation, SalaryBreakdown } from '../types/salary';
import { formatEuro } from '../utils/salaryCalculations';
import { PiggyBank, Wallet, ArrowRight, ShieldCheck, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

interface ArbitrageCardProps {
  breakdown: SalaryBreakdown;
  onSetAllTo: (choice: 'versement' | 'placement') => void;
}

export const ArbitrageCard: React.FC<ArbitrageCardProps> = ({
  breakdown,
  onSetAllTo,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const totalGrossBonus =
    breakdown.participationCalc.grossAmount + breakdown.interessementCalc.grossAmount;

  if (totalGrossBonus <= 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="bg-slate-50/80 p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-100/60 transition-colors select-none border-b border-slate-200/80"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <PiggyBank className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Arbitrage Épargne Salariale : Cash vs Placement PEE / PER
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Aucune prime de participation ou d&apos;intéressement saisie
              </p>
            </div>
          </div>
          <button
            type="button"
            className="text-slate-500 hover:text-slate-800 p-1 rounded-md cursor-pointer"
            aria-label={isOpen ? "Replier l'arbitrage épargne" : "Déplier l'arbitrage épargne"}
          >
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        {isOpen && (
          <div className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <PiggyBank className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">
              Arbitrage Épargne Salariale : Versement ou Placement ?
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Renseignez un montant pour la participation ou l&apos;intéressement ci-dessus pour comparer instantanément le gain net en poche vs l&apos;économie d&apos;impôt en PEE/PER.
            </p>
          </div>
        )}
      </div>
    );
  }

  // Calculate hypothetical scenarios: All Versement vs All Placement
  const csgRate = 0.097 * 0.9825;
  const netBeforeTax = totalGrossBonus * (1 - csgRate);
  const netInPocketIfAllVersement = Math.round(netBeforeTax);

  const netPlacedIfAllPlaced = Math.round(
    (breakdown.participationCalc.choice === 'placement'
      ? breakdown.participationCalc.totalPlaced
      : (breakdown.participationCalc.grossAmount * (1 - csgRate)) * (1 + (breakdown.participationCalc.employerMatchAmount > 0 ? 0.5 : 0))) +
    (breakdown.interessementCalc.choice === 'placement'
      ? breakdown.interessementCalc.totalPlaced
      : (breakdown.interessementCalc.grossAmount * (1 - csgRate)) * (1 + (breakdown.interessementCalc.employerMatchAmount > 0 ? 0.5 : 0)))
  );

  const isAllVersement =
    breakdown.participationCalc.choice === 'versement' &&
    breakdown.interessementCalc.choice === 'versement';
  const isAllPlacement =
    breakdown.participationCalc.choice === 'placement' &&
    breakdown.interessementCalc.choice === 'placement';

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="bg-slate-50/80 p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-100/60 transition-colors select-none border-b border-slate-200/80"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <PiggyBank className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Arbitrage Épargne Salariale (Cash vs Placement PEE / PER)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Total primes : <strong className="font-mono text-slate-800">{formatEuro(totalGrossBonus)} brut</strong> · TMI estimé : <strong className="font-mono text-blue-700">{breakdown.marginalTaxRate}%</strong>
            </p>
          </div>
        </div>

        {/* Quick action buttons & Chevron */}
        <div className="flex items-center gap-2.5 shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => onSetAllTo('versement')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              isAllVersement
                ? 'bg-emerald-600 text-white shadow-xs ring-1 ring-emerald-500 hover:bg-emerald-700'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {isAllVersement && <CheckCircle2 className="w-3.5 h-3.5" />}
            <span>Tout en cash</span>
          </button>
          <button
            type="button"
            onClick={() => onSetAllTo('placement')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              isAllPlacement
                ? 'bg-emerald-600 text-white shadow-xs ring-1 ring-emerald-500 hover:bg-emerald-700'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {isAllPlacement && <CheckCircle2 className="w-3.5 h-3.5" />}
            <span>Tout en PEE</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
            className="text-slate-500 hover:text-slate-800 p-1 rounded-md cursor-pointer"
            aria-label={isOpen ? "Replier l'arbitrage épargne" : "Déplier l'arbitrage épargne"}
          >
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="p-5 sm:p-6 space-y-5">

      {/* Side-by-side comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Scenario A: Versement direct sur compte bancaire */}
        <div className="border border-blue-200 rounded-xl p-4 bg-blue-50/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-blue-600" />
                Option A : Versement immédiat
              </span>
              <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                Imposable à l&apos;IR
              </span>
            </div>

            <div className="text-2xl font-black font-mono text-slate-900 tabular-nums mb-1">
              {formatEuro(netInPocketIfAllVersement)}
            </div>
            <span className="text-xs text-slate-500 block mb-4">
              Net total perçu en cash sur votre compte
            </span>

            <div className="space-y-1.5 text-xs text-slate-600 border-t border-blue-100 pt-3">
              <div className="flex justify-between">
                <span>Prélèvement social (CSG/CRDS 9,7%) :</span>
                <span className="font-mono text-rose-600">-{formatEuro(Math.round(totalGrossBonus * csgRate))}</span>
              </div>
              <div className="flex justify-between font-medium text-slate-700">
                <span>Net versé en direct :</span>
                <span className="font-mono font-bold text-blue-700">{formatEuro(netInPocketIfAllVersement)}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-blue-100 text-[11px] text-slate-500">
            Idéal si vous avez un besoin de trésorerie immédiat.
          </div>
        </div>

        {/* Scenario B: Placement sur PEE / PER */}
        <div className="border border-emerald-300 rounded-xl p-4 bg-emerald-50/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <PiggyBank className="w-4 h-4 text-emerald-600" />
                Option B : Placement PEE / PER
              </span>
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                100% Exonéré d&apos;impôt
              </span>
            </div>

            <div className="text-2xl font-black font-mono text-emerald-700 tabular-nums mb-1">
              {formatEuro(netPlacedIfAllPlaced)}
            </div>
            <span className="text-xs text-slate-500 block mb-4">
              Capital net placé sur votre plan d&apos;épargne
            </span>

            <div className="space-y-1.5 text-xs text-slate-600 border-t border-emerald-200/80 pt-3">
              <div className="flex justify-between">
                <span>Prélèvement social (CSG/CRDS 9,7%) :</span>
                <span className="font-mono text-rose-600">-{formatEuro(Math.round(totalGrossBonus * csgRate))}</span>
              </div>
              <div className="flex justify-between font-medium text-emerald-800">
                <span>Impôt sur le Revenu payé :</span>
                <span className="font-mono font-bold text-emerald-700">0 € (Exonéré)</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-200/80 flex items-center justify-between text-xs">
            <span className="font-semibold text-emerald-900">Surplus capitalisé (Abondement inclus) :</span>
            <span className="font-mono font-bold text-emerald-700">
              +{formatEuro(Math.max(0, netPlacedIfAllPlaced - netInPocketIfAllVersement))}
            </span>
          </div>
        </div>
      </div>

      {/* Cas de déblocage anticipé */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600">
        <span className="font-semibold text-slate-800 block mb-1">
          💡 Bon à savoir : Déblocages anticipés du PEE sans perte d&apos;exonération
        </span>
        <p className="leading-relaxed">
          Même si les fonds du PEE sont théoriquement bloqués 5 ans, vous pouvez les retirer <strong>sans payer d&apos;impôt sur le revenu</strong> dans de nombreux cas de la vie courante : achat ou rénovation de la résidence principale, mariage, PACS, 3e enfant, fin du contrat de travail (changement d&apos;employeur, démission, rupture conventionnelle).
        </p>
      </div>
        </div>
      )}
    </div>
  );
};
