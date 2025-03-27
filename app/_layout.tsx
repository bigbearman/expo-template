import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, useCallback } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { ToastProvider } from 'react-native-toaster-ui';
import { ThemeProvider } from '@/theme/ThemeContext';
import { useAppState } from '@/hooks/useAppState';
import { disableYellowBox } from '@/utils/performance';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Disable yellow box warnings in development
if (__DEV__) {
  disableYellowBox();
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('@/assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [auth, setAuth] = useState(true);

  // Handle app state changes
  useAppState((status) => {
    if (status === 'active') {
      // Refresh data when app becomes active
      // apiService.clearCache();
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
    <ThemeProvider>
      <NavigationThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <ToastProvider>
          <StatusBar style="auto" />
          {auth ? (
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
          ) : (
            <Stack>
              <Stack.Screen name="onboarding/index" options={{ headerShown: false }} />
            </Stack>
          )}
        </ToastProvider>
      </NavigationThemeProvider>
    </ThemeProvider>
  );
}
