'use client';
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Shield, ArrowDownAZ, Terminal, Sparkles } from 'lucide-react';

export const SeoContentSection: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <footer aria-label="Technical Documentation & FAQ" className="mt-12 border-t border-gray-200/70 pb-12 pt-6 dark:border-gray-800/80">
      {/* Sleek Minimalist Spec & Status Strip */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500 dark:text-gray-400">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50/80 px-2.5 py-1 font-mono text-[11px] text-gray-700 dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-300">
            <Shield className="h-3 w-3 text-emerald-500" />
            100% Client-Side Privacy
          </span>
          <span className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50/80 px-2.5 py-1 font-mono text-[11px] text-gray-700 dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-300">
            <ArrowDownAZ className="h-3 w-3 text-indigo-500" />
            Recursive A→Z Key Sort
          </span>
          <span className="hidden md:flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50/80 px-2.5 py-1 font-mono text-[11px] text-gray-700 dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-300">
            <Terminal className="h-3 w-3 text-amber-500" />
            TypeScript Interface Gen
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-lg px-2.5 py-1 text-xs font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/80 dark:hover:text-gray-200"
        >
          <span>{isOpen ? 'Close Reference & FAQ' : 'Technical Reference & FAQ'}</span>
          {isOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Collapsible Technical Details for Humans, Fully Preserved for AI/Search Engines */}
      {isOpen && (
        <div className="mt-6 space-y-6 rounded-2xl border border-gray-200/80 bg-gray-50/50 p-6 backdrop-blur-sm dark:border-gray-800/70 dark:bg-dark/40 text-xs">
          {/* Engineering Specifications Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                <ArrowDownAZ className="h-3.5 w-3.5 text-indigo-500" />
                Deterministic Key Ordering
              </h3>
              <p className="mt-1.5 leading-relaxed text-gray-600 dark:text-gray-400">
                JSON object keys have no semantic order under RFC 8259, yet conventional diff algorithms treat reordered keys as deletions and additions. JSON Share recursively traverses the AST and sorts keys alphabetically (A→Z) prior to diff computation.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
                AST Diff & Path Resolution
              </h3>
              <p className="mt-1.5 leading-relaxed text-gray-600 dark:text-gray-400">
                Beyond line-by-line git diffs, the semantic inspector isolates differences into <code>MISSING</code>, <code>ADDED</code>, <code>MODIFIED</code>, and <code>TYPE_MISMATCH</code> with exact dot-notation paths (e.g. <code>api.config.routes[0]</code>).
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-sky-500" />
                Local Execution & Data Integrity
              </h3>
              <p className="mt-1.5 leading-relaxed text-gray-600 dark:text-gray-400">
                Parsing, normalization, formatting, and diff comparison execute in the browser thread using local state. Data is never transmitted to any server unless you explicitly generate a shareable URL.
              </p>
            </div>
          </div>

          {/* Developer FAQ */}
          <div className="border-t border-gray-200/70 pt-6 dark:border-gray-800/80">
            <h3 className="font-mono text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Developer Q&A
            </h3>
            <dl className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <dt className="font-semibold text-gray-900 dark:text-gray-100">
                  How does alphabetical normalization handle nested objects and arrays?
                </dt>
                <dd className="mt-1 text-gray-600 dark:text-gray-400 leading-relaxed">
                  The sorter recursively inspects each value. All nested object properties are sorted alphabetically. By default, array element positions are preserved to respect sequence-dependent collections.
                </dd>
              </div>

              <div>
                <dt className="font-semibold text-gray-900 dark:text-gray-100">
                  What syntax anomalies does Auto-Fix repair?
                </dt>
                <dd className="mt-1 text-gray-600 dark:text-gray-400 leading-relaxed">
                  Auto-Fix resolves relaxed JS literal notations: unquoted object keys (e.g. <code>&#123; foo: 1 &#125;</code>), single quotes (<code>&apos;bar&apos;</code>), and trailing commas in arrays or objects.
                </dd>
              </div>

              <div>
                <dt className="font-semibold text-gray-900 dark:text-gray-100">
                  Can I use JSON Share with sensitive API payloads or tokens?
                </dt>
                <dd className="mt-1 text-gray-600 dark:text-gray-400 leading-relaxed">
                  Yes. Comparing two payloads or formatting JSON runs entirely client-side in memory. No network request is initiated until you explicitly click the <strong>Save</strong> button.
                </dd>
              </div>

              <div>
                <dt className="font-semibold text-gray-900 dark:text-gray-100">
                  How does theme synchronization work?
                </dt>
                <dd className="mt-1 text-gray-600 dark:text-gray-400 leading-relaxed">
                  Editor palettes (VS Code Dark+/Light+, IntelliJ Darcula/Light, GitHub Dark/Light) match their original IDE tokens and adapt dynamically when toggling between daylight and dark modes.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}
    </footer>
  );
};
