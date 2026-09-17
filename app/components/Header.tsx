'use client';
import { ThemeSwitcher } from './ThemeSwitcher';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeftRight, Share2 } from 'lucide-react';

export function Header() {
  const pathname = usePathname();
  const isCompare = pathname.startsWith('/compare');
  const isShare = !isCompare;

  return (
    <header className="supports-backdrop-blur:bg-white/95 sticky top-0 z-40 overflow-x-hidden border-b border-gray-200/70 bg-white/75 py-2.5 backdrop-blur dark:border-gray-800/80 dark:bg-dark/75">
      <div className="mx-auto flex w-[95vw] items-center justify-between px-3 lg:w-[75vw] lg:px-0">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <NextLink href="/" aria-label="jsonshare.dev" className="flex items-center gap-1.5 text-lg font-bold tracking-tight">
            <span className="rounded-md bg-indigo-600 px-1.5 py-0.5 font-mono text-xs font-black text-white dark:bg-indigo-500">
              {"{ }"}
            </span>
            <span className="text-gray-900 dark:text-gray-100">JSON</span>
            <span className="text-indigo-600 dark:text-indigo-400">Share</span>
          </NextLink>

          {/* Navigation links */}
          <nav className="flex items-center gap-1 rounded-lg border border-gray-200/80 bg-gray-100/70 p-1 dark:border-gray-800 dark:bg-gray-800/60">
            <NextLink
              href="/"
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition ${
                isShare
                  ? 'bg-white text-indigo-700 shadow-sm dark:bg-gray-700 dark:text-indigo-300'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Share</span>
            </NextLink>

            <NextLink
              href="/compare"
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition ${
                isCompare
                  ? 'bg-white text-indigo-700 shadow-sm dark:bg-gray-700 dark:text-indigo-300'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <ArrowLeftRight className="h-3.5 w-3.5" />
              <span>Compare</span>
              <span className="rounded-full bg-indigo-100 px-1.5 py-0.2 text-[9px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                Diff
              </span>
            </NextLink>
          </nav>
        </div>

        {/* Right Action */}
        <div className="flex items-center gap-2 text-base leading-5">
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
