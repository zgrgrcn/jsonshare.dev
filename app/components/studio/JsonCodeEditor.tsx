'use client';
import React, { useRef, useEffect } from 'react';
import { Copy, Check, AlertCircle } from 'lucide-react';

import { useEditorTheme } from '@/app/context/EditorThemeContext';

interface JsonCodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  readOnly?: boolean;
  title?: string;
}

export const JsonCodeEditor: React.FC<JsonCodeEditorProps> = ({
  value,
  onChange,
  error,
  readOnly = false,
  title = 'JSON Editor',
}) => {
  const { activeTheme } = useEditorTheme();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const lineNumbersRef = useRef<HTMLDivElement | null>(null);
  const [copied, setCopied] = React.useState(false);

  const lines = value.split('\n');
  const lineCount = lines.length;

  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (readOnly) return;
    // Allow Tab key to indent with 2 spaces
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const byteSize = new Blob([value]).size;
  const formattedSize = byteSize < 1024 ? `${byteSize} B` : `${(byteSize / 1024).toFixed(1)} KB`;

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-gray-200/90 bg-white shadow-sm dark:border-gray-800 dark:bg-dark">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200/90 bg-gray-50/90 px-3 py-2 text-xs font-semibold dark:border-gray-800 dark:bg-gray-900/50">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-indigo-500" />
          <span className="text-gray-800 dark:text-gray-200">{title}</span>
          <span className="rounded bg-gray-200/80 px-1.5 py-0.5 text-[10px] text-gray-600 dark:bg-gray-800 dark:text-gray-400">
            {lineCount} lines • {formattedSize}
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded p-1 text-gray-500 transition hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          title="Copy code"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Editor Body with Theme-Driven Background and Colors */}
      <div
        className="relative flex min-h-0 flex-1 overflow-hidden font-mono text-[12px] leading-5 transition-colors"
        style={{
          backgroundColor: activeTheme.panelBg,
          color: activeTheme.panelFg,
        }}
      >
        {/* Line Numbers */}
        <div
          ref={lineNumbersRef}
          className="pointer-events-none select-none overflow-hidden py-3 pr-2 text-right text-[11px] transition-colors"
          style={{
            backgroundColor: activeTheme.gutterBg,
            color: activeTheme.gutterFg,
            borderRight: `1px solid ${activeTheme.gutterBorder}`,
            width: `${Math.max(2.5, String(lineCount).length * 0.7 + 1.2)}rem`,
          }}
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i + 1} className="h-5">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          readOnly={readOnly}
          spellCheck={false}
          autoCapitalize="none"
          autoCorrect="off"
          placeholder="Paste or write your JSON here..."
          className="h-full min-h-0 flex-1 resize-none border-0 bg-transparent p-3 font-mono text-[12px] leading-5 placeholder:text-gray-400 focus:outline-none focus:ring-0 selection:bg-indigo-500 selection:text-white dark:placeholder:text-gray-600"
          style={{
            color: activeTheme.panelFg,
          }}
        />
      </div>

      {/* Error Footer if any */}
      {error && (
        <div className="flex items-center gap-2 border-t border-amber-300/80 bg-amber-50/90 px-3 py-1.5 text-xs text-amber-900 dark:border-amber-500/30 dark:bg-amber-950/40 dark:text-amber-300">
          <AlertCircle className="h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
          <span className="truncate font-mono text-[11px]">{error}</span>
        </div>
      )}
    </div>
  );
};
