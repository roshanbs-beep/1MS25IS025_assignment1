import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Navbar } from './components/Navbar.tsx';
import { Sidebar, ActiveTab } from './components/Sidebar.tsx';
import { TopicInputSection } from './components/TopicInputSection.tsx';
import { AnalysisView } from './components/AnalysisView.tsx';
import { LiteratureReviewView } from './components/LiteratureReviewView.tsx';
import { PaperView } from './components/PaperView.tsx';
import { CitationsView } from './components/CitationsView.tsx';
import { ExportSection } from './components/ExportSection.tsx';
import { PipelineProgressModal } from './components/PipelineProgressModal.tsx';
import { ConfigPromptViewer } from './components/ConfigPromptViewer.tsx';
import { AssignmentGuideModal } from './components/AssignmentGuideModal.tsx';
import {
  ResearchProject,
  ResearchTopicInput,
  PipelineStep,
  TopicAnalysis,
  LiteratureReviewData,
  ResearchPaper,
} from './types/research.ts';

const STORAGE_KEY_CURRENT = 'scholaragent_current_project';
const STORAGE_KEY_HISTORY = 'scholaragent_history_projects';
const STORAGE_KEY_THEME = 'scholaragent_theme';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_THEME);
    if (saved !== null) return saved === 'dark';
    return true; // Default to dark for modern academic aesthetic
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('topic_input');
  const [activeProject, setActiveProject] = useState<ResearchProject | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CURRENT);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [historyProjects, setHistoryProjects] = useState<ResearchProject[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [pipelineStep, setPipelineStep] = useState<PipelineStep>('idle');
  const [pipelineError, setPipelineError] = useState<string | null>(null);

  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  // Sync dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(STORAGE_KEY_THEME, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(STORAGE_KEY_THEME, 'light');
    }
  }, [darkMode]);

  // Sync active project to localStorage
  useEffect(() => {
    if (activeProject) {
      localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(activeProject));
    }
  }, [activeProject]);

  // Sync history projects to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(historyProjects));
  }, [historyProjects]);

  const saveProject = (project: ResearchProject) => {
    setActiveProject(project);
    setHistoryProjects((prev) => {
      const filtered = prev.filter((p) => p.id !== project.id);
      return [project, ...filtered].slice(0, 20);
    });
  };

  const handleSelectProject = (project: ResearchProject) => {
    setActiveProject(project);
    setActiveTab('paper');
  };

  const handleDeleteProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistoryProjects((prev) => prev.filter((p) => p.id !== id));
    if (activeProject?.id === id) {
      setActiveProject(null);
      setActiveTab('topic_input');
      localStorage.removeItem(STORAGE_KEY_CURRENT);
    }
  };

  // Start Pipeline (One-Click or Step-by-Step)
  const handleStartPipeline = async (
    input: ResearchTopicInput,
    mode: 'full' | 'step'
  ) => {
    setPipelineError(null);

    if (mode === 'full') {
      try {
        setPipelineStep('analyzing_topic');
        // Simulated intermediate stage transitions for visual clarity
        const timer1 = setTimeout(() => setPipelineStep('searching_literature'), 3000);
        const timer2 = setTimeout(() => setPipelineStep('synthesizing_paper'), 8000);
        const timer3 = setTimeout(() => setPipelineStep('formatting_citations'), 14000);

        const response = await fetch('/api/research/full-pipeline', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input),
        });

        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);

        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Failed to generate research paper.');
        }

        saveProject(data.project);
        setPipelineStep('complete');
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.7 },
        });

        setTimeout(() => {
          setPipelineStep('idle');
          setActiveTab('paper');
        }, 800);
      } catch (err: any) {
        console.error('Pipeline error:', err);
        setPipelineError(err.message || 'An unexpected error occurred.');
        setPipelineStep('error');
      }
    } else {
      // Step-by-step: Start with Topic Analysis
      try {
        setPipelineStep('analyzing_topic');
        const response = await fetch('/api/research/analyze-topic', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input),
        });

        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Failed to analyze topic.');
        }

        const initialProject: ResearchProject = {
          id: 'proj_' + Date.now(),
          timestamp: Date.now(),
          topicInput: input,
          analysis: data.analysis,
          literature: {
            searchQueriesUsed: [],
            searchGrounded: false,
            groundingSourcesCount: 0,
            summary: 'Literature review pending in step 2.',
            studies: [],
            comparativeMatrix: { dimensions: [], studyComparisons: [] },
            similarities: [],
            differences: [],
            overallGaps: [],
          },
          paper: {
            title: data.analysis.mainTopic,
            abstract: 'Paper synthesis will occur in step 3.',
            keywords: [],
            introduction: '',
            problemStatement: '',
            literatureReview: '',
            researchObjectives: '',
            methodology: '',
            resultsAndDiscussion: {
              content: '',
              isHypothetical: true,
              disclaimer: '',
            },
            conclusion: '',
            futureScope: '',
            references: [],
          },
        };

        saveProject(initialProject);
        setPipelineStep('idle');
        setActiveTab('analysis');
      } catch (err: any) {
        console.error('Analysis error:', err);
        setPipelineError(err.message || 'Failed to analyze topic.');
        setPipelineStep('error');
      }
    }
  };

  // Step 2 in step-by-step mode: Run Literature Review
  const handleProceedToLiterature = async () => {
    if (!activeProject) return;
    if (activeProject.literature.studies.length > 0) {
      setActiveTab('literature');
      return;
    }

    try {
      setPipelineStep('searching_literature');
      setPipelineError(null);

      const response = await fetch('/api/research/literature-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicInput: activeProject.topicInput,
          analysis: activeProject.analysis,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to conduct literature review.');
      }

      const updated: ResearchProject = {
        ...activeProject,
        literature: data.literature,
      };

      saveProject(updated);
      setPipelineStep('idle');
      setActiveTab('literature');
    } catch (err: any) {
      console.error('Literature error:', err);
      setPipelineError(err.message || 'Failed to conduct literature review.');
      setPipelineStep('error');
    }
  };

  // Step 3 in step-by-step mode: Generate Paper
  const handleProceedToPaper = async () => {
    if (!activeProject) return;
    if (activeProject.paper.introduction) {
      setActiveTab('paper');
      return;
    }

    try {
      setPipelineStep('synthesizing_paper');
      setPipelineError(null);

      const response = await fetch('/api/research/generate-paper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicInput: activeProject.topicInput,
          analysis: activeProject.analysis,
          literature: activeProject.literature,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate academic paper.');
      }

      const updated: ResearchProject = {
        ...activeProject,
        paper: data.paper,
      };

      saveProject(updated);
      setPipelineStep('idle');
      setActiveTab('paper');

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (err: any) {
      console.error('Paper error:', err);
      setPipelineError(err.message || 'Failed to generate paper.');
      setPipelineStep('error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Navigation Bar */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenConfig={() => setIsConfigModalOpen(true)}
        onOpenGuide={() => setIsGuideModalOpen(true)}
        onNewResearch={() => setActiveTab('topic_input')}
        hasActiveProject={!!activeProject}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeProject={activeProject}
          historyProjects={historyProjects}
          onSelectProject={handleSelectProject}
          onDeleteProject={handleDeleteProject}
          onNewTopic={() => setActiveTab('topic_input')}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'topic_input' && (
            <TopicInputSection
              onStartPipeline={handleStartPipeline}
              isLoading={pipelineStep !== 'idle' && pipelineStep !== 'error'}
            />
          )}

          {activeTab === 'analysis' && activeProject && (
            <AnalysisView
              analysis={activeProject.analysis}
              onProceedToLiterature={handleProceedToLiterature}
              isLoading={pipelineStep !== 'idle'}
            />
          )}

          {activeTab === 'literature' && activeProject && (
            <LiteratureReviewView
              literature={activeProject.literature}
              onProceedToPaper={handleProceedToPaper}
              topicTitle={activeProject.topicInput.topic}
            />
          )}

          {activeTab === 'paper' && activeProject && (
            <PaperView
              project={activeProject}
              onOpenExport={() => setActiveTab('export')}
            />
          )}

          {activeTab === 'citations' && activeProject && (
            <CitationsView project={activeProject} />
          )}

          {activeTab === 'export' && activeProject && (
            <ExportSection project={activeProject} />
          )}
        </main>
      </div>

      {/* Pipeline Progress Modal */}
      {(pipelineStep !== 'idle' || pipelineError) && (
        <PipelineProgressModal
          step={pipelineStep}
          error={pipelineError}
          onCancel={() => {
            setPipelineStep('idle');
            setPipelineError(null);
          }}
        />
      )}

      {/* Spec & Prompt Viewer Modal */}
      <ConfigPromptViewer
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
      />

      {/* College Assignment & Deployment Guide Modal */}
      <AssignmentGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />
    </div>
  );
}
