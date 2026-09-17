import * as JsDiff from 'diff';

export type DiffType = 'added' | 'removed' | 'modified' | 'type_changed';

export interface DiffItem {
  id: string;
  path: string;
  type: DiffType;
  leftValue?: any;
  rightValue?: any;
  leftType?: string;
  rightType?: string;
  message: string;
}

export interface DiffSummary {
  total: number;
  added: number;
  removed: number;
  modified: number;
  typeChanged: number;
  isEqual: boolean;
  isEqualAfterSorting: boolean;
}

export interface CompareOptions {
  sortKeysAlphabetically: boolean;
  sortArrays?: boolean;
  ignoreWhitespace?: boolean;
}

export interface DiffLine {
  lineNumber?: number;
  content: string;
  type: 'normal' | 'added' | 'removed' | 'modified' | 'empty';
  charChunks?: Array<{ value: string; added?: boolean; removed?: boolean }>;
}

export interface SideBySideRow {
  id: number;
  left: DiffLine;
  right: DiffLine;
}

/**
 * Recursively sorts all keys of an object alphabetically.
 */
export function sortJsonKeys(value: any, sortArrays = false): any {
  if (value === null || typeof value !== 'object') {
    return value;
  }

  if (Array.isArray(value)) {
    const sortedItems = value.map((item) => sortJsonKeys(item, sortArrays));
    if (sortArrays) {
      return sortedItems.slice().sort((a, b) => {
        const strA = typeof a === 'object' ? JSON.stringify(a) : String(a);
        const strB = typeof b === 'object' ? JSON.stringify(b) : String(b);
        return strA.localeCompare(strB);
      });
    }
    return sortedItems;
  }

  const sortedObj: Record<string, any> = {};
  const keys = Object.keys(value).sort((a, b) => a.localeCompare(b));
  for (const key of keys) {
    sortedObj[key] = sortJsonKeys(value[key], sortArrays);
  }
  return sortedObj;
}

export function getTypeName(val: any): string {
  if (val === null) return 'null';
  if (val === undefined) return 'undefined';
  if (Array.isArray(val)) return 'array';
  return typeof val;
}

export function formatValue(val: any): string {
  if (val === undefined) return 'undefined';
  if (typeof val === 'string') return `"${val}"`;
  if (typeof val === 'object' && val !== null) {
    try {
      const str = JSON.stringify(val);
      return str.length > 50 ? str.slice(0, 47) + '...' : str;
    } catch {
      return String(val);
    }
  }
  return String(val);
}

/**
 * Deeply compares two JSON objects and produces a list of semantic differences.
 */
export function analyzeJsonDiff(
  left: any,
  right: any,
  options: CompareOptions = { sortKeysAlphabetically: true }
): { differences: DiffItem[]; summary: DiffSummary } {
  const differences: DiffItem[] = [];

  // If sorting is enabled, normalize both before deep compare
  const normalizedLeft = options.sortKeysAlphabetically
    ? sortJsonKeys(left, options.sortArrays)
    : left;
  const normalizedRight = options.sortKeysAlphabetically
    ? sortJsonKeys(right, options.sortArrays)
    : right;

  function walk(l: any, r: any, currentPath: string) {
    const lType = getTypeName(l);
    const rType = getTypeName(r);

    if (l === undefined && r !== undefined) {
      differences.push({
        id: `${currentPath}-added-${differences.length}`,
        path: currentPath || '(root)',
        type: 'added',
        rightValue: r,
        rightType: rType,
        message: `Field added: ${formatValue(r)}`,
      });
      return;
    }

    if (l !== undefined && r === undefined) {
      differences.push({
        id: `${currentPath}-removed-${differences.length}`,
        path: currentPath || '(root)',
        type: 'removed',
        leftValue: l,
        leftType: lType,
        message: `Field missing in modified: ${formatValue(l)}`,
      });
      return;
    }

    if (lType !== rType) {
      differences.push({
        id: `${currentPath}-type-${differences.length}`,
        path: currentPath || '(root)',
        type: 'type_changed',
        leftValue: l,
        rightValue: r,
        leftType: lType,
        rightType: rType,
        message: `Type mismatch: was ${lType}, now ${rType}`,
      });
      return;
    }

    if (lType === 'object') {
      const allKeys = Array.from(new Set([...Object.keys(l || {}), ...Object.keys(r || {})]));
      if (options.sortKeysAlphabetically) {
        allKeys.sort((a, b) => a.localeCompare(b));
      }

      for (const k of allKeys) {
        const nextPath = currentPath ? `${currentPath}.${k}` : k;
        walk(l?.[k], r?.[k], nextPath);
      }
      return;
    }

    if (lType === 'array') {
      const maxLen = Math.max(l.length, r.length);
      for (let i = 0; i < maxLen; i++) {
        const nextPath = `${currentPath}[${i}]`;
        walk(l[i], r[i], nextPath);
      }
      return;
    }

    // Primitives
    if (l !== r) {
      differences.push({
        id: `${currentPath}-mod-${differences.length}`,
        path: currentPath || '(root)',
        type: 'modified',
        leftValue: l,
        rightValue: r,
        leftType: lType,
        rightType: rType,
        message: `Value changed: ${formatValue(l)} → ${formatValue(r)}`,
      });
    }
  }

  walk(normalizedLeft, normalizedRight, '');

  const added = differences.filter((d) => d.type === 'added').length;
  const removed = differences.filter((d) => d.type === 'removed').length;
  const modified = differences.filter((d) => d.type === 'modified').length;
  const typeChanged = differences.filter((d) => d.type === 'type_changed').length;
  const total = differences.length;

  const rawLeftStr = JSON.stringify(left);
  const rawRightStr = JSON.stringify(right);
  const sortedLeftStr = JSON.stringify(sortJsonKeys(left, options.sortArrays));
  const sortedRightStr = JSON.stringify(sortJsonKeys(right, options.sortArrays));

  const isEqual = rawLeftStr === rawRightStr;
  const isEqualAfterSorting = !isEqual && sortedLeftStr === sortedRightStr;

  return {
    differences,
    summary: {
      total,
      added,
      removed,
      modified,
      typeChanged,
      isEqual,
      isEqualAfterSorting,
    },
  };
}

/**
 * Builds aligned side-by-side rows with inline character diffs for changed lines.
 */
export function generateSideBySideDiff(leftText: string, rightText: string): SideBySideRow[] {
  const diffParts = JsDiff.diffLines(leftText, rightText);
  const rows: SideBySideRow[] = [];

  let leftLineNum = 1;
  let rightLineNum = 1;
  let rowId = 1;

  let i = 0;
  while (i < diffParts.length) {
    const part = diffParts[i];

    if (!part.added && !part.removed) {
      // Unchanged block
      const lines = part.value.replace(/\n$/, '').split('\n');
      for (const line of lines) {
        rows.push({
          id: rowId++,
          left: { lineNumber: leftLineNum++, content: line, type: 'normal' },
          right: { lineNumber: rightLineNum++, content: line, type: 'normal' },
        });
      }
      i++;
    } else if (part.removed && i + 1 < diffParts.length && diffParts[i + 1].added) {
      // Modified block: removed followed by added
      const removedLines = part.value.replace(/\n$/, '').split('\n');
      const addedLines = diffParts[i + 1].value.replace(/\n$/, '').split('\n');
      const maxLines = Math.max(removedLines.length, addedLines.length);

      for (let j = 0; j < maxLines; j++) {
        const leftContent = removedLines[j];
        const rightContent = addedLines[j];

        if (leftContent !== undefined && rightContent !== undefined) {
          // Word/character diff between corresponding lines
          const wordDiff = JsDiff.diffWordsWithSpace(leftContent, rightContent);
          const leftChunks = wordDiff
            .filter((c) => !c.added)
            .map((c) => ({ value: c.value, removed: c.removed }));
          const rightChunks = wordDiff
            .filter((c) => !c.removed)
            .map((c) => ({ value: c.value, added: c.added }));

          rows.push({
            id: rowId++,
            left: {
              lineNumber: leftLineNum++,
              content: leftContent,
              type: 'modified',
              charChunks: leftChunks,
            },
            right: {
              lineNumber: rightLineNum++,
              content: rightContent,
              type: 'modified',
              charChunks: rightChunks,
            },
          });
        } else if (leftContent !== undefined) {
          rows.push({
            id: rowId++,
            left: { lineNumber: leftLineNum++, content: leftContent, type: 'removed' },
            right: { content: '', type: 'empty' },
          });
        } else {
          rows.push({
            id: rowId++,
            left: { content: '', type: 'empty' },
            right: { lineNumber: rightLineNum++, content: rightContent!, type: 'added' },
          });
        }
      }
      i += 2;
    } else if (part.removed) {
      // Pure deletion
      const lines = part.value.replace(/\n$/, '').split('\n');
      for (const line of lines) {
        rows.push({
          id: rowId++,
          left: { lineNumber: leftLineNum++, content: line, type: 'removed' },
          right: { content: '', type: 'empty' },
        });
      }
      i++;
    } else if (part.added) {
      // Pure addition
      const lines = part.value.replace(/\n$/, '').split('\n');
      for (const line of lines) {
        rows.push({
          id: rowId++,
          left: { content: '', type: 'empty' },
          right: { lineNumber: rightLineNum++, content: line, type: 'added' },
        });
      }
      i++;
    }
  }

  return rows;
}

export interface UnifiedLine {
  id: number;
  type: 'normal' | 'added' | 'removed';
  leftLineNumber?: number;
  rightLineNumber?: number;
  content: string;
}

/**
 * Builds unified diff lines (Git style).
 */
export function generateUnifiedDiff(leftText: string, rightText: string): UnifiedLine[] {
  const diffParts = JsDiff.diffLines(leftText, rightText);
  const lines: UnifiedLine[] = [];

  let leftLineNum = 1;
  let rightLineNum = 1;
  let lineId = 1;

  for (const part of diffParts) {
    const rawLines = part.value.replace(/\n$/, '').split('\n');
    for (const text of rawLines) {
      if (part.added) {
        lines.push({
          id: lineId++,
          type: 'added',
          rightLineNumber: rightLineNum++,
          content: `+ ${text}`,
        });
      } else if (part.removed) {
        lines.push({
          id: lineId++,
          type: 'removed',
          leftLineNumber: leftLineNum++,
          content: `- ${text}`,
        });
      } else {
        lines.push({
          id: lineId++,
          type: 'normal',
          leftLineNumber: leftLineNum++,
          rightLineNumber: rightLineNum++,
          content: `  ${text}`,
        });
      }
    }
  }

  return lines;
}

/**
 * Realistic demonstration samples
 */
export const SAMPLE_LEFT = {
  service: "Payment Gateway",
  active: true,
  environment: "production",
  version: "2.4.0",
  features: ["apple_pay", "google_pay", "3d_secure", "credit_card"],
  database: {
    port: 5432,
    host: "db.internal.jsonshare.dev",
    maxConnections: 50,
    ssl: true,
  },
  rateLimit: {
    windowSec: 60,
    maxRequests: 1000,
  },
  deprecatedToken: "legacy_secret_99812",
  maintenanceWindow: "Sunday 03:00 UTC",
};

// Intentionally scrambled key order, removed key (deprecatedToken), added keys (metrics, retryPolicy), modified values (version, maxRequests, features)
export const SAMPLE_RIGHT = {
  version: "2.5.0",
  environment: "production",
  service: "Payment Gateway",
  active: true,
  rateLimit: {
    maxRequests: 2500,
    windowSec: 60,
  },
  database: {
    maxConnections: 75,
    host: "db.internal.jsonshare.dev",
    port: 5432,
    ssl: true,
  },
  features: ["apple_pay", "google_pay", "3d_secure", "instant_payouts"],
  retryPolicy: {
    backoffMs: 500,
    maxAttempts: 3,
  },
  metrics: {
    enabled: true,
    prometheusEndpoint: "/metrics",
  },
  maintenanceWindow: "Sunday 03:00 UTC",
};
