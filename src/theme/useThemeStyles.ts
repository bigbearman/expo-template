import { StyleSheet } from 'react-native';
import { useThemeContext } from './ThemeContext';
import { Theme } from './index';

export const useThemeStyles = () => {
  const { theme } = useThemeContext();

  const createStyles = (styleCreator: (theme: Theme) => any) => {
    return StyleSheet.create(styleCreator(theme));
  };

  return {
    createStyles,
    theme,
  };
}; 