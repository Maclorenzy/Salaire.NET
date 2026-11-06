/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import {
  X,
  Mail,
  FileSpreadsheet,
  FileText,
  MessageSquare,
  Keyboard,
  Smartphone,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';

interface CopyDestinationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReCopy?: () => void;
  copied?: boolean;
}

export const CopyDestinationModal: React.FC<CopyDestinationModalProps> = ({
  isOpen,
  onClose,
  onReCopy,
  copied = false,
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scrolling
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const destinations = [
    {
      icon: Mail,
      iconBg: 'bg-blue-50 text-blue-600',
      title: 'E-mails RH, Recruteur ou Manager',
      tools: 'Gmail, Outlook, Apple Mail, Thunderbird',
      description:
        "Idéal pour préparer un entretien annuel d'évaluation, demander une revalorisation salariale, ou récapituler une proposition d'embauche avec le détail brut, net, variable et épargne salariale.",
      badge: 'Négociation & RH',
    },
    {
      icon: FileSpreadsheet,
      iconBg: 'bg-emerald-50 text-emerald-600',
      title: 'Tableurs & Budget Personnel',
      tools: 'Microsoft Excel, Google Sheets, LibreOffice Calc',
      description:
        "Parfait pour coller dans votre tableau de budget mensuel prévisionnel, calculer votre reste à vivre ou comparer côte à côte deux offres d'emploi concurrentes.",
      badge: 'Budget & Modélisation',
    },
    {
      icon: FileText,
      iconBg: 'bg-indigo-50 text-indigo-600',
      title: 'Applications de Notes & Documents',
      tools: 'Notion, Obsidian, Apple Notes, Word, Google Docs',
      description:
        "Pour archiver vos simulations de package salarial, garder une trace des dates clés de versement de participation/intéressement et suivre l'évolution de votre rémunération au fil des années.",
      badge: 'Archivage & Suivi',
    },
    {
      icon: MessageSquare,
      iconBg: 'bg-amber-50 text-amber-600',
      title: 'Messageries d’Entreprise ou Privées',
      tools: 'Slack, Microsoft Teams, WhatsApp, Discord',
      description:
        "Pour transmettre en un clic une estimation claire à un collègue, un représentant du personnel ou un proche lors d'échanges informels.",
      badge: 'Partage Rapide',
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-destination-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50/75">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shrink-0">
              <Copy className="w-4 h-4" />
            </div>
            <div>
              <h2 id="modal-destination-title" className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                Où coller la synthèse copiée ?
              </h2>
              <p className="text-xs text-slate-500">
                La synthèse est copiée dans votre presse-papier sous forme de texte structuré et prêt à l'emploi.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shortcuts banner */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 px-5 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-700">
            <div className="flex items-center gap-2 font-medium">
              <Keyboard className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Comment coller ce texte :</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
              <span className="px-2 py-1 bg-white border border-blue-200 rounded-md font-semibold text-slate-800 shadow-2xs">
                Windows / Linux : Ctrl + V
              </span>
              <span className="px-2 py-1 bg-white border border-blue-200 rounded-md font-semibold text-slate-800 shadow-2xs">
                Mac : ⌘ Cmd + V
              </span>
              <span className="flex items-center gap-1 px-2 py-1 bg-white border border-blue-200 rounded-md font-semibold text-slate-800 shadow-2xs font-sans text-[11px]">
                <Smartphone className="w-3 h-3 text-blue-500" />
                Mobile : Appui long &gt; Coller
              </span>
            </div>
          </div>
        </div>

        {/* Body content */}
        <div className="p-5 overflow-y-auto space-y-4 text-slate-700 text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {destinations.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-xs bg-white transition-all flex flex-col justify-between gap-2.5"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${item.iconBg}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <h3 className="font-semibold text-slate-900 text-xs sm:text-sm">
                          {item.title}
                        </h3>
                      </div>
                      <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full shrink-0">
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-slate-500">
                      {item.tools}
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Practical format breakdown */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
              <span>Contenu exact présent dans votre presse-papier :</span>
            </h4>
            <ul className="text-xs text-slate-600 space-y-1 pl-4 list-disc marker:text-blue-500">
              <li><strong className="text-slate-800">Salaire brut fixe & variable :</strong> montant annuel, part variable et total brut mensuel.</li>
              <li><strong className="text-slate-800">Net avant et après impôt :</strong> montant contractuel, taux effectif de prélèvement à la source et net viré en banque.</li>
              <li><strong className="text-slate-800">Épargne salariale :</strong> arbitrage PEE vs versement cash de la participation et de l'intéressement, abondement employeur et économie d'impôt.</li>
              <li><strong className="text-slate-800">Coût employeur complet :</strong> super-brut mensuel et annuel pour mesurer le budget entreprise total.</li>
            </ul>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-200 bg-slate-50">
          {onReCopy ? (
            <button
              type="button"
              onClick={onReCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Synthèse re-copiée !' : 'Re-copier la synthèse'}</span>
            </button>
          ) : (
            <span className="text-xs text-slate-500">
              Raccourci rapide : cliquez où vous le souhaitez puis <strong>Ctrl+V</strong>
            </span>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            Compris, fermer
          </button>
        </div>
      </div>
    </div>
  );
};
