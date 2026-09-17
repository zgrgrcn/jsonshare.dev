'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Palette, ChevronDown, Check } from 'lucide-react';
import { useEditorTheme } from '@/app/context/EditorThemeContext';
import { EditorThemeFamily } from '@/app/utils/editorThemes';

export const ThemeSelectorDropdown: React.FC = () => {
  const { themeFamily, setThemeFamily, activeTheme, isDark } = useEditorTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const options: Array<{ family: EditorThemeFamily; label: string; preview: string; darkName: string; lightName: string }> = [
    {
      family: 'vscode',
      label: 'VS Code',
      preview: isDark ? '#1e1e1e' : '#ffffff',
      darkName: 'Dark+',
      lightName: 'Light+',
    },
    {
      family: 'intellij',
      label: 'IntelliJ IDEA',
      preview: isDark ? '#2b2b2b' : '#ffffff',
      darkName: 'Darcula',
      lightName: 'Light',
    },
    {
      family: 'github',
      label: 'GitHub',
      preview: isDark ? '#0d1117' : '#ffffff',
      darkName: 'Dark',
      lightName: 'Light',
    },
  ];

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-300 dark:hover:bg-gray-700"
        title="Select editor theme (VS Code, IntelliJ, GitHub)"
      >
        <Palette className="h-3.5 w-3.5 text-indigo-500" />
        <span className="font-semibold">{activeTheme.name}</span>
        <ChevronDown className="h-3 w-3 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-1.5 w-48 rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl backdrop-blur dark:border-gray-700 dark:bg-dark">
          <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Editor Theme
          </div>

          <div className="space-y-0.5">
            {options.map((opt) => {
              const isSelected = themeFamily === opt.family;
              return (
                <button
                  key={opt.family}
                  type="button"
                  onClick={() => {
                    setThemeFamily(opt.family);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                    isSelected
                      ? 'bg-indigo-50 text-indigo-900 font-semibold dark:bg-indigo-950/60 dark:text-indigo-200'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full border border-gray-300 dark:border-gray-600 shadow-sm"
                      style={{ backgroundColor: opt.preview }}
                    />
                    <span>{opt.label}</span>
                    <span className="text-[10px] text-gray-400 font-normal">
                      ({isDark ? opt.darkName : opt.lightName})
                    </span>
                  </div>
                  {isSelected && <Check className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
