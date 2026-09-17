'use client';
import React, { useState, useMemo } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Search,
  Copy,
  Check,
  FoldVertical,
  UnfoldVertical,
} from 'lucide-react';

import { useEditorTheme } from '@/app/context/EditorThemeContext';

interface JsonTreeViewerProps {
  data: any;
  title?: string;
}

export const JsonTreeViewer: React.FC<JsonTreeViewerProps> = ({
  data,
  title = 'Interactive Tree View',
}) => {
  const { activeTheme } = useEditorTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedPaths, setCollapsedPaths] = useState<Set<string>>(new Set());
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  const toggleCollapse = (path: string) => {
    setCollapsedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const handleCollapseAll = () => {
    const allPaths = new Set<string>();
    function collect(val: any, currentPath: string) {
      if (val !== null && typeof val === 'object') {
        allPaths.add(currentPath);
        if (Array.isArray(val)) {
          val.forEach((item, idx) => collect(item, `${currentPath}[${idx}]`));
        } else {
          Object.keys(val).forEach((k) => collect(val[k], currentPath ? `${currentPath}.${k}` : k));
        }
      }
    }
    collect(data, 'root');
    setCollapsedPaths(allPaths);
  };

  const handleExpandAll = () => {
    setCollapsedPaths(new Set());
  };

  const handleCopyPath = async (path: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(path.replace(/^root\.?/, ''));
      setCopiedPath(path);
      setTimeout(() => setCopiedPath(null), 1500);
    } catch {}
  };

  const renderNode = (keyName: string | number | null, value: any, currentPath: string, depth = 0) => {
    const isObject = value !== null && typeof value === 'object';
    const isArray = Array.isArray(value);
    const isCollapsed = collapsedPaths.has(currentPath);

    // Search query check
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      const keyStr = String(keyName || '').toLowerCase();
      const valStr = JSON.stringify(value)?.toLowerCase() || '';
      if (!keyStr.includes(q) && !valStr.includes(q)) {
        return null;
      }
    }

    if (!isObject) {
      let valueColorStyle = { color: activeTheme.panelFg };
      let formattedVal = String(value);

      if (typeof value === 'string') {
        valueColorStyle = { color: activeTheme.stringColor };
        formattedVal = `"${value}"`;
      } else if (typeof value === 'number') {
        valueColorStyle = { color: activeTheme.numberColor };
      } else if (typeof value === 'boolean') {
        valueColorStyle = { color: activeTheme.booleanColor };
      } else if (value === null) {
        valueColorStyle = { color: activeTheme.nullColor };
        formattedVal = 'null';
      }

      return (
        <div
          key={currentPath}
          className="group flex items-center gap-1.5 py-0.5 rounded px-1 transition-colors"
          style={{ paddingLeft: `${depth * 1.25}rem` }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = activeTheme.hoverBg)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          {keyName !== null && (
            <span className="font-semibold" style={{ color: activeTheme.keyColor }}>
              {keyName}
              <span style={{ color: activeTheme.colonColor }}>: </span>
            </span>
          )}
          <span className="font-mono break-all select-text" style={valueColorStyle}>
            {formattedVal}
          </span>
          <button
            type="button"
            onClick={(e) => handleCopyPath(currentPath, e)}
            className="rounded p-0.5 text-gray-400 opacity-0 transition group-hover:opacity-100 hover:bg-gray-200 hover:text-gray-700 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            title="Copy path"
          >
            {copiedPath === currentPath ? (
              <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </button>
        </div>
      );
    }

    const keys = Object.keys(value);
    const count = keys.length;
    const bracketOpen = isArray ? '[' : '{';
    const bracketClose = isArray ? ']' : '}';

    return (
      <div key={currentPath} className="flex flex-col">
        <div
          onClick={() => toggleCollapse(currentPath)}
          className="group flex cursor-pointer select-none items-center gap-1 rounded py-0.5 transition-colors"
          style={{ paddingLeft: `${depth * 1.25}rem` }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = activeTheme.hoverBg)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          {isCollapsed ? (
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-gray-400 dark:text-gray-500" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-gray-400 dark:text-gray-500" />
          )}

          {keyName !== null && (
            <span className="font-semibold" style={{ color: activeTheme.keyColor }}>
              {keyName}
              <span style={{ color: activeTheme.colonColor }}>: </span>
            </span>
          )}

          <span className="font-mono text-[11px]" style={{ color: activeTheme.bracketColor }}>
            {bracketOpen}
            {isCollapsed && (
              <span className="mx-1 rounded bg-gray-200/60 px-1 py-0.2 text-[10px] text-gray-600 dark:bg-gray-800/80 dark:text-gray-400">
                {count} {isArray ? 'items' : 'keys'}
              </span>
            )}
            {isCollapsed && bracketClose}
          </span>

          <button
            type="button"
            onClick={(e) => handleCopyPath(currentPath, e)}
            className="ml-1 rounded p-0.5 text-gray-400 opacity-0 transition group-hover:opacity-100 hover:bg-gray-200 hover:text-gray-700 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            title="Copy path"
          >
            {copiedPath === currentPath ? (
              <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </button>
        </div>

        {!isCollapsed && (
          <div className="flex flex-col">
            {keys.map((k) => {
              const childVal = value[k];
              const nextPath = isArray ? `${currentPath}[${k}]` : `${currentPath}.${k}`;
              return renderNode(isArray ? Number(k) : k, childVal, nextPath, depth + 1);
            })}
            <div
              className="py-0.5 font-mono text-[11px]"
              style={{
                paddingLeft: `${depth * 1.25 + 0.9}rem`,
                color: activeTheme.bracketColor,
              }}
            >
              {bracketClose}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-gray-200/90 bg-white shadow-sm dark:border-gray-800 dark:bg-dark">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200/90 bg-gray-50/90 px-3 py-2 text-xs font-semibold dark:border-gray-800 dark:bg-gray-900/50">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-gray-800 dark:text-gray-200">{title}</span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Search box */}
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search keys or values..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-6 w-32 rounded-md border border-gray-300 bg-white pl-6 pr-2 text-[11px] text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:w-44 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>

          <button
            type="button"
            onClick={handleExpandAll}
            className="rounded p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            title="Expand All"
          >
            <UnfoldVertical className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={handleCollapseAll}
            className="rounded p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            title="Collapse All"
          >
            <FoldVertical className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Tree Content with Theme-Driven Background and Colors */}
      <div
        className="h-full overflow-auto p-3 font-mono text-[12px] leading-relaxed selection:bg-indigo-500 selection:text-white transition-colors"
        style={{
          backgroundColor: activeTheme.panelBg,
          color: activeTheme.panelFg,
        }}
      >
        {data === undefined || data === null ? (
          <div className="flex h-full items-center justify-center text-gray-400 italic">
            Enter valid JSON to view interactive tree.
          </div>
        ) : (
          renderNode(null, data, 'root', 0)
        )}
      </div>
    </div>
  );
};
