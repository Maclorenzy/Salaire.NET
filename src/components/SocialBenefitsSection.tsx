/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MealVoucherConfig, MutuelleConfig, TransportPassConfig } from '../types/salary';
import { formatEuro } from '../utils/salaryCalculations';
import { ChevronDown, ChevronUp, Utensils, Bus, HeartPulse, Minus, Plus } from 'lucide-react';

interface SocialBenefitsSectionProps {
  mealVouchers: MealVoucherConfig;
  setMealVouchers: React.Dispatch<React.SetStateAction<MealVoucherConfig>>;
  transportPass: TransportPassConfig;
  setTransportPass: React.Dispatch<React.SetStateAction<TransportPassConfig>>;
  mutuelle: MutuelleConfig;
  setMutuelle: React.Dispatch<React.SetStateAction<MutuelleConfig>>;
}

export const SocialBenefitsSection: React.FC<SocialBenefitsSectionProps> = ({
  mealVouchers,
  setMealVouchers,
  transportPass,
  setTransportPass,
  mutuelle,
  setMutuelle,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Calcul part salariale des tickets restaurant
  const mealVoucherEmployeeDeduction = mealVouchers.enabled
    ? Math.round(
        (mealVouchers.countPerMonth || 0) *
        (mealVouchers.faceValue || 0) *
        ((100 - Math.max(0, Math.min(100, mealVouchers.employerSharePercent ?? 50))) / 100)
      )
    : 0;

  // Calcul remboursement transports publics
  const transportReimbursementAmount = Math.round(
    transportPass.monthlyCost * ((transportPass.employerSharePercent || 50) / 100)
  );

  const isAnyBenefitEnabled = transportPass.enabled || mutuelle.enabled || mealVouchers.enabled;

  return (
    <div className={`bg-white rounded-xl border transition-all shadow-sm overflow-hidden ${isAnyBenefitEnabled ? 'border-slate-200' : 'border-slate-200/70'}`}>
      {/* Clickable Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="bg-slate-50/80 p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-100/60 transition-colors select-none border-b border-slate-200/80"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Utensils className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>2. Avantages Sociaux</span>
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                Quotidien
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Transports publics, Mutuelle santé et Titres-restaurant (Optionnel)
            </p>
          </div>
        </div>

        {/* Global toggle + Chevron */}
        <div className="flex items-center gap-3 self-center shrink-0" onClick={(e) => e.stopPropagation()}>
          <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-slate-700 bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg shadow-2xs hover:border-slate-300 transition-colors">
            <input
              type="checkbox"
              checked={isAnyBenefitEnabled}
              onChange={(e) => {
                const checked = e.target.checked;
                setTransportPass((prev) => ({ ...prev, enabled: checked }));
                setMutuelle((prev) => ({ ...prev, enabled: checked }));
                setMealVouchers((prev) => ({ ...prev, enabled: checked }));
              }}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <span className={isAnyBenefitEnabled ? 'text-blue-700' : 'text-slate-600'}>
              {isAnyBenefitEnabled ? 'Avantages activés' : 'Activer les avantages'}
            </span>
          </label>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
            className="text-slate-500 hover:text-slate-800 p-1 rounded-md cursor-pointer"
            aria-label={isOpen ? 'Replier la section' : 'Déplier la section'}
          >
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="p-5 sm:p-6 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Personnalisez la prise en charge de vos transports en commun, mutuelle santé et titres-restaurant (désactivés par défaut).
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
            {/* 1. Remboursement Transports Publics */}
            <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Bus className="w-4 h-4 text-blue-600 shrink-0" />
                    Transports publics
                  </span>
                  <input
                    type="checkbox"
                    checked={transportPass.enabled}
                    onChange={(e) => setTransportPass({ ...transportPass, enabled: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer"
                  />
                </div>

                {transportPass.enabled ? (
                  <div className="space-y-3 text-xs">
                    {/* Coût abonnement */}
                    <div className="bg-slate-50/80 p-2.5 rounded-lg border border-slate-200/60">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-semibold text-slate-700">Coût de l&apos;abonnement</span>
                        <span className="text-[11px] text-slate-400 font-mono">/ mois</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setTransportPass((prev) => ({ ...prev, monthlyCost: Math.max(0, Math.round((prev.monthlyCost - 1) * 10) / 10) }))}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-700 shadow-2xs transition-colors cursor-pointer shrink-0"
                          title="Diminuer de 1 €"
                          aria-label="Diminuer le coût transport de 1 euro"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <div className="relative flex-1">
                          <input
                            type="number"
                            min={0}
                            step="any"
                            value={transportPass.monthlyCost === 0 ? '' : transportPass.monthlyCost}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              setTransportPass((prev) => ({ ...prev, monthlyCost: isNaN(val) ? 0 : Math.max(0, val) }));
                            }}
                            placeholder="0"
                            className="w-full h-8 px-2 pr-6 text-center font-mono font-bold text-xs border border-slate-300 rounded-lg bg-white text-slate-900 focus:border-blue-500 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none shadow-2xs"
                          />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 font-bold pointer-events-none select-none">€</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setTransportPass((prev) => ({ ...prev, monthlyCost: Math.round((prev.monthlyCost + 1) * 10) / 10 }))}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-700 shadow-2xs transition-colors cursor-pointer shrink-0"
                          title="Augmenter de 1 €"
                          aria-label="Augmenter le coût transport de 1 euro"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Prise en charge employeur modifiable */}
                    <div className="bg-slate-50/80 p-2.5 rounded-lg border border-slate-200/60">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-semibold text-slate-700">Prise en charge employeur</span>
                        <span className="text-xs font-mono font-bold text-blue-700">{transportPass.employerSharePercent}%</span>
                      </div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <button
                          type="button"
                          onClick={() => setTransportPass((prev) => ({ ...prev, employerSharePercent: Math.max(0, prev.employerSharePercent - 5) }))}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-700 shadow-2xs transition-colors cursor-pointer shrink-0"
                          title="Diminuer de 5%"
                          aria-label="Diminuer la prise en charge de 5 pourcent"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <div className="relative flex-1">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            step={5}
                            value={transportPass.employerSharePercent}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              setTransportPass((prev) => ({
                                ...prev,
                                employerSharePercent: isNaN(val) ? 0 : Math.max(0, Math.min(100, val)),
                              }));
                            }}
                            className="w-full h-8 px-2 pr-6 text-center font-mono font-bold text-xs border border-slate-300 rounded-lg bg-white text-blue-700 focus:border-blue-500 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none shadow-2xs"
                          />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 font-bold pointer-events-none select-none">%</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setTransportPass((prev) => ({ ...prev, employerSharePercent: Math.min(100, prev.employerSharePercent + 5) }))}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-700 shadow-2xs transition-colors cursor-pointer shrink-0"
                          title="Augmenter de 5%"
                          aria-label="Augmenter la prise en charge de 5 pourcent"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Quick preset buttons: 50%, 75%, 100% */}
                      <div className="flex gap-1.5">
                        {[50, 75, 100].map((pct) => (
                          <button
                            key={pct}
                            type="button"
                            onClick={() => setTransportPass((prev) => ({ ...prev, employerSharePercent: pct }))}
                            className={`flex-1 py-1 text-[11px] font-semibold rounded-md border transition-colors cursor-pointer ${
                              transportPass.employerSharePercent === pct
                                ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {pct}% {pct === 50 && '(légal)'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center text-xs text-slate-400 italic">
                    Transports désactivés
                  </div>
                )}
              </div>

              {transportPass.enabled && (
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Remboursement employeur :</span>
                  <strong className="font-mono font-bold text-emerald-600 whitespace-nowrap">
                    +{formatEuro(transportReimbursementAmount)} / mois
                  </strong>
                </div>
              )}
            </div>

            {/* 2. Mutuelle Santé (Parts Salariale & Patronale modifiables) */}
            <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <HeartPulse className="w-4 h-4 text-rose-600 shrink-0" />
                    Mutuelle Santé
                  </span>
                  <input
                    type="checkbox"
                    checked={mutuelle.enabled}
                    onChange={(e) => setMutuelle({ ...mutuelle, enabled: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer"
                  />
                </div>

                {mutuelle.enabled ? (
                  <div className="space-y-3 text-xs">
                    {/* Part salariale */}
                    <div className="bg-slate-50/80 p-2.5 rounded-lg border border-slate-200/60">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-semibold text-slate-700">Part salariale (retenue)</span>
                        <span className="text-[11px] text-slate-400 font-mono">/ mois</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setMutuelle((prev) => ({ ...prev, employeeMonthlyCost: Math.max(0, Math.round(prev.employeeMonthlyCost - 5)) }))}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-700 shadow-2xs transition-colors cursor-pointer shrink-0"
                          title="Diminuer de 5 €"
                          aria-label="Diminuer la part salariale mutuelle de 5 euros"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <div className="relative flex-1">
                          <input
                            type="number"
                            min={0}
                            step={5}
                            value={mutuelle.employeeMonthlyCost === 0 ? '' : mutuelle.employeeMonthlyCost}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              setMutuelle((prev) => ({ ...prev, employeeMonthlyCost: isNaN(val) ? 0 : Math.max(0, val) }));
                            }}
                            placeholder="0"
                            className="w-full h-8 px-2 pr-7 text-center font-mono font-bold text-xs border border-slate-300 rounded-lg bg-white text-rose-700 focus:border-rose-400 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none shadow-2xs"
                          />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold pointer-events-none select-none">€/m</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setMutuelle((prev) => ({ ...prev, employeeMonthlyCost: Math.round(prev.employeeMonthlyCost + 5) }))}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-700 shadow-2xs transition-colors cursor-pointer shrink-0"
                          title="Augmenter de 5 €"
                          aria-label="Augmenter la part salariale mutuelle de 5 euros"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Part employeur modifiable */}
                    <div className="bg-slate-50/80 p-2.5 rounded-lg border border-slate-200/60">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-semibold text-slate-700">Part employeur (financée)</span>
                        <span className="text-[11px] text-slate-400 font-mono">/ mois</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setMutuelle((prev) => ({ ...prev, employerMonthlyCost: Math.max(0, Math.round(prev.employerMonthlyCost - 5)) }))}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-700 shadow-2xs transition-colors cursor-pointer shrink-0"
                          title="Diminuer de 5 €"
                          aria-label="Diminuer la part employeur mutuelle de 5 euros"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <div className="relative flex-1">
                          <input
                            type="number"
                            min={0}
                            step={5}
                            value={mutuelle.employerMonthlyCost === 0 ? '' : mutuelle.employerMonthlyCost}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              setMutuelle((prev) => ({ ...prev, employerMonthlyCost: isNaN(val) ? 0 : Math.max(0, val) }));
                            }}
                            placeholder="0"
                            className="w-full h-8 px-2 pr-7 text-center font-mono font-bold text-xs border border-slate-300 rounded-lg bg-white text-indigo-700 focus:border-indigo-400 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none shadow-2xs"
                          />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold pointer-events-none select-none">€/m</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setMutuelle((prev) => ({ ...prev, employerMonthlyCost: Math.round(prev.employerMonthlyCost + 5) }))}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-700 shadow-2xs transition-colors cursor-pointer shrink-0"
                          title="Augmenter de 5 €"
                          aria-label="Augmenter la part employeur mutuelle de 5 euros"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-400 leading-tight">
                      La part employeur est intégrée au net fiscal et au coût employeur.
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center text-xs text-slate-400 italic">
                    Mutuelle désactivée
                  </div>
                )}
              </div>

              {mutuelle.enabled && (
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Retenue nette salariale :</span>
                  <strong className="font-mono font-bold text-rose-600 whitespace-nowrap">
                    -{formatEuro(mutuelle.employeeMonthlyCost)} / mois
                  </strong>
                </div>
              )}
            </div>

            {/* 3. Tickets Restaurant */}
            <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Utensils className="w-4 h-4 text-amber-600 shrink-0" />
                    Tickets Restaurant
                  </span>
                  <input
                    type="checkbox"
                    checked={mealVouchers.enabled}
                    onChange={(e) => setMealVouchers({ ...mealVouchers, enabled: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer"
                  />
                </div>

                {mealVouchers.enabled ? (
                  <div className="space-y-3 text-xs">
                    {/* Montant du ticket (Valeur faciale) */}
                    <div className="bg-slate-50/80 p-2.5 rounded-lg border border-slate-200/60">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-semibold text-slate-700">Valeur unitaire du ticket</span>
                        <span className="text-[11px] text-slate-400 font-mono">par repas</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setMealVouchers((prev) => ({ ...prev, faceValue: Math.max(1, Math.round((prev.faceValue - 0.5) * 10) / 10) }))}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-700 shadow-2xs transition-colors cursor-pointer shrink-0"
                          title="Diminuer de 0,50 €"
                          aria-label="Diminuer la valeur faciale de 0,50 euro"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <div className="relative flex-1">
                          <input
                            type="number"
                            min={1}
                            max={30}
                            step={0.5}
                            value={mealVouchers.faceValue === 0 ? '' : mealVouchers.faceValue}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              setMealVouchers((prev) => ({ ...prev, faceValue: isNaN(val) ? 0 : Math.max(0, val) }));
                            }}
                            placeholder="10"
                            className="w-full h-8 px-2 pr-6 text-center font-mono font-bold text-xs border border-slate-300 rounded-lg bg-white text-amber-900 focus:border-amber-500 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none shadow-2xs"
                          />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 font-bold pointer-events-none select-none">€</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setMealVouchers((prev) => ({ ...prev, faceValue: Math.min(30, Math.round((prev.faceValue + 0.5) * 10) / 10) }))}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-700 shadow-2xs transition-colors cursor-pointer shrink-0"
                          title="Augmenter de 0,50 €"
                          aria-label="Augmenter la valeur faciale de 0,50 euro"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Pourcentage de prise en charge employeur */}
                    <div className="bg-slate-50/80 p-2.5 rounded-lg border border-slate-200/60">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-semibold text-slate-700">Prise en charge employeur</span>
                        <span className="text-xs font-mono font-bold text-emerald-700">{mealVouchers.employerSharePercent}%</span>
                      </div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <button
                          type="button"
                          onClick={() => setMealVouchers((prev) => ({ ...prev, employerSharePercent: Math.max(0, prev.employerSharePercent - 5) }))}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-700 shadow-2xs transition-colors cursor-pointer shrink-0"
                          title="Diminuer de 5%"
                          aria-label="Diminuer la prise en charge tickets de 5 pourcent"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <div className="relative flex-1">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            step={1}
                            value={mealVouchers.employerSharePercent}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              setMealVouchers((prev) => ({
                                ...prev,
                                employerSharePercent: isNaN(val) ? 0 : Math.max(0, Math.min(100, val)),
                              }));
                            }}
                            className="w-full h-8 px-2 pr-6 text-center font-mono font-bold text-xs border border-slate-300 rounded-lg bg-white text-emerald-700 focus:border-emerald-500 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none shadow-2xs"
                          />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 font-bold pointer-events-none select-none">%</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setMealVouchers((prev) => ({ ...prev, employerSharePercent: Math.min(100, prev.employerSharePercent + 5) }))}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-700 shadow-2xs transition-colors cursor-pointer shrink-0"
                          title="Augmenter de 5%"
                          aria-label="Augmenter la prise en charge tickets de 5 pourcent"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Quick presets : 50% (légal min), 60% (légal max exonéré) */}
                      <div className="flex gap-1.5">
                        {[50, 60].map((pct) => (
                          <button
                            key={pct}
                            type="button"
                            onClick={() => setMealVouchers((prev) => ({ ...prev, employerSharePercent: pct }))}
                            className={`flex-1 py-1 text-[11px] font-semibold rounded-md border transition-colors cursor-pointer ${
                              mealVouchers.employerSharePercent === pct
                                ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {pct}% {pct === 50 ? '(min légal)' : '(max exonéré)'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Nombre de tickets par mois */}
                    <div className="bg-slate-50/80 p-2.5 rounded-lg border border-slate-200/60">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-semibold text-slate-700">Nombre de tickets par mois</span>
                        <span className="text-[11px] text-slate-400 font-mono">/ mois</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setMealVouchers((prev) => ({ ...prev, countPerMonth: Math.max(0, prev.countPerMonth - 1) }))}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-700 shadow-2xs transition-colors cursor-pointer shrink-0"
                          title="Diminuer de 1 ticket"
                          aria-label="Diminuer de 1 ticket"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <div className="relative flex-1">
                          <input
                            type="number"
                            min={0}
                            max={31}
                            value={mealVouchers.countPerMonth}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              setMealVouchers((prev) => ({ ...prev, countPerMonth: isNaN(val) ? 0 : Math.max(0, Math.min(31, val)) }));
                            }}
                            className="w-full h-8 px-2 text-center font-mono font-bold text-xs border border-slate-300 rounded-lg bg-white text-slate-900 focus:border-amber-500 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none shadow-2xs"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setMealVouchers((prev) => ({ ...prev, countPerMonth: Math.min(31, prev.countPerMonth + 1) }))}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-700 shadow-2xs transition-colors cursor-pointer shrink-0"
                          title="Augmenter de 1 ticket"
                          aria-label="Augmenter de 1 ticket"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center text-xs text-slate-400 italic">
                    Tickets restaurant désactivés
                  </div>
                )}
              </div>

              {mealVouchers.enabled && (
                <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center text-emerald-700">
                    <span className="font-medium">Pris en charge employeur :</span>
                    <strong className="font-mono font-bold whitespace-nowrap">
                      +{formatEuro(Math.round(mealVouchers.countPerMonth * mealVouchers.faceValue * (mealVouchers.employerSharePercent / 100)))} / mois
                    </strong>
                  </div>
                  <div className="flex justify-between items-center text-rose-600">
                    <span className="font-medium">Part employé déduite du net :</span>
                    <strong className="font-mono font-bold whitespace-nowrap">
                      -{formatEuro(mealVoucherEmployeeDeduction)} / mois
                    </strong>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
