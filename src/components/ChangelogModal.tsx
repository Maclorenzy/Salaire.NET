/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  History,
  GitCommit,
  Tag,
  Search,
  Copy,
  Check,
  MessageSquareQuote,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { APP_VERSION, CHANGELOG_DATA, VersionRelease } from '../data/changelog';

interface ChangelogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangelogModal: React.FC<ChangelogModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'major' | 'evolution'>('all');
  const [copiedVersion, setCopiedVersion] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

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

  // Prevent background scroll when open
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

  // Filtered releases
  const filteredReleases = useMemo(() => {
    return CHANGELOG_DATA.filter((release) => {
      const matchesSearch =
        release.version.toLowerCase().includes(searchQuery.toLowerCase()) ||
        release.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        release.userPrompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        release.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        release.changes.some((c) => c.description.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (selectedFilter === 'major') {
        return release.badge === 'Majeure' || release.badge === 'Dernière version';
      }
      if (selectedFilter === 'evolution') {
        return release.badge === 'Évolution' || release.badge === 'Correctif';
      }
      return true;
    });
  }, [searchQuery, selectedFilter]);

  const handleCopySingle = async (release: VersionRelease) => {
    const text = `## [${release.version}] - ${release.date}
### Demande utilisateur
> "${release.userPrompt}"

### Résumé
${release.summary}

### Détail des modifications
${release.changes.map((c) => `- [${c.type.toUpperCase()}] ${c.description}`).join('\n')}
`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedVersion(release.version);
      setTimeout(() => setCopiedVersion(null), 2000);
    } catch {
      // ignore
    }
  };

  const handleCopyAll = async () => {
    const fullText = CHANGELOG_DATA.map(
      (r) => `## [${r.version}] - ${r.date} (${r.title})
Demande : "${r.userPrompt}"
Résumé : ${r.summary}
${r.changes.map((c) => `- ${c.description}`).join('\n')}
`
    ).join('\n---\n\n');

    try {
      await navigator.clipboard.writeText(fullText);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch {
      // ignore
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="changelog-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50/70 flex items-start justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm shrink-0">
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 id="changelog-modal-title" className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                  Journal des Modifications & Versioning
                </h2>
                <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-blue-100 text-blue-800 rounded-full border border-blue-200">
                  {APP_VERSION}
                </span>
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-100 text-emerald-800 rounded-md">
                  {CHANGELOG_DATA.length} versions répertoriées
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Traçabilité rigoureuse de chaque itération avec la demande utilisateur originale et les règles de calcul associées.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopyAll}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg shadow-xs transition-colors cursor-pointer"
              title="Copier tout l'historique au format texte"
            >
              {copiedAll ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Tout copié !</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copier tout</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Fermer la fenêtre du changelog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 border-b border-slate-100 bg-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher par version, mot-clé, formule..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          {/* Tag filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs shrink-0">
            <button
              type="button"
              onClick={() => setSelectedFilter('all')}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
                selectedFilter === 'all'
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Toutes ({CHANGELOG_DATA.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter('major')}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
                selectedFilter === 'major'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Majeures
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter('evolution')}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
                selectedFilter === 'evolution'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Évolutions & Correctifs
            </button>
          </div>
        </div>

        {/* Scrollable Changelog Timeline */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {filteredReleases.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <History className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium">Aucune version ne correspond à votre recherche.</p>
            </div>
          ) : (
            filteredReleases.map((release, index) => {
              const isLatest = index === 0 && release.version === APP_VERSION;
              return (
                <div
                  key={release.version}
                  className={`rounded-xl border p-5 transition-all ${
                    isLatest
                      ? 'bg-blue-50/20 border-blue-200 shadow-xs ring-1 ring-blue-500/10'
                      : 'bg-white border-slate-200 shadow-xs'
                  }`}
                >
                  {/* Version header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-mono font-black text-base text-slate-900">
                        {release.version}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                          release.badge === 'Dernière version'
                            ? 'bg-emerald-600 text-white'
                            : release.badge === 'Majeure'
                            ? 'bg-blue-600 text-white'
                            : release.badge === 'Correctif'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {release.badge}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">{release.date}</span>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <button
                        type="button"
                        onClick={() => handleCopySingle(release)}
                        className="flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-slate-800 p-1 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Copier les détails de cette version"
                      >
                        {copiedVersion === release.version ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700 font-semibold">Copié</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copier</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Title & Summary */}
                  <div className="mt-3">
                    <h3 className="text-sm font-bold text-slate-900">{release.title}</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{release.summary}</p>
                  </div>

                  {/* Demande de l'utilisateur (Quotation box) */}
                  <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500 font-bold mb-1">
                      <MessageSquareQuote className="w-3.5 h-3.5 text-blue-600" />
                      <span>Demande de modification initiale de l&apos;utilisateur :</span>
                    </div>
                    <blockquote className="text-slate-800 italic pl-5 border-l-2 border-blue-400 font-medium leading-relaxed">
                      « {release.userPrompt} »
                    </blockquote>
                  </div>

                  {/* Highlights tags */}
                  {release.highlights.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {release.highlights.map((hl, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200"
                        >
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          <span>{hl}</span>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Change list */}
                  <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-1.5">
                    {release.changes.map((change, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <span
                          className={`uppercase font-mono text-[9px] font-extrabold px-1.5 py-0.5 rounded shrink-0 mt-0.5 ${
                            change.type === 'feat'
                              ? 'bg-emerald-100 text-emerald-800'
                              : change.type === 'fix'
                              ? 'bg-amber-100 text-amber-800'
                              : change.type === 'refactor'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {change.type}
                        </span>
                        <span className="leading-relaxed">{change.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            <span>Gestion du versioning conforme Semantic Versioning (SemVer 2.0.0)</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            Fermer le changelog
          </button>
        </div>
      </div>
    </div>
  );
};
