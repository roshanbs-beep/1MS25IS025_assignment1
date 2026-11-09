import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Check,
  Printer,
  Download,
  AlertTriangle,
  Bookmark,
  Share2,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { ResearchProject, ResearchPaper } from '../types/research.ts';
import { formatPaperAsText } from '../utils/exportUtils.ts';

interface PaperViewProps {
  project: ResearchProject;
  onOpenExport: () => void;
}

export const PaperView: React.FC<PaperViewProps> = ({ project, onOpenExport }) => {
  const { paper, topicInput } = project;
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [fontSerif, setFontSerif] = useState(false);

  const handleCopy = (text: string, sectionName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionName);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const sections = [
    { id: 'sec-abstract', title: 'Abstract' },
    { id: 'sec-keywords', title: 'Keywords' },
    { id: 'sec-intro', title: '1. Introduction' },
    { id: 'sec-problem', title: '2. Problem Statement' },
    { id: 'sec-lit', title: '3. Literature Review' },
    { id: 'sec-objectives', title: '4. Research Objectives' },
    { id: 'sec-methodology', title: '5. Methodology' },
    { id: 'sec-results', title: '6. Results & Discussion' },
    { id: 'sec-conclusion', title: '7. Conclusion' },
    { id: 'sec-future', title: '8. Future Scope' },
    { id: 'sec-references', title: '9. References' },
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 animate-fadeIn">
      {/* Top Controls Toolbar */}
      <div className="sticky top-18 z-20 mb-6 p-3 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-xs">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Manuscript View:
          </span>
          <button
            onClick={() => setFontSerif(false)}
            className={`px-2.5 py-1 rounded text-xs transition ${
              !fontSerif
                ? 'bg-indigo-600 text-white font-medium'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            Sans
          </button>
          <button
            onClick={() => setFontSerif(true)}
            className={`px-2.5 py-1 rounded text-xs font-serif transition ${
              fontSerif
                ? 'bg-indigo-600 text-white font-medium'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            Serif (Academic)
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleCopy(formatPaperAsText(project), 'Entire Manuscript')}
            className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 flex items-center space-x-1.5 transition cursor-pointer"
          >
            {copiedSection === 'Entire Manuscript' ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-emerald-600">Copied Paper!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Full Paper</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 flex items-center space-x-1.5 transition cursor-pointer"
            title="Print or Save as PDF"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print / PDF</span>
          </button>

          <button
            onClick={onOpenExport}
            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs flex items-center space-x-1.5 transition cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Formats</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sticky Sidebar Table of Contents */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-36 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs">
            <h3 className="font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 text-[10px] mb-3">
              Section Index
            </h3>
            <nav className="space-y-1">
              {sections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => scrollTo(sec.id)}
                  className="w-full text-left px-2.5 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition truncate block"
                >
                  {sec.title}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Paper Manuscript Body */}
        <div className="lg:col-span-3">
          <article
            className={`p-6 sm:p-12 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl space-y-10 ${
              fontSerif ? 'font-serif' : 'font-sans'
            }`}
          >
            {/* Title & Metadata */}
            <header className="border-b border-slate-200 dark:border-slate-800 pb-8 text-center space-y-4">
              <span className="inline-block text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-sans">
                Academic Research Manuscript
              </span>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {paper.title}
              </h1>

              <div className="text-xs text-slate-500 font-sans flex flex-wrap items-center justify-center gap-3">
                <span>Field: <strong>{topicInput.field}</strong></span>
                <span>•</span>
                <span>Level: <strong>{topicInput.academicLevel}</strong></span>
                <span>•</span>
                <span>Design: <strong>{topicInput.methodologyPreference}</strong></span>
              </div>
            </header>

            {/* Abstract */}
            <section id="sec-abstract" className="relative group p-6 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 font-sans">
                  Abstract
                </h2>
                <button
                  onClick={() => handleCopy(paper.abstract, 'Abstract')}
                  className="opacity-0 group-hover:opacity-100 transition p-1 hover:text-indigo-600 text-slate-400 font-sans text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="h-3 w-3" />
                  <span>{copiedSection === 'Abstract' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed text-justify">
                {paper.abstract}
              </p>
            </section>

            {/* Keywords */}
            <section id="sec-keywords" className="font-sans">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                Keywords (IEEE / MeSH Indexing)
              </h2>
              <div className="flex flex-wrap gap-2">
                {paper.keywords.map((kw, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs border border-slate-200 dark:border-slate-700"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </section>

            {/* Section 1: Introduction */}
            <section id="sec-intro" className="relative group space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  1. Introduction
                </h2>
                <button
                  onClick={() => handleCopy(paper.introduction, 'Introduction')}
                  className="opacity-0 group-hover:opacity-100 transition text-slate-400 hover:text-indigo-600 font-sans text-xs flex items-center gap-1"
                >
                  <Copy className="h-3 w-3" />
                  <span>Copy</span>
                </button>
              </div>
              <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line text-justify">
                {paper.introduction}
              </div>
            </section>

            {/* Section 2: Problem Statement */}
            <section id="sec-problem" className="relative group space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  2. Problem Statement
                </h2>
                <button
                  onClick={() => handleCopy(paper.problemStatement, 'Problem Statement')}
                  className="opacity-0 group-hover:opacity-100 transition text-slate-400 hover:text-indigo-600 font-sans text-xs flex items-center gap-1"
                >
                  <Copy className="h-3 w-3" />
                  <span>Copy</span>
                </button>
              </div>
              <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line text-justify">
                {paper.problemStatement}
              </div>
            </section>

            {/* Section 3: Literature Review */}
            <section id="sec-lit" className="relative group space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  3. Literature Review
                </h2>
                <button
                  onClick={() => handleCopy(paper.literatureReview, 'Literature Review')}
                  className="opacity-0 group-hover:opacity-100 transition text-slate-400 hover:text-indigo-600 font-sans text-xs flex items-center gap-1"
                >
                  <Copy className="h-3 w-3" />
                  <span>Copy</span>
                </button>
              </div>
              <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line text-justify">
                {paper.literatureReview}
              </div>
            </section>

            {/* Section 4: Research Objectives */}
            <section id="sec-objectives" className="relative group space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  4. Research Objectives
                </h2>
                <button
                  onClick={() => handleCopy(paper.researchObjectives, 'Research Objectives')}
                  className="opacity-0 group-hover:opacity-100 transition text-slate-400 hover:text-indigo-600 font-sans text-xs flex items-center gap-1"
                >
                  <Copy className="h-3 w-3" />
                  <span>Copy</span>
                </button>
              </div>
              <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line text-justify">
                {paper.researchObjectives}
              </div>
            </section>

            {/* Section 5: Methodology */}
            <section id="sec-methodology" className="relative group space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  5. Methodology
                </h2>
                <button
                  onClick={() => handleCopy(paper.methodology, 'Methodology')}
                  className="opacity-0 group-hover:opacity-100 transition text-slate-400 hover:text-indigo-600 font-sans text-xs flex items-center gap-1"
                >
                  <Copy className="h-3 w-3" />
                  <span>Copy</span>
                </button>
              </div>
              <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line text-justify">
                {paper.methodology}
              </div>
            </section>

            {/* Section 6: Results and Discussion (WITH MANDATORY DISCLAIMER) */}
            <section id="sec-results" className="relative group space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <span>6. Results and Discussion</span>
                </h2>
                <button
                  onClick={() => handleCopy(paper.resultsAndDiscussion.content, 'Results and Discussion')}
                  className="opacity-0 group-hover:opacity-100 transition text-slate-400 hover:text-indigo-600 font-sans text-xs flex items-center gap-1"
                >
                  <Copy className="h-3 w-3" />
                  <span>Copy</span>
                </button>
              </div>

              {/* Mandatory Scientific Integrity Disclaimer */}
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-sans">
                <div className="flex items-center space-x-2 font-bold mb-1">
                  <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <span>Preliminary / Hypothetical Benchmark Disclosure:</span>
                </div>
                <p className="leading-relaxed opacity-95">
                  {paper.resultsAndDiscussion.disclaimer ||
                    'Results represent simulated experimental parameters, algorithmic baseline comparisons, or anticipated empirical metrics designed to validate the methodological protocol.'}
                </p>
              </div>

              {/* Key Metrics / Benchmark Table */}
              {paper.resultsAndDiscussion.keyMetrics && paper.resultsAndDiscussion.keyMetrics.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4 font-sans">
                  {paper.resultsAndDiscussion.keyMetrics.map((metric, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50"
                    >
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                        {metric.label}
                      </span>
                      <div className="text-lg font-bold font-mono text-indigo-600 dark:text-indigo-400">
                        {metric.value}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                        {metric.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line text-justify">
                {paper.resultsAndDiscussion.content}
              </div>
            </section>

            {/* Section 7: Conclusion */}
            <section id="sec-conclusion" className="relative group space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  7. Conclusion
                </h2>
                <button
                  onClick={() => handleCopy(paper.conclusion, 'Conclusion')}
                  className="opacity-0 group-hover:opacity-100 transition text-slate-400 hover:text-indigo-600 font-sans text-xs flex items-center gap-1"
                >
                  <Copy className="h-3 w-3" />
                  <span>Copy</span>
                </button>
              </div>
              <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line text-justify">
                {paper.conclusion}
              </div>
            </section>

            {/* Section 8: Future Scope */}
            <section id="sec-future" className="relative group space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  8. Future Scope & Recommendations
                </h2>
                <button
                  onClick={() => handleCopy(paper.futureScope, 'Future Scope')}
                  className="opacity-0 group-hover:opacity-100 transition text-slate-400 hover:text-indigo-600 font-sans text-xs flex items-center gap-1"
                >
                  <Copy className="h-3 w-3" />
                  <span>Copy</span>
                </button>
              </div>
              <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line text-justify">
                {paper.futureScope}
              </div>
            </section>

            {/* Section 9: References */}
            <section id="sec-references" className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800 font-sans">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  9. References ({paper.references.length})
                </h2>
                <span className="text-xs text-slate-400">
                  Standard Academic Format
                </span>
              </div>

              <div className="space-y-3">
                {paper.references.map((ref, idx) => (
                  <div
                    key={ref.id || idx}
                    className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/40 text-xs flex items-start justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                          [{idx + 1}]
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            ref.isVerified
                              ? 'bg-emerald-100/80 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {ref.isVerified ? 'Verified Grounded Citation' : 'Domain Literature Reference'}
                        </span>
                      </div>
                      <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
                        {ref.citationApa}
                      </p>
                    </div>

                    {ref.doiOrUrl && (
                      <a
                        href={ref.doiOrUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-indigo-600 dark:text-indigo-400 flex-shrink-0"
                        title="Open external paper or DOI link"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </article>
        </div>
      </div>
    </div>
  );
};
