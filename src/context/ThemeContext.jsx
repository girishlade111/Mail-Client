import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext(null);

const ACCENT_COLORS = [
  { id: 'blue', name: 'Blue', color: '#4361ee' },
  { id: 'purple', name: 'Purple', color: '#8b5cf6' },
  { id: 'green', name: 'Green', color: '#22c55e' },
  { id: 'orange', name: 'Orange', color: '#f59e0b' },
  { id: 'red', name: 'Red', color: '#ef4444' },
  { id: 'teal', name: 'Teal', color: '#06b6d4' },
];

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('flowmail-theme');
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [accentColor, setAccentColor] = useState(() => {
    const stored = localStorage.getItem('flowmail-accent-color');
    return stored || 'blue';
  });

  const [fontSize, setFontSize] = useState(() => {
    const stored = localStorage.getItem('flowmail-font-size');
    return stored || 'medium';
  });

  useEffect(() => {
    const effectiveTheme = theme === 'system' 
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme;
    document.documentElement.setAttribute('data-theme', effectiveTheme);
    localStorage.setItem('flowmail-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('flowmail-accent-color', accentColor);
    document.documentElement.style.setProperty('--accent', ACCENT_COLORS.find(c => c.id === accentColor)?.color || '#4361ee');
  }, [accentColor]);

  useEffect(() => {
    localStorage.setItem('flowmail-font-size', fontSize);
    document.documentElement.style.setProperty('--font-size-base', fontSize === 'small' ? '13px' : fontSize === 'large' ? '16px' : '14px');
  }, [fontSize]);

  const setThemeMode = useCallback((mode) => {
    setTheme(mode);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const value = {
    theme,
    setTheme: setThemeMode,
    toggleTheme,
    accentColor,
    setAccentColor,
    fontSize,
    setFontSize,
    accentColors: ACCENT_COLORS,
    isDark: theme === 'dark',
    isSystem: theme === 'system',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}