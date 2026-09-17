'use client';

import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { EditorThemeProvider } from './context/EditorThemeContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider className="h-full">
      <NextThemesProvider attribute="class" defaultTheme="dark">
        <EditorThemeProvider>
          {children}
        </EditorThemeProvider>
      </NextThemesProvider>
    </NextUIProvider>
  );
}