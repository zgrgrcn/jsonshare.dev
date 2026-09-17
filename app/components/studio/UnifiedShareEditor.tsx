'use client';
import React, { useState, useMemo, useCallback } from 'react';
import { StudioToolbar } from './StudioToolbar';
import { JsonCodeEditor } from './JsonCodeEditor';
import { JsonTreeViewer } from './JsonTreeViewer';
import { sortJsonKeys } from '@/app/utils/jsonCompare';
import { autoFixJson, jsonToTypeScript } from '@/app/utils/jsonTools';

interface UnifiedShareEditorProps {
  initialData?: any;
  onChangeData?: (data: any) => void;
  renderFooterActions?: (data: any, parseError: string | null) => React.ReactNode;
}

const DEFAULT_JSON = {
  array: [1, 2, 3],
  boolean: true,
  null: null,
  number: 123,
  object: { a: 'b', c: 'd' },
  string: 'Hello World',
  color: '#82b92c',
};

export const UnifiedShareEditor: React.FC<UnifiedShareEditorProps> = ({
  initialData = DEFAULT_JSON,
  onChangeData,
  renderFooterActions,
}) => {
  const [rawText, setRawText] = useState<string>(() =>
    JSON.stringify(initialData || DEFAULT_JSON, null, 2)
  );
  const [copiedRaw, setCopiedRaw] = useState(false);
  const [copiedTs, setCopiedTs] = useState(false);
  const [autoFixMessage, setAutoFixMessage] = useState<string | null>(null);

  // Parsing & validation
  const { parsedJson, parseError } = useMemo(() => {
    if (!rawText.trim()) return { parsedJson: null, parseError: 'Empty JSON' };
    try {
      const parsed = JSON.parse(rawText);
      return { parsedJson: parsed, parseError: null };
    } catch (err: any) {
      return { parsedJson: null, parseError: err.message || 'Invalid JSON syntax' };
    }
  }, [rawText]);

  // Keep parent in sync
  React.useEffect(() => {
    if (parsedJson !== null && onChangeData) {
      onChangeData(parsedJson);
    }
  }, [parsedJson, onChangeData]);

  // Handlers
  const handleFormat = useCallback(() => {
    if (parsedJson) {
      setRawText(JSON.stringify(parsedJson, null, 2));
    }
  }, [parsedJson]);

  const handleMinify = useCallback(() => {
    if (parsedJson) {
      setRawText(JSON.stringify(parsedJson));
    }
  }, [parsedJson]);

  const handleSortKeys = useCallback(() => {
    if (parsedJson) {
      const sorted = sortJsonKeys(parsedJson);
      setRawText(JSON.stringify(sorted, null, 2));
    }
  }, [parsedJson]);

  const handleAutoFix = useCallback(() => {
    const result = autoFixJson(rawText);
    if (result.wasFixed) {
      setRawText(result.fixed);
      setAutoFixMessage('✨ Repaired quotes and trailing commas successfully!');
      setTimeout(() => setAutoFixMessage(null), 3000);
    } else if (result.error) {
      setAutoFixMessage(`Could not auto-fix: ${result.error}`);
      setTimeout(() => setAutoFixMessage(null), 3000);
    } else {
      setAutoFixMessage('JSON is already valid!');
      setTimeout(() => setAutoFixMessage(null), 2000);
    }
  }, [rawText]);

  const handleCopyTsTypes = useCallback(async () => {
    if (!parsedJson) return;
    try {
      const types = jsonToTypeScript('RootObject', parsedJson);
      await navigator.clipboard.writeText(types);
      setCopiedTs(true);
      setTimeout(() => setCopiedTs(false), 2000);
    } catch {}
  }, [parsedJson]);

  const handleLoadSample = useCallback(() => {
    setRawText(JSON.stringify(DEFAULT_JSON, null, 2));
  }, []);

  const handleUpload = useCallback((content: string) => {
    setRawText(content);
  }, []);

  const handleClear = useCallback(() => {
    setRawText('');
  }, []);

  const handleCopyRaw = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(rawText);
      setCopiedRaw(true);
      setTimeout(() => setCopiedRaw(false), 2000);
    } catch {}
  }, [rawText]);

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-3 py-3">
      {/* Shared Studio Toolbar */}
      <StudioToolbar
        onFormat={handleFormat}
        onMinify={handleMinify}
        onSortKeys={handleSortKeys}
        onAutoFix={handleAutoFix}
        onCopyTsTypes={handleCopyTsTypes}
        onLoadSample={handleLoadSample}
        onUpload={handleUpload}
        onClear={handleClear}
        onCopyRaw={handleCopyRaw}
        copiedRaw={copiedRaw}
        copiedTs={copiedTs}
      />

      {/* Auto-Fix notification pill */}
      {autoFixMessage && (
        <div className="rounded-lg border border-indigo-200 bg-indigo-50/90 px-3 py-1.5 text-xs text-indigo-900 shadow-sm dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-200">
          {autoFixMessage}
        </div>
      )}

      {/* Main Grid: Code Editor (Left) & Interactive Tree Viewer (Right) */}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 md:grid-cols-2">
        <JsonCodeEditor
          value={rawText}
          onChange={setRawText}
          error={parseError}
          title="Source JSON"
        />
        <JsonTreeViewer
          data={parsedJson}
          title="Interactive Tree Inspector"
        />
      </div>

      {/* Action Footer Bar */}
      {renderFooterActions && (
        <div className="sticky bottom-0 z-30 shrink-0 border-t border-gray-200/80 bg-white/90 py-2.5 backdrop-blur dark:border-gray-800 dark:bg-dark/90">
          {renderFooterActions(parsedJson, parseError)}
        </div>
      )}
    </div>
  );
};
