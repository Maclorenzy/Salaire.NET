/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MealVoucherConfig, MutuelleConfig, TaxSourceConfig, TransportPassConfig } from '../types/salary';
import { formatEuro } from '../utils/salaryCalculations';
import { ChevronDown, ChevronUp, ShieldCheck, Utensils, Bus, HeartPulse, Minus, Plus, Settings2 } from 'lucide-react';

interface SuggestedImprovementsProps {
  taxSource: TaxSourceConfig;
  setTaxSource: React.Dispatch<React.SetStateAction<TaxSourceConfig>>;
  mealVouchers: MealVoucherConfig;
  setMealVouchers: React.Dispatch<React.SetStateAction<MealVoucherConfig>>;
  transportPass: TransportPassConfig;
  setTransportPass: React.Dispatch<React.SetStateAction<TransportPassConfig>>;
  mutuelle: MutuelleConfig;
  setMutuelle: React.Dispatch<React.SetStateAction<MutuelleConfig>>;
  calculatedTaxRate: number;
  netBeforeTaxMonthly: number;
  incomeTaxMonthly: number;
}

export const SuggestedImprovements: React.FC<SuggestedImprovementsProps> = ({
  taxSource,
  setTaxSource,
  mealVouchers,
  setMealVouchers,
  transportPass,
  setTransportPass,
  mutuelle,
  setMutuelle,
  calculatedTaxRate,
  netBeforeTaxMonthly,
  incomeTaxMonthly,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  // Step 0.1% handlers for Tax Rate
  const handleRateIncrement = (delta: number) => {
    const current = taxSource.mode === 'auto' ? calculatedTaxRate : (taxSource.customRate || 0);
    const nextRate = Math.max(0, Math.min(60, Math.round((current + delta) * 10) / 10));
    const nextAmount = Math.round(netBeforeTaxMonthly * (nextRate / 100));

    setTaxSource({
      ...taxSource,
      mode: 'custom',
      customRate: nextRate,
      customAmount: nextAmount,
    });
  };

  const handleRateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    const nextRate = isNaN(val) ? 0 : Math.max(0, Math.min(60, Math.round(val * 10) / 10));
    const nextAmount = Math.round(netBeforeTaxMonthly * (nextRate / 100));

    setTaxSource({
      ...taxSource,
      mode: 'custom',
      customRate: nextRate,
      customAmount: nextAmount,
    });
  };

  // Direct Amount in Euros handler
  const handleAmountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    const nextAmount = isNaN(val) ? 0 : Math.max(0, Math.round(val));
    const nextRate = netBeforeTaxMonthly > 0
      ? Math.round((nextAmount / netBeforeTaxMonthly) * 1000) / 10
      : 0;

    setTaxSource({
      ...taxSource,
      mode: 'amount',
      customAmount: nextAmount,
      customRate: nextRate,
    });
  };

  const handleAmountIncrement = (delta: number) => {
    const currentAmount = incomeTaxMonthly || 0;
    const nextAmount = Math.max(0, Math.round(currentAmount + delta));
    const nextRate = netBeforeTaxMonthly > 0
      ? Math.round((nextAmount / netBeforeTaxMonthly) * 1000) / 10
      : 0;

    setTaxSource({
      ...taxSource,
      mode: 'amount',
      customAmount: nextAmount,
      customRate: nextRate,
    });
  };

  const currentDisplayRate =
    taxSource.mode === 'auto'
      ? calculatedTaxRate
      : taxSource.customRate;

  // Calcul part salariale des tickets restaurant
  const mealVoucherEmployeeDeduction = mealVouchers.enabled
    ? Math.round(
        (mealVouchers.countPerMonth || 0) *
        (mealVouchers.faceValue || 0) *
        ((100 - Math.max(0, Math.min(100, mealVouchers.employerSharePercent ?? 50))) / 100)
      )
    : 0;

  // Salaire net après impôts (déduit de l'IR et de la part salarié des tickets restaurant)
  const netAfterTaxDirect = Math.max(
    0,
    netBeforeTaxMonthly - incomeTaxMonthly - mealVoucherEmployeeDeduction
  );

  // Transport reimbursement calculation
  const transportReimbursementAmount = Math.round(
    transportPass.monthlyCost * ((transportPass.employerSharePercent || 50) / 100)
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="bg-slate-50/80 p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-100/60 transition-colors select-none border-b border-slate-200/80"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Settings2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              2. Impôt sur le Revenu (PAS) & Avantages Sociaux
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Prélèvement à la source (taux ou montant au dixième de %) · Transports, Mutuelle et Tickets resto
            </p>
          </div>
        </div>

        <button
          type="button"
          className="text-slate-500 hover:text-slate-800 p-1 rounded-md"
          aria-label={isOpen ? 'Replier la section' : 'Déplier la section'}
        >
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {isOpen && (
        <div className="p-5 sm:p-6 space-y-6">
          {/* Section A : Impôt sur le Revenu (PAS) */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Impôt sur le Revenu (Prélèvement à la Source - PAS)
                </h3>
              </div>
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-slate-700 bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg shadow-2xs hover:border-slate-300 transition-colors">
                <input
                  type="checkbox"
                  checked={taxSource.enabled}
                  onChange={(e) => setTaxSource({ ...taxSource, enabled: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span className={taxSource.enabled ? 'text-blue-700' : 'text-slate-600'}>
                  {taxSource.enabled ? 'PAS activé' : "Activer l'impôt à la source"}
                </span>
              </label>
            </div>

            <p className="text-xs text-slate-600 mb-3 leading-relaxed">
              Saisissez directement le <strong>montant de l&apos;IR en euros</strong> ou ajustez le <strong>taux par pas à pas de 0,1%</strong>.
            </p>

            {!taxSource.enabled ? (
              <div className="py-4 px-3 text-center rounded-lg border border-dashed border-slate-300 bg-white/70 text-xs text-slate-500">
                <p>
                  L&apos;impôt à la source est actuellement désactivé (0 € retenu). Le salaire net après impôts est égal au salaire net avant impôts.
                </p>
                <button
                  type="button"
                  onClick={() => setTaxSource({ ...taxSource, enabled: true })}
                  className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md border border-blue-200 transition-colors cursor-pointer"
                >
                  Activer le prélèvement à la source
                </button>
              </div>
            ) : (
              <div className="space-y-4 pt-3 border-t border-slate-200/80">
                {/* Mode Selector */}
                <div>
                  <span className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Mode de renseignement de l&apos;IR :
                  </span>
                  <div className="grid grid-cols-3 gap-2 p-1 bg-white border border-slate-200 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setTaxSource({ ...taxSource, mode: 'custom' })}
                      className={`py-1.5 px-2 text-xs font-medium rounded-md transition-all cursor-pointer ${
                        taxSource.mode === 'custom'
                          ? 'bg-blue-600 text-white font-semibold shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Taux en % (pas de 0,1%)
                    </button>
                    <button
                      type="button"
                      onClick={() => setTaxSource({ ...taxSource, mode: 'amount' })}
                      className={`py-1.5 px-2 text-xs font-medium rounded-md transition-all cursor-pointer ${
                        taxSource.mode === 'amount'
                          ? 'bg-blue-600 text-white font-semibold shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Montant en € / mois
                    </button>
                    <button
                      type="button"
                      onClick={() => setTaxSource({ ...taxSource, mode: 'auto' })}
                      className={`py-1.5 px-2 text-xs font-medium rounded-md transition-all cursor-pointer ${
                        taxSource.mode === 'auto'
                          ? 'bg-blue-600 text-white font-semibold shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Barème officiel (Auto)
                    </button>
                  </div>
                </div>

                {/* Saisie par Taux avec pas de 0,1% */}
                {taxSource.mode === 'custom' && (
                  <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <label htmlFor="tax-rate-input" className="block text-xs font-semibold text-slate-800">
                          Taux de prélèvement à la source (pas à pas de 0,1%) :
                        </label>
                        <span className="text-[11px] text-slate-500">
                          Taux figurant sur votre avis d&apos;impôt ou espace impots.gouv
                        </span>
                      </div>

                      {/* Stepper with 0.1% step */}
                      <div className="flex items-center gap-1.5 self-start sm:self-auto">
                        <button
                          type="button"
                          onClick={() => handleRateIncrement(-0.1)}
                          className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold transition-colors cursor-pointer"
                          title="Diminuer de 0,1%"
                          aria-label="Diminuer de 0,1 pourcent"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>

                        <div className="relative w-24">
                          <input
                            id="tax-rate-input"
                            type="number"
                            min={0}
                            max={60}
                            step={0.1}
                            value={taxSource.customRate}
                            onChange={handleRateInputChange}
                            className="w-full h-8 pl-2 pr-7 text-center text-sm font-bold font-mono text-slate-900 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                          />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                            %
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRateIncrement(0.1)}
                          className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold transition-colors cursor-pointer"
                          title="Augmenter de 0,1%"
                          aria-label="Augmenter de 0,1 pourcent"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Range slider with 0.1% step */}
                    <input
                      type="range"
                      min={0}
                      max={35}
                      step={0.1}
                      value={taxSource.customRate}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        setTaxSource({
                          ...taxSource,
                          mode: 'custom',
                          customRate: Math.round(val * 10) / 10,
                          customAmount: Math.round(netBeforeTaxMonthly * (val / 100)),
                        });
                      }}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />

                    <div className="flex justify-between items-center text-xs text-slate-600 pt-1 border-t border-slate-100">
                      <span>Équivalent retenue d&apos;impôt :</span>
                      <span className="font-mono font-bold text-rose-600">
                        -{formatEuro(incomeTaxMonthly)} / mois
                      </span>
                    </div>
                  </div>
                )}

                {/* Saisie par Montant direct en euros */}
                {taxSource.mode === 'amount' && (
                  <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <label htmlFor="tax-amount-input" className="block text-xs font-semibold text-slate-800">
                          Montant de l&apos;Impôt sur le Revenu prélevé :
                        </label>
                        <span className="text-[11px] text-slate-500">
                          Montant mensuel prélevé sur votre fiche de paie
                        </span>
                      </div>

                      {/* Stepper with 10€ step */}
                      <div className="flex items-center gap-1.5 self-start sm:self-auto">
                        <button
                          type="button"
                          onClick={() => handleAmountIncrement(-10)}
                          className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold transition-colors cursor-pointer"
                          title="Diminuer de 10 €"
                          aria-label="Diminuer de 10 euros"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>

                        <div className="relative w-28">
                          <input
                            id="tax-amount-input"
                            type="number"
                            min={0}
                            step={1}
                            value={taxSource.customAmount || ''}
                            onChange={handleAmountInputChange}
                            placeholder="0"
                            className="w-full h-8 pl-2 pr-10 text-center text-sm font-bold font-mono text-slate-900 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                          />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                            € / m
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleAmountIncrement(10)}
                          className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold transition-colors cursor-pointer"
                          title="Augmenter de 10 €"
                          aria-label="Augmenter de 10 euros"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs text-slate-600 pt-1 border-t border-slate-100">
                      <span>Taux effectif correspondant :</span>
                      <span className="font-mono font-bold text-blue-700">
                        {currentDisplayRate}% du net avant impôt
                      </span>
                    </div>
                  </div>
                )}

                {/* Saisie par Barème Auto */}
                {taxSource.mode === 'auto' && (
                  <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-2">
                    <label className="block text-xs font-semibold text-slate-700">
                      Parts fiscales du foyer (Barème progressif 2026) :
                    </label>
                    <div className="flex items-center gap-1.5">
                      {[1, 1.5, 2, 2.5, 3].map((parts) => (
                        <button
                          key={parts}
                          type="button"
                          onClick={() => setTaxSource({ ...taxSource, familyParts: parts })}
                          className={`flex-1 py-1.5 text-xs font-medium rounded border transition-colors cursor-pointer ${
                            taxSource.familyParts === parts
                              ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {parts} {parts === 1 ? 'part' : 'parts'}
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-600 pt-1 border-t border-slate-100">
                      <span>Taux moyen calculé : <strong className="font-mono text-blue-700">{calculatedTaxRate}%</strong></span>
                      <span className="font-mono text-rose-600 font-medium">-{formatEuro(incomeTaxMonthly)} / mois</span>
                    </div>
                  </div>
                )}

                {/* Live Before / Tax / After comparison banner */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-2.5 bg-blue-50/60 border border-blue-200/70 rounded-lg text-xs">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Salaire Net Avant impôts :</span>
                    <span className="font-mono font-bold text-slate-900">
                      {formatEuro(netBeforeTaxMonthly)} / mois
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Impôt sur le Revenu :</span>
                    <span className="font-mono font-bold text-rose-600">
                      -{formatEuro(incomeTaxMonthly)} / mois ({currentDisplayRate}%)
                    </span>
                  </div>
                  <div className="sm:text-right">
                    <span className="text-[11px] text-slate-500 block font-semibold text-blue-900">
                      Salaire Net Après impôts :
                    </span>
                    <span className="font-mono font-black text-blue-800 text-sm">
                      {formatEuro(netAfterTaxDirect)} / mois
                    </span>
                    {mealVoucherEmployeeDeduction > 0 && (
                      <span className="text-[10px] text-slate-500 block">
                        (Tickets resto -{formatEuro(mealVoucherEmployeeDeduction)} inclus)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section B : Avantages du quotidien (Transports, Mutuelle, Titres-Restaurant) */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <Utensils className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Avantages du quotidien (Transports, Mutuelle santé, Titres-Restaurant)
                </h3>
              </div>
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-slate-700 bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg shadow-2xs hover:border-slate-300 transition-colors self-start sm:self-auto">
                <input
                  type="checkbox"
                  checked={transportPass.enabled || mutuelle.enabled || mealVouchers.enabled}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setTransportPass((prev) => ({ ...prev, enabled: checked }));
                    setMutuelle((prev) => ({ ...prev, enabled: checked }));
                    setMealVouchers((prev) => ({ ...prev, enabled: checked }));
                  }}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span className={transportPass.enabled || mutuelle.enabled || mealVouchers.enabled ? 'text-blue-700' : 'text-slate-600'}>
                  {transportPass.enabled || mutuelle.enabled || mealVouchers.enabled
                    ? 'Avantages activés'
                    : "Activer les avantages du quotidien"}
                </span>
              </label>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Personnalisez la prise en charge de vos transports en commun, mutuelle santé et titres-restaurant (désactivés par défaut).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Remboursement Transports Publics */}
              <div className="bg-white border border-slate-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Bus className="w-3.5 h-3.5 text-blue-600" />
                    Transports publics
                  </span>
                  <input
                    type="checkbox"
                    checked={transportPass.enabled}
                    onChange={(e) => setTransportPass({ ...transportPass, enabled: e.target.checked })}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 cursor-pointer"
                  />
                </div>
                {transportPass.enabled ? (
                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Coût abonnement :</span>
                      <div className="relative w-18">
                        <input
                          type="number"
                          min={0}
                          step={1}
                          value={transportPass.monthlyCost}
                          onChange={(e) =>
                            setTransportPass({ ...transportPass, monthlyCost: parseFloat(e.target.value) || 0 })
                          }
                          className="w-full h-7 text-center font-mono text-xs border border-slate-200 rounded"
                        />
                        <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">€</span>
                      </div>
                    </div>

                    {/* Prise en charge employeur modifiable */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-slate-600 font-medium">Prise en charge employeur :</span>
                        <div className="relative w-16">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            step={5}
                            value={transportPass.employerSharePercent}
                            onChange={(e) =>
                              setTransportPass({
                                ...transportPass,
                                employerSharePercent: Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)),
                              })
                            }
                            className="w-full h-7 text-center font-mono font-bold text-xs border border-slate-300 rounded text-blue-700"
                          />
                          <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">%</span>
                        </div>
                      </div>

                      {/* Quick preset buttons: 50%, 75%, 100% */}
                      <div className="flex gap-1 mt-1">
                        {[50, 75, 100].map((pct) => (
                          <button
                            key={pct}
                            type="button"
                            onClick={() => setTransportPass({ ...transportPass, employerSharePercent: pct })}
                            className={`flex-1 py-0.5 text-[10px] font-medium rounded border transition-colors cursor-pointer ${
                              transportPass.employerSharePercent === pct
                                ? 'bg-blue-600 text-white border-blue-600 font-bold'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {pct}% {pct === 50 && '(légal)'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-600 pt-1.5 border-t border-slate-100">
                      Remboursement employeur : <strong className="font-mono text-emerald-600">+{formatEuro(transportReimbursementAmount)} / m</strong>
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 italic">Désactivé</span>
                )}
              </div>

              {/* Mutuelle Santé (Parts Salariale & Patronale modifiables) */}
              <div className="bg-white border border-slate-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <HeartPulse className="w-3.5 h-3.5 text-rose-600" />
                    Mutuelle Santé
                  </span>
                  <input
                    type="checkbox"
                    checked={mutuelle.enabled}
                    onChange={(e) => setMutuelle({ ...mutuelle, enabled: e.target.checked })}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 cursor-pointer"
                  />
                </div>
                {mutuelle.enabled ? (
                  <div className="space-y-2 text-xs">
                    {/* Part salariale */}
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Part salariale :</span>
                      <div className="relative w-18">
                        <input
                          type="number"
                          min={0}
                          step={5}
                          value={mutuelle.employeeMonthlyCost}
                          onChange={(e) =>
                            setMutuelle({ ...mutuelle, employeeMonthlyCost: parseFloat(e.target.value) || 0 })
                          }
                          className="w-full h-7 text-center font-mono text-xs border border-slate-200 rounded text-rose-700 font-semibold"
                        />
                        <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">€/m</span>
                      </div>
                    </div>

                    {/* Part employeur modifiable */}
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 font-medium">Part employeur :</span>
                      <div className="relative w-18">
                        <input
                          type="number"
                          min={0}
                          step={5}
                          value={mutuelle.employerMonthlyCost}
                          onChange={(e) =>
                            setMutuelle({ ...mutuelle, employerMonthlyCost: parseFloat(e.target.value) || 0 })
                          }
                          className="w-full h-7 text-center font-mono text-xs border border-slate-300 rounded text-indigo-700 font-bold"
                        />
                        <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">€/m</span>
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-400 leading-tight">
                      La part employeur est intégrée au net fiscal et au coût employeur.
                    </div>

                    <div className="text-[11px] text-slate-600 pt-1 border-t border-slate-100 flex justify-between">
                      <span>Retenue nette :</span>
                      <strong className="font-mono text-rose-600">-{formatEuro(mutuelle.employeeMonthlyCost)} / m</strong>
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 italic">Désactivé</span>
                )}
              </div>

              {/* Tickets Restaurant */}
              <div className="bg-white border border-slate-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5 text-amber-600" />
                    Tickets Restaurant
                  </span>
                  <input
                    type="checkbox"
                    checked={mealVouchers.enabled}
                    onChange={(e) => setMealVouchers({ ...mealVouchers, enabled: e.target.checked })}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 cursor-pointer"
                  />
                </div>
                {mealVouchers.enabled ? (
                  <div className="space-y-2.5 text-xs">
                    {/* Montant du ticket (Valeur faciale) */}
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 font-medium">Montant du ticket :</span>
                      <div className="relative w-20">
                        <input
                          type="number"
                          min={1}
                          max={25}
                          step={0.5}
                          value={mealVouchers.faceValue || ''}
                          onChange={(e) =>
                            setMealVouchers({ ...mealVouchers, faceValue: Math.max(0, parseFloat(e.target.value) || 0) })
                          }
                          placeholder="10"
                          className="w-full h-7 pl-2 pr-5 text-center font-mono font-bold text-xs border border-slate-300 rounded text-amber-900"
                        />
                        <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">€</span>
                      </div>
                    </div>

                    {/* Pourcentage de prise en charge employeur */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-slate-600 font-medium">Prise en charge employeur :</span>
                        <div className="relative w-18">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            step={1}
                            value={mealVouchers.employerSharePercent}
                            onChange={(e) =>
                              setMealVouchers({
                                ...mealVouchers,
                                employerSharePercent: Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)),
                              })
                            }
                            className="w-full h-7 text-center font-mono font-bold text-xs border border-slate-300 rounded text-emerald-700"
                          />
                          <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">%</span>
                        </div>
                      </div>

                      {/* Quick presets : 50% (légal min), 60% (légal max exonéré) */}
                      <div className="flex gap-1 mt-1">
                        {[50, 60].map((pct) => (
                          <button
                            key={pct}
                            type="button"
                            onClick={() => setMealVouchers({ ...mealVouchers, employerSharePercent: pct })}
                            className={`flex-1 py-0.5 text-[10px] font-medium rounded border transition-colors cursor-pointer ${
                              mealVouchers.employerSharePercent === pct
                                ? 'bg-amber-600 text-white border-amber-600 font-bold'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {pct}% {pct === 50 ? '(min légal)' : '(max exonéré)'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Nombre de tickets par mois */}
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Tickets par mois :</span>
                      <div className="relative w-16">
                        <input
                          type="number"
                          min={1}
                          max={31}
                          value={mealVouchers.countPerMonth}
                          onChange={(e) =>
                            setMealVouchers({ ...mealVouchers, countPerMonth: parseInt(e.target.value, 10) || 0 })
                          }
                          className="w-full h-7 text-center font-mono text-xs border border-slate-200 rounded"
                        />
                      </div>
                    </div>

                    {/* Recap breakdown: Part employeur vs Part employé déduite */}
                    <div className="space-y-1 pt-1.5 border-t border-slate-100 text-[11px]">
                      <div className="flex justify-between text-emerald-700">
                        <span>Pris en charge employeur ({mealVouchers.employerSharePercent}%) :</span>
                        <strong className="font-mono">
                          +{formatEuro(Math.round(mealVouchers.countPerMonth * mealVouchers.faceValue * (mealVouchers.employerSharePercent / 100)))}
                        </strong>
                      </div>
                      <div className="flex justify-between text-rose-600 font-semibold">
                        <span>Part employé ({100 - mealVouchers.employerSharePercent}%) déduite du net :</span>
                        <strong className="font-mono">
                          -{formatEuro(mealVoucherEmployeeDeduction)} / m
                        </strong>
                      </div>
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 italic">Désactivé</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
