import React, { useState } from 'react';
import {
  TableProperties,
  Search,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  GitCompare,
  ArrowRight,
  BookOpen,
  Filter,
  Layers,
} from 'lucide-react';
import { LiteratureReviewData, LiteratureStudy } from '../types/research.ts';

interface LiteratureReviewViewProps {
  literature: LiteratureReviewData;
  onProceedToPaper: () => void;
  topicTitle: string;
}

export const LiteratureReviewView: React.FC<LiteratureReviewViewProps> = ({
  literature,
  onProceedToPaper,
  topicTitle,
}) => {
  const [filterVerifiedOnly, setFilterVerifiedOnly] = useState(false);

  const displayedStudies = filterVerifiedOnly
    ? literature.studies.filter((s) => s.verified)
    : literature.studies;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-8 animate-fadeIn">
      {/* Grounding Status Banner */}
      <div
        className={`p-5 rounded-2xl border ${
          literature.searchGrounded
            ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
            : 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
        } flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}
      >
        <div className="flex items-start space-x-3.5">
          {literature.searchGrounded ? (
            <ShieldCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          )}
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm">
                {literature.searchGrounded
                  ? 'Factual Google Search Grounding Active'
                  : 'Synthesized Consensus Review (Unverified via Live Web Search)'}
              </span>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-white/70 dark:bg-slate-900/60">
                {literature.studies.length} Studies Analyzed
              </span>
            </div>
            <p className="text-xs opacity-90 mt-1 leading-relaxed">
              {literature.searchGrounded
                ? `Retrieved ${literature.groundingSourcesCount} verified web grounding sources. Author names and titles have been cross-checked with real academic databases.`
                : 'Live web search was limited or ungrounded. Studies reflect landmark domain literature and theoretical baselines; independent empirical peer-review verification is recommended.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setFilterVerifiedOnly(!filterVerifiedOnly)}
          className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 text-xs font-semibold shadow-xs border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center space-x-1.5 cursor-pointer"
        >
          <Filter className="h-3.5 w-3.5 text-indigo-500" />
          <span>{filterVerifiedOnly ? 'Show All Studies' : 'Filter Verified Only'}</span>
        </button>
      </div>

      {/* Synthesis Narrative Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center space-x-2.5 mb-4">
          <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <BookOpen className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Literature Review Narrative Synthesis
            </h2>
            <p className="text-[11px] text-slate-500">
              Thematic evolution, prevailing paradigms, and state-of-the-art
            </p>
          </div>
        </div>

        <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
          {literature.summary}
        </div>
      </div>

      {/* Comparative Matrix Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-lg bg-sky-50 dark:bg-sky-950/70 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <TableProperties className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Comparative Studies Matrix
              </h2>
              <p className="text-[11px] text-slate-500">
                Cross-study evaluation of methodology, datasets, advantages, and limitations
              </p>
            </div>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {literature.comparativeMatrix.studyComparisons.length} Comparative Entries
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3.5 px-4 w-1/4">Study & Year</th>
                <th className="py-3.5 px-4 w-1/5">Methodological Approach</th>
                <th className="py-3.5 px-4 w-1/5">Dataset / Sample</th>
                <th className="py-3.5 px-4 w-1/5 text-emerald-700 dark:text-emerald-400">Key Advantage</th>
                <th className="py-3.5 px-4 w-1/5 text-amber-700 dark:text-amber-400">Critical Limitation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {literature.comparativeMatrix.studyComparisons.map((row, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-850/60 transition-colors"
                >
                  <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white align-top">
                    <div>{row.studyTitle}</div>
                    <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-normal">
                      {row.year}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 align-top leading-relaxed">
                    {row.methodology}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 align-top leading-relaxed">
                    {row.sampleOrData}
                  </td>
                  <td className="py-3.5 px-4 text-emerald-800 dark:text-emerald-300 align-top leading-relaxed">
                    {row.keyAdvantage}
                  </td>
                  <td className="py-3.5 px-4 text-amber-800 dark:text-amber-300 align-top leading-relaxed">
                    {row.limitation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Individual Studies Cards with Verification & Links */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Layers className="h-4 w-4 text-indigo-500" />
          Primary Empirical & Theoretical Works ({displayedStudies.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedStudies.map((study, idx) => (
            <div
              key={study.id || idx}
              className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      study.verified
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <ShieldCheck className="h-3 w-3" />
                    <span>{study.verified ? 'Verified Grounded Study' : 'Landmark Reference'}</span>
                  </span>

                  <span className="text-[11px] font-mono text-slate-400">
                    {study.year}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                  {study.title}
                </h4>

                <p className="mt-1 text-[11px] text-slate-500 italic">
                  {study.authors.join(', ')} • {study.publicationOrSource}
                </p>

                <div className="mt-3 space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300">
                    <span className="font-semibold text-slate-900 dark:text-white block mb-0.5">
                      Core Contribution:
                    </span>
                    {study.coreContribution}
                  </div>

                  <div className="text-[11px] text-slate-600 dark:text-slate-400">
                    <span className="font-medium text-slate-700 dark:text-slate-300">Key Finding: </span>
                    {study.keyFindings}
                  </div>
                </div>
              </div>

              {study.url && (
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400 truncate max-w-[200px]">
                    {study.url}
                  </span>
                  <a
                    href={study.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-indigo-600 dark:text-indigo-400 hover:underline font-medium text-xs flex-shrink-0"
                  >
                    <span>View Source</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Synthesis Dimensions: Similarities, Differences, Overall Gaps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Similarities */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex items-center space-x-2 mb-3 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Converging Insights
            </h4>
          </div>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            {literature.similarities.map((item, i) => (
              <li key={i} className="flex items-start space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Differences */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex items-center space-x-2 mb-3 text-sky-600 dark:text-sky-400">
            <GitCompare className="h-4 w-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Methodological Divergence
            </h4>
          </div>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            {literature.differences.map((item, i) => (
              <li key={i} className="flex items-start space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-500 mt-1.5 flex-shrink-0" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Critical Gaps Addressed */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex items-center space-x-2 mb-3 text-amber-600 dark:text-amber-400">
            <AlertCircle className="h-4 w-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Unaddressed Gaps
            </h4>
          </div>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            {literature.overallGaps.map((item, i) => (
              <li key={i} className="flex items-start space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <span className="text-xs text-slate-500">
          Literature synthesis complete. Proceed to view full academic paper.
        </span>

        <button
          onClick={onProceedToPaper}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 flex items-center space-x-2 transition cursor-pointer"
        >
          <span>Read Academic Paper</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
