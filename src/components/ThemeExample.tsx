import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useThemeStyles } from '../theme/useThemeStyles';
import { useThemeContext } from '../theme/ThemeContext';

export const ThemeExample = () => {
  const { createStyles } = useThemeStyles();
  const { isDark, toggleTheme } = useThemeContext();

  const styles = createStyles((theme) => ({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: theme.spacing.md,
    },
    title: {
      ...theme.typography.h1,
      color: theme.colors.text,
      marginBottom: theme.spacing.lg,
    },
    text: {
      ...theme.typography.body,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    button: {
      backgroundColor: theme.colors.primary,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
    },
    buttonText: {
      color: '#FFFFFF',
      ...theme.typography.body,
      fontWeight: 'bold',
    },
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Theme Example</Text>
      <Text style={styles.text}>
        Current theme: {isDark ? 'Dark' : 'Light'}
      </Text>
      <TouchableOpacity style={styles.button} onPress={toggleTheme}>
        <Text style={styles.buttonText}>Toggle Theme</Text>
      </TouchableOpacity>
    </View>
  );
}; 