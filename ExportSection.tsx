import React, { useState } from 'react';
import {
  Download,
  FileText,
  FileCode,
  Copy,
  Check,
  Printer,
  Sparkles,
  Share2,
} from 'lucide-react';
import { ResearchProject } from '../types/research.ts';
import {
  formatPaperAsText,
  formatPaperAsMarkdown,
  downloadBlob,
} from '../utils/exportUtils.ts';

interface ExportSectionProps {
  project: ResearchProject;
}

export const ExportSection: React.FC<ExportSectionProps> = ({ project }) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const handleCopy = (content: string, type: string) => {
    navigator.clipboard.writeText(content);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleDownloadTxt = () => {
    const text = formatPaperAsText(project);
    const safeTitle = project.paper.title.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30);
    downloadBlob(text, `${safeTitle}_paper.txt`, 'text/plain');
  };

  const handleDownloadMarkdown = () => {
    const md = formatPaperAsMarkdown(project);
    const safeTitle = project.paper.title.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30);
    downloadBlob(md, `${safeTitle}_paper.md`, 'text/markdown');
  };

  const handleDownloadJson = () => {
    const jsonStr = JSON.stringify(project, null, 2);
    const safeTitle = project.paper.title.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30);
    downloadBlob(jsonStr, `${safeTitle}_research_data.json`, 'application/json');
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-8 animate-fadeIn">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
          Export & Archival Options
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Download clean academic text, Markdown, structured raw JSON, or print directly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Plain Text (.txt) Card */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
          <div>
            <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center mb-4">
              <FileText className="h-5 w-5" />
            </div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Plain Text Manuscript (.txt)
            </h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Clean ASCII-formatted manuscript formatted with section dividers, suitable for submission portals and plagiarism checkers.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <button
              onClick={handleDownloadTxt}
              className="w-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download .TXT</span>
            </button>
            <button
              onClick={() => handleCopy(formatPaperAsText(project), 'txt')}
              className="w-full py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center justify-center space-x-1.5 transition cursor-pointer"
            >
              {copiedType === 'txt' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedType === 'txt' ? 'Copied Text!' : 'Copy to Clipboard'}</span>
            </button>
          </div>
        </div>

        {/* Markdown (.md) Card */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
          <div>
            <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <FileCode className="h-5 w-5" />
            </div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Markdown Manuscript (.md)
            </h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Full GitHub/Obsidian/Notion-compatible Markdown with tables, callout blockquotes, headers, and hyperlinks.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <button
              onClick={handleDownloadMarkdown}
              className="w-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download .MD</span>
            </button>
            <button
              onClick={() => handleCopy(formatPaperAsMarkdown(project), 'md')}
              className="w-full py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center justify-center space-x-1.5 transition cursor-pointer"
            >
              {copiedType === 'md' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedType === 'md' ? 'Copied Markdown!' : 'Copy to Clipboard'}</span>
            </button>
          </div>
        </div>

        {/* Structured JSON Card */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
          <div>
            <div className="h-10 w-10 rounded-xl bg-sky-50 dark:bg-sky-950/70 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-4">
              <Sparkles className="h-5 w-5" />
            </div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Complete Research Data (.json)
            </h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Raw structured JSON containing all research questions, objectives, literature matrix, 12 paper sections, and citations.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <button
              onClick={handleDownloadJson}
              className="w-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export .JSON</span>
            </button>
            <button
              onClick={() => handleCopy(JSON.stringify(project, null, 2), 'json')}
              className="w-full py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center justify-center space-x-1.5 transition cursor-pointer"
            >
              {copiedType === 'json' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedType === 'json' ? 'Copied JSON!' : 'Copy JSON'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Raw JSON Preview Box */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Raw Schema Inspector (JSON)
        </h2>
        <div className="max-h-80 overflow-y-auto rounded-xl bg-slate-950 p-4 border border-slate-800">
          <pre className="text-[11px] font-mono text-emerald-400 leading-relaxed">
            {JSON.stringify(project, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};
