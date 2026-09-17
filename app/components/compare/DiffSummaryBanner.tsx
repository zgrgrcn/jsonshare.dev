'use client';
import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  PlusCircle,
  MinusCircle,
  RefreshCw,
  HelpCircle,
} from 'lucide-react';
import { DiffSummary } from '@/app/utils/jsonCompare';

export type DiffFilterType = 'all' | 'added' | 'removed' | 'modified';

interface DiffSummaryBannerProps {
  summary: DiffSummary | null;
  leftError: string | null;
  rightError: string | null;
  isEmpty: boolean;
  activeFilter: DiffFilterType;
  setActiveFilter: (filter: DiffFilterType) => void;
  onViewSemantic: () => void;
  isSorted: boolean;
}

export const DiffSummaryBanner: React.FC<DiffSummaryBannerProps> = ({
  summary,
  leftError,
  rightError,
  isEmpty,
  activeFilter,
  setActiveFilter,
  onViewSemantic,
  isSorted,
}) => {
  // Syntax error case
  if (leftError || rightError) {
    return (
      <div className="flex flex-col gap-1 rounded-xl border border-amber-300 bg-amber-50/90 p-3 text-xs text-amber-900 shadow-sm backdrop-blur dark:border-amber-700/60 dark:bg-amber-950/40 dark:text-amber-200">
        <div className="flex items-center gap-2 font-semibold">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>Invalid JSON Syntax</span>
        </div>
        {leftError && (
          <p className="ml-6 font-mono text-[11px] text-amber-700 dark:text-amber-300">
            Left JSON: {leftError}
          </p>
        )}
        {rightError && (
          <p className="ml-6 font-mono text-[11px] text-amber-700 dark:text-amber-300">
            Right JSON: {rightError}
          </p>
        )}
      </div>
    );
  }

  // Empty state
  if (isEmpty || !summary) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-gray-200/70 bg-gray-50/70 px-4 py-2.5 text-xs text-gray-500 dark:border-gray-800 dark:bg-gray-800/40 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-gray-400 dark:text-gray-500" />
          <span>Paste or type JSON into both panels, or click <strong>Load Sample</strong> to start.</span>
        </div>
      </div>
    );
  }

  // Exact Match
  if (summary.total === 0 && summary.isEqual) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-emerald-300/80 bg-emerald-50/80 px-4 py-2.5 text-xs font-medium text-emerald-900 shadow-sm dark:border-emerald-800/70 dark:bg-emerald-950/40 dark:text-emerald-200">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span>Exact Match: Both JSON documents are 100% identical in structure, values, and order.</span>
        </div>
      </div>
    );
  }

  // Semantic Match after alphabetical sorting
  if (summary.total === 0 && summary.isEqualAfterSorting && isSorted) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-indigo-300/80 bg-indigo-50/90 px-4 py-2.5 text-xs font-medium text-indigo-950 shadow-sm dark:border-indigo-800/70 dark:bg-indigo-950/40 dark:text-indigo-200">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <span>
            <strong>Semantically Identical:</strong> All keys and values match! The files only differed in key ordering, which was normalized alphabetically.
          </span>
        </div>
        <span className="rounded-md bg-indigo-200/70 px-2 py-0.5 text-[11px] font-semibold text-indigo-900 dark:bg-indigo-900 dark:text-indigo-100">
          Normalized A→Z
        </span>
      </div>
    );
  }

  // Key order differs when sorting is turned OFF
  if (summary.total === 0 && summary.isEqualAfterSorting && !isSorted) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-amber-300/80 bg-amber-50/90 px-4 py-2.5 text-xs font-medium text-amber-950 shadow-sm dark:border-amber-800/70 dark:bg-amber-950/40 dark:text-amber-200">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <span>
            <strong>Key Order Differs:</strong> Values match semantically, but lines appear in different order. Turn on <strong>Sort Keys (A→Z)</strong> to align them.
          </span>
        </div>
      </div>
    );
  }

  // Differences Found
  return (
    <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-xl border border-gray-200 bg-white/90 p-2.5 shadow-sm dark:border-gray-800 dark:bg-dark/90">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
          Differences ({summary.total}):
        </span>

        {/* Removed / Missing in Right */}
        <button
          type="button"
          onClick={() => {
            setActiveFilter(activeFilter === 'removed' ? 'all' : 'removed');
            onViewSemantic();
          }}
          className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold transition ${
            activeFilter === 'removed'
              ? 'border-rose-500 bg-rose-500 text-white shadow-sm'
              : 'border-rose-200 bg-rose-50/80 text-rose-800 hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-900/50'
          }`}
          title="Fields present in Left but missing in Right"
        >
          <MinusCircle className="h-3.5 w-3.5" />
          <span>Missing / Removed: {summary.removed}</span>
        </button>

        {/* Added in Right */}
        <button
          type="button"
          onClick={() => {
            setActiveFilter(activeFilter === 'added' ? 'all' : 'added');
            onViewSemantic();
          }}
          className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold transition ${
            activeFilter === 'added'
              ? 'border-emerald-500 bg-emerald-500 text-white shadow-sm'
              : 'border-emerald-200 bg-emerald-50/80 text-emerald-800 hover:bg-emerald-100 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-900/50'
          }`}
          title="Fields present in Right but not in Left"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          <span>Added: {summary.added}</span>
        </button>

        {/* Modified */}
        <button
          type="button"
          onClick={() => {
            setActiveFilter(activeFilter === 'modified' ? 'all' : 'modified');
            onViewSemantic();
          }}
          className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold transition ${
            activeFilter === 'modified'
              ? 'border-amber-500 bg-amber-500 text-white shadow-sm'
              : 'border-amber-200 bg-amber-50/80 text-amber-800 hover:bg-amber-100 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300 dark:hover:bg-amber-900/50'
          }`}
          title="Keys with modified values"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Modified: {summary.modified + summary.typeChanged}</span>
        </button>
      </div>

      <div className="flex items-center gap-2">
        {isSorted && (
          <span className="hidden items-center gap-1 text-[11px] text-gray-500 sm:inline-flex dark:text-gray-400">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            Alphabetical order applied
          </span>
        )}
      </div>
    </div>
  );
};
