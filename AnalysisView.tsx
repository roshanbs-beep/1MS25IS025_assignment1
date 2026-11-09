import React from 'react';
import {
  HelpCircle,
  Target,
  AlertTriangle,
  Cpu,
  Layers,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Share2,
} from 'lucide-react';
import { TopicAnalysis } from '../types/research.ts';

interface AnalysisViewProps {
  analysis: TopicAnalysis;
  onProceedToLiterature: () => void;
  onRegenerateAnalysis?: () => void;
  isLoading?: boolean;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({
  analysis,
  onProceedToLiterature,
  onRegenerateAnalysis,
  isLoading,
}) => {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5 text-indigo-300" />
            <span>Phase 1: Topic Decomposition & Framing</span>
          </div>
          <span className="text-xs px-3 py-1 rounded-md bg-white/10 text-white font-mono">
            {analysis.field}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {analysis.mainTopic}
        </h1>

        <p className="mt-3 text-sm text-indigo-100/90 leading-relaxed max-w-4xl">
          {analysis.backgroundSummary}
        </p>
      </div>

      {/* Grid of Key Research Dimensions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Research Questions Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center space-x-2.5 mb-4">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <HelpCircle className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Research Questions
              </h2>
              <p className="text-[11px] text-slate-500">
                Core inquiry and sub-investigations
              </p>
            </div>
          </div>

          {/* Primary Question Box */}
          <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 mb-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
              Primary Research Question (PRQ)
            </span>
            <p className="mt-1 text-xs font-semibold text-slate-900 dark:text-white leading-relaxed">
              "{analysis.primaryResearchQuestion}"
            </p>
          </div>

          {/* Secondary Questions */}
          <div className="space-y-2.5">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              Secondary Sub-Questions:
            </span>
            {analysis.secondaryQuestions.map((q, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-2.5 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800"
              >
                <span className="h-5 w-5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-semibold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                  Q{idx + 1}
                </span>
                <span className="leading-relaxed">{q}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Research Objectives Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center space-x-2.5 mb-4">
            <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Target className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Research Objectives
              </h2>
              <p className="text-[11px] text-slate-500">
                Primary aim and SMART sub-objectives
              </p>
            </div>
          </div>

          {/* Primary Aim */}
          <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 mb-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
              Primary Aim
            </span>
            <p className="mt-1 text-xs font-semibold text-slate-900 dark:text-white leading-relaxed">
              {analysis.primaryObjective}
            </p>
          </div>

          {/* Specific Objectives */}
          <div className="space-y-2.5">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              Specific Measurable Sub-Objectives:
            </span>
            {analysis.specificObjectives.map((obj, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-2.5 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{obj}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Literature Gaps & Methodology Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Identified Research Gaps */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center space-x-2.5 mb-4">
            <div className="h-8 w-8 rounded-lg bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Identified Literature Gaps
              </h2>
              <p className="text-[11px] text-slate-500">
                Critical bottlenecks & unaddressed frontiers
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {analysis.identifiedGaps.map((gap, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-amber-200/80 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/30 text-xs text-slate-800 dark:text-slate-200"
              >
                <div className="flex items-center space-x-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-200/60 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200">
                    Gap #{idx + 1}
                  </span>
                </div>
                <p className="leading-relaxed text-slate-700 dark:text-slate-300">
                  {gap}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Suggested Methodology */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center space-x-2.5 mb-4">
            <div className="h-8 w-8 rounded-lg bg-sky-50 dark:bg-sky-950/70 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Cpu className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Methodological Blueprint
              </h2>
              <p className="text-[11px] text-slate-500">
                Recommended paradigm, data strategy & toolkits
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
              <span className="font-semibold text-slate-900 dark:text-white block mb-1">
                Paradigm & Approach:
              </span>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {analysis.suggestedMethodology.approach}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
              <span className="font-semibold text-slate-900 dark:text-white block mb-1">
                Data Acquisition & Sampling Strategy:
              </span>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {analysis.suggestedMethodology.dataStrategy}
              </p>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                Recommended Toolkits & Frameworks:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {analysis.suggestedMethodology.toolkits.map((tool, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-[11px] font-mono font-medium"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-100/70 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Feasibility & Ethics: </span>
              {analysis.suggestedMethodology.feasibilityNotes}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <span className="text-xs text-slate-500">
          Ready to review literature matrix & search academic databases.
        </span>

        <button
          onClick={onProceedToLiterature}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 flex items-center space-x-2 transition cursor-pointer"
        >
          <span>View Literature Review</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
