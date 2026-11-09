import React, { useEffect, useState } from 'react';
import {
  Loader2,
  CheckCircle2,
  Sparkles,
  Search,
  BookOpen,
  Layers,
  FileText,
  Quote,
  ShieldAlert,
} from 'lucide-react';
import { PipelineStep } from '../types/research.ts';

interface PipelineProgressModalProps {
  step: PipelineStep;
  error?: string | null;
  onCancel?: () => void;
}

export const PipelineProgressModal: React.FC<PipelineProgressModalProps> = ({
  step,
  error,
  onCancel,
}) => {
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    if (step === 'idle' || step === 'complete' || step === 'error') {
      return;
    }
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [step]);

  const pipelineStages = [
    {
      id: 'analyzing_topic',
      title: 'Topic Decomposition & Scoping',
      description: 'Generating primary research questions, SMART objectives, and identifying methodology.',
      icon: Layers,
    },
    {
      id: 'searching_literature',
      title: 'Grounded Academic Literature Search',
      description: 'Querying real web sources via Google Search grounding to find peer-reviewed papers.',
      icon: Search,
    },
    {
      id: 'synthesizing_paper',
      title: 'Full 12-Section Manuscript Synthesis',
      description: 'Authoring formal academic prose, problem statement, experimental design, and conclusions.',
      icon: FileText,
    },
    {
      id: 'formatting_citations',
      title: 'Citation Standard Verification',
      description: 'Generating APA, IEEE, MLA 9th Edition and BibTeX with verified link references.',
      icon: Quote,
    },
  ];

  const getStageStatus = (stageId: string) => {
    if (error) return 'error';
    const order = ['analyzing_topic', 'searching_literature', 'synthesizing_paper', 'formatting_citations', 'complete'];
    const currentIndex = order.indexOf(step);
    const stageIndex = order.indexOf(stageId);

    if (currentIndex > stageIndex || step === 'complete') return 'finished';
    if (currentIndex === stageIndex) return 'current';
    return 'pending';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                AI Research Agent Pipeline
              </h2>
              <p className="text-xs text-slate-500">
                Multi-stage autonomous academic investigation
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/70 px-2.5 py-1 rounded-md">
              {secondsElapsed}s elapsed
            </span>
          </div>
        </div>

        {/* Stages list */}
        <div className="p-6 space-y-4">
          {error ? (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 flex items-start space-x-3 text-xs">
              <ShieldAlert className="h-5 w-5 flex-shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
              <div>
                <p className="font-semibold text-sm">Pipeline Execution Error</p>
                <p className="mt-1">{error}</p>
              </div>
            </div>
          ) : (
            pipelineStages.map((stage) => {
              const status = getStageStatus(stage.id);
              const Icon = stage.icon;

              return (
                <div
                  key={stage.id}
                  className={`flex items-start space-x-3.5 p-3 rounded-xl transition-all ${
                    status === 'current'
                      ? 'bg-indigo-50/70 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/80 shadow-xs'
                      : status === 'finished'
                      ? 'bg-slate-50 dark:bg-slate-850 opacity-90'
                      : 'opacity-40'
                  }`}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    {status === 'finished' ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    ) : status === 'current' ? (
                      <Loader2 className="h-5 w-5 text-indigo-600 animate-spin" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <p
                        className={`text-xs font-semibold ${
                          status === 'current'
                            ? 'text-indigo-900 dark:text-indigo-200'
                            : status === 'finished'
                            ? 'text-slate-800 dark:text-slate-200'
                            : 'text-slate-500'
                        }`}
                      >
                        {stage.title}
                      </p>
                      {status === 'current' && (
                        <span className="inline-block h-2 w-2 rounded-full bg-indigo-600 animate-ping" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      {stage.description}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between text-xs text-slate-500">
          <span>Gemini 3.8 Flash • Factual Grounding</span>
          {onCancel && (
            <button
              onClick={onCancel}
              className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-3 py-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
