import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { darkTheme, lightTheme, Theme } from '../config/theme.config';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setThemeMode: (mode: 'dark' | 'light' | 'system') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<'dark' | 'light' | 'system'>('system');
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (themeMode === 'system') {
      setIsDark(systemColorScheme === 'dark');
    } else {
      setIsDark(themeMode === 'dark');
    }
  }, [themeMode, systemColorScheme]);

  const theme = isDark ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setIsDark(!isDark);
    setThemeMode(isDark ? 'light' : 'dark');
  };

  const setThemeModeHandler = (mode: 'dark' | 'light' | 'system') => {
    setThemeMode(mode);
    if (mode !== 'system') {
      setIsDark(mode === 'dark');
    }
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      isDark,
      toggleTheme,
      setThemeMode: setThemeModeHandler,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme
