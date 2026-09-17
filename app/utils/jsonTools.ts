/**
 * Utilities for formatting, minifying, auto-fixing, and generating TypeScript types from JSON.
 */

/**
 * Attempts to automatically repair common malformed JSON errors:
 * - Single quotes -> double quotes
 * - Unquoted keys -> quoted keys
 * - Trailing commas in objects and arrays
 * - Trailing semicolons
 */
export function autoFixJson(raw: string): { fixed: string; wasFixed: boolean; error?: string } {
  const trimmed = raw.trim().replace(/;+$/, '');
  if (!trimmed) return { fixed: '', wasFixed: false };

  // Try native parse first
  try {
    const parsed = JSON.parse(trimmed);
    return { fixed: JSON.stringify(parsed, null, 2), wasFixed: false };
  } catch {
    // Continue to repair
  }

  let repaired = trimmed;

  // 1. Replace single-quoted string values or keys with double quotes, preserving escaped quotes
  repaired = repaired.replace(/'([^'\\]*(?:\\.[^'\\]*)*)'/g, (match, content) => {
    return `"${content.replace(/"/g, '\\"')}"`;
  });

  // 2. Add double quotes around unquoted object keys (e.g. { foo: 123 } -> { "foo": 123 })
  repaired = repaired.replace(/([{,]\s*)([a-zA-Z0-9_$]+)\s*:/g, '$1"$2":');

  // 3. Remove trailing commas in objects and arrays
  repaired = repaired.replace(/,\s*([}\]])/g, '$1');

  try {
    const parsed = JSON.parse(repaired);
    return { fixed: JSON.stringify(parsed, null, 2), wasFixed: true };
  } catch (err: any) {
    return { fixed: repaired, wasFixed: false, error: err.message || 'Unable to automatically repair JSON' };
  }
}

/**
 * Generates clean TypeScript interfaces from a JSON object.
 */
export function jsonToTypeScript(rootInterfaceName: string, data: any): string {
  if (data === null || typeof data !== 'object') {
    return `export type ${rootInterfaceName} = ${typeof data};`;
  }

  const interfaces: Map<string, string> = new Map();

  function capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function getType(val: any, keyHint: string): string {
    if (val === null) return 'null';
    if (val === undefined) return 'undefined';
    if (Array.isArray(val)) {
      if (val.length === 0) return 'any[]';
      const sample = val[0];
      const elemType = getType(sample, keyHint.endsWith('s') ? keyHint.slice(0, -1) : `${keyHint}Item`);
      return `${elemType}[]`;
    }
    if (typeof val === 'object') {
      const nestedName = capitalize(keyHint);
      generateInterface(nestedName, val);
      return nestedName;
    }
    return typeof val;
  }

  function generateInterface(name: string, obj: Record<string, any>) {
    if (interfaces.has(name)) return;

    const lines: string[] = [`export interface ${name} {`];
    for (const [key, value] of Object.entries(obj)) {
      const isIdentifier = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key);
      const safeKey = isIdentifier ? key : JSON.stringify(key);
      const typeStr = getType(value, key);
      lines.push(`  ${safeKey}: ${typeStr};`);
    }
    lines.push('}');
    interfaces.set(name, lines.join('\n'));
  }

  if (Array.isArray(data)) {
    if (data.length === 0) return `export type ${rootInterfaceName} = any[];`;
    const itemType = getType(data[0], rootInterfaceName.endsWith('s') ? rootInterfaceName.slice(0, -1) : `${rootInterfaceName}Item`);
    const allInterfaces = Array.from(interfaces.values()).join('\n\n');
    return `${allInterfaces ? allInterfaces + '\n\n' : ''}export type ${rootInterfaceName} = ${itemType}[];`;
  }

  generateInterface(rootInterfaceName, data);
  return Array.from(interfaces.values()).join('\n\n');
}
