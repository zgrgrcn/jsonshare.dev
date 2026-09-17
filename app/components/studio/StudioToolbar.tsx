'use client';
import React, { useState } from 'react';
import {
  Code2,
  Minimize2,
  ArrowDownAZ,
  Wand2,
  Copy,
  Check,
  Upload,
  RotateCcw,
  Sparkles,
  FileCode,
} from 'lucide-react';

import { ThemeSelectorDropdown } from './ThemeSelectorDropdown';

interface StudioToolbarProps {
  onFormat: () => void;
  onMinify: () => void;
  onSortKeys: () => void;
  onAutoFix: () => void;
  onCopyTsTypes: () => void;
  onLoadSample: () => void;
  onUpload: (content: string) => void;
  onClear: () => void;
  onCopyRaw: () => void;
  copiedRaw: boolean;
  copiedTs: boolean;
  isSortActive?: boolean;
}

export const StudioToolbar: React.FC<StudioToolbarProps> = ({
  onFormat,
  onMinify,
  onSortKeys,
  onAutoFix,
  onCopyTsTypes,
  onLoadSample,
  onUpload,
  onClear,
  onCopyRaw,
  copiedRaw,
  copiedTs,
  isSortActive,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      onUpload(text);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-gray-200/80 bg-white/80 p-2 shadow-sm backdrop-blur dark:border-gray-800 dark:bg-dark/80">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".json,application/json,text/plain"
        onChange={handleFileChange}
      />

      {/* Action Group 1 */}
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={onFormat}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-300 dark:hover:bg-gray-700"
          title="Pretty-print JSON with 2 spaces"
        >
          <Code2 className="h-3.5 w-3.5 text-indigo-500" />
          <span>Format</span>
        </button>

        <button
          type="button"
          onClick={onMinify}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-300 dark:hover:bg-gray-700"
          title="Minify JSON into a single line"
        >
          <Minimize2 className="h-3.5 w-3.5" />
          <span>Minify</span>
        </button>

        <button
          type="button"
          onClick={onSortKeys}
          className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
            isSortActive
              ? 'border-indigo-400 bg-indigo-50 text-indigo-800 dark:border-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300'
              : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
          title="Sort all object keys alphabetically (A→Z) recursively"
        >
          <ArrowDownAZ className="h-3.5 w-3.5 text-indigo-500" />
          <span>Sort Keys</span>
        </button>

        <button
          type="button"
          onClick={onAutoFix}
          className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50/70 px-2.5 py-1.5 text-xs font-medium text-amber-800 transition hover:bg-amber-100 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300 dark:hover:bg-amber-900/50"
          title="Automatically repair single quotes, missing quotes, or trailing commas"
        >
          <Wand2 className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
          <span>Auto-Fix</span>
        </button>

        <button
          type="button"
          onClick={onCopyTsTypes}
          className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50/70 px-2.5 py-1.5 text-xs font-medium text-blue-800 transition hover:bg-blue-100 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
          title="Generate and copy TypeScript types from this JSON"
        >
          {copiedTs ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <FileCode className="h-3.5 w-3.5 text-blue-500" />}
          <span>{copiedTs ? 'Copied Types!' : 'Copy as TS'}</span>
        </button>
      </div>

      {/* Action Group 2 */}
      <div className="flex flex-wrap items-center gap-1.5">
        {/* Editor Theme Switcher (VS Code, IntelliJ, GitHub) */}
        <ThemeSelectorDropdown />

        <div className="h-4 w-[1px] bg-gray-300 dark:bg-gray-700 mx-0.5 hidden sm:block" />

        <button
          type="button"
          onClick={onLoadSample}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-300 dark:hover:bg-gray-700"
          title="Load sample JSON"
        >
          <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
          <span className="hidden sm:inline">Sample</span>
        </button>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-300 dark:hover:bg-gray-700"
          title="Upload .json file"
        >
          <Upload className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Upload</span>
        </button>

        <button
          type="button"
          onClick={onCopyRaw}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-300 dark:hover:bg-gray-700"
          title="Copy raw JSON to clipboard"
        >
          {copiedRaw ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
          <span>{copiedRaw ? 'Copied' : 'Copy'}</span>
        </button>

        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-rose-50 hover:text-rose-600 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-300 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
          title="Clear editor"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Clear</span>
        </button>
      </div>
    </div>
  );
};
