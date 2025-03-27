import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';

export function ThemeToggle() {
  const { theme, setTheme, isDark, toggleTheme } = useTheme();

  return (
    <View className="p-4 space-y-2">
      <TouchableOpacity
        onPress={toggleTheme}
        className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-md"
      >
        <Text className="text-center text-gray-900 dark:text-white">
          Switch to {isDark ? 'Light' : 'Dark'} Mode
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setTheme('system')}
        className={`p-4 rounded-lg ${
          theme === 'system' ? 'bg-blue-500' : 'bg-gray-500'
        } shadow-md`}
      >
        <Text className="text-center text-white">
          Use System Theme
        </Text>
      </TouchableOpacity>
    </View>
  );
} 