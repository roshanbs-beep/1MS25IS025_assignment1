import React, { useState } from 'react';
import {
  Quote,
  Copy,
  Check,
  Download,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  FileCode,
  Filter,
} from 'lucide-react';
import { CitationItem, CitationFormat, ResearchProject } from '../types/research.ts';
import { formatAllCitations, formatBibtexAll, downloadBlob } from '../utils/exportUtils.ts';

interface CitationsViewProps {
  project: ResearchProject;
}

export const CitationsView: React.FC<CitationsViewProps> = ({ project }) => {
  const { references } = project.paper;
  const [selectedFormat, setSelectedFormat] = useState<CitationFormat>('APA');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [filterVerified, setFilterVerified] = useState(false);

  const displayedReferences = filterVerified
    ? references.filter((r) => r.isVerified)
    : references;

  const handleCopyCitation = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAll = () => {
    const allFormatted = formatAllCitations(project, selectedFormat);
    navigator.clipboard.writeText(allFormatted);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleDownloadBibtex = () => {
    const bibtexContent = formatBibtexAll(project);
    downloadBlob(bibtexContent, 'references.bib', 'application/x-bibtex');
  };

  const getCitationString = (ref: CitationItem, format: CitationFormat) => {
    if (format === 'APA') return ref.citationApa;
    if (format === 'IEEE') return ref.citationIeee;
    if (format === 'MLA') return ref.citationMla;
    return ref.citationApa;
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Quote className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                Academic Citation Generator
              </h1>
              <p className="text-xs text-slate-500">
                Standards-compliant APA 7th, IEEE Numeric, MLA 9th, and BibTeX
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyAll}
              className="px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center space-x-1.5 transition cursor-pointer"
            >
              {copiedAll ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-emerald-600">Copied All!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy All ({selectedFormat})</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadBibtex}
              className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs flex items-center space-x-1.5 transition cursor-pointer"
            >
              <FileCode className="h-3.5 w-3.5" />
              <span>Export .bib (BibTeX)</span>
            </button>
          </div>
        </div>

        {/* Style Selector Tabs & Filter */}
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-500 mr-2">Citation Format:</span>
            {(['APA', 'IEEE', 'MLA'] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setSelectedFormat(fmt)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedFormat === fmt
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {fmt === 'APA' && 'APA 7th Edition'}
                {fmt === 'IEEE' && 'IEEE Numeric'}
                {fmt === 'MLA' && 'MLA 9th Edition'}
              </button>
            ))}
          </div>

          <button
            onClick={() => setFilterVerified(!filterVerified)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center space-x-1.5 transition ${
              filterVerified
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 text-emerald-800 dark:text-emerald-300'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Filter className="h-3 w-3" />
            <span>{filterVerified ? 'Showing Verified Only' : 'Filter Verified Grounded'}</span>
          </button>
        </div>
      </div>

      {/* Citations List */}
      <div className="space-y-4">
        {displayedReferences.map((ref, idx) => {
          const formattedString = getCitationString(ref, selectedFormat);
          const isCopied = copiedId === (ref.id || String(idx));

          return (
            <div
              key={ref.id || idx}
              className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    [{idx + 1}]
                  </span>
                  <span
                    className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      ref.isVerified
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <ShieldCheck className="h-3 w-3" />
                    <span>{ref.isVerified ? 'Verified Grounded Reference' : 'Suggested Literature Avenue'}</span>
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleCopyCitation(formattedString, ref.id || String(idx))}
                    className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-indigo-600 transition text-xs flex items-center space-x-1"
                    title="Copy formatted citation"
                  >
                    {isCopied ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    <span className="text-[11px]">{isCopied ? 'Copied' : 'Copy'}</span>
                  </button>

                  {ref.doiOrUrl && (
                    <a
                      href={ref.doiOrUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-indigo-600 dark:text-indigo-400 flex items-center space-x-1 text-xs"
                      title="Open source URL"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span className="text-[11px]">Source</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Formatted Citation Text */}
              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-sans leading-relaxed">
                {formattedString}
              </div>

              {/* BibTeX toggle or detail */}
              <details className="text-[11px] text-slate-500">
                <summary className="cursor-pointer hover:text-indigo-600 font-mono text-[10px] uppercase tracking-wider">
                  View BibTeX Syntax
                </summary>
                <pre className="mt-2 p-3 rounded bg-slate-900 text-slate-200 overflow-x-auto text-[11px] font-mono leading-tight">
                  {ref.bibtex}
                </pre>
              </details>
            </div>
          );
        })}
      </div>
    </div>
  );
};
