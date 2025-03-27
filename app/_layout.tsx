import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useCallback } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { ToastProvider } from 'react-native-toaster-ui';
import { ThemeProvider } from '@/theme/ThemeContext';
import { useAppState } from '@/hooks/useAppState';
import { disableYellowBox } from '@/utils/performance';
import { useStore } from '@/store/useStore';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Disable yellow box warnings in development
if (__DEV__) {
  disableYellowBox();
}

export default function RootLayout() {
  const { isDarkMode } = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('@/assets/fonts/SpaceMono-Regular.ttf'),
  });
  
  // Using auth state from Zustand store instead of local state
  const { isAuthenticated } = useStore();

  // Handle app state changes
  useAppState((status) => {
    if (status === 'active') {
      // Refresh data when app becomes active
      // apiService.clearCache();
      console.log('App is active');
    }
  });

  const handleSplashScreen = useCallback(async () => {
    if (loaded) {
      await SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    handleSplashScreen();
  }, [handleSplashScreen]);

  if (!loaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <NavigationThemeProvider value={isDarkMode ? DarkTheme : DefaultTheme}>
          <ToastProvider>
            <StatusBar style="auto" />
            {isAuthenticated ? (
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
              </Stack>
            ) : (
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="onboarding/index" />
              </Stack>
            )}
          </ToastProvider>
        </NavigationThemeProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
