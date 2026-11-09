import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  Layers,
  Search,
  Sliders,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { ResearchTopicInput, SuggestedTopic } from '../types/research.ts';
import { ACADEMIC_FIELDS, SUGGESTED_TOPICS } from '../data/suggestedTopics.ts';

interface TopicInputSectionProps {
  onStartPipeline: (input: ResearchTopicInput, mode: 'full' | 'step') => void;
  isLoading: boolean;
}

export const TopicInputSection: React.FC<TopicInputSectionProps> = ({
  onStartPipeline,
  isLoading,
}) => {
  const [topic, setTopic] = useState('');
  const [field, setField] = useState('Computer Science & AI');
  const [academicLevel, setAcademicLevel] = useState<ResearchTopicInput['academicLevel']>('Master');
  const [methodologyPreference, setMethodologyPreference] =
    useState<ResearchTopicInput['methodologyPreference']>('Mixed Methods');
  const [selectedFieldFilter, setSelectedFieldFilter] = useState<string>('All');

  const handleSelectSuggested = (item: SuggestedTopic) => {
    setTopic(item.topic);
    setField(item.field);
    if (item.level === 'Undergraduate' || item.level === 'Master' || item.level === 'Doctoral / Postdoc') {
      setAcademicLevel(item.level as any);
    }
  };

  const handleSubmit = (mode: 'full' | 'step') => {
    if (!topic.trim()) return;
    onStartPipeline(
      {
        topic: topic.trim(),
        field,
        academicLevel,
        methodologyPreference,
      },
      mode
    );
  };

  const filteredSuggested =
    selectedFieldFilter === 'All'
      ? SUGGESTED_TOPICS
      : SUGGESTED_TOPICS.filter((s) => s.field === selectedFieldFilter);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      {/* Hero Badge & Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-4">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Next-Generation Scholarly Research Agent</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Investigate, Review & Generate <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500">
            Publication-Ready Academic Papers
          </span>
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Powered by Gemini 3.8 Flash with real Google Search grounding. Formulate research
          questions, uncover literature gaps, construct comparative matrices, and draft complete
          12-section manuscripts with verifiable citations.
        </p>
      </div>

      {/* Main Input Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/40 border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
        {/* Form fields */}
        <div className="space-y-6">
          {/* Topic Textarea */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="research-topic-input"
                className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
              >
                <BookOpen className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                Research Topic or Hypothesis
              </label>
              <span className="text-[11px] text-slate-400">
                {topic.length} characters
              </span>
            </div>
            <textarea
              id="research-topic-input"
              rows={3}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Evaluating the robustness of deep reinforcement learning agents against adversarial observation perturbations in autonomous driving..."
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>

          {/* Academic Field & Level Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Field */}
            <div>
              <label
                htmlFor="academic-field-select"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Academic Field
              </label>
              <select
                id="academic-field-select"
                value={field}
                onChange={(e) => setField(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {ACADEMIC_FIELDS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            {/* Academic Level */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Target Scholarly Level
              </label>
              <div className="grid grid-cols-3 gap-1">
                {(['Undergraduate', 'Master', 'Doctoral / Postdoc'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setAcademicLevel(lvl)}
                    className={`px-2 py-2 rounded-lg text-[11px] font-medium border text-center transition ${
                      academicLevel === lvl
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-600 text-indigo-700 dark:text-indigo-300 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {lvl.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Methodology */}
            <div>
              <label
                htmlFor="methodology-preference-select"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Methodology Orientation
              </label>
              <select
                id="methodology-preference-select"
                value={methodologyPreference}
                onChange={(e) => setMethodologyPreference(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Mixed Methods">Mixed Methods (Empirical & Qualitative)</option>
                <option value="Quantitative / Empirical">Quantitative / Empirical Experiment</option>
                <option value="Qualitative / Case Study">Qualitative / Systematic Case Analysis</option>
                <option value="Computational / Simulation">Computational / Algorithmic Simulation</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => handleSubmit('full')}
              disabled={isLoading || !topic.trim()}
              className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-sky-600 hover:from-indigo-700 hover:to-sky-700 text-white font-semibold text-sm shadow-md shadow-indigo-500/25 flex items-center justify-center space-x-2 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>Generate Full Academic Paper (1-Click)</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={() => handleSubmit('step')}
              disabled={isLoading || !topic.trim()}
              className="w-full sm:w-auto py-3.5 px-5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium text-xs flex items-center justify-center space-x-1.5 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              title="Step-by-step review to inspect analysis and literature before generating"
            >
              <Sliders className="h-4 w-4" />
              <span>Step-by-Step Mode</span>
            </button>
          </div>
        </div>

        {/* Feature Guarantees */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="flex items-start space-x-2.5 text-slate-600 dark:text-slate-400">
            <ShieldCheck className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">Factual Citation Integrity</p>
              <p className="text-[11px] text-slate-500">Searches live academic web sources. No hallucinated authors.</p>
            </div>
          </div>

          <div className="flex items-start space-x-2.5 text-slate-600 dark:text-slate-400">
            <Layers className="h-4 w-4 text-indigo-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">12 Standardized Sections</p>
              <p className="text-[11px] text-slate-500">Full IMRaD format with explicit simulated results disclaimer.</p>
            </div>
          </div>

          <div className="flex items-start space-x-2.5 text-slate-600 dark:text-slate-400">
            <GraduationCap className="h-4 w-4 text-sky-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">Multi-Format Citations</p>
              <p className="text-[11px] text-slate-500">Instant toggle between APA 7th, IEEE, MLA 9th, and BibTeX.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Topics Catalog */}
      <div className="mt-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Compass className="h-4 w-4 text-indigo-500" />
              Suggested Multidisciplinary Research Topics
            </h2>
            <p className="text-xs text-slate-500">
              Click any topic to prefill parameters and inspect the agent's workflow.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
            {['All', 'Computer Science & AI', 'Medicine & Health Sciences', 'Climate & Environmental Science'].map(
              (f) => (
                <button
                  key={f}
                  onClick={() => setSelectedFieldFilter(f)}
                  className={`px-2.5 py-1 rounded-md text-[11px] whitespace-nowrap transition ${
                    selectedFieldFilter === f
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {f === 'All' ? 'All Fields' : f.split('&')[0]}
                </button>
              )
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSuggested.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleSelectSuggested(item)}
              className="group p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/70 px-2 py-0.5 rounded">
                    {item.field.split('&')[0]}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {item.level}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition leading-snug">
                  {item.topic}
                </h3>
                <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-end text-[11px] text-indigo-600 dark:text-indigo-400 font-medium group-hover:translate-x-0.5 transition-transform">
                <span>Select & Investigate &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
