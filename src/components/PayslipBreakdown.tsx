/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SalaryBreakdown } from '../types/salary';
import { formatEuro } from '../utils/salaryCalculations';
import { FileText, ChevronDown, ChevronUp, Info } from 'lucide-react';

interface PayslipBreakdownProps {
  breakdown: SalaryBreakdown;
}

export const PayslipBreakdown: React.FC<PayslipBreakdownProps> = ({ breakdown }) => {
  const [showDetails, setShowDetails] = useState(true);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Bulletin de Paie Clarifié (Mensuel)
            </h3>
            <p className="text-xs text-slate-500">
              Décomposition officielle des cotisations sociales et fiscales françaises
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
        >
          <span>{showDetails ? 'Masquer le détail' : 'Afficher le détail'}</span>
          {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      <div className="p-5 space-y-4">
        {/* Table summary */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-medium">
                <th className="text-left py-2 px-1">Rubrique de paie</th>
                <th className="text-right py-2 px-1">Base / Taux</th>
                <th className="text-right py-2 px-1">Montant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Salaire Brut (avec détail part variable si actif) */}
              {breakdown.variableBonusEnabled && breakdown.variableBonusAmount > 0 ? (
                <>
                  <tr className="text-slate-700 bg-slate-50/30">
                    <td className="py-2 px-1">Salaire brut fixe de base</td>
                    <td className="text-right py-2 px-1 font-mono text-slate-500">Fixe contractuel</td>
                    <td className="text-right py-2 px-1 font-mono text-slate-700 tabular-nums">
                      {formatEuro(breakdown.grossMonthly - breakdown.variableBonusMonthly)}
                    </td>
                  </tr>
                  <tr className="text-blue-800 bg-blue-50/30">
                    <td className="py-2 px-1 font-medium">Part variable (Bonus objectifs {breakdown.variableBonusPercent}%)</td>
                    <td className="text-right py-2 px-1 font-mono text-blue-600">Variable cadre</td>
                    <td className="text-right py-2 px-1 font-mono font-medium text-blue-700 tabular-nums">
                      +{formatEuro(breakdown.variableBonusMonthly)}
                    </td>
                  </tr>
                  <tr className="font-semibold text-slate-900 bg-slate-100/60">
                    <td className="py-2.5 px-1">Total Salaire Brut Mensuel Soumis</td>
                    <td className="text-right py-2.5 px-1 font-mono text-slate-500">Fixe + Variable</td>
                    <td className="text-right py-2.5 px-1 font-mono font-bold text-slate-900 tabular-nums">
                      {formatEuro(breakdown.grossMonthly)}
                    </td>
                  </tr>
                </>
              ) : (
                <tr className="font-semibold text-slate-900 bg-slate-50/50">
                  <td className="py-2.5 px-1">Salaire Brut Mensuel</td>
                  <td className="text-right py-2.5 px-1 font-mono text-slate-500">35h / Cadence</td>
                  <td className="text-right py-2.5 px-1 font-mono text-slate-900 tabular-nums">
                    {formatEuro(breakdown.grossMonthly)}
                  </td>
                </tr>
              )}

              {/* Social contributions details */}
              {showDetails && (
                <>
                  <tr className="text-slate-600">
                    <td className="py-2 px-1 pl-4">1. Santé (Assurance maladie, maternité)</td>
                    <td className="text-right py-2 px-1 font-mono text-slate-400">0.40%</td>
                    <td className="text-right py-2 px-1 font-mono text-slate-600 tabular-nums">
                      -{formatEuro(breakdown.socialDetails.health)}
                    </td>
                  </tr>
                  <tr className="text-slate-600">
                    <td className="py-2 px-1 pl-4">2. Retraite Sécurité Sociale (Base plafonnée & déplafonnée)</td>
                    <td className="text-right py-2 px-1 font-mono text-slate-400">7.30%</td>
                    <td className="text-right py-2 px-1 font-mono text-slate-600 tabular-nums">
                      -{formatEuro(breakdown.socialDetails.basicRetirement)}
                    </td>
                  </tr>
                  <tr className="text-slate-600">
                    <td className="py-2 px-1 pl-4">3. Retraite Complémentaire (Agirc-Arrco)</td>
                    <td className="text-right py-2 px-1 font-mono text-slate-400">
                      {breakdown.employeeStatus === 'cadre' ? '~5.50%' : '~4.80%'}
                    </td>
                    <td className="text-right py-2 px-1 font-mono text-slate-600 tabular-nums">
                      -{formatEuro(breakdown.socialDetails.complementaryRetirement)}
                    </td>
                  </tr>
                  <tr className="text-slate-600">
                    <td className="py-2 px-1 pl-4">4. CSG déductible de l&apos;impôt</td>
                    <td className="text-right py-2 px-1 font-mono text-slate-400">6.8% (s/ 98.25%)</td>
                    <td className="text-right py-2 px-1 font-mono text-slate-600 tabular-nums">
                      -{formatEuro(breakdown.socialDetails.csgDeductible)}
                    </td>
                  </tr>
                  <tr className="text-slate-600">
                    <td className="py-2 px-1 pl-4">5. CSG non déductible & CRDS</td>
                    <td className="text-right py-2 px-1 font-mono text-slate-400">2.9% (s/ 98.25%)</td>
                    <td className="text-right py-2 px-1 font-mono text-slate-600 tabular-nums">
                      -{formatEuro(breakdown.socialDetails.csgNonDeductibleCrds)}
                    </td>
                  </tr>
                  {breakdown.employeeStatus === 'cadre' && (
                    <tr className="text-slate-600">
                      <td className="py-2 px-1 pl-4">6. Spécifique Cadre (APEC & Prévoyance décès Tranche A)</td>
                      <td className="text-right py-2 px-1 font-mono text-slate-400">~1.80%</td>
                      <td className="text-right py-2 px-1 font-mono text-slate-600 tabular-nums">
                        -{formatEuro(breakdown.socialDetails.cadreSpecific)}
                      </td>
                    </tr>
                  )}
                </>
              )}

              {/* Total Cotisations Salariales */}
              <tr className="font-medium text-rose-700 bg-rose-50/30">
                <td className="py-2.5 px-1">
                  Total des cotisations salariales ({breakdown.employeeStatus === 'cadre' ? '~25%' : '~24%'})
                </td>
                <td className="text-right py-2.5 px-1 font-mono text-rose-600">
                  {breakdown.employeeStatus === 'cadre' ? 'Statut Cadre' : 'Statut Non-Cadre'}
                </td>
                <td className="text-right py-2.5 px-1 font-mono font-bold text-rose-700 tabular-nums">
                  -{formatEuro(breakdown.employeeContributionsMonthly)}
                </td>
              </tr>

              {/* Net à payer avant impôt */}
              <tr className="font-bold text-slate-900 bg-slate-100/70">
                <td className="py-3 px-1 text-sm">Net à payer avant impôt sur le revenu</td>
                <td className="text-right py-3 px-1 font-mono text-slate-500">Ligne officielle</td>
                <td className="text-right py-3 px-1 font-mono text-sm font-bold text-slate-900 tabular-nums">
                  {formatEuro(breakdown.netBeforeTaxMonthly)}
                </td>
              </tr>

              {/* Prélèvement à la source */}
              {breakdown.incomeTaxMonthly > 0 ? (
                <tr className="text-rose-700">
                  <td className="py-2 px-1 pl-4">
                    Impôt sur le Revenu prélevé à la source (PAS)
                  </td>
                  <td className="text-right py-2 px-1 font-mono text-slate-500">
                    Taux : {breakdown.estimatedTaxRate}%
                  </td>
                  <td className="text-right py-2 px-1 font-mono font-semibold tabular-nums">
                    -{formatEuro(breakdown.incomeTaxMonthly)}
                  </td>
                </tr>
              ) : (
                <tr className="text-slate-500">
                  <td className="py-2 px-1 pl-4">Impôt sur le Revenu prélevé à la source (PAS)</td>
                  <td className="text-right py-2 px-1 font-mono text-slate-400">Taux : 0% (Non imposable)</td>
                  <td className="text-right py-2 px-1 font-mono text-slate-400 tabular-nums">0 €</td>
                </tr>
              )}

              {/* Retenue Tickets Restaurant (Part salariale) */}
              {breakdown.mealVouchersDeductionMonthly > 0 && (
                <tr className="text-rose-700">
                  <td className="py-2 px-1 pl-4">Retenue Tickets Restaurant (Part salariale)</td>
                  <td className="text-right py-2 px-1 font-mono text-slate-400">Déduit du net</td>
                  <td className="text-right py-2 px-1 font-mono font-semibold text-rose-700 tabular-nums">
                    -{formatEuro(breakdown.mealVouchersDeductionMonthly)}
                  </td>
                </tr>
              )}

              {/* Sous-total Salaire Net Après impôts */}
              <tr className="font-bold text-blue-900 bg-blue-50/50">
                <td className="py-2 px-1 text-xs">
                  Salaire Net Après impôts {breakdown.mealVouchersDeductionMonthly > 0 && '(déduit des tickets resto)'}
                </td>
                <td className="text-right py-2 px-1 font-mono text-blue-600 text-[11px]">Net après impôts</td>
                <td className="text-right py-2 px-1 font-mono text-xs font-black text-blue-800 tabular-nums">
                  {formatEuro(breakdown.netAfterTaxMonthly)}
                </td>
              </tr>

              {/* Compléments bancaires */}
              {breakdown.mutuelleDeductionMonthly > 0 && (
                <tr className="text-slate-600">
                  <td className="py-2 px-1 pl-4">Cotisation Mutuelle d&apos;entreprise (Part salariale)</td>
                  <td className="text-right py-2 px-1 font-mono text-slate-400">Santé obligatoire</td>
                  <td className="text-right py-2 px-1 font-mono text-rose-600 tabular-nums">
                    -{formatEuro(breakdown.mutuelleDeductionMonthly)}
                  </td>
                </tr>
              )}

              {breakdown.transportReimbursementMonthly > 0 && (
                <tr className="text-emerald-700">
                  <td className="py-2 px-1 pl-4">Prise en charge Transport Public</td>
                  <td className="text-right py-2 px-1 font-mono text-emerald-600">Non imposable</td>
                  <td className="text-right py-2 px-1 font-mono font-semibold tabular-nums">
                    +{formatEuro(breakdown.transportReimbursementMonthly)}
                  </td>
                </tr>
              )}

              {/* Net payé en euros (Virement bancaire) */}
              <tr className="font-black text-slate-950 bg-emerald-50/80 border-t-2 border-emerald-500">
                <td className="py-3 px-1 text-sm text-emerald-950">
                  Net Payé en Euros (Virement bancaire fin de mois)
                </td>
                <td className="text-right py-3 px-1 font-mono text-emerald-800 font-semibold">
                  Virement réel
                </td>
                <td className="text-right py-3 px-1 font-mono text-base font-black text-emerald-700 tabular-nums">
                  {formatEuro(breakdown.netInBankMonthlyStandard)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex items-start gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
          <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <p>
            Cette décomposition respecte les normes du bulletin de paie clarifié en vigueur en France. Les pourcentages effectifs peuvent varier légèrement selon la convention collective nationale (CCN) et le niveau de salaire par rapport au plafond de la sécurité sociale (PMSS).
          </p>
        </div>
      </div>
    </div>
  );
};
