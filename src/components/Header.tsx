/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RotateCcw, Copy, Check, History, AlertTriangle } from 'lucide-react';
import { APP_VERSION } from '../data/changelog';

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
  return (
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

          <button
            type="button"
            onClick={onCopySummary}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            title="Copier le résumé complet"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copié !</span>
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
  );
};
