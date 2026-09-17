export type EditorThemeFamily = 'vscode' | 'intellij' | 'github';

export type EditorThemeId =
  | 'vscode-dark'
  | 'vscode-light'
  | 'intellij-dark'
  | 'intellij-light'
  | 'github-dark'
  | 'github-light';

export interface EditorThemeDefinition {
  id: EditorThemeId;
  name: string;
  family: EditorThemeFamily;
  mode: 'dark' | 'light';
  // Panel styling
  panelBg: string;
  panelFg: string;
  panelBorder: string;
  gutterBg: string;
  gutterFg: string;
  gutterBorder: string;
  // Syntax tokens
  keyColor: string;
  stringColor: string;
  numberColor: string;
  booleanColor: string;
  nullColor: string;
  colonColor: string;
  bracketColor: string;
  hoverBg: string;
  // Diff styling
  diffRemovedBg: string;
  diffRemovedBorder: string;
  diffRemovedFg: string;
  diffRemovedLineNum: string;
  diffRemovedChunk: string;
  diffAddedBg: string;
  diffAddedBorder: string;
  diffAddedFg: string;
  diffAddedLineNum: string;
  diffAddedChunk: string;
  diffModifiedBg: string;
  diffModifiedBorder: string;
  diffModifiedFg: string;
  diffModifiedLineNum: string;
  diffEmptyBg: string;
}

export const EDITOR_THEMES: Record<EditorThemeId, EditorThemeDefinition> = {
  // 1. VS Code Dark+
  'vscode-dark': {
    id: 'vscode-dark',
    name: 'VS Code Dark+',
    family: 'vscode',
    mode: 'dark',
    panelBg: '#1e1e1e',
    panelFg: '#d4d4d4',
    panelBorder: '#333333',
    gutterBg: '#1e1e1e',
    gutterFg: '#858585',
    gutterBorder: '#2d2d2d',
    keyColor: '#9cdcfe', // VS Code sky blue
    stringColor: '#ce9178', // VS Code warm terracotta / orange
    numberColor: '#b5cea8', // VS Code light olive green
    booleanColor: '#569cd6', // VS Code keyword blue
    nullColor: '#569cd6',
    colonColor: '#858585',
    bracketColor: '#ffd700', // VS Code bracket yellow
    hoverBg: 'rgba(255, 255, 255, 0.05)',
    diffRemovedBg: 'rgba(255, 0, 0, 0.15)',
    diffRemovedBorder: '#e51400',
    diffRemovedFg: '#f85149',
    diffRemovedLineNum: 'rgba(255, 0, 0, 0.3)',
    diffRemovedChunk: 'rgba(255, 0, 0, 0.45)',
    diffAddedBg: 'rgba(46, 160, 67, 0.15)',
    diffAddedBorder: '#2ea043',
    diffAddedFg: '#3fb950',
    diffAddedLineNum: 'rgba(46, 160, 67, 0.3)',
    diffAddedChunk: 'rgba(46, 160, 67, 0.45)',
    diffModifiedBg: 'rgba(210, 153, 34, 0.15)',
    diffModifiedBorder: '#d29922',
    diffModifiedFg: '#e3b341',
    diffModifiedLineNum: 'rgba(210, 153, 34, 0.3)',
    diffEmptyBg: 'rgba(255, 255, 255, 0.02)',
  },

  // 2. VS Code Light+
  'vscode-light': {
    id: 'vscode-light',
    name: 'VS Code Light+',
    family: 'vscode',
    mode: 'light',
    panelBg: '#ffffff',
    panelFg: '#000000',
    panelBorder: '#e1e4e8',
    gutterBg: '#ffffff',
    gutterFg: '#237893',
    gutterBorder: '#f0f0f0',
    keyColor: '#0451a5', // VS Code Light dark navy blue
    stringColor: '#a31515', // VS Code Light brick red
    numberColor: '#098658', // VS Code Light dark forest green
    booleanColor: '#0000ff', // VS Code Light pure blue
    nullColor: '#0000ff',
    colonColor: '#000000',
    bracketColor: '#0451a5',
    hoverBg: 'rgba(0, 0, 0, 0.04)',
    diffRemovedBg: 'rgba(255, 0, 0, 0.08)',
    diffRemovedBorder: '#e51400',
    diffRemovedFg: '#b60205',
    diffRemovedLineNum: 'rgba(255, 0, 0, 0.15)',
    diffRemovedChunk: 'rgba(255, 0, 0, 0.25)',
    diffAddedBg: 'rgba(46, 160, 67, 0.1)',
    diffAddedBorder: '#2ea043',
    diffAddedFg: '#1a7f37',
    diffAddedLineNum: 'rgba(46, 160, 67, 0.15)',
    diffAddedChunk: 'rgba(46, 160, 67, 0.25)',
    diffModifiedBg: 'rgba(210, 153, 34, 0.1)',
    diffModifiedBorder: '#d29922',
    diffModifiedFg: '#9a6700',
    diffModifiedLineNum: 'rgba(210, 153, 34, 0.15)',
    diffEmptyBg: 'rgba(0, 0, 0, 0.02)',
  },

  // 3. IntelliJ IDEA Darcula
  'intellij-dark': {
    id: 'intellij-dark',
    name: 'IntelliJ Darcula',
    family: 'intellij',
    mode: 'dark',
    panelBg: '#2b2b2b', // Authentic Darcula background
    panelFg: '#a9b7c6', // Darcula default text
    panelBorder: '#323232',
    gutterBg: '#313335', // Darcula gutter
    gutterFg: '#606366',
    gutterBorder: '#3c3f41',
    keyColor: '#9876aa', // Darcula orchid purple
    stringColor: '#6a8759', // Darcula olive sage green
    numberColor: '#6897bb', // Darcula steel blue
    booleanColor: '#cc7832', // Darcula caramel orange
    nullColor: '#cc7832',
    colonColor: '#a9b7c6',
    bracketColor: '#e8bf6a', // Darcula yellow bracket
    hoverBg: 'rgba(255, 255, 255, 0.06)',
    diffRemovedBg: 'rgba(128, 48, 48, 0.35)',
    diffRemovedBorder: '#ba4f4f',
    diffRemovedFg: '#ff7b72',
    diffRemovedLineNum: 'rgba(128, 48, 48, 0.5)',
    diffRemovedChunk: 'rgba(180, 50, 50, 0.6)',
    diffAddedBg: 'rgba(41, 92, 59, 0.35)',
    diffAddedBorder: '#499c54',
    diffAddedFg: '#7ee787',
    diffAddedLineNum: 'rgba(41, 92, 59, 0.5)',
    diffAddedChunk: 'rgba(41, 140, 59, 0.6)',
    diffModifiedBg: 'rgba(130, 95, 25, 0.3)',
    diffModifiedBorder: '#c49a38',
    diffModifiedFg: '#e3b341',
    diffModifiedLineNum: 'rgba(130, 95, 25, 0.5)',
    diffEmptyBg: 'rgba(255, 255, 255, 0.02)',
  },

  // 4. IntelliJ IDEA Light
  'intellij-light': {
    id: 'intellij-light',
    name: 'IntelliJ Light',
    family: 'intellij',
    mode: 'light',
    panelBg: '#ffffff',
    panelFg: '#000000',
    panelBorder: '#d1d1d1',
    gutterBg: '#f2f2f2', // Authentic IntelliJ Light gutter
    gutterFg: '#999999',
    gutterBorder: '#e2e2e2',
    keyColor: '#660e7a', // Authentic IntelliJ Light royal purple
    stringColor: '#008000', // IntelliJ forest green
    numberColor: '#0000ff', // IntelliJ vibrant blue
    booleanColor: '#000080', // IntelliJ deep navy
    nullColor: '#000080',
    colonColor: '#000000',
    bracketColor: '#660e7a',
    hoverBg: 'rgba(0, 0, 0, 0.04)',
    diffRemovedBg: 'rgba(255, 215, 215, 0.7)',
    diffRemovedBorder: '#d9534f',
    diffRemovedFg: '#a94442',
    diffRemovedLineNum: 'rgba(255, 180, 180, 0.8)',
    diffRemovedChunk: 'rgba(255, 150, 150, 0.9)',
    diffAddedBg: 'rgba(215, 255, 215, 0.7)',
    diffAddedBorder: '#5cb85c',
    diffAddedFg: '#3c763d',
    diffAddedLineNum: 'rgba(180, 255, 180, 0.8)',
    diffAddedChunk: 'rgba(150, 255, 150, 0.9)',
    diffModifiedBg: 'rgba(255, 245, 205, 0.7)',
    diffModifiedBorder: '#f0ad4e',
    diffModifiedFg: '#8a6d3b',
    diffModifiedLineNum: 'rgba(255, 230, 150, 0.8)',
    diffEmptyBg: 'rgba(0, 0, 0, 0.02)',
  },

  // 5. GitHub Dark
  'github-dark': {
    id: 'github-dark',
    name: 'GitHub Dark',
    family: 'github',
    mode: 'dark',
    panelBg: '#0d1117',
    panelFg: '#c9d1d9',
    panelBorder: '#30363d',
    gutterBg: '#0d1117',
    gutterFg: '#6e7681',
    gutterBorder: '#21262d',
    keyColor: '#79c0ff', // GitHub blue
    stringColor: '#a5d6ff', // GitHub light blue
    numberColor: '#79c0ff',
    booleanColor: '#ff7b72', // GitHub coral red
    nullColor: '#ff7b72',
    colonColor: '#8b949e',
    bracketColor: '#d2a8ff', // GitHub purple
    hoverBg: 'rgba(255, 255, 255, 0.04)',
    diffRemovedBg: 'rgba(248, 81, 73, 0.15)',
    diffRemovedBorder: '#f85149',
    diffRemovedFg: '#ff7b72',
    diffRemovedLineNum: 'rgba(248, 81, 73, 0.25)',
    diffRemovedChunk: 'rgba(248, 81, 73, 0.4)',
    diffAddedBg: 'rgba(46, 160, 67, 0.15)',
    diffAddedBorder: '#2ea043',
    diffAddedFg: '#3fb950',
    diffAddedLineNum: 'rgba(46, 160, 67, 0.25)',
    diffAddedChunk: 'rgba(46, 160, 67, 0.4)',
    diffModifiedBg: 'rgba(210, 153, 34, 0.15)',
    diffModifiedBorder: '#d29922',
    diffModifiedFg: '#e3b341',
    diffModifiedLineNum: 'rgba(210, 153, 34, 0.25)',
    diffEmptyBg: 'rgba(255, 255, 255, 0.02)',
  },

  // 6. GitHub Light
  'github-light': {
    id: 'github-light',
    name: 'GitHub Light',
    family: 'github',
    mode: 'light',
    panelBg: '#ffffff',
    panelFg: '#24292f',
    panelBorder: '#d0d7de',
    gutterBg: '#ffffff',
    gutterFg: '#8c959f',
    gutterBorder: '#d0d7de',
    keyColor: '#0550ae', // GitHub blue
    stringColor: '#0a3069', // GitHub dark blue
    numberColor: '#0550ae',
    booleanColor: '#cf222e', // GitHub red
    nullColor: '#cf222e',
    colonColor: '#57606a',
    bracketColor: '#8250df', // GitHub purple
    hoverBg: 'rgba(0, 0, 0, 0.03)',
    diffRemovedBg: 'rgba(255, 235, 233, 1)',
    diffRemovedBorder: '#cf222e',
    diffRemovedFg: '#82071e',
    diffRemovedLineNum: '#ffdcd7',
    diffRemovedChunk: 'rgba(255, 129, 130, 0.4)',
    diffAddedBg: 'rgba(230, 255, 236, 1)',
    diffAddedBorder: '#1a7f37',
    diffAddedFg: '#116329',
    diffAddedLineNum: '#ccffd8',
    diffAddedChunk: 'rgba(84, 219, 120, 0.4)',
    diffModifiedBg: 'rgba(255, 248, 197, 1)',
    diffModifiedBorder: '#9a6700',
    diffModifiedFg: '#633c01',
    diffModifiedLineNum: '#fff5b1',
    diffEmptyBg: 'rgba(0, 0, 0, 0.02)',
  },
};

/**
 * Returns active theme ID matching the preferred family and dark/light mode.
 */
export function getThemeByFamilyAndMode(
  family: EditorThemeFamily,
  isDark: boolean
): EditorThemeDefinition {
  const themeId = `${family}-${isDark ? 'dark' : 'light'}` as EditorThemeId;
  return EDITOR_THEMES[themeId] || EDITOR_THEMES[isDark ? 'vscode-dark' : 'vscode-light'];
}
