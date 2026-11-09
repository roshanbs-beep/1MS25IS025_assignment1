import React from 'react';
import {
  GraduationCap,
  Moon,
  Sun,
  BookOpen,
  Sparkles,
  FileCode,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  onOpenConfig: () => void;
  onOpenGuide: () => void;
  onNewResearch: () => void;
  hasActiveProject: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  setDarkMode,
  onOpenConfig,
  onOpenGuide,
  onNewResearch,
  hasActiveProject,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onNewResearch}>
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-sky-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
                ScholarAgent
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                v2.5
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Autonomous Academic Research & Synthesis
            </p>
          </div>
        </div>

        {/* Center Indicators / Badges */}
        <div className="hidden md:flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 font-medium">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Search Grounded Citations</span>
          </div>

          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-mono text-[11px]">
            <Sparkles className="h-3 w-3 text-amber-500" />
            <span>Gemini 3.8 Flash</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {hasActiveProject && (
            <button
              onClick={onNewResearch}
              className="text-xs font-medium px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors flex items-center space-x-1.5"
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">New Topic</span>
            </button>
          )}

          <button
            onClick={onOpenConfig}
            title="Inspect Agent Configuration & System Prompt"
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors text-xs flex items-center space-x-1.5"
          >
            <FileCode className="h-4 w-4" />
            <span className="hidden lg:inline text-xs font-medium">Agent Spec</span>
          </button>

          <button
            onClick={onOpenGuide}
            title="Assignment & Run Instructions"
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors text-xs flex items-center space-x-1"
          >
            <HelpCircle className="h-4 w-4" />
            <span className="hidden lg:inline text-xs font-medium">Docs & Setup</span>
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={() => setDarkMode((prev) => !prev)}
            aria-label="Toggle Dark Mode"
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          >
            {darkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};
