'use client';
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useTheme } from 'next-themes';
import {
  EditorThemeFamily,
  EditorThemeDefinition,
  getThemeByFamilyAndMode,
  EDITOR_THEMES,
} from '@/app/utils/editorThemes';

interface EditorThemeContextType {
  themeFamily: EditorThemeFamily;
  setThemeFamily: (family: EditorThemeFamily) => void;
  activeTheme: EditorThemeDefinition;
  isDark: boolean;
}

const EditorThemeContext = createContext<EditorThemeContextType | undefined>(undefined);

export const EditorThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, resolvedTheme } = useTheme();
  const [themeFamily, setThemeFamilyState] = useState<EditorThemeFamily>('vscode');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem('jsonshare_editor_family') as EditorThemeFamily;
      if (saved && (saved === 'vscode' || saved === 'intellij' || saved === 'github')) {
        setThemeFamilyState(saved);
      }
    } catch {}
  }, []);

  const isDark = mounted ? (theme === 'dark' || resolvedTheme === 'dark') : true;

  const setThemeFamily = (family: EditorThemeFamily) => {
    setThemeFamilyState(family);
    try {
      localStorage.setItem('jsonshare_editor_family', family);
    } catch {}
  };

  const activeTheme = useMemo(() => {
    return getThemeByFamilyAndMode(themeFamily, isDark);
  }, [themeFamily, isDark]);

  return (
    <EditorThemeContext.Provider
      value={{
        themeFamily,
        setThemeFamily,
        activeTheme,
        isDark,
      }}
    >
      {children}
    </EditorThemeContext.Provider>
  );
};

export const useEditorTheme = () => {
  const ctx = useContext(EditorThemeContext);
  if (!ctx) {
    // Fallback if rendered outside provider
    return {
      themeFamily: 'vscode' as EditorThemeFamily,
      setThemeFamily: () => {},
      activeTheme: EDITOR_THEMES['vscode-dark'],
      isDark: true,
    };
  }
  return ctx;
};
