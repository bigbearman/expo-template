import { StyleSheet } from 'react-native';
import { useTheme } from './ThemeContext';
import type { Theme } from './index';

export const useThemeStyles = () => {
  const { currentTheme } = useTheme();

  const createStyles = (styleCreator: (theme: Theme) => any) => {
    return StyleSheet.create(styleCreator(currentTheme));
  };

  return {
    createStyles,
    theme: currentTheme,
  };
}; 