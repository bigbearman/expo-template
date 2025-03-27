export const APP_CONSTANTS = {
  STORAGE_KEYS: {
    THEME_PREFERENCE: '@theme_preference',
    AUTH_TOKEN: '@auth_token',
  },
  API: {
    BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'https://api.example.com',
    TIMEOUT: 10000,
  },
  ANIMATION: {
    DURATION: {
      FAST: 200,
      NORMAL: 300,
      SLOW: 500,
    },
  },
} as const; 