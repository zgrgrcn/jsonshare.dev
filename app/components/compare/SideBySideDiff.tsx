'use client';
import React, { useRef, useEffect } from 'react';
import { Copy, Check, Upload, ArrowDownToLine } from 'lucide-react';
import { SideBySideRow } from '@/app/utils/jsonCompare';

import { useEditorTheme } from '@/app/context/EditorThemeContext';

interface SideBySideDiffProps {
  rows: SideBySideRow[];
  leftTitle?: string;
  rightTitle?: string;
  leftRaw: string;
  rightRaw: string;
  onUploadLeft: (content: string) => void;
  onUploadRight: (content: string) => void;
}

export const SideBySideDiff: React.FC<SideBySideDiffProps> = ({
  rows,
  leftTitle = 'Original JSON (Left)',
  rightTitle = 'Modified JSON (Right)',
  leftRaw,
  rightRaw,
  onUploadLeft,
  onUploadRight,
}) => {
  const { activeTheme } = useEditorTheme();
  const leftScrollRef = useRef<HTMLDivElement | null>(null);
  const rightScrollRef = useRef<HTMLDivElement | null>(null);
  const isSyncingLeft = useRef(false);
  const isSyncingRight = useRef(false);

  const [copiedLeft, setCopiedLeft] = React.useState(false);
  const [copiedRight, setCopiedRight] = React.useState(false);

  const leftFileInputRef = useRef<HTMLInputElement | null>(null);
  const rightFileInputRef = useRef<HTMLInputElement | null>(null);

  // Synchronized scrolling
  const handleLeftScroll = () => {
    if (!isSyncingRight.current && rightScrollRef.current && leftScrollRef.current) {
      isSyncingLeft.current = true;
      rightScrollRef.current.scrollTop = leftScrollRef.current.scrollTop;
      rightScrollRef.current.scrollLeft = leftScrollRef.current.scrollLeft;
      requestAnimationFrame(() => {
        isSyncingLeft.current = false;
      });
    }
  };

  const handleRightScroll = () => {
    if (!isSyncingLeft.current && leftScrollRef.current && rightScrollRef.current) {
      isSyncingRight.current = true;
      leftScrollRef.current.scrollTop = rightScrollRef.current.scrollTop;
      leftScrollRef.current.scrollLeft = rightScrollRef.current.scrollLeft;
      requestAnimationFrame(() => {
        isSyncingRight.current = false;
      });
    }
  };

  const copyText = async (text: string, isLeft: boolean) => {
    try {
      await navigator.clipboard.writeText(text);
      if (isLeft) {
        setCopiedLeft(true);
        setTimeout(() => setCopiedLeft(false), 2000);
      } else {
        setCopiedRight(true);
        setTimeout(() => setCopiedRight(false), 2000);
      }
    } catch {
      // Fallback
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isLeft: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      if (isLeft) {
        onUploadLeft(content);
      } else {
        onUploadRight(content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const leftLinesCount = rows.filter((r) => r.left.lineNumber !== undefined).length;
  const rightLinesCount = rows.filter((r) => r.right.lineNumber !== undefined).length;

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-gray-200/90 bg-white shadow-sm dark:border-gray-800 dark:bg-dark">
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={leftFileInputRef}
        className="hidden"
        accept=".json,application/json,text/plain"
        onChange={(e) => handleFileChange(e, true)}
      />
      <input
        type="file"
        ref={rightFileInputRef}
        className="hidden"
        accept=".json,application/json,text/plain"
        onChange={(e) => handleFileChange(e, false)}
      />

      {/* Side Headers */}
      <div className="grid grid-cols-1 border-b border-gray-200/90 md:grid-cols-2 dark:border-gray-800">
        {/* Left Header */}
        <div className="flex items-center justify-between border-b border-gray-200/90 bg-gray-50/90 px-3 py-2 text-xs font-semibold md:border-b-0 md:border-r dark:border-gray-800 dark:bg-gray-900/50">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            <span className="text-gray-800 dark:text-gray-200">{leftTitle}</span>
            <span className="rounded bg-gray-200/80 px-1.5 py-0.5 text-[10px] text-gray-600 dark:bg-gray-800 dark:text-gray-400">
              {leftLinesCount} lines
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => leftFileInputRef.current?.click()}
              className="rounded p-1 text-gray-500 transition hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              title="Upload .json file"
            >
              <Upload className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => copyText(leftRaw, true)}
              className="rounded p-1 text-gray-500 transition hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              title="Copy left JSON"
            >
              {copiedLeft ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        {/* Right Header */}
        <div className="flex items-center justify-between bg-gray-50/90 px-3 py-2 text-xs font-semibold dark:bg-gray-900/50">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-gray-800 dark:text-gray-200">{rightTitle}</span>
            <span className="rounded bg-gray-200/80 px-1.5 py-0.5 text-[10px] text-gray-600 dark:bg-gray-800 dark:text-gray-400">
              {rightLinesCount} lines
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => rightFileInputRef.current?.click()}
              className="rounded p-1 text-gray-500 transition hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              title="Upload .json file"
            >
              <Upload className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => copyText(rightRaw, false)}
              className="rounded p-1 text-gray-500 transition hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              title="Copy right JSON"
            >
              {copiedRight ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Side-by-side panels container */}
      <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-800">
        {/* Left Diff Panel */}
        <div
          ref={leftScrollRef}
          onScroll={handleLeftScroll}
          className="h-full overflow-auto font-mono text-[12px] leading-5 selection:bg-indigo-500 selection:text-white transition-colors"
          style={{
            backgroundColor: activeTheme.panelBg,
            color: activeTheme.panelFg,
          }}
        >
          {rows.map((row) => {
            const line = row.left;
            let rowStyle: React.CSSProperties = { borderLeft: '2px solid transparent' };
            let lineNumStyle: React.CSSProperties = {
              backgroundColor: activeTheme.gutterBg,
              color: activeTheme.gutterFg,
              borderRight: `1px solid ${activeTheme.gutterBorder}`,
            };
            let contentStyle: React.CSSProperties = { color: activeTheme.panelFg };

            if (line.type === 'removed') {
              rowStyle = {
                backgroundColor: activeTheme.diffRemovedBg,
                borderLeft: `2px solid ${activeTheme.diffRemovedBorder}`,
              };
              lineNumStyle = {
                backgroundColor: activeTheme.diffRemovedLineNum,
                color: activeTheme.diffRemovedFg,
                fontWeight: 'bold',
                borderRight: `1px solid ${activeTheme.diffRemovedBorder}`,
              };
              contentStyle = { color: activeTheme.diffRemovedFg };
            } else if (line.type === 'modified') {
              rowStyle = {
                backgroundColor: activeTheme.diffModifiedBg,
                borderLeft: `2px solid ${activeTheme.diffModifiedBorder}`,
              };
              lineNumStyle = {
                backgroundColor: activeTheme.diffModifiedLineNum,
                color: activeTheme.diffModifiedFg,
                fontWeight: 'bold',
                borderRight: `1px solid ${activeTheme.diffModifiedBorder}`,
              };
              contentStyle = { color: activeTheme.diffModifiedFg };
            } else if (line.type === 'empty') {
              rowStyle = { backgroundColor: activeTheme.diffEmptyBg };
              lineNumStyle = { backgroundColor: 'transparent', color: 'transparent' };
            }

            return (
              <div
                key={`left-${row.id}`}
                className="flex min-w-full transition-colors"
                style={rowStyle}
              >
                <span
                  className="w-10 shrink-0 select-none px-2 text-right text-[11px]"
                  style={lineNumStyle}
                >
                  {line.lineNumber ?? ''}
                </span>
                <div
                  className="flex-1 overflow-visible whitespace-pre px-2 py-0.5"
                  style={contentStyle}
                >
                  {line.charChunks && line.charChunks.length > 0 ? (
                    line.charChunks.map((chunk, idx) => (
                      <span
                        key={idx}
                        style={
                          chunk.removed
                            ? {
                                backgroundColor: activeTheme.diffRemovedChunk,
                                color: '#ffffff',
                                borderRadius: '2px',
                                padding: '1px 2px',
                                fontWeight: 'bold',
                              }
                            : undefined
                        }
                      >
                        {chunk.value}
                      </span>
                    ))
                  ) : (
                    <span>{line.content}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Diff Panel */}
        <div
          ref={rightScrollRef}
          onScroll={handleRightScroll}
          className="h-full overflow-auto font-mono text-[12px] leading-5 selection:bg-indigo-500 selection:text-white transition-colors"
          style={{
            backgroundColor: activeTheme.panelBg,
            color: activeTheme.panelFg,
          }}
        >
          {rows.map((row) => {
            const line = row.right;
            let rowStyle: React.CSSProperties = { borderLeft: '2px solid transparent' };
            let lineNumStyle: React.CSSProperties = {
              backgroundColor: activeTheme.gutterBg,
              color: activeTheme.gutterFg,
              borderRight: `1px solid ${activeTheme.gutterBorder}`,
            };
            let contentStyle: React.CSSProperties = { color: activeTheme.panelFg };

            if (line.type === 'added') {
              rowStyle = {
                backgroundColor: activeTheme.diffAddedBg,
                borderLeft: `2px solid ${activeTheme.diffAddedBorder}`,
              };
              lineNumStyle = {
                backgroundColor: activeTheme.diffAddedLineNum,
                color: activeTheme.diffAddedFg,
                fontWeight: 'bold',
                borderRight: `1px solid ${activeTheme.diffAddedBorder}`,
              };
              contentStyle = { color: activeTheme.diffAddedFg };
            } else if (line.type === 'modified') {
              rowStyle = {
                backgroundColor: activeTheme.diffModifiedBg,
                borderLeft: `2px solid ${activeTheme.diffModifiedBorder}`,
              };
              lineNumStyle = {
                backgroundColor: activeTheme.diffModifiedLineNum,
                color: activeTheme.diffModifiedFg,
                fontWeight: 'bold',
                borderRight: `1px solid ${activeTheme.diffModifiedBorder}`,
              };
              contentStyle = { color: activeTheme.diffModifiedFg };
            } else if (line.type === 'empty') {
              rowStyle = { backgroundColor: activeTheme.diffEmptyBg };
              lineNumStyle = { backgroundColor: 'transparent', color: 'transparent' };
            }

            return (
              <div
                key={`right-${row.id}`}
                className="flex min-w-full transition-colors"
                style={rowStyle}
              >
                <span
                  className="w-10 shrink-0 select-none px-2 text-right text-[11px]"
                  style={lineNumStyle}
                >
                  {line.lineNumber ?? ''}
                </span>
                <div
                  className="flex-1 overflow-visible whitespace-pre px-2 py-0.5"
                  style={contentStyle}
                >
                  {line.charChunks && line.charChunks.length > 0 ? (
                    line.charChunks.map((chunk, idx) => (
                      <span
                        key={idx}
                        style={
                          chunk.added
                            ? {
                                backgroundColor: activeTheme.diffAddedChunk,
                                color: '#ffffff',
                                borderRadius: '2px',
                                padding: '1px 2px',
                                fontWeight: 'bold',
                              }
                            : undefined
                        }
                      >
                        {chunk.value}
                      </span>
                    ))
                  ) : (
                    <span>{line.content}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
