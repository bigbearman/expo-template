import { useState, useEffect, useCallback } from 'react';
import { ColorSchemeName, useColorScheme as useSystemColorScheme, Appearance } from 'react-native';
import { useStore } from '@/store/useStore';

export type ThemeMode = 'light' | 'dark' | 'system';

export function useColorScheme() {
  const systemColorScheme = useSystemColorScheme();
  const { theme, setTheme } = useStore();
  
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>(() => 
    theme === 'system' ? (systemColorScheme || 'light') : theme
  );

  // Apply to document body for web
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (colorScheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [colorScheme]);

  const synchronizeTheme = useCallback((newScheme: ColorSchemeName) => {
    setColorScheme(newScheme);
    // Use Appearance API to set the color scheme for native platforms
    Appearance.setColorScheme(newScheme as 'light' | 'dark' | null);
  }, []);

  useEffect(() => {
    const appearanceListener = Appearance.addChangeListener(({ colorScheme: newColorScheme }) => {
      if (theme === 'system') {
        synchronizeTheme(newColorScheme || 'light');
      }
    });

    const activeColorScheme = theme === 'system' 
      ? systemColorScheme || 'light'
      : theme;
    
    synchronizeTheme(activeColorScheme);

    return () => {
      appearanceListener.remove();
    };
  }, [theme, systemColorScheme, synchronizeTheme]);

  const toggleColorScheme = useCallback(() => {
    const newScheme = colorScheme === 'light' ? 'dark' : 'light';
    synchronizeTheme(newScheme);
    setTheme(newScheme as ThemeMode);
  }, [colorScheme, synchronizeTheme, setTheme]);

  const setColorSchemeWithFallback = useCallback(
    (newScheme: ThemeMode) => {
      if (newScheme === 'system') {
        const systemScheme = systemColorScheme || 'light';
        synchronizeTheme(systemScheme);
        setTheme('system');
      } else {
        synchronizeTheme(newScheme);
        setTheme(newScheme);
      }
    },
    [systemColorScheme, synchronizeTheme, setTheme]
  );

  return {
    colorScheme,
    setColorScheme: setColorSchemeWithFallback,
    toggleColorScheme,
    isDarkMode: colorScheme === 'dark',
    currentTheme: theme,
  };
}
