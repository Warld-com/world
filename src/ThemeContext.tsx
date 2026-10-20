import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';

export type Theme = 'dark' | 'light';

export interface ThemeContextType {
  theme: Theme;
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'world_theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'dark';
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
      // Check system preference if no saved theme
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light';
      }
    } catch {
      // Ignore storage errors in restricted contexts
    }
    return 'dark';
  });

  const isDarkMode = theme === 'dark';

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch {}
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.remove('light');
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
      document.body.style.backgroundColor = '#000000';
      document.body.style.color = '#ffffff';
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
      document.body.style.backgroundColor = '#f8fafc';
      document.body.style.color = '#0f172a';
    }

    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {}
  }, [theme, isDarkMode]);

  // Listen to system theme changes if user hasn't explicitly set a preference
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      try {
        const hasSaved = localStorage.getItem(THEME_STORAGE_KEY);
        if (!hasSaved) {
          setTheme(e.matches ? 'dark' : 'light');
        }
      } catch {}
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const value = useMemo(
    () => ({
      theme,
      isDarkMode,
      toggleTheme,
      setTheme,
    }),
    [theme, isDarkMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    // Graceful fallback if used outside of ThemeProvider
    return {
      theme: 'dark',
      isDarkMode: true,
      toggleTheme: () => {},
      setTheme: () => {},
    };
  }
  return context;
}
