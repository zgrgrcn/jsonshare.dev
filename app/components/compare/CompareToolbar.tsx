'use client';
import React from 'react';
import {
  ArrowLeftRight,
  Sparkles,
  RotateCcw,
  Code2,
  Columns2,
  AlignJustify,
  ListFilter,
  ArrowDownAZ,
  FileCode2,
} from 'lucide-react';
import { CompareOptions } from '@/app/utils/jsonCompare';

import { ThemeSelectorDropdown } from '../studio/ThemeSelectorDropdown';

export type ViewMode = 'side-by-side' | 'unified' | 'semantic' | 'editor';

interface CompareToolbarProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  options: CompareOptions;
  setOptions: React.Dispatch<React.SetStateAction<CompareOptions>>;
  onLoadSample: () => void;
  onSwap: () => void;
  onBeautifyBoth: () => void;
  onClearBoth: () => void;
  disabled?: boolean;
}

export const CompareToolbar: React.FC<CompareToolbarProps> = ({
  viewMode,
  setViewMode,
  options,
  setOptions,
  onLoadSample,
  onSwap,
  onBeautifyBoth,
  onClearBoth,
  disabled,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-xl border border-gray-200/80 bg-white/80 p-2.5 shadow-sm backdrop-blur dark:border-gray-800 dark:bg-dark/80">
      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={onLoadSample}
          className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50/70 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100 dark:border-indigo-900/50 dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:bg-indigo-900/60"
          title="Load sample JSONs to test comparison"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Load Sample</span>
        </button>

        <button
          type="button"
          onClick={onSwap}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-300 dark:hover:bg-gray-700"
          title="Swap Left and Right JSONs"
        >
          <ArrowLeftRight className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Swap</span>
        </button>

        <button
          type="button"
          onClick={onBeautifyBoth}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-300 dark:hover:bg-gray-700"
          title="Format and indent both JSON inputs"
        >
          <Code2 className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Format Both</span>
        </button>

        <button
          type="button"
          onClick={onClearBoth}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-rose-50 hover:text-rose-600 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-300 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
          title="Clear both inputs"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Clear</span>
        </button>

        <div className="h-4 w-[1px] bg-gray-300 dark:bg-gray-700 mx-1 hidden md:block" />

        {/* Normalization Options */}
        <label
          className={`inline-flex cursor-pointer select-none items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
            options.sortKeysAlphabetically
              ? 'border-indigo-400 bg-indigo-50 text-indigo-800 shadow-sm dark:border-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-200'
              : 'border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-400'
          }`}
          title="Sort keys alphabetically (A→Z) recursively so differing key order won't produce false diffs"
        >
          <input
            type="checkbox"
            className="sr-only"
            checked={options.sortKeysAlphabetically}
            onChange={(e) =>
              setOptions((prev) => ({ ...prev, sortKeysAlphabetically: e.target.checked }))
            }
          />
          <ArrowDownAZ className={`h-3.5 w-3.5 ${options.sortKeysAlphabetically ? 'text-indigo-600 dark:text-indigo-400' : ''}`} />
          <span>Sort Keys (A→Z)</span>
          <span
            className={`ml-0.5 rounded px-1 text-[10px] uppercase tracking-wider font-bold ${
              options.sortKeysAlphabetically
                ? 'bg-indigo-200/80 text-indigo-900 dark:bg-indigo-900 dark:text-indigo-100'
                : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
            }`}
          >
            {options.sortKeysAlphabetically ? 'ON' : 'OFF'}
          </span>
        </label>
      </div>

      {/* Right Controls: Theme Selector + View Mode Selector */}
      <div className="flex flex-wrap items-center gap-2">
        <ThemeSelectorDropdown />

        <div className="flex items-center rounded-lg border border-gray-200 bg-gray-100/80 p-0.5 dark:border-gray-700 dark:bg-gray-800/70">
        <button
          type="button"
          onClick={() => setViewMode('side-by-side')}
          className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition ${
            viewMode === 'side-by-side'
              ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-100'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
          title="Side-by-side split diff view"
        >
          <Columns2 className="h-3.5 w-3.5" />
          <span>Split Diff</span>
        </button>

        <button
          type="button"
          onClick={() => setViewMode('unified')}
          className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition ${
            viewMode === 'unified'
              ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-100'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
          title="Single column unified git-style diff view"
        >
          <AlignJustify className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Unified</span>
        </button>

        <button
          type="button"
          onClick={() => setViewMode('semantic')}
          className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition ${
            viewMode === 'semantic'
              ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-100'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
          title="Semantic differences breakdown table"
        >
          <ListFilter className="h-3.5 w-3.5" />
          <span>Inspector</span>
        </button>

        <button
          type="button"
          onClick={() => setViewMode('editor')}
          className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition ${
            viewMode === 'editor'
              ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-100'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
          title="Direct edit mode"
        >
          <FileCode2 className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Raw Edit</span>
        </button>
        </div>
      </div>
    </div>
  );
};
