import React, { useState, useEffect } from 'react';
import {
  FileCode,
  FileText,
  Copy,
  Check,
  X,
  Sparkles,
  Settings,
  ShieldCheck,
} from 'lucide-react';

interface ConfigPromptViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConfigPromptViewer: React.FC<ConfigPromptViewerProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'config' | 'prompt'>('config');
  const [configJson, setConfigJson] = useState<string>('Loading config...');
  const [promptText, setPromptText] = useState<string>('Loading prompt...');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    fetch('/api/agent/config')
      .then((res) => res.json())
      .then((data) => setConfigJson(JSON.stringify(data, null, 2)))
      .catch((err) => setConfigJson('Failed to load agent config: ' + err));

    fetch('/api/agent/prompt')
      .then((res) => res.text())
      .then((text) => setPromptText(text))
      .catch((err) => setPromptText('Failed to load system prompt: ' + err));
  }, [isOpen]);

  if (!isOpen) return null;

  const currentContent = activeTab === 'config' ? configJson : promptText;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-4xl max-h-[85vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Agent Specification & System Prompt
              </h2>
              <p className="text-xs text-slate-500">
                Transparent view of research agent parameters and core prompt directives
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

        {/* Tab switch */}
        <div className="px-5 pt-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('config')}
              className={`px-4 py-2 border-b-2 font-medium text-xs flex items-center space-x-2 transition ${
                activeTab === 'config'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <FileCode className="h-4 w-4" />
              <span>research_agent_config.json</span>
            </button>

            <button
              onClick={() => setActiveTab('prompt')}
              className={`px-4 py-2 border-b-2 font-medium text-xs flex items-center space-x-2 transition ${
                activeTab === 'prompt'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>research_agent_prompt.txt</span>
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="mb-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center space-x-1"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Content Viewer */}
        <div className="flex-1 p-5 overflow-y-auto bg-slate-950 text-slate-200 font-mono text-xs leading-relaxed">
          <pre className="whitespace-pre-wrap">{currentContent}</pre>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>Anti-hallucination protocols active</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-medium transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
