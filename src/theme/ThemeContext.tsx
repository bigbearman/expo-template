import React, { createContext, useContext, useEffect } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import { useStore } from '@/store/useStore';
import { lightTheme, darkTheme } from './index';
import type { Theme } from './index';

// Removed ThemeMode import and using the one from the store
type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeMode;
  currentTheme: Theme;
  setTheme: (theme: ThemeMode) => void;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useSystemColorScheme();
  const { theme, setTheme } = useStore();
  
  // Determine if we're in dark mode
  const isDark = theme === 'system' 
    ? systemColorScheme === 'dark'
    : theme === 'dark';

  // Get the current theme object
  const currentTheme = isDark ? darkTheme : lightTheme;
  
  // Toggle between light and dark
  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  // Sync with system theme changes
  useEffect(() => {
    if (theme === 'system' && systemColorScheme) {
      // Update any UI libraries that need to know about theme changes
    }
  }, [systemColorScheme, theme]);

  const value = {
    theme,
    currentTheme,
    setTheme,
    isDark,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 