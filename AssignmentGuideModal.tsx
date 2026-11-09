import React from 'react';
import {
  HelpCircle,
  X,
  Terminal,
  Github,
  CheckCircle2,
  BookOpen,
  Cpu,
  Layers,
  Sparkles,
  Download,
} from 'lucide-react';

interface AssignmentGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AssignmentGuideModal: React.FC<AssignmentGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-3xl max-h-[85vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Project Documentation & Deployment Guide
              </h2>
              <p className="text-xs text-slate-500">
                Setup instructions, running locally, and college assignment demonstration notes
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 text-xs text-slate-700 dark:text-slate-300">
          {/* Deliverables Checklist */}
          <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-2">
            <h3 className="font-bold text-sm text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              Required Assignment Deliverables Included
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center space-x-1.5 text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>1. Complete Full-Stack Source Code</span>
              </div>
              <div className="flex items-center space-x-1.5 text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>2. package.json & dependencies</span>
              </div>
              <div className="flex items-center space-x-1.5 text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>3. README.md with Full Setup</span>
              </div>
              <div className="flex items-center space-x-1.5 text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>4. research_agent_config.json</span>
              </div>
              <div className="flex items-center space-x-1.5 text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>5. research_agent_prompt.txt</span>
              </div>
              <div className="flex items-center space-x-1.5 text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>6. Multi-Format Citations (APA/IEEE/MLA)</span>
              </div>
            </div>
          </div>

          {/* Running Locally */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Terminal className="h-4 w-4 text-indigo-500" />
              How to Run Locally
            </h3>
            <div className="p-3.5 rounded-xl bg-slate-950 font-mono text-emerald-400 text-[11px] space-y-1">
              <p className="text-slate-500"># 1. Clone repository and navigate to directory</p>
              <p>git clone &lt;your-repo-url&gt;</p>
              <p>cd ai-research-paper-agent</p>
              <p className="text-slate-500 pt-2"># 2. Install dependencies</p>
              <p>npm install</p>
              <p className="text-slate-500 pt-2"># 3. Create .env with your Gemini API Key</p>
              <p>echo "GEMINI_API_KEY=your_gemini_api_key_here" &gt; .env</p>
              <p className="text-slate-500 pt-2"># 4. Start the application</p>
              <p>npm run dev</p>
            </div>
            <p className="text-[11px] text-slate-500">
              The app starts on <code className="text-indigo-600 dark:text-indigo-400">http://localhost:3000</code>.
            </p>
          </div>

          {/* Deploying & Uploading to GitHub */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Github className="h-4 w-4 text-slate-800 dark:text-white" />
              Uploading to GitHub
            </h3>
            <div className="p-3.5 rounded-xl bg-slate-950 font-mono text-sky-400 text-[11px] space-y-1">
              <p className="text-slate-500"># Initialize Git and commit files</p>
              <p>git init</p>
              <p>git add .</p>
              <p>git commit -m "feat: complete AI Academic Research Paper Agent"</p>
              <p className="text-slate-500 pt-2"># Link to your GitHub repository and push</p>
              <p>git branch -M main</p>
              <p>git remote add origin https://github.com/&lt;your-username&gt;/ai-research-paper-agent.git</p>
              <p>git push -u origin main</p>
            </div>
          </div>

          {/* College Demo Tips */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Presentation & Demonstration Tips for College Evaluators
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              <li>
                <strong>Factual Grounding:</strong> Highlight that the agent uses real Google Search Grounding to prevent the hallucination of non-existent research papers and fake authors.
              </li>
              <li>
                <strong>12 Mandatory Sections:</strong> Show that the paper adheres to full academic IMRaD guidelines with title, abstract, keywords, intro, problem, literature review, objectives, methodology, results & discussion, conclusion, future scope, and references.
              </li>
              <li>
                <strong>Ethical Results Disclaimer:</strong> Point out the explicit disclosure banner in Section 9 distinguishing simulated/preliminary validation from unverified empirical claims.
              </li>
              <li>
                <strong>Citation Versatility:</strong> Demonstrate switching between APA 7th, IEEE Numeric, and MLA 9th in real-time.
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs transition cursor-pointer"
          >
            Got it, return to App
          </button>
        </div>
      </div>
    </div>
  );
};
