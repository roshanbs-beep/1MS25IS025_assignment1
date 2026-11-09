import React from 'react';
import {
  Compass,
  FileText,
  BookOpen,
  TableProperties,
  Quote,
  Download,
  History,
  Trash2,
  Calendar,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { ResearchProject } from '../types/research.ts';

export type ActiveTab = 'topic_input' | 'analysis' | 'literature' | 'paper' | 'citations' | 'export';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  activeProject: ResearchProject | null;
  historyProjects: ResearchProject[];
  onSelectProject: (project: ResearchProject) => void;
  onDeleteProject: (id: string, e: React.MouseEvent) => void;
  onNewTopic: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  activeProject,
  historyProjects,
  onSelectProject,
  onDeleteProject,
  onNewTopic,
}) => {
  const navItems = [
    {
      id: 'topic_input' as ActiveTab,
      label: 'Topic Explorer',
      icon: Compass,
      desc: 'Formulate & Scope Topic',
      disabled: false,
    },
    {
      id: 'analysis' as ActiveTab,
      label: 'Research Assistant',
      icon: Layers,
      desc: 'Questions, Objectives & Gaps',
      disabled: !activeProject,
    },
    {
      id: 'literature' as ActiveTab,
      label: 'Literature Review',
      icon: TableProperties,
      desc: 'Matrix & Grounded Sources',
      disabled: !activeProject,
    },
    {
      id: 'paper' as ActiveTab,
      label: 'Academic Paper',
      icon: FileText,
      desc: '12-Section Manuscript',
      disabled: !activeProject,
    },
    {
      id: 'citations' as ActiveTab,
      label: 'Citation Generator',
      icon: Quote,
      desc: 'APA / IEEE / MLA / BibTeX',
      disabled: !activeProject,
    },
    {
      id: 'export' as ActiveTab,
      label: 'Export & Share',
      icon: Download,
      desc: 'TXT, MD, JSON, Print/PDF',
      disabled: !activeProject,
    },
  ];

  return (
    <aside className="w-full md:w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col flex-shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Current Project Card (if loaded) */}
      {activeProject ? (
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Active Project
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-100/70 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-medium">
              {activeProject.topicInput.academicLevel}
            </span>
          </div>
          <h2 className="text-xs font-semibold text-slate-900 dark:text-white line-clamp-2 leading-relaxed" title={activeProject.topicInput.topic}>
            {activeProject.topicInput.topic}
          </h2>
          <div className="mt-2 flex items-center text-[11px] text-slate-500 dark:text-slate-400">
            <span className="truncate">{activeProject.topicInput.field}</span>
          </div>
        </div>
      ) : (
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="rounded-lg p-3 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 text-indigo-950 dark:text-indigo-200 text-xs leading-relaxed">
            <p className="font-semibold text-indigo-700 dark:text-indigo-300 mb-1 flex items-center gap-1.5">
              <Compass className="h-3.5 w-3.5" /> Start Research
            </p>
            Enter an academic topic or select one of our curated multidisciplinary topics to launch the agent.
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <div className="p-3 space-y-1">
        <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          Workspace Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              disabled={item.disabled}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20 font-medium'
                  : item.disabled
                  ? 'opacity-40 cursor-not-allowed text-slate-400 dark:text-slate-600'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <Icon className={`h-4 w-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                <div className="min-w-0">
                  <div className="text-xs font-medium leading-none">{item.label}</div>
                  <div className={`text-[10px] mt-1 truncate ${isActive ? 'text-indigo-100' : 'text-slate-400 dark:text-slate-500'}`}>
                    {item.desc}
                  </div>
                </div>
              </div>
              {isActive && <ChevronRight className="h-3.5 w-3.5 text-white/80 flex-shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Saved Projects History */}
      <div className="mt-auto p-3 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between px-3 py-1.5">
          <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            <History className="h-3 w-3" />
            <span>Research History</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
            {historyProjects.length}
          </span>
        </div>

        <div className="mt-2 space-y-1 max-h-48 overflow-y-auto pr-1">
          {historyProjects.length === 0 ? (
            <p className="px-3 py-2 text-[11px] text-slate-400 dark:text-slate-500 italic">
              No previous papers saved yet.
            </p>
          ) : (
            historyProjects.map((p) => {
              const isSelected = activeProject?.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => onSelectProject(p)}
                  className={`group flex items-center justify-between px-2.5 py-2 rounded-md text-xs cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-slate-200/80 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-medium'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <p className="truncate text-[11px] font-medium leading-tight">
                      {p.topicInput.topic}
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-0.5">
                      <Calendar className="h-2.5 w-2.5" />
                      {new Date(p.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={(e) => onDeleteProject(p.id, e)}
                    title="Delete project"
                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 text-slate-400 transition-opacity"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </aside>
  );
};
