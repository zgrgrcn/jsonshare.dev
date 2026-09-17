'use client';
import React, { useState, useMemo } from 'react';
import {
  Search,
  Copy,
  Check,
  PlusCircle,
  MinusCircle,
  RefreshCw,
  HelpCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { DiffItem, formatValue } from '@/app/utils/jsonCompare';
import { DiffFilterType } from './DiffSummaryBanner';

interface SemanticDiffInspectorProps {
  differences: DiffItem[];
  activeFilter: DiffFilterType;
  setActiveFilter: (filter: DiffFilterType) => void;
}

export const SemanticDiffInspector: React.FC<SemanticDiffInspectorProps> = ({
  differences,
  activeFilter,
  setActiveFilter,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedReport, setCopiedReport] = useState(false);
  const [copiedPathId, setCopiedPathId] = useState<string | null>(null);

  // Filter differences by type and search query
  const filteredDiffs = useMemo(() => {
    return differences.filter((d) => {
      // Type filter
      if (activeFilter === 'added' && d.type !== 'added') return false;
      if (activeFilter === 'removed' && d.type !== 'removed') return false;
      if (activeFilter === 'modified' && d.type !== 'modified' && d.type !== 'type_changed') return false;

      // Search filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const pathMatch = d.path.toLowerCase().includes(q);
      const leftMatch = d.leftValue !== undefined && String(d.leftValue).toLowerCase().includes(q);
      const rightMatch = d.rightValue !== undefined && String(d.rightValue).toLowerCase().includes(q);
      const msgMatch = d.message.toLowerCase().includes(q);
      return pathMatch || leftMatch || rightMatch || msgMatch;
    });
  }, [differences, activeFilter, searchQuery]);

  const counts = useMemo(() => {
    return {
      all: differences.length,
      added: differences.filter((d) => d.type === 'added').length,
      removed: differences.filter((d) => d.type === 'removed').length,
      modified: differences.filter((d) => d.type === 'modified' || d.type === 'type_changed').length,
    };
  }, [differences]);

  const handleCopyReport = async () => {
    const lines = [
      `# JSON Comparison Report`,
      `Total Differences: ${differences.length}`,
      `- Missing / Removed: ${counts.removed}`,
      `- Added: ${counts.added}`,
      `- Modified: ${counts.modified}`,
      '',
      `## Detailed Changes:`,
      ...differences.map((d, i) => {
        const typeTag = d.type.toUpperCase();
        if (d.type === 'added') {
          return `${i + 1}. [${typeTag}] \`${d.path}\`: Added with value: \`${JSON.stringify(d.rightValue)}\``;
        }
        if (d.type === 'removed') {
          return `${i + 1}. [${typeTag}] \`${d.path}\`: Missing in modified (was \`${JSON.stringify(d.leftValue)}\`)`;
        }
        return `${i + 1}. [${typeTag}] \`${d.path}\`: \`${JSON.stringify(d.leftValue)}\` → \`${JSON.stringify(d.rightValue)}\``;
      }),
    ];

    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setCopiedReport(true);
      setTimeout(() => setCopiedReport(false), 2000);
    } catch {}
  };

  const handleCopyPath = async (path: string, id: string) => {
    try {
      await navigator.clipboard.writeText(path);
      setCopiedPathId(id);
      setTimeout(() => setCopiedPathId(null), 1500);
    } catch {}
  };

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-gray-200/90 bg-white shadow-sm dark:border-gray-800 dark:bg-dark">
      {/* Header with Search and Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-gray-200/90 bg-gray-50/90 p-3 text-xs font-semibold dark:border-gray-800 dark:bg-gray-900/50">
        <div className="flex flex-wrap items-center gap-2">
          {/* Tabs */}
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`rounded-lg px-2.5 py-1 transition ${
              activeFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            All ({counts.all})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('removed')}
            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 transition ${
              activeFilter === 'removed'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-white text-rose-700 hover:bg-rose-50 dark:bg-gray-800 dark:text-rose-300 dark:hover:bg-rose-950/40'
            }`}
          >
            <MinusCircle className="h-3 w-3" />
            <span>Missing / Removed ({counts.removed})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('added')}
            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 transition ${
              activeFilter === 'added'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-emerald-700 hover:bg-emerald-50 dark:bg-gray-800 dark:text-emerald-300 dark:hover:bg-emerald-950/40'
            }`}
          >
            <PlusCircle className="h-3 w-3" />
            <span>Added ({counts.added})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('modified')}
            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 transition ${
              activeFilter === 'modified'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white text-amber-700 hover:bg-amber-50 dark:bg-gray-800 dark:text-amber-300 dark:hover:bg-amber-950/40'
            }`}
          >
            <RefreshCw className="h-3 w-3" />
            <span>Modified ({counts.modified})</span>
          </button>
        </div>

        {/* Search & Copy Report */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by path or value..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-7 w-40 rounded-lg border border-gray-300 bg-white pl-8 pr-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 md:w-56 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>

          <button
            type="button"
            onClick={handleCopyReport}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            title="Copy differences summary as Markdown"
          >
            {copiedReport ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <FileSpreadsheet className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{copiedReport ? 'Copied' : 'Copy Report'}</span>
          </button>
        </div>
      </div>

      {/* Differences List */}
      <div className="min-h-0 flex-1 overflow-auto p-3">
        {filteredDiffs.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-gray-400 dark:text-gray-500">
            <HelpCircle className="h-8 w-8" />
            <p className="text-sm">No differences matching the current filter.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredDiffs.map((diff) => {
              let badgeBg = 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
              let badgeBorder = 'border-gray-200 dark:border-gray-700';
              let label = 'MODIFIED';

              if (diff.type === 'removed') {
                badgeBg = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900';
                label = 'MISSING IN MODIFIED';
              } else if (diff.type === 'added') {
                badgeBg = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900';
                label = 'ADDED';
              } else if (diff.type === 'type_changed') {
                badgeBg = 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900';
                label = 'TYPE MISMATCH';
              } else {
                badgeBg = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900';
                label = 'VALUE CHANGED';
              }

              return (
                <div
                  key={diff.id}
                  className="group rounded-lg border border-gray-200/90 bg-gray-50/50 p-2.5 transition hover:border-indigo-300 hover:bg-white dark:border-gray-800/80 dark:bg-gray-900/40 dark:hover:border-indigo-700 dark:hover:bg-gray-900"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    {/* Path & Type */}
                    <div className="flex items-center gap-2">
                      <span className={`rounded border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badgeBg} ${badgeBorder}`}>
                        {label}
                      </span>
                      <code className="rounded bg-gray-200/70 px-1.5 py-0.5 font-mono text-xs font-semibold text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                        {diff.path}
                      </code>
                      <button
                        type="button"
                        onClick={() => handleCopyPath(diff.path, diff.id)}
                        className="rounded p-1 text-gray-400 opacity-0 transition group-hover:opacity-100 hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                        title="Copy path"
                      >
                        {copiedPathId === diff.id ? (
                          <Check className="h-3 w-3 text-emerald-500" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    </div>

                    <span className="text-[11px] text-gray-500 dark:text-gray-400">
                      {diff.message}
                    </span>
                  </div>

                  {/* Values diff row */}
                  <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {/* Left side */}
                    <div className={`rounded border p-2 text-xs font-mono ${
                      diff.type === 'removed'
                        ? 'border-rose-200 bg-rose-50/50 text-rose-900 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-200'
                        : 'border-gray-200 bg-white text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300'
                    }`}>
                      <div className="mb-1 text-[10px] font-sans font-semibold uppercase tracking-wider text-gray-400">
                        Original (Left) {diff.leftType ? `• ${diff.leftType}` : ''}
                      </div>
                      <div className="truncate whitespace-pre-wrap">
                        {diff.leftValue !== undefined ? formatValue(diff.leftValue) : <span className="italic text-gray-400">— absent —</span>}
                      </div>
                    </div>

                    {/* Right side */}
                    <div className={`rounded border p-2 text-xs font-mono ${
                      diff.type === 'added'
                        ? 'border-emerald-200 bg-emerald-50/50 text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-200'
                        : diff.type === 'removed'
                        ? 'border-dashed border-gray-300 bg-gray-100/50 text-gray-400 dark:border-gray-800 dark:bg-gray-900/20'
                        : 'border-gray-200 bg-white text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300'
                    }`}>
                      <div className="mb-1 text-[10px] font-sans font-semibold uppercase tracking-wider text-gray-400">
                        Modified (Right) {diff.rightType ? `• ${diff.rightType}` : ''}
                      </div>
                      <div className="truncate whitespace-pre-wrap">
                        {diff.rightValue !== undefined ? formatValue(diff.rightValue) : <span className="italic text-gray-400">— missing —</span>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
