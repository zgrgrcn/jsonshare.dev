'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  sortJsonKeys,
  analyzeJsonDiff,
  generateSideBySideDiff,
  generateUnifiedDiff,
  SAMPLE_LEFT,
  SAMPLE_RIGHT,
  CompareOptions,
  SideBySideRow,
  UnifiedLine,
  DiffItem,
  DiffSummary,
} from '@/app/utils/jsonCompare';
import { CompareToolbar, ViewMode } from './CompareToolbar';
import { DiffSummaryBanner, DiffFilterType } from './DiffSummaryBanner';
import { SideBySideDiff } from './SideBySideDiff';
import { UnifiedDiff } from './UnifiedDiff';
import { SemanticDiffInspector } from './SemanticDiffInspector';
import { JsonCodeEditor } from '../studio/JsonCodeEditor';
import { Upload, Copy, Check, Code2, Trash2 } from 'lucide-react';

interface CompareViewProps {
  initialLeftId?: string;
}

export const CompareView: React.FC<CompareViewProps> = ({ initialLeftId }) => {
  // Raw text states
  const [leftText, setLeftText] = useState<string>('');
  const [rightText, setRightText] = useState<string>('');

  // Options
  const [options, setOptions] = useState<CompareOptions>({
    sortKeysAlphabetically: true,
    sortArrays: false,
    ignoreWhitespace: true,
  });

  // UI state
  const [viewMode, setViewMode] = useState<ViewMode>('side-by-side');
  const [activeFilter, setActiveFilter] = useState<DiffFilterType>('all');
  const [copiedLeftRaw, setCopiedLeftRaw] = useState(false);
  const [copiedRightRaw, setCopiedRightRaw] = useState(false);

  // Load from initialLeftId if provided
  useEffect(() => {
    if (initialLeftId) {
      fetch(`/api/save-data/${initialLeftId}`)
        .then((res) => {
          if (!res.ok) return null;
          return res.json();
        })
        .then((data) => {
          if (data && data.jsonData) {
            setLeftText(JSON.stringify(data.jsonData, null, 2));
          }
        })
        .catch(() => {});
    } else {
      // Default to sample so the user immediately sees the comparison value!
      setLeftText(JSON.stringify(SAMPLE_LEFT, null, 2));
      setRightText(JSON.stringify(SAMPLE_RIGHT, null, 2));
    }
  }, [initialLeftId]);

  // Safe parsing & validation
  const { parsedLeft, leftError } = useMemo(() => {
    if (!leftText.trim()) return { parsedLeft: null, leftError: null };
    try {
      return { parsedLeft: JSON.parse(leftText), leftError: null };
    } catch (err: any) {
      return { parsedLeft: null, leftError: err.message || 'Invalid JSON' };
    }
  }, [leftText]);

  const { parsedRight, rightError } = useMemo(() => {
    if (!rightText.trim()) return { parsedRight: null, rightError: null };
    try {
      return { parsedRight: JSON.parse(rightText), rightError: null };
    } catch (err: any) {
      return { parsedRight: null, rightError: err.message || 'Invalid JSON' };
    }
  }, [rightText]);

  // Deep comparison analysis
  const { diffResult, summary } = useMemo(() => {
    if (!parsedLeft || !parsedRight) {
      return { diffResult: null, summary: null };
    }
    const result = analyzeJsonDiff(parsedLeft, parsedRight, options);
    return { diffResult: result.differences, summary: result.summary };
  }, [parsedLeft, parsedRight, options]);

  // Formatted representations for text diffing
  const { formattedLeft, formattedRight } = useMemo(() => {
    if (!parsedLeft && !parsedRight) return { formattedLeft: '', formattedRight: '' };

    let l = parsedLeft;
    let r = parsedRight;

    if (options.sortKeysAlphabetically) {
      if (l) l = sortJsonKeys(l, options.sortArrays);
      if (r) r = sortJsonKeys(r, options.sortArrays);
    }

    const fl = l ? JSON.stringify(l, null, 2) : leftText;
    const fr = r ? JSON.stringify(r, null, 2) : rightText;

    return { formattedLeft: fl, formattedRight: fr };
  }, [parsedLeft, parsedRight, leftText, rightText, options]);

  // Side by Side rows
  const sideBySideRows: SideBySideRow[] = useMemo(() => {
    if (!formattedLeft && !formattedRight) return [];
    return generateSideBySideDiff(formattedLeft, formattedRight);
  }, [formattedLeft, formattedRight]);

  // Unified diff lines
  const unifiedLines: UnifiedLine[] = useMemo(() => {
    if (!formattedLeft && !formattedRight) return [];
    return generateUnifiedDiff(formattedLeft, formattedRight);
  }, [formattedLeft, formattedRight]);

  // Toolbar Actions
  const handleLoadSample = useCallback(() => {
    setLeftText(JSON.stringify(SAMPLE_LEFT, null, 2));
    setRightText(JSON.stringify(SAMPLE_RIGHT, null, 2));
  }, []);

  const handleSwap = useCallback(() => {
    setLeftText(rightText);
    setRightText(leftText);
  }, [leftText, rightText]);

  const handleBeautifyBoth = useCallback(() => {
    if (parsedLeft) {
      const sortedL = options.sortKeysAlphabetically ? sortJsonKeys(parsedLeft, options.sortArrays) : parsedLeft;
      setLeftText(JSON.stringify(sortedL, null, 2));
    }
    if (parsedRight) {
      const sortedR = options.sortKeysAlphabetically ? sortJsonKeys(parsedRight, options.sortArrays) : parsedRight;
      setRightText(JSON.stringify(sortedR, null, 2));
    }
  }, [parsedLeft, parsedRight, options]);

  const handleClearBoth = useCallback(() => {
    setLeftText('');
    setRightText('');
  }, []);

  const handleUploadRaw = (content: string, isLeft: boolean) => {
    if (isLeft) {
      setLeftText(content);
    } else {
      setRightText(content);
    }
  };

  const isEmpty = !leftText.trim() && !rightText.trim();

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-3 py-3">
      {/* 1. Control Toolbar */}
      <CompareToolbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        options={options}
        setOptions={setOptions}
        onLoadSample={handleLoadSample}
        onSwap={handleSwap}
        onBeautifyBoth={handleBeautifyBoth}
        onClearBoth={handleClearBoth}
      />

      {/* 2. Summary & Status Banner */}
      <DiffSummaryBanner
        summary={summary}
        leftError={leftError}
        rightError={rightError}
        isEmpty={isEmpty}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        onViewSemantic={() => setViewMode('semantic')}
        isSorted={options.sortKeysAlphabetically}
      />

      {/* 3. Main Diff Display Viewport */}
      <div className="min-h-0 flex-1">
        {viewMode === 'side-by-side' && (
          <SideBySideDiff
            rows={sideBySideRows}
            leftRaw={leftText}
            rightRaw={rightText}
            onUploadLeft={(c) => handleUploadRaw(c, true)}
            onUploadRight={(c) => handleUploadRaw(c, false)}
          />
        )}

        {viewMode === 'unified' && <UnifiedDiff lines={unifiedLines} />}

        {viewMode === 'semantic' && (
          <SemanticDiffInspector
            differences={diffResult || []}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />
        )}

        {viewMode === 'editor' && (
          <div className="grid h-full min-h-0 grid-cols-1 gap-4 md:grid-cols-2">
            <JsonCodeEditor
              value={leftText}
              onChange={setLeftText}
              error={leftError}
              title="Original JSON (Left)"
            />
            <JsonCodeEditor
              value={rightText}
              onChange={setRightText}
              error={rightError}
              title="Modified JSON (Right)"
            />
          </div>
        )}
      </div>
    </div>
  );
};
