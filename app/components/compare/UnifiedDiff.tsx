'use client';
import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { UnifiedLine } from '@/app/utils/jsonCompare';

import { useEditorTheme } from '@/app/context/EditorThemeContext';

interface UnifiedDiffProps {
  lines: UnifiedLine[];
}

export const UnifiedDiff: React.FC<UnifiedDiffProps> = ({ lines }) => {
  const { activeTheme } = useEditorTheme();
  const [copied, setCopied] = useState(false);

  const handleCopyUnified = async () => {
    const text = lines.map((l) => l.content).join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-gray-200/90 bg-white shadow-sm dark:border-gray-800 dark:bg-dark">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200/90 bg-gray-50/90 px-3 py-2 text-xs font-semibold dark:border-gray-800 dark:bg-gray-900/50">
        <div className="flex items-center gap-2">
          <span className="text-gray-800 dark:text-gray-200">Unified Diff View</span>
          <span className="rounded bg-gray-200/80 px-1.5 py-0.5 text-[10px] text-gray-600 dark:bg-gray-800 dark:text-gray-400">
            {lines.length} lines
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopyUnified}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
          <span>{copied ? 'Copied' : 'Copy Diff'}</span>
        </button>
      </div>

      {/* Lines container with activeTheme styling */}
      <div
        className="h-full overflow-auto font-mono text-[12px] leading-5 transition-colors"
        style={{
          backgroundColor: activeTheme.panelBg,
          color: activeTheme.panelFg,
        }}
      >
        {lines.map((line) => {
          let rowStyle: React.CSSProperties = { borderLeft: '2px solid transparent' };
          let lineNumStyle: React.CSSProperties = {
            backgroundColor: activeTheme.gutterBg,
            color: activeTheme.gutterFg,
            borderRight: `1px solid ${activeTheme.gutterBorder}`,
          };
          let textStyle: React.CSSProperties = { color: activeTheme.panelFg };

          if (line.type === 'added') {
            rowStyle = {
              backgroundColor: activeTheme.diffAddedBg,
              borderLeft: `2px solid ${activeTheme.diffAddedBorder}`,
            };
            lineNumStyle = {
              backgroundColor: activeTheme.diffAddedLineNum,
              color: activeTheme.diffAddedFg,
              borderRight: `1px solid ${activeTheme.diffAddedBorder}`,
            };
            textStyle = { color: activeTheme.diffAddedFg, fontWeight: 600 };
          } else if (line.type === 'removed') {
            rowStyle = {
              backgroundColor: activeTheme.diffRemovedBg,
              borderLeft: `2px solid ${activeTheme.diffRemovedBorder}`,
            };
            lineNumStyle = {
              backgroundColor: activeTheme.diffRemovedLineNum,
              color: activeTheme.diffRemovedFg,
              borderRight: `1px solid ${activeTheme.diffRemovedBorder}`,
            };
            textStyle = { color: activeTheme.diffRemovedFg, fontWeight: 600 };
          }

          return (
            <div
              key={`unified-${line.id}`}
              className="flex min-w-full transition-colors"
              style={rowStyle}
            >
              <span
                className="w-10 shrink-0 select-none px-2 text-right text-[11px]"
                style={lineNumStyle}
              >
                {line.leftLineNumber ?? ''}
              </span>
              <span
                className="w-10 shrink-0 select-none px-2 text-right text-[11px]"
                style={lineNumStyle}
              >
                {line.rightLineNumber ?? ''}
              </span>
              <div
                className="flex-1 overflow-visible whitespace-pre px-2 py-0.5"
                style={textStyle}
              >
                {line.content}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
