/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RotateCcw, Copy, Check, History, AlertTriangle, HelpCircle } from 'lucide-react';
import { APP_VERSION } from '../data/changelog';
import { CopyDestinationModal } from './CopyDestinationModal';

interface HeaderProps {
  onReset: () => void;
  onCopySummary: () => void;
  copied: boolean;
  activeSection: string;
  setActiveSection: (section: string) => void;
  onOpenChangelog: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onReset,
  onCopySummary,
  copied,
  activeSection,
  setActiveSection,
  onOpenChangelog,
}) => {
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 sm:gap-8">
          {/* Zone 1: Brand wordmark & Version pill */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
              €
            </div>
            <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0">
              Simulateur Salaire Net FR
            </span>
            <button
              type="button"
              onClick={onOpenChangelog}
              className="flex items-center gap-1.5 px-2 py-0.5 text-xs font-mono font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-full transition-colors cursor-pointer"
              title="Consulter le Changelog et l'historique des versions"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{APP_VERSION}</span>
            </button>
          </div>

          {/* Zone 2: 4 clean single-line navigation tabs */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              type="button"
              onClick={() => setActiveSection('simulateur')}
              className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
                activeSection === 'simulateur'
                  ? 'text-blue-600 font-semibold'
                  : 'hover:text-slate-900'
              }`}
            >
              Simulateur
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('bulletin')}
              className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
                activeSection === 'bulletin'
                  ? 'text-blue-600 font-semibold'
                  : 'hover:text-slate-900'
              }`}
            >
              Bulletin de Paie
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('arbitrage')}
              className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
                activeSection === 'arbitrage'
                  ? 'text-blue-600 font-semibold'
                  : 'hover:text-slate-900'
              }`}
            >
              Épargne Salariale & Arbitrage
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('cout-employeur')}
              className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
                activeSection === 'cout-employeur'
                  ? 'text-blue-600 font-semibold'
                  : 'hover:text-slate-900'
              }`}
            >
              Coût Employeur
            </button>
            <button
              type="button"
              onClick={onOpenChangelog}
              className="flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap shrink-0 text-slate-600 hover:text-blue-600"
            >
              <History className="w-3.5 h-3.5 text-blue-600" />
              <span>Changelog</span>
            </button>
          </nav>

          {/* Zone 3: 1 primary action group */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onOpenChangelog}
              className="flex sm:hidden items-center justify-center w-8 h-8 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
              title="Ouvrir le changelog"
              aria-label="Ouvrir le changelog"
            >
              <History className="w-4 h-4 text-blue-600" />
            </button>

            {/* Copy button with integrated destination guide trigger */}
            <div className="relative">
              <div className="flex items-center rounded-md bg-slate-100 border border-slate-200 shadow-2xs">
                <button
                  type="button"
                  onClick={onCopySummary}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 rounded-l-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  title="Copier le résumé complet de la simulation dans le presse-papier"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-semibold">Synthèse copiée !</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copier synthèse</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsGuideOpen(true)}
                  className="px-2 py-1.5 text-xs text-slate-500 hover:text-blue-700 hover:bg-blue-50 border-l border-slate-200 rounded-r-md transition-colors cursor-pointer flex items-center gap-1"
                  title="Où et comment coller la synthèse ?"
                  aria-label="Préciser où coller la synthèse"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                  <span className="hidden lg:inline text-[11px] font-medium text-slate-600">Où coller ?</span>
                </button>
              </div>

              {/* Informative bubble/toast right beneath the button when copied */}
              {copied && (
                <div className="absolute right-0 top-full mt-2 z-50 w-72 sm:w-80 p-3 bg-white rounded-xl shadow-xl border border-slate-200 text-xs text-slate-700 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Copié dans le presse-papier !</span>
                  </div>
                  <p className="mt-1.5 text-[11px] text-slate-600 leading-normal">
                    Collez ce texte avec <kbd className="px-1 py-0.5 bg-slate-100 border border-slate-300 rounded font-mono font-semibold text-slate-800">Ctrl+V</kbd> ou <kbd className="px-1 py-0.5 bg-slate-100 border border-slate-300 rounded font-mono font-semibold text-slate-800">⌘V</kbd> dans :
                  </p>
                  <ul className="mt-1.5 text-[11px] text-slate-600 space-y-1 pl-4 list-disc marker:text-blue-500">
                    <li><strong className="text-slate-800">E-mail RH / Recruteur</strong> (négociation d'embauche ou révision salariale)</li>
                    <li><strong className="text-slate-800">Tableur Excel ou Google Sheets</strong> (budget prévisionnel)</li>
                    <li><strong className="text-slate-800">Bloc-notes ou document Word</strong> (sauvegarde personnelle)</li>
                  </ul>
                  <button
                    type="button"
                    onClick={() => setIsGuideOpen(true)}
                    className="mt-2 text-[11px] font-semibold text-blue-600 hover:text-blue-800 underline block cursor-pointer"
                  >
                    Voir le guide d'utilisation complet →
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Réinitialiser</span>
            </button>
          </div>
        </div>

        {/* Avertissement légal et indicatif */}
        <div className="bg-amber-50/95 border-t border-amber-200/80 px-4 sm:px-6 lg:px-8 py-2">
          <div className="max-w-7xl mx-auto flex items-start sm:items-center gap-2.5 text-[11px] sm:text-xs text-amber-950 leading-relaxed sm:leading-normal">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
            <p>
              <span className="font-semibold text-amber-900">Avertissement :</span> Les chiffres sont purement à titre indicatif et seule la fiche de paie fait foi. Même si les calculs sont basés sur des barèmes officiels, seules les règles de l'entreprise prévalent sur les projections affichées dans l'application et aucun chiffre annoncé ici ne peut les contredire.
            </p>
          </div>
        </div>
      </header>

      {/* Guide modal explaining where and how to paste the summary */}
      <CopyDestinationModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onReCopy={onCopySummary}
        copied={copied}
      />
    </>
  );
};
